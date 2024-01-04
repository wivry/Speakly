#!/bin/bash

prep_data="" # složka, kam se uloží výsledek data preparation
data_dir="" # Složka s daty na přípravu

# kontrola existence výsledné složky
if [ ! -d "$prep_data" ] || [ -z "$(ls -A "$prep_data")" ]; then
    echo "Výsledná složka neexistuje nebo je prázdná. Probíhá příprava dat pro Kaldi..."

    # Projdi všechny podadresáře (řečníky) v adresáři `audio_files`
    for speaker_dir in "$data_dir"/*; do
        if [ -d "$speaker_dir" ]; then
            speaker_id=$(basename "$speaker_dir") # Získání ID řečníka z názvu podadresáře
            speaker_prep="$prep_data/$speaker_id" # Cesta k výsledným datům pro každého řečníka

            # Vytvoření složky pro výsledné soubory pro každého řečníka
            mkdir -p "$speaker_prep"

            # Vytvoření souboru wav.scp pro každého řečníka
            for audio_file in "$speaker_dir"/*.wav; do
                audio_id=$(basename "$audio_file" .wav) # Získání ID zvukového souboru
                echo "$speaker_id-$audio_id $audio_file"
            done >> "$speaker_prep/wav.scp"

            # Vytvoření souboru utt2spk pro každého řečníka
            for audio_file in "$speaker_dir"/*.wav; do
                audio_id=$(basename "$audio_file" .wav) # Získání ID zvukového souboru
                echo "$speaker_id-$audio_id $speaker_id"
            done >> "$speaker_prep/utt2spk"

            # Vytvoření souboru spk2utt pro každého řečníka
            cat "$speaker_prep/utt2spk" | awk -v spk="$speaker_id" '{print $2, $1}' >> "$speaker_prep/spk2utt"
        fi
    done

    echo "Příprava dat pro Kaldi dokončena."
else
    echo "Výsledná složka existuje a není prázdná. Skript nebude spuštěn."
fi
