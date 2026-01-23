from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from assets.models import Computer, NetworkDevice
from support.models import Ticket
from django.contrib.auth import get_user_model
from organization.models import Site

User = get_user_model()


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = self.request.user

        # Filter base querysets based on user role and site
        computers_queryset = Computer.objects.all()
        network_devices_queryset = NetworkDevice.objects.all()
        tickets_queryset = Ticket.objects.all()

        if user.role != 'admin' and user.site:
            computers_queryset = computers_queryset.filter(site=user.site)
            network_devices_queryset = network_devices_queryset.filter(site=user.site)
            tickets_queryset = tickets_queryset.filter(site=user.site)
        elif user.role != 'admin' and not user.site:
            # If a regular user has no site, they should see no data
            computers_queryset = Computer.objects.none()
            network_devices_queryset = NetworkDevice.objects.none()
            tickets_queryset = Ticket.objects.none()


        # COMPUTERS
        computers_total = computers_queryset.count()
        computers_by_status = (
            computers_queryset
            .values("status")
            .annotate(count=Count("id"))
        )

        # NETWORK DEVICES
        network_devices_total = network_devices_queryset.count()
        network_devices_by_type = (
            network_devices_queryset
            .values("device_type")
            .annotate(count=Count("id"))
        )

        # TICKETS
        tickets_total = tickets_queryset.count()
        tickets_by_status = (
            tickets_queryset
            .values("status")
            .annotate(count=Count("id"))
        )

        # USERS & SITES (only show for admin)
        users_total = User.objects.count() if user.role == 'admin' else 0
        sites_total = Site.objects.count() if user.role == 'admin' else 0


        data = {
            "computers": {
                "total": computers_total,
                "by_status": list(computers_by_status),
            },
            "network_devices": {
                "total": network_devices_total,
                "by_type": list(network_devices_by_type),
            },
            "tickets": {
                "total": tickets_total,
                "by_status": list(tickets_by_status),
            },
            "users": users_total,
            "sites": sites_total,
        }

        return Response(data)
