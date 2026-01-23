from django.contrib import admin

# Register your models here.
from .models import Ticket, TicketEvidence

class TicketEvidenceInline(admin.TabularInline):
    model = TicketEvidence
    extra = 1


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title',
        'ticket_type',
        'status',
        'site',
        'created_by',
        'assigned_to',
        'created_at'
    )
    list_filter = ('status', 'ticket_type', 'site')
    search_fields = ('title', 'description')
    inlines = [TicketEvidenceInline]
