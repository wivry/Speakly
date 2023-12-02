from rest_framework import serializers
from .models import Record, Analysis

class AnalyzeRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analysis
        #fields = ('file_to_analyze')
        fields = '__all__'

class RecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = ('id', 'spkr_id', 'name', 'location','gender', 'age', 'record_number', 'recorded_sentence_0',
                  'recorded_sentence_1', 'recorded_sentence_2', 'recorded_sentence_3', 'recorded_sentence_4',
                   'recorded_sentence_5', 'recorded_sentence_6', 'recorded_sentence_7', 'recorded_sentence_8',
                   'recorded_sentence_9',
                  'recorded_file_0', 'recorded_file_1', 'recorded_file_2', 'recorded_file_3', 'recorded_file_4',
                  'recorded_file_5', 'recorded_file_6', 'recorded_file_7', 'recorded_file_8', 'recorded_file_9',
                  'removable','created_at')

class CreateRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = ('id', 'spkr_id', 'name', 'location','gender', 'age', 'record_number', 'recorded_sentence_0',
                  'recorded_sentence_1', 'recorded_sentence_2', 'recorded_sentence_3', 'recorded_sentence_4',
                   'recorded_sentence_5', 'recorded_sentence_6', 'recorded_sentence_7', 'recorded_sentence_8',
                   'recorded_sentence_9',
                  'recorded_file_0', 'recorded_file_1', 'recorded_file_2', 'recorded_file_3', 'recorded_file_4',
                  'recorded_file_5', 'recorded_file_6', 'recorded_file_7', 'recorded_file_8', 'recorded_file_9',
                  'removable')