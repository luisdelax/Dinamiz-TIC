from rest_framework import viewsets, status
from rest_framework.decorators import action, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import Ticket, TicketEvidence
from .serializers import TicketSerializer, TicketEvidenceSerializer
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAdminOrTechnician, IsOwnerOrAdminOrTechnician
from users.models import User
from django.utils import timezone
from rest_framework import filters # Import filters
from django_filters.rest_framework import DjangoFilterBackend # Import DjangoFilterBackend

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter] # Add filter backends
    filterset_fields = ['status', 'priority', 'assigned_to', 'created_by'] # Define fields for filtering
    search_fields = ['title', 'description', 'created_by__username', 'assigned_to__username', 'id'] # Define fields for searching

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['update', 'partial_update', 'destroy']:
            self.permission_classes = [IsOwnerOrAdminOrTechnician]
        elif self.action in ['assign', 'close']:
            self.permission_classes = [IsAdminOrTechnician]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        ticket = self.get_object()
        user_id = request.data.get('user_id')

        if not user_id:
            return Response({'error': 'User ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
            if user.role not in ['admin', 'technician']:
                return Response({'error': 'Can only assign tickets to Admins or Technicians.'}, status=status.HTTP_400_BAD_REQUEST)
            
            ticket.assigned_to = user
            ticket.status = 'in_progress'
            ticket.save()
            serializer = self.get_serializer(ticket)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    @parser_classes([MultiPartParser, FormParser])
    def close(self, request, pk=None):
        ticket = self.get_object()
        ticket.status = 'closed'
        ticket.closed_at = timezone.now()
        ticket.save()

        files = request.FILES.getlist('evidences')
        if files:
            for f in files:
                TicketEvidence.objects.create(ticket=ticket, file=f)

        serializer = self.get_serializer(ticket)
        return Response(serializer.data)


class TicketEvidenceViewSet(viewsets.ModelViewSet):
    queryset = TicketEvidence.objects.all()
    serializer_class = TicketEvidenceSerializer
    permission_classes = [IsAdminOrTechnician] # Simplified for now