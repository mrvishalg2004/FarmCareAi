import requests
import asyncio
import random
import math

async def get_weather_data(latitude, longitude):
    """Get weather data for a location"""
    try:
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "current_weather": True,
            "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum",
            "timezone": "auto"
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        if "current_weather" not in data:
            return get_location_based_fallback_weather(latitude, longitude)
            
        temperature = data["current_weather"]["temperature"]
        
        # Process daily data
        daily_data = data.get("daily", {})
        temp_max = daily_data.get("temperature_2m_max", [25.0])[0]
        temp_min = daily_data.get("temperature_2m_min", [15.0])[0]
        
        # Calculate average temperature if current is missing
        if temperature is None:
            temperature = (temp_max + temp_min) / 2
            
        # Get precipitation/rainfall
        rainfall = 0
        if "precipitation_sum" in daily_data:
            rainfall_values = daily_data["precipitation_sum"]
            if rainfall_values and len(rainfall_values) > 0:
                # Get average daily rainfall and convert to annual estimate
                daily_avg = sum(val for val in rainfall_values if val is not None) / len(rainfall_values)
                # Rough annual estimate (daily * 365)
                rainfall = max(50, min(300, daily_avg * 365))
        
        # Default rainfall if missing
        if rainfall == 0:
            rainfall = 75.0
            
        # Get humidity (estimate from temperature difference if needed)
        humidity = data["current_weather"].get("humidity", None)
        if humidity is None:
            # Estimate humidity based on temperature difference
            temp_diff = temp_max - temp_min
            humidity = max(40, min(90, 90 - temp_diff * 2))
            
        return {
            "temperature": temperature,
            "humidity": humidity,
            "rainfall": rainfall
        }
    except Exception as e:
        print(f"Error fetching weather data: {e}")
        return get_location_based_fallback_weather(latitude, longitude)

def get_location_based_fallback_weather(latitude, longitude):
    """Generate realistic weather data based on location"""
    # Seed random number generator with coordinates for consistent results
    seed = int((latitude + 90) * 1000 + (longitude + 180) * 10)
    random.seed(seed)
    
    # Temperature varies by latitude (hotter near equator)
    base_temp = 30 - abs(latitude) * 0.5
    temp_variation = random.uniform(-5, 5)
    temperature = max(0, min(40, base_temp + temp_variation))
    
    # Humidity varies inversely with distance from coasts (simplified)
    humidity = random.uniform(50, 80)
    
    # Rainfall based on latitude (more near equator and at specific latitudes)
    equator_factor = 1 - min(1, abs(latitude) / 30)
    monsoon_factor = math.exp(-((abs(abs(latitude) - 15)) ** 2) / 50)
    base_rainfall = (equator_factor * 200) + (monsoon_factor * 300)
    rainfall_variation = random.uniform(0.7, 1.3)
    rainfall = max(50, min(300, base_rainfall * rainfall_variation))
    
    return {
        "temperature": round(temperature, 1),
        "humidity": round(humidity, 1),
        "rainfall": round(rainfall, 1)
    }

