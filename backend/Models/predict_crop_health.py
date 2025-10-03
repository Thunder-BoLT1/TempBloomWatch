import sys
import json
import joblib
import pandas as pd

# Define the exact feature columns your model was trained on
# This order is CRUCIAL for the model to work correctly.
FEATURE_COLS = [
    "Humidity_%", "Rainfall_m", "Temperature_C", "WindSpeed_m/s", "SolarRadiation",
    "Clay", "OrganicCarbon", "Sand", "Silt", "SoilMoisture",
    "EVI", "NDVI", "NDWI", "SAVI",
    "week_number", "month", "day_of_year",
    "region_East_Africa", "region_North_Africa", "region_South_Africa", "region_West_Africa",
    "season_Autumn", "season_Spring", "season_Summer", "season_Winter"
]

def predict(data):
    """
    Loads the crop health model and makes a prediction.
    """
    try:
        # Load the pre-trained model
        model = joblib.load('./crop_health_model.pkl')
        
        # Convert the input dictionary into a pandas DataFrame
        # ensuring the column order matches the training order.
        input_df = pd.DataFrame([data])
        input_df = input_df[FEATURE_COLS] # Enforce column order
        
        # Make a prediction
        prediction = model.predict(input_df)
        
        # The result is often a numpy array, so we extract the first element
        result = prediction[0]
        
        # XGBoost often predicts a number (0, 1, 2...). We can map this to a human-readable label.
        # This is an EXAMPLE mapping. You should replace it with your actual class labels.
        class_mapping = {0: "Healthy", 1: "Stressed", 2: "Diseased"}
        readable_prediction = class_mapping.get(result, "Unknown Class")
        
        # Return the result as a JSON object
        return json.dumps({"prediction": readable_prediction, "class_id": int(result)})

    except FileNotFoundError:
        return json.dumps({"error": "Model file (crop_health_model.pkl) not found. Make sure it's in the same directory."})
    except Exception as e:
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    try:
        if len(sys.argv) > 1:
            # The input from Node.js is a JSON string, which we parse
            input_data = json.loads(sys.argv[1])
            # Call the predict function and print the result to stdout
            print(predict(input_data))
        else:
            print(json.dumps({"error": "No input data provided to Python script."}))
    except Exception as e:
        print(json.dumps({"error": f"Exception in Python script: {str(e)}"}))
