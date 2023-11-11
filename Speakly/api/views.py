
from rest_framework import generics, status
from .serializers import  RecordSerializer, CreateRecordSerializer
from .models import Record
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

import os
import subprocess

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

# Pohled na ukládání do databáze
class CreateRecordView(APIView):
    serializer_class = CreateRecordSerializer

    def post(self, request, format=None):
        # Získání nahrávky z požadavku
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():         # nutno zkontrolovat vždy, zda jsou data validni
            name = serializer.validated_data.get('name')
            location = serializer.validated_data.get('location')
            gender = serializer.validated_data.get('gender')
            age = serializer.validated_data.get('age')
            record_number = serializer.validated_data.get('record_number')
            uploaded_file = serializer.validated_data.get('recorded_file')
            uploaded_setence = serializer.validated_data.get('recorded_setence')

            if age == 0:
                age = None

            record = Record(name=name, location=location, gender=gender, age=age, record_number=record_number, recorded_setence=uploaded_setence)

            # Získání ID posledního vytvořeného záznamu
            try:
                latest_record = Record.objects.latest('id')
                record_id = latest_record.id + 1
            except ObjectDoesNotExist:
                # Zde co se má stát, když neexistují žádné záznamy
                record_id = 1

            # kontrola poctu záznamu v databázi
            if (record_id > settings.MAX_NUMBER_RECORD):
                return Response({'Database is full at the moment'}, status=status.HTTP_400_BAD_REQUEST)
            
            # vytváření SPKR_ID
            spkr_id = "SPKR" + f"{record_id:06d}"
            record.spkr_id = spkr_id

            # nazev audio souboru
            file_name = spkr_id + "_" + str(name) + "_" + str(location) + "_" + str(gender) + "_" + str(age) + ".wav"
            # Přiřazení nahrávky
            record.recorded_file.save(file_name, uploaded_file)
            # změna práv uloženého souboru
            if (settings.DEBUG == False & settings.CHGRP_SREDEMO == True):
                audio_file_path = "media/audio_files/" + file_name
                subprocess.call(["chgrp", "sredemo", audio_file_path])
                os.chmod(audio_file_path, 0o664)
            
            # Uložení záznamu
            record.save()
        
            return Response(RecordSerializer(record).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST) #pokud není validní
    
    