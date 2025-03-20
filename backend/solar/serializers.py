from rest_framework import serializers

class ACOutputSerializer(serializers.Serializer):
    timestamp = serializers.DateTimeField()
    value = serializers.FloatField()