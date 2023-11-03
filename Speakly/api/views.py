
from rest_framework import generics, status
from .serializers import  RecordSerializer, CreateRecordSerializer
from .models import Record
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.files import File
from django.core.files.storage import default_storage
from django.core.exceptions import ObjectDoesNotExist

# Create your views here.

class RecordView(generics.ListAPIView):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer

class CreateRecordView(APIView):
    serializer_class = CreateRecordSerializer

    def post(self, request, format=None):
        # Získání nahrávky z požadavku
        #uploaded_file = request.data['recorded_file']
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():         # nutno zkontrolovat vždy, zda jsou data validni
            name = serializer.validated_data.get('name')
            location = serializer.validated_data.get('location')
            gender = serializer.validated_data.get('gender')
            age = serializer.validated_data.get('age')
            record_number = serializer.validated_data.get('record_number')
            uploaded_file = serializer.validated_data.get('recorded_file')


            if age == 0:
                age = None

            record = Record(name=name, location=location, gender=gender, age=age, record_number=record_number)

            # Získání ID posledního vytvořeného záznamu
            try:
                latest_record = Record.objects.latest('id')
                record_id = latest_record.id + 1
            except ObjectDoesNotExist:
                # Zde co se má stát, když neexistují žádné záznamy
                record_id = 1

            spkr_id = "SPKR" + f"{record_id:06d}"
            record.spkr_id = spkr_id

            file_name = spkr_id + "_" + str(name) + "_" + str(location) + "_" + str(gender) + "_" + str(age) + ".wav"
            # Přiřazení nahrávky
            record.recorded_file.save(file_name, uploaded_file)
            #record.recorded_file.save(new_file_name.name, uploaded_file)
            
            # Uložení záznamu
            record.save()
        
            return Response(RecordSerializer(record).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST) #pokud není validní
    
    