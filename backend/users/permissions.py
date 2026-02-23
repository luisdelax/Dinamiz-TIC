from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')

class IsTechnicianUser(BasePermission):
    """
    Allows access only to technician users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'technician')

class IsAdminOrTechnician(BasePermission):
    """
    Allows access to admin or technician users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.role == 'admin' or request.user.role == 'technician'))

class IsOwnerOrAdminOrTechnician(BasePermission):
    """
    Object-level permission to only allow owners of an object, admins, or technicians to edit it.
    Assumes the model instance has a `created_by` attribute.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        # Instance must have an attribute named `created_by`.
        return obj.created_by == request.user or request.user.role in ['admin', 'technician']
