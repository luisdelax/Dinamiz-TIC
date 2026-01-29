import logging
from rest_framework import viewsets
from .models import Site, Classroom, Person
from .serializers import SiteSerializer, ClassroomSerializer, PersonSerializer
from .permissions import IsAdminOrReadOnly # Import the new permission
from rest_framework import filters # Import filters
from django_filters.rest_framework import DjangoFilterBackend # Import DjangoFilterBackend

logger = logging.getLogger(__name__)

class SiteViewSet(viewsets.ModelViewSet):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer
    permission_classes = [IsAdminOrReadOnly]

class ClassroomViewSet(viewsets.ModelViewSet):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter] # Add filter backends
    filterset_fields = ['site'] # Define fields for filtering
    search_fields = ['name', 'description'] # Define fields for searching

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter] # Add filter backends
    filterset_fields = ['person_type', 'site'] # Define fields for filtering
    search_fields = ['first_name', 'last_name', 'email'] # Define fields for searching

    def list(self, request, *args, **kwargs):
        logger.error("Listing persons")
        try:
            response = super().list(request, *args, **kwargs)
            logger.error(f"Response data: {response.data}")
            return response
        except Exception as e:
            logger.error(f"Error listing persons: {e}", exc_info=True)
            raise