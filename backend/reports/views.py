from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .inventory_reports import inventory_excel_report, tickets_excel_report
from support.models import Ticket
from assets.models import Computer, NetworkDevice
from .pdf_reports import tickets_pdf_report, computer_inventory_pdf_report
from users.permissions import IsAdminUser


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_inventory_excel(request):
    if request.user.role != 'admin':
        return Response({"detail": "No autorizado"}, status=403)
    return inventory_excel_report(request)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_tickets_excel(request):

    queryset = Ticket.objects.all()

    # Filtros
    site = request.GET.get('site')
    status = request.GET.get('status')
    start = request.GET.get('start_date')
    end = request.GET.get('end_date')

    if site:
        queryset = queryset.filter(site_id=site)
    if status:
        queryset = queryset.filter(status=status)
    if start and end:
        queryset = queryset.filter(created_at__date__range=[start, end])

    return tickets_excel_report(request, queryset)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tickets_pdf(request):

    queryset = Ticket.objects.all()

    # Filtros
    site = request.GET.get('site')
    status = request.GET.get('status')
    start = request.GET.get('start_date')
    end = request.GET.get('end_date')

    if site:
        queryset = queryset.filter(site_id=site)
    if status:
        queryset = queryset.filter(status=status)
    if start and end:
        queryset = queryset.filter(created_at__date__range=[start, end])

    return tickets_pdf_report(request, queryset)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def computer_inventory_pdf(request):
    if request.user.role != 'admin':
        return Response({"detail": "No autorizado"}, status=403)

    queryset = Computer.objects.all()

    # Filtros
    site = request.GET.get('site')
    status = request.GET.get('status')
    equipment_type = request.GET.get('equipment_type')
    assigned_to = request.GET.get('assigned_to')

    if site:
        queryset = queryset.filter(site_id=site)
    if status:
        queryset = queryset.filter(status=status)
    if equipment_type:
        queryset = queryset.filter(equipment_type=equipment_type)
    if assigned_to:
        queryset = queryset.filter(assigned_to_person_id=assigned_to)

    return computer_inventory_pdf_report(queryset)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def power_bi_inventory(request):
    computers = Computer.objects.all().values(
        'asset_tag', 'equipment_type', 'brand', 'model', 'serial_number',
        'processor', 'ram', 'storage', 'operating_system', 'status',
        'assigned_to_person__first_name', 'assigned_to_person__last_name',
        'assigned_to_classroom__name', 'site__name', 'purchase_date'
    )
    
    network_devices = NetworkDevice.objects.all().values(
        'asset_tag', 'device_type', 'brand', 'model', 'serial_number',
        'ip_address', 'mac_address', 'location', 'status', 'site__name'
    )

    data = {
        'computers': list(computers),
        'network_devices': list(network_devices)
    }
    
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def power_bi_tickets(request):
    tickets = Ticket.objects.all().values(
        'id', 'title', 'ticket_type', 'status', 'priority',
        'created_by__first_name', 'created_by__last_name',
        'assigned_to__first_name', 'assigned_to__last_name',
        'site__name', 'created_at', 'closed_at'
    )
    return Response(list(tickets))