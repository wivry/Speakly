# Generated by Django 4.2.6 on 2023-10-27 17:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_record_age_record_gender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='record',
            name='gender',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
    ]
