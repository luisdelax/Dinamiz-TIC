from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAdminUser # Use IsAdminUser permission
from .serializers import UserSerializer, PasswordChangeSerializer # Import PasswordChangeSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser] # Only admins can manage users

    # Allow a user to update their own profile without being admin
    def get_permissions(self):
        if self.action == 'set_password': # Custom action for password change
            return [IsAuthenticated()] # Any authenticated user can change their own password
        elif self.action == 'retrieve' and self.request.user.id == int(self.kwargs['pk']):
            return [IsAuthenticated()] # User can view their own profile
        elif self.action in ['update', 'partial_update'] and self.request.user.id == int(self.kwargs['pk']):
            return [IsAuthenticated()] # User can update their own profile
        return super().get_permissions()

    @action(detail=True, methods=['post'], url_path='set_password')
    def set_password(self, request, pk=None):
        user = self.get_object()
        # Ensure the user is trying to change their own password unless they are admin
        if not request.user.is_admin and request.user.id != user.id:
            return Response({'detail': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({'old_password': ['Wrong password.']}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'status': 'password set'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
