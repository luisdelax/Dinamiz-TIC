from rest_framework import serializers
from .models import Ticket, TicketEvidence

class TicketEvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketEvidence
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    evidences = TicketEvidenceSerializer(many=True, read_only=True)
    created_by = serializers.StringRelatedField(read_only=True) # To display username
    assigned_to = serializers.StringRelatedField(read_only=True) # To display username

    class Meta:
        model = Ticket
        fields = '__all__'