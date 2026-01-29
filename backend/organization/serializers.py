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
    site_name = serializers.SerializerMethodField()
    dependencia = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Person
        fields = ('id', 'first_name', 'last_name', 'email', 'person_type', 'site', 'site_name', 'dependencia')

    def get_site_name(self, obj):
        return obj.site.name if obj.site else None