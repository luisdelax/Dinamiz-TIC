from django.db import models
from organization.models import Site, Classroom, Person
import uuid

class Computer(models.Model):

    STATUS_CHOICES = (
        ('active', 'Activo'),
        ('maintenance', 'En mantenimiento'),
        ('retired', 'Retirado'),
    )

    EQUIPMENT_TYPE = (
        ('desktop', 'PC Escritorio'),
        ('laptop', 'Laptop'),
    )

    asset_tag = models.CharField(
        max_length=50,
        unique=True,
        blank=True,
        verbose_name='Código de activo'
    )

    equipment_type = models.CharField(
        max_length=10,
        choices=EQUIPMENT_TYPE
    )

    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    serial_number = models.CharField(max_length=100, unique=True)

    processor = models.CharField(max_length=100)
    ram = models.CharField(max_length=50)
    storage = models.CharField(max_length=50)
    operating_system = models.CharField(max_length=100)

    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default='active'
    )

    assigned_to_person = models.ForeignKey(
        Person,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='computers'
    )

    assigned_to_classroom = models.ForeignKey(
        Classroom,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='computers'
    )

    site = models.ForeignKey(
        Site,
        on_delete=models.CASCADE
    )

    purchase_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.asset_tag:
            self.asset_tag = f"COMP-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.asset_tag} - {self.brand} {self.model}"

class NetworkDevice(models.Model):

    DEVICE_TYPE = (
        ('router', 'Router'),
        ('switch', 'Switch'),
        ('ap', 'Access Point'),
        ('patchpanel', 'Patch Panel'),
        ('firewall', 'Firewall'),
    )

    STATUS_CHOICES = (
        ('active', 'Activo'),
        ('maintenance', 'En mantenimiento'),
        ('down', 'Fuera de servicio'),
    )

    asset_tag = models.CharField(max_length=50, unique=True, blank=True)
    device_type = models.CharField(max_length=20, choices=DEVICE_TYPE)

    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    serial_number = models.CharField(max_length=100, unique=True)

    ip_address = models.GenericIPAddressField(null=True, blank=True)
    mac_address = models.CharField(max_length=50, blank=True)

    location = models.CharField(
        max_length=255,
        help_text="Rack, piso, sala, etc."
    )

    assigned_to_person = models.ForeignKey(
        Person,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='network_devices'
    )

    assigned_to_classroom = models.ForeignKey(
        Classroom,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='network_devices'
    )

    site = models.ForeignKey(
        Site,
        on_delete=models.CASCADE
    )

    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default='active'
    )

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.asset_tag:
            self.asset_tag = f"NET-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.device_type} - {self.asset_tag}"

class Peripheral(models.Model):
    PERIPHERAL_TYPE = (
        ('keyboard', 'Teclado'),
        ('mouse', 'Ratón'),
        ('monitor', 'Monitor'),
        ('printer', 'Impresora'),
        ('scanner', 'Escáner'),
        ('webcam', 'Webcam'),
        ('headset', 'Auriculares'),
        ('ups', 'UPS'),
        ('other', 'Otro'),
    )

    STATUS_CHOICES = (
        ('active', 'Activo'),
        ('maintenance', 'En mantenimiento'),
        ('retired', 'Retirado'),
    )

    asset_tag = models.CharField(max_length=50, unique=True, blank=True)
    peripheral_type = models.CharField(max_length=20, choices=PERIPHERAL_TYPE)

    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    serial_number = models.CharField(max_length=100, unique=True)

    assigned_to_person = models.ForeignKey(
        Person,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='peripherals'
    )

    assigned_to_classroom = models.ForeignKey(
        Classroom,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='peripherals'
    )

    site = models.ForeignKey(
        Site,
        on_delete=models.CASCADE
    )

    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default='active'
    )

    purchase_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.asset_tag:
            self.asset_tag = f"PERI-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.peripheral_type} - {self.asset_tag}"