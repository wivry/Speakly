from rest_framework import serializers
from .models import Record

class RecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = ('id', 'first_name', 'last_name', 'record_number','recorded_file','created_at')

class CreateRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = ('id', 'first_name', 'last_name', 'record_number','recorded_file')