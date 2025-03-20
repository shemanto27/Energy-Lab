from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .utils.solar_calc import pv_simulation
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
        
        
        result = pv_simulation(
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
        

        return Response({"ac_output": ac_output}, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=400)