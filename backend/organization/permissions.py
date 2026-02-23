from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to edit objects,
    but allows authenticated users to read.
    """

    def has_permission(self, request, view):
        # Allow read permissions for any authenticated request
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        # Write permissions are only allowed to admin users
        return request.user and request.user.role == 'admin'
