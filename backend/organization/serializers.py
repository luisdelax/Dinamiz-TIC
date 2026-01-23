from rest_framework import serializers
from .models import Site, Classroom, Person

class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = '__all__'

class ClassroomSerializer(serializers.ModelSerializer):
    site_name = serializers.CharField(source='site.name', read_only=True)
    class Meta:
        model = Classroom
        fields = '__all__'

class PersonSerializer(serializers.ModelSerializer):
    site_name = serializers.CharField(source='site.name', read_only=True)
    class Meta:
        model = Person
        fields = '__all__'