from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status  # Add this import

from .utils.solar_calc import *
from .serializers import ACOutputSerializer
# Create your views here.

@api_view(['POST'])
def solar_simulation_api(request):
    try:
        data = request.data
        latitude = data.get("latitude")
        longitude = data.get("longitude")
        altitude = data.get("altitude")
        time_zone = data.get("time_zone")
        module_db = data.get("module_db")
        inverter_db = data.get("inverter_db")
        temp_model = data.get("temp_model")
        temp_type = data.get("temp_type")
        module_dataset = data.get("module_dataset")
        inverter_dataset = data.get("inverter_dataset")
        tilt_angle = data.get("tilt_angle")
        azimuth_angle = data.get("azimuth_angle")
        starting_time = data.get("starting_time")
        ending_time = data.get("ending_time")
        time_frequency = data.get("time_frequency")
        num_of_panel_per_string = data.get("num_of_panel_per_string")
        num_of_string = data.get("num_of_string")
        
        
        result = get_power_output(
            latitude, longitude, altitude, time_zone, module_db, inverter_db,
            temp_model, temp_type, module_dataset, inverter_dataset,
            tilt_angle, azimuth_angle, starting_time, ending_time, time_frequency,
            num_of_panel_per_string, num_of_string
            )
        
        ac_output = result.ac

        # Convert the pandas Series to a list of dictionaries
        ac_output_list = [{"timestamp": k, "value": v} for k, v in ac_output.items()]

        # Serialize the data
        serializer = ACOutputSerializer(ac_output_list, many=True)
        
        return Response({"ac_output": serializer.data}, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(['POST'])
def i_v_curve_sdm_api(request):
    try:
        # Extract and convert data to float to ensure correct types
        data = request.data
        
        # Validate and convert input parameters to float
        params = {
            'effective_irradiance': float(data.get("effective_irradiance")),
            'temp_cell': float(data.get("temp_cell")),
            'alpha_sc': float(data.get("alpha_sc")),
            'a_ref': float(data.get("a_ref")),
            'I_L_ref': float(data.get("I_L_ref")),
            'I_o_ref': float(data.get("I_o_ref")),
            'R_sh_ref': float(data.get("R_sh_ref")),
            'R_s': float(data.get("R_s"))
        }

        # Use the model parameter if provided, otherwise use default
        model = data.get("model", 'lambertw')

        # Calculate I-V curve data
        i_v_curve_data = get_iv_curve_sdm(
            **params,
            method=model
        )

        # Explicitly convert numeric values to float in the response
        response_data = {
            'iv_curve': [
                {'voltage': float(point['voltage']), 'current': float(point['current'])} 
                for point in i_v_curve_data['iv_curve']
            ],
            'keypoints': {
                key: float(value) for key, value in i_v_curve_data['keypoints'].items()
            }
        }

        return Response({"i_v_curve_data": response_data}, status=status.HTTP_200_OK)

    except ValueError as ve:
        # Handle type conversion errors
        return Response({
            "error": f"Invalid input type: {str(ve)}",
            "details": "Ensure all input parameters are valid numeric values"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        # Catch any other unexpected errors
        return Response({
            "error": str(e),
            "details": "An unexpected error occurred during I-V curve calculation"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