async def get_soil_data(latitude, longitude):
    """Get soil data for a location"""
    try:
        url = "https://rest.isric.org/soilgrids/v2.0/properties/query"
        params = {
            "lat": latitude,
            "lon": longitude,
            "property": ["clay", "sand", "phh2o", "soc"],
            "depth": ["0-5cm", "5-15cm", "15-30cm"],
            "value": "mean"
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        if "properties" not in data:
            return get_location_based_fallback_soil(latitude, longitude)
            
        # Extract soil properties
        properties = data["properties"]
        
        # Get clay content (average of top layers)
        clay_values = []
        for layer in ["0-5cm", "5-15cm", "15-30cm"]:
            if f"clay_{layer}_mean" in properties:
                clay_values.append(properties[f"clay_{layer}_mean"])
        clay = sum(clay_values) / len(clay_values) if clay_values else 30
        
        # Get sand content (average of top layers)
        sand_values = []
        for layer in ["0-5cm", "5-15cm", "15-30cm"]:
            if f"sand_{layer}_mean" in properties:
                sand_values.append(properties[f"sand_{layer}_mean"])
        sand = sum(sand_values) / len(sand_values) if sand_values else 40
        
        # Calculate silt content
        silt = max(0, 100 - clay - sand)
        
        # Get pH value (average of top layers)
        ph_values = []
        for layer in ["0-5cm", "5-15cm", "15-30cm"]:
            if f"phh2o_{layer}_mean" in properties:
                ph_values.append(properties[f"phh2o_{layer}_mean"] / 10)  # Convert to standard pH scale
        ph = sum(ph_values) / len(ph_values) if ph_values else 6.5
        
        # Get soil organic carbon (SOC)
        carbon_values = []
        for layer in ["0-5cm", "5-15cm", "15-30cm"]:
            if f"soc_{layer}_mean" in properties:
                carbon_values.append(properties[f"soc_{layer}_mean"] / 10)
        carbon = sum(carbon_values) / len(carbon_values) if carbon_values else 1.5
        
        # Estimate N, P, K based on soil composition
        n_value = estimate_nitrogen(clay, sand, silt, carbon)
        p_value = estimate_phosphorus(clay, sand, silt, ph)
        k_value = estimate_potassium(clay, sand, silt)
        
        return {
            "N": n_value,
            "P": p_value,
            "K": k_value,
            "ph": ph,
            "ph_level": ph,  # Duplicate for compatibility
            "clay": clay,
            "sand": sand,
            "silt": silt,
            "carbon": carbon,
            "soil_type": determine_soil_type(clay, sand, silt)
        }
    except Exception as e:
        print(f"Error fetching soil data: {e}")
        return get_location_based_fallback_soil(latitude, longitude)

def get_location_based_fallback_soil(latitude, longitude):
    """Generate realistic soil data based on location"""
    # Seed random number generator with coordinates for consistent results
    seed = int((latitude + 90) * 100 + (longitude + 180))
    random.seed(seed)
    
    # Clay varies by latitude (more in tropics)
    base_clay = 30 + (1 - min(1, abs(latitude) / 30)) * 15
    clay_variation = random.uniform(-10, 10)
    clay = max(5, min(60, base_clay + clay_variation))
    
    # Sand varies inversely with distance from coasts and deserts (simplified)
    base_sand = 40 + (abs(latitude) / 90) * 20
    sand_variation = random.uniform(-15, 15)
    sand = max(10, min(80, base_sand + sand_variation))
    
    # Ensure clay + sand <= 100
    if clay + sand > 100:
        factor = 100 / (clay + sand)
        clay *= factor
        sand *= factor
    
    # Silt is the remainder
    silt = max(0, 100 - clay - sand)
    
    # pH varies by latitude and longitude
    base_ph = 6.5 + (abs(latitude) / 90) * 0.5 + (abs(longitude) / 180) * 0.5
    ph_variation = random.uniform(-1, 1)
    ph = max(4.5, min(8.5, base_ph + ph_variation))
    
    # Carbon content varies by latitude (more in temperate regions)
    temperate_factor = math.exp(-((abs(abs(latitude) - 45)) ** 2) / 200)
    carbon = max(0.5, min(5.0, temperate_factor * 3 + random.uniform(0.3, 1.5)))
    
    # Estimate N, P, K based on generated soil composition
    n_value = estimate_nitrogen(clay, sand, silt, carbon)
    p_value = estimate_phosphorus(clay, sand, silt, ph)
    k_value = estimate_potassium(clay, sand, silt)
    
    return {
        "N": n_value,
        "P": p_value,
        "K": k_value,
        "ph": ph,
        "ph_level": ph,  # Duplicate for compatibility
        "clay": clay,
        "sand": sand,
        "silt": silt,
        "carbon": carbon,
        "soil_type": determine_soil_type(clay, sand, silt)
    }

def estimate_nitrogen(clay, sand, silt, carbon):
    """Estimate nitrogen based on soil composition and organic carbon"""
    # Higher clay and organic carbon correlate with higher nitrogen
    base_n = (clay * 0.3 + silt * 0.1) / 10
    carbon_factor = carbon * 10  # Organic carbon has strong correlation with N
    
    # Add randomization for natural variation
    random_factor = random.uniform(0.8, 1.2)
    
    n_value = (base_n + carbon_factor) * random_factor
    return max(10, min(140, n_value))

def estimate_phosphorus(clay, sand, silt, ph):
    """Estimate phosphorus based on soil composition and pH"""
    # Higher sand often means lower P retention
    base_p = (silt * 0.4 + clay * 0.2) / 10
    
    # pH affects P availability - best around 6.5
    ph_factor = 10 - abs(ph - 6.5) * 5
    
    # Add randomization
    random_factor = random.uniform(0.7, 1.3)
    
    p_value = (base_p + ph_factor) * random_factor
    return max(5, min(145, p_value))

def estimate_potassium(clay, sand, silt):
    """Estimate potassium based on soil composition"""
    # Clay has high correlation with K
    base_k = (clay * 0.5 + silt * 0.2) / 10
    
    # Add randomization
    random_factor = random.uniform(0.8, 1.2)
    
    k_value = base_k * random_factor
    return max(5, min(205, k_value))

def determine_soil_type(clay, sand, silt):
    """Determine soil type based on soil texture triangle"""
    if sand >= 85:
        return "Sand"
    elif sand >= 70 and clay <= 15:
        return "Loamy Sand"
    elif (sand >= 43 and sand <= 85) and (silt <= 50) and (clay <= 20):
        return "Sandy Loam"
    elif clay >= 35 and sand >= 45:
        return "Sandy Clay"
    elif clay >= 40:
        return "Clay"
    elif clay >= 27 and clay < 40 and sand <= 20:
        return "Silty Clay"
    elif clay >= 27 and clay < 40 and sand > 20 and sand <= 45:
        return "Clay Loam"
    elif silt >= 80:
        return "Silt"
    elif silt >= 50 and silt < 80 and clay < 27:
        return "Silt Loam"
    elif clay >= 20 and clay < 35 and silt >= 28 and sand < 45:
        return "Silty Clay Loam"
    elif clay >= 20 and clay < 35 and silt < 28 and sand >= 45:
        return "Sandy Clay Loam"
    else:
        return "Loam"

async def get_location_info(latitude, longitude):
    """Get location info from coordinates"""
    try:
        url = f"https://nominatim.openstreetmap.org/reverse"
        params = {
            "lat": latitude,
            "lon": longitude,
            "format": "json"
        }
        
        response = requests.get(url, params=params, headers={"User-Agent": "FarmCare/1.0"})
        data = response.json()
        
        if "error" in data:
            return {
                "lat": latitude,
                "lon": longitude,
                "address": "Unknown location",
                "country": "Unknown",
                "state": "Unknown",
                "city": "Unknown"
            }
            
        address = data.get("display_name", "Unknown location")
        address_parts = data.get("address", {})
        
        country = address_parts.get("country", "Unknown")
        state = address_parts.get("state", address_parts.get("region", "Unknown"))
        city = address_parts.get("city", address_parts.get("town", address_parts.get("village", "Unknown")))
        
        return {
            "lat": latitude,
            "lon": longitude,
            "address": address,
            "country": country,
            "state": state,
            "city": city
        }
    except Exception as e:
        print(f"Error fetching location info: {e}")
        return {
            "lat": latitude,
            "lon": longitude,
            "address": "Unknown location",
            "country": "Unknown",
            "state": "Unknown",
            "city": "Unknown"
        }