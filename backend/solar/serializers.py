from rest_framework import serializers

class ACOutputSerializer(serializers.Serializer):
    timestamp = serializers.DateTimeField()
    value = serializers.FloatField()

class KeyPointsSerializer(serializers.Serializer):
    i_sc = serializers.FloatField()
    v_oc = serializers.FloatField()
    i_mp = serializers.FloatField()
    v_mp = serializers.FloatField()
    p_mp = serializers.FloatField()

class IVCurvePointSerializer(serializers.Serializer):
    voltage = serializers.FloatField()
    current = serializers.FloatField()

class PVIVCurveSerializer(serializers.Serializer):
    iv_curve = IVCurvePointSerializer(many=True)
    keypoints = KeyPointsSerializer()

    def to_representation(self, instance):
        """
        Ensure all numerical values are converted to float
        """
        # Convert iv_curve points to float
        iv_curve = [
            {
                'voltage': float(point['voltage']),
                'current': float(point['current'])
            } for point in instance['iv_curve']
        ]

        # Convert keypoints to float
        keypoints = {
            key: float(value) for key, value in instance['keypoints'].items()
        }

        return {
            'iv_curve': iv_curve,
            'keypoints': keypoints
        }