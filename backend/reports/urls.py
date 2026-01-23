from django.urls import path
from .views import export_inventory_excel, tickets_pdf, computer_inventory_pdf, power_bi_inventory, export_tickets_excel, power_bi_tickets

urlpatterns = [
    path('inventory/excel/', export_inventory_excel),
    path('inventory/pdf/', computer_inventory_pdf),
    path('tickets/pdf/', tickets_pdf),
    path('tickets/excel/', export_tickets_excel),
    path('inventory/powerbi/', power_bi_inventory),
    path('tickets/powerbi/', power_bi_tickets),
]
