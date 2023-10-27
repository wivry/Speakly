from django.db import models


# Create your models here.

class Record(models.Model):
    first_name = models.CharField(max_length=50, default="") 
    last_name = models.CharField(max_length=50, default="")
    gender = models.CharField(max_length=30, null=True, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    record_number = models.IntegerField(null=False, default=1)
    recorded_file = models.FileField(upload_to='audio_files/', default='default.wav')   # toto pridane
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:     # toto pridane
        db_table='Record'