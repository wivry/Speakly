from django.db import models
import os

def get_upload_path_analyze(instance, filename):
    return os.path.join('audio_files/test/', instance.analyzing_spkr_id, filename)

class Analysis(models.Model):
    spkr_id = models.CharField(max_length=10, default="0")
    analyzing_spkr_id = models.CharField(max_length=10, default="0")
    record_number = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    method = models.CharField(max_length=20,null=True, blank=True)
    file_to_analyze_0 = models.FileField(upload_to=get_upload_path_analyze,  null=True, blank=True )
    file_to_analyze_1 = models.FileField(upload_to=get_upload_path_analyze,  null=True, blank=True )
    file_to_analyze_2 = models.FileField(upload_to=get_upload_path_analyze,  null=True, blank=True )
    file_to_analyze_3 = models.FileField(upload_to=get_upload_path_analyze,  null=True, blank=True )
    file_to_analyze_4 = models.FileField(upload_to=get_upload_path_analyze,  null=True, blank=True )
    file_to_analyze_5 = models.FileField(upload_to=get_upload_path_analyze,  null=True, blank=True )
    file_to_analyze_6 = models.FileField(upload_to=get_upload_path_analyze,  null=True, blank=True )
    file_to_analyze_7 = models.FileField(upload_to=get_upload_path_analyze,  null=True, blank=True )
    file_to_analyze_8 = models.FileField(upload_to=get_upload_path_analyze,  null=True, blank=True )
    file_to_analyze_9 = models.FileField(upload_to=get_upload_path_analyze,  null=True, blank=True )

    recorded_sentence_0 = models.CharField(max_length=200,null=True, blank=True)
    recorded_sentence_1 = models.CharField(max_length=200,null=True, blank=True)
    recorded_sentence_2 = models.CharField(max_length=200,null=True, blank=True)
    recorded_sentence_3 = models.CharField(max_length=200,null=True, blank=True)
    recorded_sentence_4 = models.CharField(max_length=200,null=True, blank=True)
    recorded_sentence_5 = models.CharField(max_length=200,null=True, blank=True)
    recorded_sentence_6 = models.CharField(max_length=200,null=True, blank=True)
    recorded_sentence_7 = models.CharField(max_length=200,null=True, blank=True)
    recorded_sentence_8 = models.CharField(max_length=200,null=True, blank=True)
    recorded_sentence_9 = models.CharField(max_length=200,null=True, blank=True)
    class Meta:     # toto pridane
        db_table='Analysis'


def get_upload_path(instance, filename):
    return os.path.join('audio_files/enroll/', instance.spkr_id, filename)

class Record(models.Model):
    spkr_id = models.CharField(max_length=10, default="SPKR000000")
    name = models.CharField(max_length=50, null=True, blank=True) 
    location = models.CharField(max_length=50, null=True, blank=True)
    gender = models.CharField(max_length=30, default="")
    age = models.PositiveIntegerField(default=0)
    record_number = models.IntegerField(null=False, default=1)
    recorded_sentence_0 = models.CharField(max_length=200,null=True, blank=True)
    recorded_sentence_1 = models.CharField(max_length=200,null=True, blank=True)
    recorded_sentence_2 = models.CharField(max_length=200,null=True, blank=True)
    recorded_sentence_3 = models.CharField(max_length=200,null=True, blank=True)
    recorded_sentence_4 = models.CharField(max_length=200,null=True, blank=True)
    recorded_sentence_5 = models.CharField(max_length=200,null=True, blank=True)
    recorded_sentence_6 = models.CharField(max_length=200,null=True, blank=True)
    recorded_sentence_7 = models.CharField(max_length=200,null=True, blank=True)
    recorded_sentence_8 = models.CharField(max_length=200,null=True, blank=True)
    recorded_sentence_9 = models.CharField(max_length=200,null=True, blank=True)
    
    recorded_file_0 = models.FileField(upload_to=get_upload_path,  null=True, blank=True )
    recorded_file_1 = models.FileField(upload_to=get_upload_path,  null=True, blank=True )
    recorded_file_2 = models.FileField(upload_to=get_upload_path,  null=True, blank=True )
    recorded_file_3 = models.FileField(upload_to=get_upload_path,  null=True, blank=True )
    recorded_file_4 = models.FileField(upload_to=get_upload_path,  null=True, blank=True )
    recorded_file_5 = models.FileField(upload_to=get_upload_path,  null=True, blank=True )
    recorded_file_6 = models.FileField(upload_to=get_upload_path,  null=True, blank=True )
    recorded_file_7 = models.FileField(upload_to=get_upload_path,  null=True, blank=True )
    recorded_file_8 = models.FileField(upload_to=get_upload_path,  null=True, blank=True)
    recorded_file_9 = models.FileField(upload_to=get_upload_path,  null=True, blank=True)
    removable = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:     # toto pridane
        db_table='Record'