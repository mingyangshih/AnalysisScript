import pandas as pd
import os
from pathlib import Path
import matplotlib.pyplot as plt
import numpy as np
import re

# Country grouping from countryGroup.js
COUNTRY_GROUP_1 = [
    "PL", "AR", "BR", "IN", "IL", "TH", "GR", "UA", "PT", "CO", "RS", "TR", "CL", 
    "VE", "PH", "PE", "UY", "CN", "MY", "VN", "ID", "EC", "BA", "EG", "MK", "PK", 
    "LB", "BY", "AM", "XK", "MD", "KE", "DZ", "BO", "LK", "NA", "KH", "GT", "JO", 
    "AZ", "BD", "NP", "ZW", "QA", "MN", "IM", "AL", "TN", "PY", "SR", "VI", "NI", 
    "FO", "JE", "BZ", "RE", "SX", "GH", "AG", "CW", "IQ", "SZ", "AO", "PS", "LC", 
    "MQ", "ET", "GP", "GI", "NC", "HT", "MM", "GA", "TJ", "OM", "MW", "BH", "PF", 
    "PG", "CD", "VG", "TZ", "KG", "FJ", "CM", "DM", "AD", "GY", "CV", "GL", "TO", 
    "TC", "CG", "BN", "LY", "LA", "SL", "SN", "PW", "SM", "YE", "GD", "MZ", "CK", 
    "CI", "TL", "SO", "GM", "BT", "RW", "SC", "MF", "MH", "EH", "MG"
]

COUNTRY_GROUP_2 = [
    "ES", "IT", "HU", "MX", "RO", "ZA", "IE", "JP", "BG", "FI", "SK", "LT", "EE", 
    "HR", "SI", "GE", "TW", "PR", "CR", "DO", "TT", "JM", "ME", "MA", "SV", "BB", 
    "HN", "KW", "BW", "NG", "ZM", "MU", "GG", "LI", "UG", "LS", "VC", "AI", "LR", "BJ"
]

# Directory path
PUBLISHER = "sudoku"
EVENT = "Yolla" 
directory = f"/Users/clayton/YollaWork/AnalysisScript/python_script/{PUBLISHER}/{EVENT}"
output_dir = f"/Users/clayton/YollaWork/AnalysisScript/python_script/{PUBLISHER}/charts"

def create_variant_object(object_dict, variant, default_value):
    """Create a variant object if it doesn't exist"""
    if variant not in object_dict:
        object_dict[variant] = default_value

def get_country_group(country):
    """Determine country group based on country code"""
    if country in COUNTRY_GROUP_1:
        return "Group1"
    elif country in COUNTRY_GROUP_2:
        return "Group2"
    else:
        return country

def parse_browser_size(bs_string):
    """Parse browser size string like '1353x595' and return width, height"""
    if pd.isna(bs_string) or bs_string == '':
        return None, None
    
    # Use regex to extract width and height
    match = re.match(r'(\d+)x(\d+)', str(bs_string))
    if match:
        width = int(match.group(1))
        height = int(match.group(2))
        return width, height
    return None, None

def categorize_browser_size(width):
    """Categorize browser size based on width"""
    if width is None:
        return "Unknown"
    elif width > 800:
        return ">=800px"
    else:
        return "<800px"

def calculate_percentages(stats_dict):
    """Calculate percentages for each category"""
    percentages = {}
    for case_key, case_stats in stats_dict.items():
        total = sum(case_stats.values())
        percentages[case_key] = {k: (v/total)*100 for k, v in case_stats.items()}
    return percentages

