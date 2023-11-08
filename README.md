# Speakly

Toto jsou moje poznámky k projektu Webové aplikace na rozpoznání řečníka.

## Jak nainstalovat:

### Vytvoření Django serveru

- stáhnout Python
  (3.11.5)

```bash
python --version
```

- Stáhnout repozitář z GitHubu
- aktivovat a nainstalovat virtuální prostředí
- stustit Django aplikaci

### Python virtuální prostředí:

```bash
python -m venv myenv # vytvoření vyrtuálního prostředí
pip freeze > requirements.txt # vytvoření požadavků pro virtuální prostředí a jeho aktualizace
pip install -r requirements.txt # instalace balíčků
```

aktivace virtuálního prostředí

- Windows:

```bash
myenv\Scripts\activate
```

- macOS a Linux:

```bash
source myenv/bin/activate
```

### Vytvoření React aplikace:

- stáhnout Node.js (https://nodejs.org/).

```bash
node -v # verze node (v18.18.0)
npm -v # ujištění že npm se nainstaloval spolu s node.js, pokud ne, tak je třeba ho nainstalovat
npm install # nainstaluje node_modules dle souboru package.json
```

- spuštění Reactu je třeba v Python virtuálním prostředí stejně jako Django, protože jsou spolu provázané

```bash
npm run dev # spustí vývojářský režim
npm run build # spustí build verzi
```

## Jak spustit server:

### Django část

aktivace virtuálního prostředí

- Windows:

```bash
myenv\Scripts\activate
```

- macOS a Linux:

```bash
source myenv/bin/activate
```

Jít do spožky aplikace serveru

```bash
cd Speakly
```

#############################################################################################

```bash
v settings.py je DEBUG=true # true pro vývojové prostředí , false pro deployment
ALLOWED_HOSTS = []      # zde musí být URL stránky
CORS_ALLOW_ALL_ORIGINS = True # při finále by mělo být na false, ale pozor na práva souborů
CORS_ALLOWED_ORIGINS = [
"http://localhost:3000", # Zde nastavte doménu vaší React aplikace
]
```

############################################################################################

```bash
python manage.py makemigrations # jen pokud předtím došlo ke změně v databázi
python manage.py migrate # jen pokud předtím došlo ke změně v databázi
python manage.py collectstatic  # nutno schromáždit všechny static files
python .\manage.py runserver # spustí server
```

### React část

aktivace virtuálního prostředí

- Windows:

```bash
myenv\Scripts\activate
```

- macOS a Linux:

```bash
source myenv/bin/activate
```

Jít do složky frontendu

```bash
cd Speakly/frontend
npm run dev # spustí vývojářský režim
npm run build # spustí build verzi
```

Replace "production" with "development" in the following snippet of the webpack.config: plugins: [ new webpack.DefinePlugin({ "process.env": { // This has effect on the react lib size NODE_ENV: JSON.stringify("development"), }, }), ]

## Jak na git:

```bash
git add .
git commit -m "Popis"
git push -u origin in_work

git checkout moje-vetev #přepnout na vetev

git init
git add .
git commit -m "Popis"
git remote add origin https://github.com/wivry/Speakly
git branch -M main # nová větev
git branch -M in_work
git push -u -f origin main
```

## Jak byl vytvoren Django project:

- vytvoření vyrtuálního prostředí (viz virtuální prostředí)
- instalace balíčků

```bash
  pip install django
  pip install djangorestframework
  pip install django-cors-headers
```

- vytvoření Django projektu

```bash
  django-admin startproject Speakly # Speakly je jméno projektu
```

- vytvoření Django aplikace

```bash
  python manage.py startapp api # api je jméno backend aplikace
```

- vytvoření React aplikace

```bash
  python manage.py startapp frontend # frontend je jméno
```

- nastavení projektu (přidat do settings.py):
- - do INSTALLED_APPS:

```bash
    'api.apps.ApiConfig',
    'rest_framework',
    'frontend.apps.FrontendConfig',
    'corsheaders',
```

- - do MIDLEWARE:

```bash
    'corsheaders.middleware.CorsMiddleware',
```

- - TIME_ZONE = 'Europe/Prague'
- - STATIC_URL = 'static/'
- - MEDIA_URL = 'media/'
- - MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
- Po vytvoření modelů a pohledů (models.py, views.py)

```bash
  python manage.py makemigrations
  python manage.py migrate
```

## Jak byl vytvořen React project:

- instalace node.js (https://nodejs.org/).
  verze node (v18.18.0)

```bash
node -v
```

ujištění, že npm se nainstaloval spolu s node.js, pokud ne, tak je třeba ho nainstalovat

```bash
npm -v
```

Jít do složky frontendu

```bash
cd Speakly/frontend
Npm init -y
Npm i webpack webpack-cli - -save-dev
npm i @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
npm i react react-dom --save-dev
npm install bootstrap jquery --save
npm install vmsg --save
npm i react-audio-analyser        # náhrada za wmsg kvůli podpoře wav
npm i prop-types
npm i wavesurfer.js               # vykreslení waveform

npm install @babel/plugin-proposal-class-properties
npm install react-router-dom
npm install css-loader style-loader webpack --save-dev
pip install django-cors-headers
```

- soubor babel.config.json a webpack.config.js
- upravit scripty v package.json:

```bash
  "dev": "webpack --mode development --watch",
  "build": "web -mode production"
```

- If you get the following error: Conflicting values for 'process.env.NODE_ENV' Replace "production" with "development" in the following snippet of the webpack.config: plugins: [ new webpack.DefinePlugin({ "process.env": { // This has effect on the react lib size NODE_ENV: JSON.stringify("development"), }, }), ]

# Na serveru Noel

vavrinek@noel.fel.cvut.cz
Vavrinek1

ssh-keygen

- v adresáři var/www/sredemo
- virtuální prostředí - sreenv

## Připojení na Apache

- Nainstalování modulu "mod_wsgi"

```bash
sudo apt-get install libapache2-mod-wsgi
```

- Aktivovat v Apache wsgi mod (tam, kde je konfigurační soubor Apache):

```bash
sudo a2enmod wsgi

```

- V konfiguračním souboru Apache nutno nastavit wsgi a cestu k Django projektu na spouštění
- Dále v konfiguračním souboru přidat přesměrování

```bash
WSGIDaemonProcess Speakly python-home=/home/www/sredemo/sreenv python-path=/home/www/sredemo/Speakly/Speakly
WSGIProcessGroup Speakly
WSGIScriptAlias /sredemo /home/www/sredemo/Speakly/Speakly/Speakly/wsgi.py

<Directory /home/www/sredemo/Speakly/Speakly/Speakly>
<Files wsgi.py>
Require all granted
</Files>
</Directory>

Alias /media/ /home/www/sredemo/Speakly/Speakly/media/
Alias /static/ /home/www/sredemo/Speakly/Speakly/static/

<Directory /home/www/sredemo/Speakly/Speakly/static>
Require all granted
</Directory>

<Directory /home/www/sredemo/Speakly/Speakly/media>
Require all granted
</Directory>
```

- Možná bude třeba udělat i toto:

```bash
Alias /robots.txt /path/to/mysite.com/static/robots.txt
Alias /favicon.ico /path/to/mysite.com/static/favicon.ico
```

- Po provedení změn nutno restartovat Apache

```bash
sudo systemctl restart apache2
```

### Fixing UnicodeEncodeError for file uploads

If you get a UnicodeEncodeError when uploading or writing files with file names or content that contains non-ASCII characters, make sure Apache is configured to support UTF-8 encoding:

```bash
export LANG='en_US.UTF-8'
export LC_ALL='en_US.UTF-8'
```

A common location to put this configuration is /etc/apache2/envvars.

Alternatively, if you are using mod_wsgi daemon mode you can add lang and locale options to the WSGIDaemonProcess directive:

```bash
WSGIDaemonProcess example.com lang='en_US.UTF-8' locale='en_US.UTF-8'
```

See the Files section of the Unicode reference guide for details.
