from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Computer, NetworkDevice, Peripheral
from .serializers import ComputerSerializer, NetworkDeviceSerializer, PeripheralSerializer
from users.permissions import IsAdminOrTechnician
from organization.models import Person, Classroom
from rest_framework import filters # Import filters
from django_filters.rest_framework import DjangoFilterBackend # Import DjangoFilterBackend

class ComputerViewSet(viewsets.ModelViewSet):
    queryset = Computer.objects.all()
    serializer_class = ComputerSerializer
    permission_classes = [IsAdminOrTechnician]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter] # Add filter backends
    filterset_fields = ['status', 'equipment_type', 'brand', 'site', 'assigned_to_person', 'assigned_to_classroom'] # Define fields for filtering
    search_fields = ['asset_tag', 'brand', 'model', 'serial_number', 'processor', 'operating_system'] # Define fields for searching

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        computer = self.get_object()
        person_id = request.data.get('person_id')
        classroom_id = request.data.get('classroom_id')

        if person_id and classroom_id:
            return Response({'error': 'Cannot assign to both a person and a classroom.'}, status=status.HTTP_400_BAD_REQUEST)

        computer.assigned_to_person = None
        computer.assigned_to_classroom = None

        if person_id:
            try:
                person = Person.objects.get(id=person_id)
                computer.assigned_to_person = person
            except Person.DoesNotExist:
                return Response({'error': 'Person not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        if classroom_id:
            try:
                classroom = Classroom.objects.get(id=classroom_id)
                computer.assigned_to_classroom = classroom
            except Classroom.DoesNotExist:
                return Response({'error': 'Classroom not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        computer.save()
        serializer = self.get_serializer(computer)
        return Response(serializer.data)


class NetworkDeviceViewSet(viewsets.ModelViewSet):
    queryset = NetworkDevice.objects.all()
    serializer_class = NetworkDeviceSerializer
    permission_classes = [IsAdminOrTechnician]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter] # Add filter backends
    filterset_fields = ['status', 'device_type', 'brand', 'site', 'assigned_to_person', 'assigned_to_classroom'] # Define fields for filtering
    search_fields = ['asset_tag', 'brand', 'model', 'serial_number', 'ip_address', 'mac_address', 'location'] # Define fields for searching

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        network_device = self.get_object()
        person_id = request.data.get('person_id')
        classroom_id = request.data.get('classroom_id')

        if person_id and classroom_id:
            return Response({'error': 'Cannot assign to both a person and a classroom.'}, status=status.HTTP_400_BAD_REQUEST)

        network_device.assigned_to_person = None
        network_device.assigned_to_classroom = None

        if person_id:
            try:
                person = Person.objects.get(id=person_id)
                network_device.assigned_to_person = person
            except Person.DoesNotExist:
                return Response({'error': 'Person not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        if classroom_id:
            try:
                classroom = Classroom.objects.get(id=classroom_id)
                network_device.assigned_to_classroom = classroom
            except Classroom.DoesNotExist:
                return Response({'error': 'Classroom not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        network_device.save()
        serializer = self.get_serializer(network_device)
        return Response(serializer.data)


class PeripheralViewSet(viewsets.ModelViewSet):
    queryset = Peripheral.objects.all()
    serializer_class = PeripheralSerializer
    permission_classes = [IsAdminOrTechnician]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter] # Add filter backends
    filterset_fields = ['status', 'peripheral_type', 'brand', 'site', 'assigned_to_person', 'assigned_to_classroom'] # Define fields for filtering
    search_fields = ['asset_tag', 'brand', 'model', 'serial_number', 'description'] # Define fields for searching