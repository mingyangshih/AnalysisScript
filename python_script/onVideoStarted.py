import os
import pandas as pd
from collections import defaultdict

# Directory path
directory = "/Users/clayton/YollaWork/AnalysisScript/bubbleshooter.net/onVideoStarted"
# directory = "/home/ubuntu/YAReport/calScripts/bubbleshooter.net/onVideoStarted"

# Initialize statistics dictionaries
stats = {
    'caseOutstream': defaultdict(int),
    'caseOutstreamCPM': defaultdict(float),
    'caseOutstreamCPM_cd40_4': defaultdict(float),
    'caseOutstreamCPM_cd40_not_4': defaultdict(float)
}


def format_number(num):
    """Format number: divide by 1000 and keep 2 decimal places"""
    return round(num / 1000, 2)

def process_csv_files():
    
    try:
        # Get all files in directory
        files = os.listdir(directory)
        csv_files = [f for f in files if f.endswith('.csv')]
        
        if not csv_files:
            print("No CSV files found in directory")
            return
        
        print(f"Found {len(csv_files)} CSV files to process")
        
        # Process each CSV file
        for file in csv_files:
            file_path = os.path.join(directory, file)
            print(f"Processing file: {file}")
            
            try:
                # Read CSV file
                df = pd.read_csv(file_path) # data frame
                
                # Filter data based on conditions
                filtered_data = df[
                    (df['action'] == 'onVideoStarted') & 
                    (df['label'].str.contains('outstream', na=False))
                ]
                
                # Process each row
                for _, row in filtered_data.iterrows():
                    case_key = f"Case{row['cd3']}"
                    
                    # Update statistics
                    stats['caseOutstream'][case_key] += 1
                    stats['caseOutstreamCPM'][case_key] += float(row['cd2'])
                    
                    # Classify by cd40 and accumulate cd2
                    if str(row['cd40']) == '4':
                        stats['caseOutstreamCPM_cd40_4'][case_key] += float(row['cd2'])
                    else:
                        stats['caseOutstreamCPM_cd40_not_4'][case_key] += float(row['cd2'])
                        
            except Exception as e:
                print(f"Error processing file {file}: {e}")
                continue
        
        # Generate combined statistics table
        generate_combined_table()
        
    except Exception as e:
        print(f"Error reading directory: {e}")

def generate_combined_table():
    """Generate and display combined statistics table"""
    combined_table = {}
    
    for variant in stats['caseOutstream'].keys():
        count = stats['caseOutstream'][variant]
        total_cpm = stats['caseOutstreamCPM'][variant]
        cpm_cd40_4 = stats['caseOutstreamCPM_cd40_4'][variant]
        cpm_cd40_not_4 = stats['caseOutstreamCPM_cd40_not_4'][variant]
        
        combined_table[variant] = {
            'Count': count,
            'Total CPM (K)': format_number(total_cpm),
            'Avg CPM (K)': format_number(total_cpm / count) if count > 0 else 0,
            'CPM cd40=4 (K)': format_number(cpm_cd40_4),
            'Avg CPM cd40=4 (K)': format_number(cpm_cd40_4 / count) if count > 0 else 0,
            'CPM cd40!=4 (K)': format_number(cpm_cd40_not_4),
            'Avg CPM cd40!=4 (K)': format_number(cpm_cd40_not_4 / count) if count > 0 else 0
        }
    
    print("\n=== Combined Statistics ===")
    
    # Convert to DataFrame for better display
    df_table = pd.DataFrame.from_dict(combined_table, orient='index')
    print(df_table.to_string())
    
    # Also print test_cpm value
    print(f"\nTest CPM Total: {format_number(test_cpm)}")

if __name__ == "__main__":
    process_csv_files() 