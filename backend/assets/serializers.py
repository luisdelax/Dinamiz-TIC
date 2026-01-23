from rest_framework import serializers
from .models import Computer, NetworkDevice, Peripheral # Import Peripheral

class ComputerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Computer
        fields = '__all__'

class NetworkDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NetworkDevice
        fields = '__all__'

class PeripheralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Peripheral
        fields = '__all__'