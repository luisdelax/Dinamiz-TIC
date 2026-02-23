from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SiteViewSet, ClassroomViewSet, PersonViewSet

router = DefaultRouter()
router.register(r'sites', SiteViewSet)
router.register(r'classrooms', ClassroomViewSet)
router.register(r'persons', PersonViewSet)

urlpatterns = [
    path('', include(router.urls)),
]