from pymongo import MongoClient
import pandas as pd
from datetime import datetime
import os

# MongoDB connection settings
# 34.217.61.62 perfomance tracker
# 54.189.105.156 debug tracker
MONGODB_URL = "mongodb://34.217.61.62:27017/" 
DB_NAME = "data-collection"
DOMAIN_ID = 276
COLLECTION_NAME = f"pageview{DOMAIN_ID}"

# Time settings
START_TIME = 1750132800000  # Starting timestamp 0617
ONE_HOUR_MS = 3600000  # One hour in milliseconds
TOTAL_HOURS = 24
EVENT = "Duration"

# Output directory
OUTPUT_DIR = f"sudoku/{EVENT}"

def export_data():
    # Create output directory if it doesn't exist
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Connect to MongoDB
    client = MongoClient(MONGODB_URL)
    try:
        print("Connected to MongoDB")
        
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        
        for hour in range(TOTAL_HOURS):
            current_start_time = START_TIME + hour * ONE_HOUR_MS
            current_end_time = current_start_time + ONE_HOUR_MS
            
            # Define match condition
            match_condition = [
                {
                    "$match": {
                        "ts": {
                            "$gte": current_start_time,
                            "$lte": current_end_time
                        },
                        "category": {
                            "$regex": f"^{EVENT}$"
                        },
                        # "cd3": {"$in": ["5","6","7","8"]}
                        "cd3": {"$in": ["7","8","9","10"]}
                    }
                },
                {
                    "$lookup": {
                        "from": f"user_info{DOMAIN_ID}",
                        "as": "user",
                        "localField": "user_info_id",
                        "foreignField": "_id"
                    }
                },
                {
                    "$replaceRoot": {
                        "newRoot": {
                            "$mergeObjects": [
                                "$$ROOT",
                                {
                                    "$arrayElemAt": ["$user", 0]
                                }
                            ]
                        }
                    }
                },
                {
                    "$project": {
                        "label": "$label",
                        "ts": "$ts",
                        "category": "$category",
                        "action": "$action",
                        "value": "$value",
                        "uuid": "$uuid",
                        "sessionid": "$sessionid",
                        "bs": "$bs",
                        "pagepath": "$pagepath",
                        "hostname": "$hostname",
                        "country": "$country",
                        "cd1": "$cd1",
                        "cd2": "$cd2",
                        "cd3": "$cd3",
                        "cd4": "$cd4",
                        "cd5": "$cd5",
                        "cd6": "$cd6",
                        "cd7": "$cd7",
                        "cd15": "$cd15",
                        "cd16": "$cd16",
                        "cd24": "$cd24",
                        "cd26": "$cd26",
                        "cd27": "$cd27",
                        "cd33": "$cd33",
                        "cd36": "$cd36",
                        "cd38": "$cd38",
                        "cd40": "$cd40",
                        "cm3": "$cm3",
                        "cm5": "$cm5",
                        "cm13": "$cm13",
                        "country": "$country",
                        "browsersize": "$browsersize",
                        "devicecategory": "$devicecategory"
                    }
                }
            ]
            
            # Query data
            data = list(collection.aggregate(
                match_condition,
                maxTimeMS=600000,
                allowDiskUse=True
            ))
            
            if data:
                print(f"\nFound {len(data)} records for hour {hour + 1}")
                # Convert to DataFrame and save as CSV
                df = pd.DataFrame(data)
                output_file = os.path.join(OUTPUT_DIR, f"hour_{hour + 1}_data.csv")
                df.to_csv(output_file, index=False)
                print(f"Saved to: {output_file}")
            else:
                print(f"\nNo data found for hour {hour + 1}")
                
    except Exception as e:
        print(f"Error exporting data: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    export_data() 