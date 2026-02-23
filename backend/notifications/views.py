from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(generics.ListAPIView):
    """
    List all notifications for the current user.
    Provides filtering for unread notifications.
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Notification.objects.filter(user=user)
        
        # Filter by is_read status if query param is present
        unread = self.request.query_params.get('unread')
        if unread and unread.lower() == 'true':
            queryset = queryset.filter(is_read=False)
            
        return queryset

class NotificationMarkAsReadView(generics.UpdateAPIView):
    """
    Mark a specific notification as read.
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    queryset = Notification.objects.all()

    def get_queryset(self):
        # Users can only update their own notifications
        return self.queryset.filter(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(is_read=True)

class NotificationMarkAllAsReadView(generics.GenericAPIView):
    """
    Mark all unread notifications for the current user as read.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response(
            {"detail": "All unread notifications have been marked as read."},
            status=status.HTTP_200_OK
        )