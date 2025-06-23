import pandas as pd
import os
from pathlib import Path
import matplotlib.pyplot as plt
import numpy as np
import re
# Directory path
PUBLISHER = "sudoku"
EVENT = "Yolla" 
directory = f"/Users/clayton/YollaWork/AnalysisScript/python_script/{PUBLISHER}/{EVENT}"
def create_variant_object(object_dict, variant, default_value):
    """Create a variant object if it doesn't exist"""
    if variant not in object_dict:
        object_dict[variant] = default_value
def analyze_csv_files():
    """Analyze CSV files and generate unique user statistics"""
    
    # Initialize statistics objects
    stats = {
        "unique_users": {}
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
            create_variant_object(stats["unique_users"], case_key, set())
            
            # Add UUID to the set for this case
            stats["unique_users"][case_key].add(data["uuid"])
    
    print("\n=== Unique User Statistics ===")
    
    # Create a list to store results for table
    results = []
    
    for case_key, uuid_set in stats["unique_users"].items():
        unique_count = len(uuid_set)
        
        results.append({
            'Case': case_key,
            'Unique Users': unique_count
        })
    
    # Create DataFrame and display as table
    df_results = pd.DataFrame(results)
    print(df_results.to_string(index=False))

analyze_csv_files()