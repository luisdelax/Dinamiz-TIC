from django.contrib.auth.models import AbstractUser
from django.db import models
from organization.models import Site # Import Site model

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Administrador'),
        ('technician', 'Técnico'), # Add technician role
        ('user', 'Usuario'),
    )

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='user'
    )
    site = models.ForeignKey(
        Site,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users'
    )