def create_charts(stats, percentages):
    """Create and save charts"""
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Set style for better looking charts
    plt.style.use('default')
    
    # Create combined country chart (all cases in one chart)
    fig, ax = plt.subplots(figsize=(12, 8))
    
    # Prepare data for all cases country comparison - only US, CA, and Others
    all_cases = sorted(list(stats["country"].keys()), key=lambda x: int(x[4:]))  # Sort by case number
    target_countries = ['US', 'CA']
    
    # Create grouped bar chart
    x = np.arange(len(target_countries) + 1)  # +1 for "Others"
    width = 0.2
    multiplier = 0
    
    for case_key in all_cases:
        case_percentages = []
        
        # Add US and CA percentages
        for country in target_countries:
            if country in percentages["country"][case_key]:
                case_percentages.append(percentages["country"][case_key][country])
            else:
                case_percentages.append(0)
        
        # Calculate Others percentage (sum of all other countries)
        others_percentage = 0
        for country, percentage in percentages["country"][case_key].items():
            if country not in target_countries:
                others_percentage += percentage
        case_percentages.append(others_percentage)
        
        offset = width * multiplier
        rects = ax.bar(x + offset, case_percentages, width, label=case_key)
        
        # Add value labels on bars
        for rect, percent in zip(rects, case_percentages):
            height = rect.get_height()
            if height > 0:  # Only add label if bar has height
                ax.text(rect.get_x() + rect.get_width()/2., height + 0.5,
                        f'{percent:.1f}%', ha='center', va='bottom', fontsize=10)
        
        multiplier += 1
    
    ax.set_title(f'{PUBLISHER} - All Cases Country Percentages', fontsize=16, fontweight='bold')
    ax.set_ylabel('Percentage (%)')
    ax.set_xlabel('Countries')
    ax.set_xticks(x + width * (len(all_cases) - 1) / 2)
    ax.set_xticklabels(target_countries + ['Others'])
    ax.legend(loc='upper right')
    ax.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, f'all_cases_country_analysis.png'), 
               dpi=300, bbox_inches='tight')
    plt.close()
    
    print(f"Saved combined country chart for all cases")
    
    # Create combined browser size chart (all cases in one chart)
    fig, ax = plt.subplots(figsize=(12, 8))
    
    # Prepare data for all cases browser size comparison
    all_browser_sizes = set()
    for case_stats in stats["browsersize"].values():
        all_browser_sizes.update(case_stats.keys())
    all_browser_sizes = sorted(list(all_browser_sizes))
    
    # Create grouped bar chart
    x = np.arange(len(all_browser_sizes))
    width = 0.2
    multiplier = 0
    
    for case_key in all_cases:  # Use the same sorted cases
        case_percentages = []
        for browser_size in all_browser_sizes:
            if browser_size in percentages["browsersize"][case_key]:
                case_percentages.append(percentages["browsersize"][case_key][browser_size])
            else:
                case_percentages.append(0)
        
        offset = width * multiplier
        rects = ax.bar(x + offset, case_percentages, width, label=case_key)
        
        # Add value labels on bars
        for rect, percent in zip(rects, case_percentages):
            height = rect.get_height()
            if height > 0:  # Only add label if bar has height
                ax.text(rect.get_x() + rect.get_width()/2., height + 0.5,
                        f'{percent:.1f}%', ha='center', va='bottom', fontsize=8)
        
        multiplier += 1
    
    ax.set_title(f'{PUBLISHER} - All Cases Browser Size Percentages', fontsize=16, fontweight='bold')
    ax.set_ylabel('Percentage (%)')
    ax.set_xlabel('Browser Sizes')
    ax.set_xticks(x + width * (len(all_cases) - 1) / 2)
    ax.set_xticklabels(all_browser_sizes)
    ax.legend(loc='upper right')
    ax.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, f'all_cases_browser_size_analysis.png'), 
               dpi=300, bbox_inches='tight')
    plt.close()
    
    print(f"Saved combined browser size chart for all cases")

