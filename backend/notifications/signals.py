from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import Q
from support.models import Ticket
from users.models import User
from .models import Notification

@receiver(post_save, sender=Ticket)
def create_ticket_notification(sender, instance, created, **kwargs):
    """
    Signal handler to create notifications when a new ticket is created.
    
    A notification is sent to all 'admin' and 'technician' users.
    """
    if created:
        # Find all admin and technician users
        eligible_users = User.objects.filter(
            Q(role='admin') | Q(role='technician')
        )
        
        # Prepare notifications for bulk creation
        notifications_to_create = []
        title = f"Nuevo Ticket Creado: #{instance.id}"
        message = (
            f"Se ha creado un nuevo ticket '{instance.title}' por "
            f"{instance.created_by.get_full_name() or instance.created_by.username}."
        )

        for user in eligible_users:
            # Avoid notifying the user who created the ticket if they are admin/tech
            if user != instance.created_by:
                notifications_to_create.append(
                    Notification(
                        user=user,
                        title=title,
                        message=message
                    )
                )

        if notifications_to_create:
            Notification.objects.bulk_create(notifications_to_create)

