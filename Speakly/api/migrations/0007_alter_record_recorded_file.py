# Generated by Django 4.2.6 on 2023-10-17 09:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_record_recorded_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='record',
            name='recorded_file',
            field=models.FileField(default='default.mp3', upload_to='audio_files/'),
        ),
    ]
