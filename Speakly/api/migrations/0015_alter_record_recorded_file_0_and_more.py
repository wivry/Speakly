# Generated by Django 4.2.6 on 2023-12-01 19:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_alter_record_recorded_file_0_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='record',
            name='recorded_file_0',
            field=models.FileField(default='none', upload_to='audio_files/'),
        ),
        migrations.AlterField(
            model_name='record',
            name='recorded_file_1',
            field=models.FileField(default='none', upload_to='audio_files/'),
        ),
        migrations.AlterField(
            model_name='record',
            name='recorded_file_2',
            field=models.FileField(default='none', upload_to='audio_files/'),
        ),
        migrations.AlterField(
            model_name='record',
            name='recorded_file_3',
            field=models.FileField(default='none', upload_to='audio_files/'),
        ),
        migrations.AlterField(
            model_name='record',
            name='recorded_file_4',
            field=models.FileField(default='none', upload_to='audio_files/'),
        ),
        migrations.AlterField(
            model_name='record',
            name='recorded_file_5',
            field=models.FileField(default='none', upload_to='audio_files/'),
        ),
        migrations.AlterField(
            model_name='record',
            name='recorded_file_6',
            field=models.FileField(default='none', upload_to='audio_files/'),
        ),
        migrations.AlterField(
            model_name='record',
            name='recorded_file_7',
            field=models.FileField(default='none', upload_to='audio_files/'),
        ),
        migrations.AlterField(
            model_name='record',
            name='recorded_file_8',
            field=models.FileField(default='none', upload_to='audio_files/'),
        ),
        migrations.AlterField(
            model_name='record',
            name='recorded_file_9',
            field=models.FileField(default='none', upload_to='audio_files/'),
        ),
    ]