import os
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from collections import defaultdict

# Control variable - change this to switch between folders
FOLDER_TYPE = "onVideoStarted"  # Options: "onAdUnitEnded" or "onVideoStarted"

# Directory path
directory = f"/Users/clayton/YollaWork/AnalysisScript/python_script/bubbleshooter.net/{FOLDER_TYPE}"

def create_variant_object(object_dict, variant, default_value):
    """Create a variant object if it doesn't exist"""
    if variant not in object_dict:
        object_dict[variant] = default_value

def process_csv_files():
    """Process only CSV files in the directory and return statistics"""
    total = 0
    size_object = defaultdict(int)
    
    # Get only CSV files in the directory
    csv_files = [f for f in os.listdir(directory) if f.lower().endswith('.csv')]
    
    if not csv_files:
        print(f"No CSV files found in the directory: {directory}")
        return 0, {}
    
    print(f"Found {len(csv_files)} CSV files to process in {FOLDER_TYPE}")
    
    # Process each CSV file
    for file in csv_files:
        file_path = os.path.join(directory, file)
        print(f"Processing CSV file: {file}")
        
        try:
            # Read CSV file
            df = pd.read_csv(file_path, low_memory=False)
            
            # Process each row
            for _, row in df.iterrows():
                total += 1
                
                # Check if cm7 > 0
                if pd.notna(row.get('cm7')) and float(row['cm7']) > 0:
                    cd37_value = row.get('cd37')
                    if pd.notna(cd37_value):
                        create_variant_object(size_object, cd37_value, 0)
                        size_object[cd37_value] += 1
                        
        except Exception as e:
            print(f"Error processing CSV file {file}: {e}")
    
    return total, dict(size_object)

def create_percentage_chart(size_object, total):
    """Create a bar chart showing percentage distribution"""
    if not size_object:
        print("No data to plot")
        return
    
    # Calculate percentages
    percentages = {}
    for key, value in size_object.items():
        percentages[key] = (value / total) * 100
    
    # Sort by percentage (descending)
    sorted_items = sorted(percentages.items(), key=lambda x: x[1], reverse=True)
    
    # Prepare data for plotting
    labels = [str(item[0]) for item in sorted_items]
    values = [item[1] for item in sorted_items]
    
    # Create the chart
    plt.figure(figsize=(12, 8))
    bars = plt.bar(range(len(labels)), values, color='skyblue', edgecolor='navy', alpha=0.7)
    
    # Customize the chart
    plt.title(f'Percentage Distribution by cd37 (cm7 > 0) - {FOLDER_TYPE}', fontsize=16, fontweight='bold')
    plt.xlabel('cd37 Values', fontsize=12)
    plt.ylabel('Percentage (%)', fontsize=12)
    plt.xticks(range(len(labels)), labels, rotation=45, ha='right')
    
    # Add value labels on bars
    for i, (bar, value) in enumerate(zip(bars, values)):
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height + 0.1,
                f'{value:.1f}%', ha='center', va='bottom', fontweight='bold')
    
    # Add grid
    plt.grid(axis='y', alpha=0.3)
    plt.tight_layout()
    
    # Save the chart
    output_path = os.path.join(directory, f'cd37_percentage_distribution_{FOLDER_TYPE}.png')
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    print(f"Chart saved to: {output_path}")
    
    # Close the plot to free memory
    plt.close()
    
    return sorted_items

def save_table_to_file(size_object, total, sorted_items):
    """Save the summary table to a text file"""
    table_path = os.path.join(directory, f'cd37_percentage_summary_{FOLDER_TYPE}.txt')
    
    with open(table_path, 'w', encoding='utf-8') as f:
        f.write("="*60 + "\n")
        f.write(f"PERCENTAGE DISTRIBUTION SUMMARY - {FOLDER_TYPE}\n")
        f.write("="*60 + "\n")
        f.write(f"{'cd37 Value':<15} {'Count':<10} {'Percentage':<12}\n")
        f.write("-" * 60 + "\n")
        
        for key, value in sorted_items:
            count = size_object[key]
            f.write(f"{str(key):<15} {count:<10} {value:.1f}%\n")
        
        f.write("-" * 60 + "\n")
        f.write(f"{'TOTAL':<15} {total:<10} {'100.0%':<12}\n")
    
    print(f"Table saved to: {table_path}")

def main():
    """Main function to run the analysis"""
    print(f"Starting CSV analysis for {FOLDER_TYPE}...")
    
    # Process CSV files
    total, size_object = process_csv_files()
    
    print(f"\nTotal records processed: {total}")
    print(f"Records with cm7 > 0: {sum(size_object.values())}")
    print(f"Unique cd37 values: {len(size_object)}")
    
    # Create and save the chart
    sorted_items = create_percentage_chart(size_object, total)
    
    # Save table to file
    save_table_to_file(size_object, total, sorted_items)
    
    # Print summary table
    print("\n" + "="*60)
    print(f"PERCENTAGE DISTRIBUTION SUMMARY - {FOLDER_TYPE}")
    print("="*60)
    print(f"{'cd37 Value':<15} {'Count':<10} {'Percentage':<12}")
    print("-" * 60)
    
    for key, value in sorted_items:
        count = size_object[key]
        print(f"{str(key):<15} {count:<10} {value:.1f}%")
    
    print("-" * 60)
    print(f"{'TOTAL':<15} {total:<10} {'100.0%':<12}")
    
    print(f"\nAnalysis completed for {FOLDER_TYPE}. Program terminating.")

if __name__ == "__main__":
    main() 