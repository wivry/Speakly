from rest_framework import serializers
from .models import Record

class RecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = ('id', 'spkr_id', 'name', 'location','gender', 'age', 'record_number','recorded_file','removable','created_at')

class CreateRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = ('id', 'spkr_id', 'name', 'location','gender', 'age', 'record_number','recorded_file', 'removable')