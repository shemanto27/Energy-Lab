from rest_framework import serializers

class PowerOutputSerializer(serializers.Serializer):
    timestamps = serializers.ListField(child=serializers.CharField())
    values = serializers.ListField(child=serializers.FloatField())

class PowerCurveSerializer(serializers.Serializer):
    wind_speed = serializers.ListField(child=serializers.FloatField())
    value = serializers.ListField(child=serializers.FloatField())

class TurbineInfoSerializer(serializers.Serializer):
    type = serializers.CharField()
    hub_height = serializers.FloatField()
    power_curve = PowerCurveSerializer(required=False)
    power_coefficient_curve = PowerCurveSerializer(required=False)

class WindPowerResultSerializer(serializers.Serializer):
    power_output = PowerOutputSerializer()
    turbine_info = TurbineInfoSerializer()