# import ################################################################
from rest_framework import generics, status
from .serializers import  RecordSerializer, CreateRecordSerializer, AnalyzeRecordSerializer
from .models import Record, Analysis
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.files import File
from django.core.files.storage import default_storage
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings
import random
from django.http import JsonResponse
from django.contrib.staticfiles import finders

import os, stat
import subprocess

################################################################

# Pohled na obsah databáze
class RecordView(generics.ListAPIView):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer

# funkce, která vrací náhodnou větu do rozhraní na nahrávání do databáze
def RandomSentenceView(request):
    sentences_file_path = finders.find('data/sentences')
    if sentences_file_path:
        with open(sentences_file_path, 'r', encoding='utf-8') as file:
            sentences = file.readlines()
        # Vyberte náhodnou větu
        random_sentence = random.choice(sentences)
        # Odešlete náhodnou větu jako JSON
        return JsonResponse({'sentence': random_sentence.strip()})
    else:
        return JsonResponse({'error': 'Soubor "sentences" nebyl nalezen.'}, status=404)

class AnalyzeRecordView(APIView):
    serializer_class = AnalyzeRecordSerializer
    def post(self, request, format=None):
        # Získání nahrávky z požadavku
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():         # nutno zkontrolovat vždy, zda jsou data validni
            # vytvoření nového záznamu
            analysis = Analysis()
            # Získání ID posledního vytvořeného záznamu
            try:
                latest_analysis = Analysis.objects.latest('id')
                analysis_id = latest_analysis.id + 1
            except ObjectDoesNotExist:
                # pokud žádný záznam neexisstuje
                analysis_id = 1
            # vytváření SPKR_ID
            analyzing_spkr_id = "ANSP" + f"{analysis_id:06d}"
            analysis.analyzing_spkr_id = analyzing_spkr_id
            uploaded_file = serializer.validated_data.get('file_to_analyze')
            # uložení přijatého souboru do složky analysis
            analysis.file_to_analyze.save(analyzing_spkr_id, uploaded_file)
            # Uložení záznamu
            analysis.save()
            return JsonResponse({'spkr_id': "TEST00000"}, status=200)
        # pokud požadavek není validní:
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST) #pokud není validní

            


# Pohled na ukládání do databáze
class CreateRecordView(APIView):
    serializer_class = CreateRecordSerializer
    def post(self, request, format=None):
        # Získání nahrávky z požadavku
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():         # nutno zkontrolovat vždy, zda jsou data validni
            # získání základních informací z požadavku
            name = serializer.validated_data.get('name')
            location = serializer.validated_data.get('location')
            gender = serializer.validated_data.get('gender')
            age = serializer.validated_data.get('age')
            if age == 0: age = None
            record_number = serializer.validated_data.get('record_number')
            # vytvoření nového záznamu
            record = Record(name=name, location=location, gender=gender, age=age, record_number=record_number)

            # Získání ID posledního vytvořeného záznamu
            try:
                latest_record = Record.objects.latest('id')
                record_id = latest_record.id + 1
            except ObjectDoesNotExist:
                # pokud žádný záznam neexisstuje
                record_id = 1

            # kontrola poctu záznamu v databázi
            if (record_id > settings.MAX_NUMBER_RECORD):
                return Response({'Database is full at the moment'}, status=status.HTTP_400_BAD_REQUEST)
            
            # vytváření SPKR_ID
            spkr_id = "SPKR" + f"{record_id:06d}"
            record.spkr_id = spkr_id
            # postupné ukládání všech nahrávek a vět
            for i in range(record_number):
                # získání nahrávky z požadavku
                uploaded_file = serializer.validated_data.get(f"recorded_file_{i}")
                uploaded_sentence = serializer.validated_data.get(f"recorded_sentence_{i}")
                # nazev audio souboru
                file_name = spkr_id + "_" + "FILE" + str(i) + "_" + str(name) + "_" + str(location) + "_" + str(gender) + "_" + str(age) + ".wav"
                # Přiřazení nahrávky
                file_field = getattr(record, f"recorded_file_{i}")
                file_field.save(file_name, uploaded_file)
                # přiřazení věty nahrávky
                setattr(record, f"recorded_sentence_{i}", uploaded_sentence)
                # každou větu do samostatného txt souboru
                file_sen_name = f"FILE{i}_sentence.txt"
                upload_path = os.path.join(settings.MEDIA_ROOT,'audio_files', spkr_id, file_sen_name) 
                with open(upload_path, 'w') as file:
                    file.write(uploaded_sentence)

            # změna práv uloženého souboru
            if (settings.DEBUG == False & settings.CHGRP_SREDEMO == True):
                audio_file_path = "media/audio_files/" + file_name
                subprocess.call(["chgrp", "sredemo", audio_file_path])
                os.chmod(audio_file_path, stat.S_IRUSR | stat.S_IWUSR | stat.S_IRGRP | stat.S_IWGRP | stat.S_IROTH)
            
            # Uložení záznamu
            record.save()
        
            return Response(RecordSerializer(record).data, status=status.HTTP_201_CREATED)
        # pokud požadavek není validní:
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST) #pokud není validní
    
    