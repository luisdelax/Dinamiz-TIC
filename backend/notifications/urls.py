from django.urls import path
from .views import (
    NotificationListView,
    NotificationMarkAsReadView,
    NotificationMarkAllAsReadView,
)

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('mark-all-as-read/', NotificationMarkAllAsReadView.as_view(), name='notification-mark-all-as-read'),
    path('<int:pk>/mark-as-read/', NotificationMarkAsReadView.as_view(), name='notification-mark-as-read'),
]
