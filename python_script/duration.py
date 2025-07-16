import pandas as pd
import os
from pathlib import Path
import matplotlib.pyplot as plt
import numpy as np
import re
# Directory path
PUBLISHER = "sudoku"
EVENT = "Duration" 
directory = f"/Users/clayton/YollaWork/AnalysisScript/python_script/{PUBLISHER}/{EVENT}"
def create_variant_object(object_dict, variant, default_value):
    """Create a variant object if it doesn't exist"""
    if variant not in object_dict:
        object_dict[variant] = default_value
def analyze_csv_files():
    """Analyze CSV files and generate statistics"""
    
    # Initialize statistics objects
    stats = {
        "duration": {},
        "count": {}
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
        df = pd.read_csv(file_path)
        for _, data in df.iterrows():
            case_key = f"Case{data['cd3']}"
            create_variant_object(stats["duration"], case_key, 0)
            create_variant_object(stats["count"], case_key, 0)
            
            # Only accumulate data when label is "leave"
            # if data["label"] == "leave":
            stats["duration"][case_key] += data["cd15"]
            stats["count"][case_key] += 1
    
    print("\n=== Duration Statistics ===")
    
    # Create a list to store results for table
    results = []
    
    for case_key in stats["duration"].keys():
        total_duration_seconds = stats["duration"][case_key]
        count = stats["count"][case_key]
        avg_duration_seconds = total_duration_seconds / count if count > 0 else 0
        avg_duration_minutes = avg_duration_seconds / 60
        
        results.append({
            'Case': case_key,
            'Total Duration (seconds)': total_duration_seconds,
            'Count': count,
            'Average Duration (seconds)': round(avg_duration_seconds, 2),
            'Average Duration (minutes)': round(avg_duration_minutes, 2)
        })
    
    # Create DataFrame and display as table
    df_results = pd.DataFrame(results)
    print(df_results.to_string(index=False))

analyze_csv_files()