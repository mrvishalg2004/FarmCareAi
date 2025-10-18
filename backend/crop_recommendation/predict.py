import pandas as pd
import numpy as np
import pickle

def load_model_components(model_name='randomforest'):
    """
    Loads the trained model, scaler, and label encoder from disk for the RandomForest model.

    Args:
        model_name (str): The name of the model to load (default is 'randomforest').

    Returns:
        tuple: (model, scaler, label_encoder) or (None, None, None) if files not found.
    """
    try:
        with open(f'{model_name.lower()}_model.pkl', 'rb') as model_file:
            model = pickle.load(model_file)
        with open('scaler.pkl', 'rb') as scaler_file:
            scaler = pickle.load(scaler_file)
        with open('label_encoder.pkl', 'rb') as encoder_file:
            label_encoder = pickle.load(encoder_file)
        print(f"\nSuccessfully loaded {model_name} model and associated components.")
        return model, scaler, label_encoder
    except FileNotFoundError:
        print(f"Error: Model files not found for '{model_name}'.")
        print("Please ensure the correct model name is provided and 'train_model.py' has been run.")
        return None, None, None
    except Exception as e:
        print(f"An error occurred while loading model components: {e}")
        return None, None, None


def create_economic_dataset():
    """
    Creates a DataFrame with simulated economic data for each crop.
    In a real-world application, this data would be sourced from databases or APIs.
    """
    # Data based on the 22 crops in the original dataset [1]
    # Values are illustrative estimates inspired by Indian agricultural reports.
    data = {
        'Crop': ['rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas', 'mothbeans',
                 'mungbean', 'blackgram', 'lentil', 'pomegranate', 'banana', 'mango',
                 'grapes', 'watermelon', 'muskmelon', 'apple', 'orange', 'papaya',
                 'coconut', 'cotton', 'jute', 'coffee'],
        'Cost_of_Cultivation_per_Hectare': [
            32000, 22000, 18000, 20000, 21000, 17000, 18500, 19000, 17500, 60000,
            75000, 80000, 150000, 25000, 26000, 180000, 70000, 55000, 90000, 24500,
            23000, 120000
        ],
        'Avg_Yield_per_Hectare': [ # in tonnes
            6.0, 5.5, 1.5, 1.8, 2.0, 1.2, 1.4, 1.3, 1.1, 15.0, 50.0, 12.0, 20.0,
            30.0, 28.0, 25.0, 22.0, 40.0, 10.0, 2.5, 2.2, 1.0
        ],
        'Avg_Market_Price_per_Quintal': [ # in rupees
             2500, 2000, 5000, 4800, 4500, 4000, 5200, 5100, 4900, 8000, 1500,
             3000, 4000, 1200, 1500, 6000, 2500, 1800, 3500, 6000, 3000, 15000
        ]
    }
    return pd.DataFrame(data).set_index('Crop')

