# Generated by Django 4.2.6 on 2023-12-12 10:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_analysis'),
    ]

    operations = [
        migrations.AlterField(
            model_name='analysis',
            name='file_to_analyze',
            field=models.FileField(blank=True, null=True, upload_to='audio_files/test'),
        ),
    ]
