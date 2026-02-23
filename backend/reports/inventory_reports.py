import pandas as pd
from django.http import HttpResponse
from assets.models import Computer, NetworkDevice
from support.models import Ticket
import io

def tickets_excel_report(request, queryset):
    # Create an in-memory output file for the new workbook.
    output = io.BytesIO()

    # Create a Pandas Excel writer using XlsxWriter as the engine.
    writer = pd.ExcelWriter(output, engine='openpyxl')

    # Get data for tickets
    ticket_data = {
        "ID": [t.id for t in queryset],
        "Title": [t.title for t in queryset],
        "Type": [t.get_ticket_type_display() for t in queryset],
        "Status": [t.get_status_display() for t in queryset],
        "Priority": [t.get_priority_display() for t in queryset],
        "Created By": [t.created_by.get_full_name() for t in queryset],
        "Assigned To": [t.assigned_to.get_full_name() if t.assigned_to else "" for t in queryset],
        "Site": [t.site.name for t in queryset],
        "Created At": [t.created_at.strftime('%Y-%m-%d %H:%M') for t in queryset],
        "Closed At": [t.closed_at.strftime('%Y-%m-%d %H:%M') if t.closed_at else "" for t in queryset],
        "Evidencias": [", ".join([request.build_absolute_uri(e.file.url) for e in t.evidences.all()]) for t in queryset],
    }
    df_tickets = pd.DataFrame(ticket_data)
    df_tickets.to_excel(writer, sheet_name='Tickets', index=False)

    # Close the Pandas Excel writer and output the Excel file.
    writer.close()
    output.seek(0)

    # Set up the Http response.
    filename = 'tickets_report.xlsx'
    response = HttpResponse(
        output,
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = 'attachment; filename=%s' % filename

    return response

def inventory_excel_report(request):
    # Create an in-memory output file for the new workbook.
    output = io.BytesIO()

    # Create a Pandas Excel writer using XlsxWriter as the engine.
    writer = pd.ExcelWriter(output, engine='openpyxl')

    # Get data for computers
    computers = Computer.objects.all()
    computer_data = {
        "Asset Tag": [c.asset_tag for c in computers],
        "Type": [c.get_equipment_type_display() for c in computers],
        "Brand": [c.brand for c in computers],
        "Model": [c.model for c in computers],
        "Serial Number": [c.serial_number for c in computers],
        "Processor": [c.processor for c in computers],
        "RAM": [c.ram for c in computers],
        "Storage": [c.storage for c in computers],
        "OS": [c.operating_system for c in computers],
        "Status": [c.get_status_display() for c in computers],
        "Assigned To": [f"{c.assigned_to_person.first_name} {c.assigned_to_person.last_name}" if c.assigned_to_person else "" for c in computers],
        "Classroom": [c.assigned_to_classroom.name if c.assigned_to_classroom else "" for c in computers],
        "Site": [c.site.name for c in computers],
        "Purchase Date": [c.purchase_date.strftime('%Y-%m-%d') if c.purchase_date else "" for c in computers],
    }
    df_computers = pd.DataFrame(computer_data)
    df_computers.to_excel(writer, sheet_name='Computers', index=False)

    # Get data for network devices
    network_devices = NetworkDevice.objects.all()
    network_device_data = {
        "Asset Tag": [d.asset_tag for d in network_devices],
        "Type": [d.get_device_type_display() for d in network_devices],
        "Brand": [d.brand for d in network_devices],
        "Model": [d.model for d in network_devices],
        "Serial Number": [d.serial_number for d in network_devices],
        "IP Address": [d.ip_address for d in network_devices],
        "MAC Address": [d.mac_address for d in network_devices],
        "Location": [d.location for d in network_devices],
        "Status": [d.get_status_display() for d in network_devices],
        "Site": [d.site.name for d in network_devices],
    }
    df_network_devices = pd.DataFrame(network_device_data)
    df_network_devices.to_excel(writer, sheet_name='Network Devices', index=False)

    # Close the Pandas Excel writer and output the Excel file.
    writer.close()
    output.seek(0)

    # Set up the Http response.
    filename = 'inventory_report.xlsx'
    response = HttpResponse(
        output,
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = 'attachment; filename=%s' % filename

    return response