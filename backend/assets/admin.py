from django.contrib import admin
from .models import Computer, NetworkDevice

@admin.register(Computer)
class ComputerAdmin(admin.ModelAdmin):
    list_display = (
        'asset_tag',
        'brand',
        'model',
        'equipment_type',
        'status',
        'assigned_to_person',
        'assigned_to_classroom',
        'site'
    )
    search_fields = ('asset_tag', 'serial_number')
    list_filter = ('status', 'equipment_type', 'site')



@admin.register(NetworkDevice)
class NetworkDeviceAdmin(admin.ModelAdmin):
    list_display = (
        'asset_tag',
        'device_type',
        'brand',
        'model',
        'ip_address',
        'assigned_to_person',
        'assigned_to_classroom',
        'site',
        'status'
    )
    search_fields = ('asset_tag', 'serial_number', 'ip_address')
    list_filter = ('device_type', 'status', 'site')
