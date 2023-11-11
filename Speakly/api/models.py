from django.db import models


# Create your models here.

class Record(models.Model):
    spkr_id = models.CharField(max_length=10, default="SPKR000000")
    name = models.CharField(max_length=50, null=True, blank=True) 
    location = models.CharField(max_length=50, null=True, blank=True)
    gender = models.CharField(max_length=30, default="")
    age = models.PositiveIntegerField(default=0)
    record_number = models.IntegerField(null=False, default=1)
    recorded_setence = models.CharField(max_length=200,null=True, blank=True)
    recorded_file = models.FileField(upload_to='audio_files/', default='default.wav')   # toto pridane
    removable = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:     # toto pridane
        db_table='Record'