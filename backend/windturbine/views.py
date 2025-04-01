import pandas as pd
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import os
import tempfile

from .utils.wind_calc import get_power_output
from .serializers import *

@api_view(['POST'])
def wind_power_simulation_api(request):
    try:
        data = request.data
        google_sheet_url = data.get("google_sheet_url")
        time_zone = data.get("time_zone")
        wind_speed_model = data.get("wind_speed_model")
        temperature_model = data.get("temperature_model")
        density_model = data.get("density_model")
        power_output_model = data.get("power_output_model")
        density_correction = data.get("density_correction")
        obstacle_height = data.get("obstacle_height")
        hellman_exp = data.get("hellman_exp")
        turbine_type = data.get("turbine_type")
        hub_height = data.get("hub_height")

        # Validate Google Sheet URL
        if not google_sheet_url:
            raise ValueError("Google Sheet URL is required.")
        
        # Convert Google Sheet URL to CSV export link
        if "docs.google.com/spreadsheets" in google_sheet_url:
            if "edit?usp=sharing" in google_sheet_url:
                google_sheet_url = google_sheet_url.replace("edit?usp=sharing", "export?format=csv")
            elif "/edit#gid=" in google_sheet_url:
                google_sheet_url = google_sheet_url.replace("/edit#gid=", "/export?format=csv&gid=")
        else:
            raise ValueError("Invalid Google Sheet URL.")

        # Load data from Google Sheet
        try:
            df = pd.read_csv(google_sheet_url, delimiter=",", on_bad_lines="skip", engine="python")
        except Exception as e:
            raise ValueError(f"Failed to load data from Google Sheet: {str(e)}")

        # Save the data to a temporary CSV file
        temp_dir = tempfile.gettempdir()
        temp_file_path = os.path.join(temp_dir, "temp_wind_data.csv")
        df.to_csv(temp_file_path, index=False)

        try:
            # Call the wind power calculation function
            result = get_power_output(
                file_path=temp_file_path,
                time_zone=time_zone,
                wind_speed_model=wind_speed_model,
                temperature_model=temperature_model,
                density_model=density_model,
                power_output_model=power_output_model,
                density_correction=density_correction,
                obstacle_height=obstacle_height,
                hellman_exp=hellman_exp,
                turbine_type=turbine_type,
                hub_height=hub_height
            )
            
            # Prepare data for serialization
            data_for_serialization = {}
            
            # Handle power output time series
            if 'power_output' in result and hasattr(result['power_output'], 'index'):
                data_for_serialization['power_output'] = {
                    'timestamps': [str(idx) for idx in result['power_output'].index],
                    'values': result['power_output'].values.tolist()
                }
            else:
                # Handle case where power_output is not a time series
                # This is a fallback that might need adjustment based on your needs
                data_for_serialization['power_output'] = {
                    'timestamps': [],
                    'values': []
                }

            # Handle turbine info and curves
            if 'power_plant' in result:
                power_plant = result['power_plant']
                turbine_info = {
                    'type': turbine_type,
                    'hub_height': hub_height
                }
                
                # Add power curve if available
                if hasattr(power_plant, 'power_curve') and power_plant.power_curve is not None:
                    turbine_info['power_curve'] = {
                        'wind_speed': power_plant.power_curve.wind_speed.tolist(),
                        'value': power_plant.power_curve.value.tolist()
                    }
                
                # Add power coefficient curve if available
                if hasattr(power_plant, 'power_coefficient_curve') and power_plant.power_coefficient_curve is not None:
                    turbine_info['power_coefficient_curve'] = {
                        'wind_speed': power_plant.power_coefficient_curve.wind_speed.tolist(),
                        'value': power_plant.power_coefficient_curve.value.tolist()
                    }
                
                data_for_serialization['turbine_info'] = turbine_info

            # Use the serializer
            serializer = WindPowerResultSerializer(data=data_for_serialization)
            serializer.is_valid(raise_exception=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)