# Speakly

Toto jsou moje poznámky k projektu Webové aplikace na rozpoznání řečníka.

## Jak nainstalovat:

### Vytvoření Django serveru

- stáhnout Python
  (3.11.5)

```bash
- python --version
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

• Windows:

```bash
myenv\Scripts\activate # aktivace virtuálního prostředí
```

• macOS a Linux:

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

• Windows:

```bash
myenv\Scripts\activate # aktivace virtuálního prostředí
```

• macOS a Linux:

```bash
source myenv/bin/activate
```

```bash
cd Speakly
```

#############################################################################################

```bash
v settings.py je DEBUG=true # pro vývojové prostředí , false pro deployment
CORS_ALLOW_ALL_ORIGINS = True # při finále by mělo být na false, ale pozor na práva souborů
CORS_ALLOWED_ORIGINS = [
"http://localhost:3000", # Zde nastavte doménu vaší React aplikace
]
```

############################################################################################

```bash
python manage.py makemigrations # jen pokud předtím došlo ke změně v databázi
python manage.py migrate # jen pokud předtím došlo ke změně v databázi
python .\manage.py runserver # stustí server
```

### React část

• Windows: myenv\Scripts\activate # aktivace virtuálního prostředí
• macOS a Linux: source myenv/bin/activate

```bash
cd Speakly/frontend
npm run dev # spustí vývojářský režim
npm run build # spustí build verzi
```

## Jak na git:

```bash
git add .
git commit -m "Popis"
git push -u -f origin in_work

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

## Jak byl vytvoren React project:

- instalace node.js (https://nodejs.org/).
  verze node (v18.18.0)

```bash
node -v
```

ujištění že npm se nainstaloval spolu s node.js, pokud ne, tak je třeba ho nainstalovat

```bash
npm -v
```

```bash
cd Speakly/frontend
Npm init -y
Npm i webpack webpack-cli - -save-dev
npm i @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
npm i react react-dom --save-dev
npm install bootstrap jquery --save
npm install vmsg --save
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
