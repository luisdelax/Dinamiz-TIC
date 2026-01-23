from rest_framework import serializers

class ComputerStatusSerializer(serializers.Serializer):
    status = serializers.CharField()
    count = serializers.IntegerField()

class NetworkDeviceTypeSerializer(serializers.Serializer):
    device_type = serializers.CharField()
    count = serializers.IntegerField()

class TicketStatusSerializer(serializers.Serializer):
    status = serializers.CharField()
    count = serializers.IntegerField()
