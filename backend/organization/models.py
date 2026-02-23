from django.db import models

# Create your models here.

class Site(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Classroom(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    site = models.ForeignKey(Site, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} - {self.site.name}"

class Person(models.Model):

    PERSON_TYPE_CHOICES = (
        ('student', 'Estudiante'),
        ('employee', 'Funcionario'),
    )

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    person_type = models.CharField(max_length=10, choices=PERSON_TYPE_CHOICES)
    site = models.ForeignKey(Site, on_delete=models.SET_NULL, null=True, blank=True)
    dependencia = models.CharField(max_length=255, blank=True, null=True) # New field

    def __str__(self):
        return f"{self.last_name}, {self.first_name}"