def analyze_csv_files():
    """Analyze CSV files and generate statistics"""
    
    # Initialize statistics objects
    stats = {
        "devicecategory": {},
        "country": {},
        "browsersize": {}
    }
    
    # Check if directory exists
    if not os.path.exists(directory):
        print(f"Error: Directory {directory} does not exist")
        return
    
    # Get all CSV files in the directory
    csv_files = [f for f in os.listdir(directory) if f.endswith('.csv')]
    
    if not csv_files:
        print(f"No CSV files found in {directory}")
        return
    
    print(f"Found {len(csv_files)} CSV files to process")
    
    # Process each CSV file
    for file in csv_files:
        file_path = os.path.join(directory, file)
        print(f"Processing file: {file}")
        
        try:
            # Read CSV file
            df = pd.read_csv(file_path)
            
            # Process each row
            for _, data in df.iterrows():
                case_key = f"Case{data['cd3']}"
                
                # Initialize variant objects
                create_variant_object(stats["devicecategory"], case_key, {})
                create_variant_object(stats["country"], case_key, {})
                create_variant_object(stats["browsersize"], case_key, {})
                
                # Get country group
                country = get_country_group(data['country'])
                
                # Count device categories
                device_category = data['devicecategory']
                if device_category not in stats["devicecategory"][case_key]:
                    stats["devicecategory"][case_key][device_category] = 0
                stats["devicecategory"][case_key][device_category] += 1
                
                # Count countries
                if country not in stats["country"][case_key]:
                    stats["country"][case_key][country] = 0
                stats["country"][case_key][country] += 1
                
                # Parse and count browser sizes
                width, height = parse_browser_size(data['bs'])
                browser_category = categorize_browser_size(width)
                if browser_category not in stats["browsersize"][case_key]:
                    stats["browsersize"][case_key][browser_category] = 0
                stats["browsersize"][case_key][browser_category] += 1
                
        except Exception as e:
            print(f"Error processing file {file}: {e}")
    
    # Calculate percentages
    percentages = {
        "devicecategory": calculate_percentages(stats["devicecategory"]),
        "country": calculate_percentages(stats["country"]),
        "browsersize": calculate_percentages(stats["browsersize"])
    }
    
    # Print results with percentages
    print("\n=== Country Statistics ===")
    for case_key, country_stats in stats["country"].items():
        print(f"\n{case_key}:")
        total = sum(country_stats.values())
        for country, count in sorted(country_stats.items()):
            percentage = (count / total) * 100
            print(f"  {country}: {count} ({percentage:.1f}%)")
    
    print("\n=== Device Category Statistics ===")
    for case_key, device_stats in stats["devicecategory"].items():
        print(f"\n{case_key}:")
        total = sum(device_stats.values())
        for device, count in sorted(device_stats.items()):
            percentage = (count / total) * 100
            print(f"  {device}: {count} ({percentage:.1f}%)")
    
    print("\n=== Browser Size Statistics ===")
    for case_key, browser_stats in stats["browsersize"].items():
        print(f"\n{case_key}:")
        total = sum(browser_stats.values())
        for browser, count in sorted(browser_stats.items()):
            percentage = (count / total) * 100
            print(f"  {browser}: {count} ({percentage:.1f}%)")
    
    # Create charts
    print("\n=== Creating Charts ===")
    create_charts(stats, percentages)
    
    # Create and display tables
    print("\n=== Country Statistics Table ===")
    country_table_data = []
    for case_key in stats["country"].keys():
        for country, count in stats["country"][case_key].items():
            percentage = percentages["country"][case_key][country]
            country_table_data.append({
                'Case': case_key,
                'Country': country,
                'Count': count,
                'Percentage': f"{percentage:.1f}%"
            })
    
    country_df = pd.DataFrame(country_table_data)
    print(country_df.to_string(index=False))
    
    print("\n=== Browser Size Statistics Table ===")
    browser_table_data = []
    for case_key in stats["browsersize"].keys():
        for browser_size, count in stats["browsersize"][case_key].items():
            percentage = percentages["browsersize"][case_key][browser_size]
            browser_table_data.append({
                'Case': case_key,
                'Browser Size': browser_size,
                'Count': count,
                'Percentage': f"{percentage:.1f}%"
            })
    
    browser_df = pd.DataFrame(browser_table_data)
    print(browser_df.to_string(index=False))
    
    return stats, percentages

if __name__ == "__main__":
    analyze_csv_files() 