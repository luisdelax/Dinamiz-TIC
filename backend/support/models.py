from django.db import models

# Create your models here.
from users.models import User
from organization.models import Site
from assets.models import Computer, NetworkDevice


class Ticket(models.Model):

    TICKET_TYPE = (
        ('incident', 'Incidencia'),
        ('request', 'Requerimiento'),
    )

    STATUS_CHOICES = (
        ('open', 'Abierto'),
        ('in_progress', 'En progreso'),
        ('waiting', 'En espera'),
        ('closed', 'Cerrado'),
    )

    PRIORITY_CHOICES = (
        ('low', 'Baja'),
        ('medium', 'Media'),
        ('high', 'Alta'),
    )

    title = models.CharField(max_length=200)
    description = models.TextField()

    ticket_type = models.CharField(
        max_length=20,
        choices=TICKET_TYPE
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='open'
    )

    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default='medium'
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tickets_created'
    )

    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tickets_assigned'
    )

    computer = models.ForeignKey(
        Computer,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    network_device = models.ForeignKey(
        NetworkDevice,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    site = models.ForeignKey(
        Site,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)
    closed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"#{self.id} - {self.title}"

class TicketEvidence(models.Model):
    ticket = models.ForeignKey(
        Ticket,
        on_delete=models.CASCADE,
        related_name='evidences'
    )
    file = models.FileField(upload_to='ticket_evidence/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
