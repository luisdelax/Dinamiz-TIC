from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from organization.models import Site # Import Site model

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['role'] = user.role 
        token['username'] = user.username # Add username to token claims
        token['site_id'] = user.site_id
        if user.site:
            token['site_name'] = user.site.name
        # You can add other user fields here, e.g., token['username'] = user.username

        return token

class UserSerializer(serializers.ModelSerializer):
    site_name = serializers.CharField(source='site.name', read_only=True)
    password = serializers.CharField(write_only=True, required=False) # Make password optional for updates

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'site', 'site_name', 'is_active', 'is_staff', 'is_superuser',
            'password',
        )
        read_only_fields = ('id',)

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        instance.save()
        return instance

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)