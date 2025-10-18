from flask import Blueprint, request, jsonify
import asyncio
from .crop_recommendation.predict import predict_crop
from .crop_recommendation.services import get_weather_data, get_soil_data, get_location_info

crop_routes = Blueprint('crop_routes', __name__)

@crop_routes.route('/recommend', methods=['POST'])
def recommend_crop():
    data = request.get_json()
    
    # Extract parameters from request
    N = float(data.get('nitrogen', 0))
    P = float(data.get('phosphorus', 0))
    K = float(data.get('potassium', 0))
    temperature = float(data.get('temperature', 0))
    humidity = float(data.get('humidity', 0))
    ph = float(data.get('ph', 0))
    rainfall = float(data.get('rainfall', 0))
    
    # Get recommendation
    result = predict_crop(N, P, K, temperature, humidity, ph, rainfall)
    
    # Include location info if provided
    if 'location_info' in data:
        result['location_info'] = data['location_info']
    
    # Include soil data if provided
    if 'soil_data' in data:
        result['soil_data'] = data['soil_data']
    
    return jsonify(result)

@crop_routes.route('/weather/<lat>/<lon>', methods=['GET'])
def get_weather(lat, lon):
    lat_float = float(lat)
    lon_float = float(lon)
    
    # Create event loop for async call
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    # Get weather data
    weather_data = loop.run_until_complete(get_weather_data(lat_float, lon_float))
    loop.close()
    
    return jsonify(weather_data)

@crop_routes.route('/soil/<lat>/<lon>', methods=['GET'])
def get_soil(lat, lon):
    lat_float = float(lat)
    lon_float = float(lon)
    
    # Create event loop for async call
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    # Get soil data
    soil_data = loop.run_until_complete(get_soil_data(lat_float, lon_float))
    loop.close()
    
    return jsonify(soil_data)

@crop_routes.route('/location/<lat>/<lon>', methods=['GET'])
def get_location(lat, lon):
    lat_float = float(lat)
    lon_float = float(lon)
    
    # Create event loop for async call
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    # Get location info
    location_data = loop.run_until_complete(get_location_info(lat_float, lon_float))
    loop.close()
    
    return jsonify(location_data)

@crop_routes.route('/combined/<lat>/<lon>', methods=['GET'])
def get_combined_data(lat, lon):
    lat_float = float(lat)
    lon_float = float(lon)
    
    # Create event loop for async call
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    # Get data asynchronously
    weather_task = loop.create_task(get_weather_data(lat_float, lon_float))
    soil_task = loop.create_task(get_soil_data(lat_float, lon_float))
    location_task = loop.create_task(get_location_info(lat_float, lon_float))
    
    # Wait for all tasks
    loop.run_until_complete(asyncio.gather(weather_task, soil_task, location_task))
    loop.close()
    
    # Get results
    weather_data = weather_task.result()
    soil_data = soil_task.result()
    location_data = location_task.result()
    
    # Combine data
    result = {
        "weather": weather_data,
        "soil": soil_data,
        "location": location_data
    }
    
    return jsonify(result)