def get_recommendations(agronomic_inputs, user_budget_per_hectare, model, scaler, label_encoder, economic_df):
    """
    Provides profit-aware, budget-constrained crop recommendations.

    Args:
        agronomic_inputs (dict): A dictionary of the 7 agronomic features.
        user_budget_per_hectare (float): The user's budget constraint.
        model: The trained classification model.
        scaler: The fitted StandardScaler.
        label_encoder: The fitted LabelEncoder.
        economic_df (pd.DataFrame): DataFrame with economic data for crops.

    Returns:
        list: A list of recommended crops, sorted by profitability.
    """
    # --- Stage 1: Agronomic Prediction ---
    # Convert input dict to DataFrame and scale it
    input_df = pd.DataFrame([agronomic_inputs])
    input_scaled = scaler.transform(input_df)

    # Get class probabilities for all 22 crops
    probabilities = model.predict_proba(input_scaled)

    # Get the top 3 most agronomically suitable crops
    top_3_indices = np.argsort(probabilities)[0][-3:][::-1]
    top_3_crops = label_encoder.inverse_transform(top_3_indices)
    top_3_probs = probabilities[0][top_3_indices]

    print("\n--- Stage 1: Agronomic Analysis ---")
    print("Top 3 agronomically suitable crops:")
    for crop, prob in zip(top_3_crops, top_3_probs):
        print(f"- {crop.capitalize()} (Suitability: {prob:.2%})")

    # --- Stage 2: Economic Ranking & Budget Filtering ---
    print("\n--- Stage 2: Economic & Budget Analysis ---")
    recommendations = []
    for crop, prob in zip(top_3_crops, top_3_probs):
        if crop in economic_df.index:
            cost = economic_df.loc[crop, 'Cost_of_Cultivation_per_Hectare']
            yield_val = economic_df.loc[crop, 'Avg_Yield_per_Hectare']
            price = economic_df.loc[crop, 'Avg_Market_Price_per_Quintal']

            # Budget Filtering
            if cost <= user_budget_per_hectare:
                # Profitability Calculation (1 tonne = 10 quintals)
                estimated_profit = (yield_val * price * 10) - cost
                recommendations.append({
                    'Crop': crop,
                    'Agronomic_Score': f"{prob:.2%}",
                    'Est_Cost_per_Hectare': f"₹{cost:,.0f}",
                    'Est_Profit_per_Hectare': f"₹{estimated_profit:,.0f}",
                    'Status': 'Recommended'
                })
                print(f"- {crop.capitalize()}: Within budget (Cost: ₹{cost:,.0f}). Calculating profit...")
            else:
                recommendations.append({
                    'Crop': crop,
                    'Agronomic_Score': f"{prob:.2%}",
                    'Est_Cost_per_Hectare': f"₹{cost:,.0f}",
                    'Est_Profit_per_Hectare': 'N/A',
                    'Status': f'Not Recommended (Exceeds Budget of ₹{user_budget_per_hectare:,.0f})'
                })
                print(f"- {crop.capitalize()}: Exceeds budget (Cost: ₹{cost:,.0f}). Discarded.")
        else:
            print(f"- {crop.capitalize()}: No economic data available. Skipped.")

    # Sort the final list by estimated profit (if calculable)
    # We need a helper function to convert the formatted profit string back to a number for sorting
    def sort_key(rec):
        profit_str = rec.get('Est_Profit_per_Hectare', '₹0').replace('₹', '').replace(',', '')
        try:
            return float(profit_str) if profit_str!= 'N/A' else -float('inf')
        except ValueError:
            return -float('inf') # Handle cases where conversion fails

    # Separate recommended from not recommended and sort recommended by profit
    recommended_crops = sorted([rec for rec in recommendations if rec['Status'] == 'Recommended'], key=sort_key, reverse=True)
    not_recommended_crops = [rec for rec in recommendations if rec['Status'] != 'Recommended']

    return recommended_crops + not_recommended_crops


if __name__ == '__main__':
    # Load the trained components (specifically for RandomForest)
    model, scaler, label_encoder = load_model_components()

    if model:
        # Create the economic dataset
        economic_df = create_economic_dataset()

        # --- Get User Input ---
        print("\n--- Enter User Input ---")
        try:
            user_agronomic_inputs = {
                'N': float(input("Enter Nitrogen (N) value: ")),
                'P': float(input("Enter Phosphorus (P) value: ")),
                'K': float(input("Enter Potassium (K) value: ")),
                'temperature': float(input("Enter Temperature (°C): ")),
                'humidity': float(input("Enter Humidity (%): ")),
                'ph': float(input("Enter pH value: ")),
                'rainfall': float(input("Enter Rainfall (mm): "))
            }
            user_budget = float(input("Enter your budget per Hectare (₹): "))

        except ValueError:
            print("Invalid input. Please enter numeric values for all inputs.")
            exit()

        print(f"\nAgronomic Conditions: {user_agronomic_inputs}")
        print(f"User Budget per Hectare: ₹{user_budget:,.0f}")
        print("-" * 30)

        # Get the final recommendations
        final_recommendations = get_recommendations(
            user_agronomic_inputs, user_budget, model, scaler, label_encoder, economic_df
        )

        # --- Display Final Output ---
        print("\n--- Final Recommendations (Ranked by Profitability) ---")
        if final_recommendations:
            output_df = pd.DataFrame(final_recommendations)
            # Ensure correct order for display
            output_df = output_df[['Crop', 'Agronomic_Score', 'Est_Cost_per_Hectare', 'Est_Profit_per_Hectare', 'Status']]
            print(output_df.to_string(index=False))
        else:
            print("No suitable crops found based on the provided inputs.")
