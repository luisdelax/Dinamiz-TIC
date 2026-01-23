from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ComputerViewSet, NetworkDeviceViewSet, PeripheralViewSet

router = DefaultRouter()
router.register(r'computers', ComputerViewSet)
router.register(r'network-devices', NetworkDeviceViewSet)
router.register(r'peripherals', PeripheralViewSet)

urlpatterns = [
    path('', include(router.urls)),
]