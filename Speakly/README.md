# Poznámky k serveru Aspeech

## Stažení aplikace SREDEMO

- Ve složce /var/www/sredemo/ byla stažena production verze aplikace SREDEMO z githubu:

```bash
sudo git clone -b production5 https://github.com/wivry/Speakly.git #production5 - aktuální verze / název větve
```

## Python virtuální prostředí:

- Na OS Debian 12 již byl předinstalovaný Python 3.11.2 , nebylo nutno ho tedy instalovat
- Bylo potřeba nainstalovat virtuální prostředí pro python. Následně vytvořit virtuální prostředí sreenv.
  Do tohoto prostředí se pak nainstalovali potřebné knihovny pro běh aplikace SREDEMO dle souboru requirements.txt.

```bash
sudo apt install python3.11-venv # instalace balíčku virtuálních prostředí
sudo python3 -m venv sreenv # vytvoření virtuálního prostředí
source sreenv/bin/activate # aktivace virtuálího prostředí
pip install -r Speakly/requirements.txt # instalace balíčků pro aplikaci do virtuálního prostředí (při bezproblémových oprávněních)
sudo /var/www/sredemo/sreenv/bin/python -m pip install -r Speakly/requirements.txt # (instalace balíčků pokud není dostatečné oprávnění)
```

## Připojení na Apache

- Django aplikaci (SREDEMO) spouští Apache2 pomocí modulu WSGI. Tento modul bylo potřeba nainstalovat.
- Nainstalování modulu "mod_wsgi" (libapache2-mod-wsgi-py3). Většinou modul na konci svého názvu nemá "-py3", zde v Debianu 12 tak ale bylo.
- Nakonec se aktivoval v Apache2 wsgi mod.

```bash
sudo apt-get install libapache2-mod-wsgi-py3
sudo a2enmod wsgi
```

- ovládání chodu serveru

```bash
sudo systemctl stop apache2
sudo systemctl start apache2
sudo systemctl restart apache2
sudo systemctl status apache2
```

- Bylo také potřeba přidat do konfiguračního souboru Apache2.conf potřebné nastavení pro aplikaci.
- Jedná se o nasměrování na wsgi soubor Django aplikace, webový alias pro aplikaci SREDEMO, cesty na potřebné složky a práva ve složkách.
- Nastavení Apache2 na konci souboru /etc/apache2/apache2.conf:

```bash
## Addition related to sredemo (WSGI module)

WSGIDaemonProcess Speakly python-home=/var/www/sredemo/sreenv python-path=/var/www/sredemo/Speakly/Speakly
WSGIProcessGroup Speakly
WSGIScriptAlias /sredemo /var/www/sredemo/Speakly/Speakly/Speakly/wsgi.py

<Directory /var/www/sredemo/Speakly/Speakly/Speakly>
<Files wsgi.py>
Require all granted
</Files>
</Directory>

Alias /sredemo/media/ /var/www/sredemo/Speakly/Speakly/media/
Alias /sredemo/static/ /var/www/sredemo/Speakly/Speakly/static/

<Directory /var/www/sredemo/Speakly/Speakly/static>
Require all granted
</Directory>

<Directory /var/www/sredemo/Speakly/Speakly/media>
Require all granted
</Directory>

<Directory /var/www/sredemo/Speakly/Speakly>
Require all granted
</Directory>

<Directory /var/www/sredemo/Speakly>
Require all granted
</Directory>
```

## Práva pro server

- Protože aplikace zapisuje nahrané soubory a do databázového souboru do složky media, je nutné nastavit serveru (www-data) práva pro zápis.
- nastavení práva složky:

```bash
cd /var/www/sredemo/Speakly/Speakly
sudo chown -R www-data:www-data media/
sudo chmod -R u+rw media/
```

- nutno nastavit https místo http, jinak nelze posílat data mezi webem a serverem
