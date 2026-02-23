# 📖 Manual de Despliegue: IT Management System en AWS 🚀

¡Hola! Esta es una guía completa y detallada para desplegar tu aplicación Full Stack (Django + React) en un servidor Ubuntu LTS, utilizando una instancia *Free Tier* de AWS EC2. Seguiremos las mejores prácticas para asegurar que tu aplicación sea segura, eficiente y fácil de mantener.

**🎨 Nota sobre Colores e Iconos:**
Markdown no soporta colores de texto de forma nativa. Usaremos **negrita**, `bloques de código`, blockquotes y, por supuesto, ¡muchos emojis para hacer la guía más visual y amigable!

---

### 🧰 **Pila Tecnológica de Producción**

- **Servidor:** AWS EC2 t2.micro (Ubuntu Server 22.04 LTS).
- **Servidor Web/Proxy Inverso:** Nginx.
- **Servidor de Aplicación WSGI:** Gunicorn.
- **Base de Datos:** PostgreSQL.
- **Gestor de Procesos:** Systemd.
- **Certificados SSL:** Let's Encrypt (Certbot).
- **Firewall:** UFW (Uncomplicated Firewall).

---

## ეტაპი 1: ☁️ Configuración de la Instancia en AWS (EC2)

1.  **Inicia Sesión en tu Consola de AWS.**
2.  Ve al servicio **EC2** y haz clic en "**Launch Instance**".
3.  **Nombre y AMI (Amazon Machine Image):**
    *   **Name:** `it-management-server`
    *   **Application and OS Images:** Busca y selecciona `Ubuntu Server 22.04 LTS (HVM)`, asegurándote de que tenga la etiqueta "Free tier eligible".
4.  **Tipo de Instancia:**
    *   Selecciona `t2.micro`. También está marcado como "Free tier eligible".
5.  **🔑 Par de Claves (Key Pair):**
    *   Esto es **CRUCIAL** para acceder a tu servidor.
    *   Haz clic en "**Create new key pair**".
    *   **Key pair name:** `aws-ec2-key` (o el nombre que prefieras).
    *   **Key pair type:** RSA.
    *   **Private key file format:** `.pem`.
    *   Haz clic en "**Create key pair**". Tu navegador descargará el archivo `.pem`. **¡Guárdalo en un lugar seguro y no lo pierdas!**
6.  **🛡️ Configuración de Red (Security Group):**
    *   Este es el firewall virtual de tu instancia.
    *   Selecciona "**Create security group**".
    *   **Security group name:** `web-server-sg`.
    *   **Description:** `Allow HTTP, HTTPS and SSH`.
    *   **Inbound security groups rules:**
        *   **Regla 1 (SSH):**
            *   **Type:** `SSH`
            *   **Source type:** `My IP`. Esto permite que solo tú (desde tu IP actual) puedas conectarte. Es más seguro.
        *   **Regla 2 (HTTP):**
            *   Haz clic en "**Add rule**".
            *   **Type:** `HTTP`
            *   **Source type:** `Anywhere` (0.0.0.0/0). Para que los usuarios puedan visitar tu web.
        *   **Regla 3 (HTTPS):**
            *   Haz clic en "**Add rule**".
            *   **Type:** `HTTPS`
            *   **Source type:** `Anywhere` (0.0.0.0/0). Para el tráfico seguro.
7.  **Lanzar la Instancia:**
    *   Deja el resto de opciones por defecto y haz clic en "**Launch instance**".
    *   Espera a que la instancia se inicie. Una vez lista, selecciónala y copia su **Public IPv4 address**. La usaremos constantemente.

---

## ეტაპი 2: 🖥️ Conexión y Configuración Inicial del Servidor

1.  **Conéctate por SSH:**
    *   Abre una terminal en tu computadora. Navega a donde guardaste tu archivo `.pem`.
    *   Primero, asegura que tu llave tenga los permisos correctos:
        ```bash
        # Reemplaza con la ruta real de tu llave
        chmod 400 /ruta/a/tu/aws-ec2-key.pem
        ```
    *   Ahora, conéctate (reemplaza `TU_IP_PUBLICA`):
        ```bash
        ssh -i /ruta/a/tu/aws-ec2-key.pem ubuntu@TU_IP_PUBLICA
        ```

2.  **🔄 Actualiza tu Sistema:**
    *   Es una buena práctica asegurarse de que todos los paquetes estén al día.
        ```bash
        sudo apt update && sudo apt upgrade -y
        ```

3.  **🛡️ Configura el Firewall (UFW):**
    *   Ubuntu viene con `ufw`. Lo configuraremos para permitir el tráfico que ya definimos en AWS, como una capa extra de seguridad.
        ```bash
        sudo ufw allow OpenSSH         # Permite conexiones SSH
        sudo ufw allow 'Nginx Full'   # Permite tráfico HTTP y HTTPS
        sudo ufw enable               # ¡Activa el firewall!
        ```
    *   Te preguntará si quieres continuar, escribe `y` y presiona Enter.

---

## ეტაპი 3: 🛠️ Instalación de Dependencias Esenciales

Vamos a instalar Nginx, Python, Node.js y las herramientas para la base de datos de una sola vez.

```bash
sudo apt install nginx python3-pip python3-dev python3-venv libpq-dev nodejs npm postgresql postgresql-contrib -y
```
*   `nginx`: Servidor web.
*   `python3-pip`, `python3-dev`, `python3-venv`: Para gestionar nuestro entorno de Django.
*   `libpq-dev`: Necesario para que Django se comunique con PostgreSQL.
*   `nodejs`, `npm`: Para construir nuestro frontend de React.
*   `postgresql`, `postgresql-contrib`: Nuestra base de datos de producción.

---

## ეტაპი 4: 🐘 Configuración de la Base de Datos (PostgreSQL)

1.  **Inicia sesión en PostgreSQL:**
    ```bash
    sudo -u postgres psql
    ```

2.  **Crea la Base de Datos:** (Reemplaza `it_management_db` si quieres)
    ```sql
    CREATE DATABASE it_management_db;
    ```

3.  **Crea un Usuario:** (¡Usa una contraseña fuerte y segura!)
    ```sql
    CREATE USER it_management_user WITH PASSWORD 'tu_contraseña_segura';
    ```

4.  **Configura los Privilegios del Usuario:**
    ```sql
    ALTER ROLE it_management_user SET client_encoding TO 'utf8';
    ALTER ROLE it_management_user SET default_transaction_isolation TO 'read committed';
    ALTER ROLE it_management_user SET timezone TO 'UTC';
    GRANT ALL PRIVILEGES ON DATABASE it_management_db TO it_management_user;
    ```

5.  **Sal de psql:** Escribe `\q` y presiona Enter.

---

## ეტაპი 5: 🐍 Despliegue del Backend (Django)

1.  **Clona tu Repositorio:**
    *   Clona tu proyecto desde GitHub/GitLab/etc. en el directorio home del usuario.
        ```bash
        # Asegúrate de estar en /home/ubuntu
        cd ~
git clone https://github.com/tu-usuario/it-management-system.git
cd it-management-system/backend
        ```

2.  **Prepara tu Archivo de Requerimientos:**
    *   **En tu máquina local (antes de subir los cambios a git):**
        Asegúrate de tener un archivo `requirements.txt`. Si no lo tienes, créalo:
        ```bash
        # En la terminal de tu máquina local, dentro del entorno virtual
        pip freeze > requirements.txt
        ```
    *   Asegúrate de que `requirements.txt` incluya `gunicorn` y `psycopg2-binary` y `python-dotenv`.
        ```
        # requirements.txt
        django
        djangorestframework
        gunicorn
        psycopg2-binary
        python-dotenv
        ...otras dependencias
        ```

3.  **Crea un Entorno Virtual:**
    ```bash
    # Dentro de /home/ubuntu/it-management-system/backend
    python3 -m venv venv
source venv/bin/activate
    ```

4.  **Instala las Dependencias de Python:**
    ```bash
pip install -r requirements.txt
    ```

5.  **⚙️ Configura los Ajustes de Producción de Django:**
    *   Crea un archivo `.env` para las variables de entorno. ¡No subas este archivo a Git!
        ```bash
        # Dentro de la carpeta /backend
nano .env
        ```
    *   Añade lo siguiente al archivo `.env`, reemplazando los valores:
        ```ini
        SECRET_KEY='tu_secret_key_de_django_muy_larga_y_segura'
        DEBUG=False
        DATABASE_URL='postgres://it_management_user:tu_contraseña_segura@localhost/it_management_db'
        ALLOWED_HOSTS='TU_IP_PUBLICA,tu-dominio.com' # Cuando tengas un dominio
        ```
    *   Ahora, modifica tu `settings.py` para leer estas variables:
        ```python
        # settings.py
        import os
        from dotenv import load_dotenv
        import dj_database_url

        load_dotenv() # Carga las variables de .env

        SECRET_KEY = os.environ.get('SECRET_KEY')
        DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'
        ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')

        # ...

        DATABASES = {
            'default': dj_database_url.config(default=os.environ.get('DATABASE_URL'))
        }
        ```
        *Nota: Tendrás que instalar `dj-database-url` (`pip install dj-database-url`) y añadirlo a `requirements.txt`.*

6.  **Aplica las Migraciones y Recolecta Archivos Estáticos:**
    ```bash
python manage.py migrate
python manage.py collectstatic
    ```
    *   Cuando te pregunte, escribe `yes`. Esto creará una carpeta `staticfiles` que Nginx usará.

7.  **Prueba Gunicorn Manualmente:**
    ```bash
    # Dentro de la carpeta /backend con el entorno activado
    gunicorn --bind 0.0.0.0:8000 backend.wsgi
    ```
    *   Si todo va bien, no verás errores. Detén el proceso con `Ctrl+C`.

---

## ეტაპი 6: 🚀 Creación del Servicio de Systemd para Gunicorn

Esto hará que Gunicorn se ejecute como un servicio en segundo plano y se reinicie automáticamente.

1.  **Crea el archivo de servicio:**
    ```bash
sudo nano /etc/systemd/system/gunicorn.service
    ```

2.  **Pega la siguiente configuración:** (Asegúrate de que las rutas son correctas)
    ```ini
[Unit]
Description=gunicorn daemon for IT Management System
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/it-management-system/backend
ExecStart=/home/ubuntu/it-management-system/backend/venv/bin/gunicorn \
    --access-logfile - \
    --workers 3 \
    --bind unix:/run/gunicorn.sock \
    backend.wsgi:application

[Install]
WantedBy=multi-user.target
    ```
    *   **Explicación:**
        *   `User=ubuntu`: El servicio se ejecuta como el usuario `ubuntu`.
        *   `Group=www-data`: Permite que Nginx se comunique con Gunicorn.
        *   `WorkingDirectory`: La carpeta raíz del backend.
        *   `ExecStart`: El comando que inicia Gunicorn, pero esta vez usando un "socket" (`gunicorn.sock`) para comunicarse con Nginx, que es más eficiente que un puerto.

3.  **Inicia y Habilita el Servicio:**
    ```bash
sudo systemctl start gunicorn
sudo systemctl enable gunicorn  # Para que inicie con el sistema
    ```

4.  **Verifica el Estado:**
    ```bash
sudo systemctl status gunicorn
    ```
    *   Deberías ver `active (running)` en color verde. Si hay un error, el log te dará pistas.

---

## ეტაპი 7: ⚛️ Despliegue del Frontend (React)

1.  **Navega a la Carpeta del Frontend:**
    ```bash
    # Desde /home/ubuntu/it-management-system
cd ../frontend
    ```

2.  **Instala las Dependencias de Node.js:**
    ```bash
npm install
    ```

3.  **📦 Construye la Aplicación para Producción:**
    ```bash
npm run build
    ```
    *   Este comando creará una carpeta `dist` con todos los archivos estáticos optimizados (HTML, CSS, JS) que Nginx servirá directamente.

---

## ეტაპი 8: 🌐 Configuración de Nginx como Proxy Inverso

Nginx manejará todo el tráfico entrante.

1.  **Crea un archivo de configuración para tu sitio:**
    ```bash
sudo nano /etc/nginx/sites-available/it-management-system
    ```

2.  **Pega la siguiente configuración:** (Reemplaza `tu_dominio.com` con tu IP pública por ahora, si aún no tienes un dominio).
    ```nginx
server {
    listen 80;
    server_name TU_IP_PUBLICA tu_dominio.com www.tu_dominio.com;

    # Ubicación de los archivos estáticos de Django
    location /static/ {
        root /home/ubuntu/it-management-system/backend;
    }

    # Ubicación de los archivos de medios (subidos por usuarios)
    location /media/ {
        root /home/ubuntu/it-management-system/backend;
    }

    # Peticiones a la API son redirigidas a Gunicorn
    location /api/ {
        include proxy_params;
        proxy_pass http://unix:/run/gunicorn.sock;
    }

    # El resto de las peticiones sirven la app de React
    location / {
        root /home/ubuntu/it-management-system/frontend/dist;
        try_files $uri /index.html;
    }
}
    ```
    *   **Explicación:**
        *   `listen 80`: Escucha en el puerto 80 (HTTP).
        *   `location /static/` y `/media/`: Nginx sirve estos archivos directamente para mayor eficiencia.
        *   `location /api/`: ¡La magia! Cualquier petición que empiece con `/api/` (tus endpoints de Django) se la pasa a Gunicorn a través del socket.
        *   `location /`: Sirve tu aplicación de React. `try_files` es clave para que el enrutamiento de React funcione correctamente.

3.  **Habilita la Configuración:**
    *   Crea un enlace simbólico de tu archivo de `sites-available` a `sites-enabled`.
        ```bash
sudo ln -s /etc/nginx/sites-available/it-management-system /etc/nginx/sites-enabled
        ```
    *   Es una buena práctica eliminar el sitio por defecto:
        ```bash
sudo rm /etc/nginx/sites-enabled/default
        ```

4.  **Prueba la Configuración de Nginx y Reinicia:**
    ```bash
sudo nginx -t          # Debería decir que la sintaxis es ok.
sudo systemctl restart nginx
    ```

🎉 **¡En este punto, deberías poder visitar `http://TU_IP_PUBLICA` y ver tu aplicación funcionando!** El frontend de React debería cargar, y las llamadas a la API de Django deberían funcionar.

---

## ეტაპი 9: 🔐 ¡Asegurando con HTTPS! (Let's Encrypt)

1.  **Compra un Dominio:** Si aún no lo tienes, compra un dominio en servicios como Namecheap, GoDaddy, etc.
2.  **Apunta tu Dominio a la IP:** En la configuración DNS de tu proveedor de dominio, crea un registro `A` que apunte tu dominio (`tu-dominio.com`) y un `CNAME` para `www` (`www.tu-dominio.com`) a la `TU_IP_PUBLICA` de tu instancia EC2.
3.  **Instala Certbot:**
    ```bash
sudo apt install certbot python3-certbot-nginx -y
    ```
4.  **Obtén el Certificado SSL:**
    *   Asegúrate de que tu `server_name` en el archivo de Nginx tiene tu dominio.
    *   Ejecuta Certbot:
        ```bash
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
        ```
    *   **Sigue las instrucciones:**
        *   Te pedirá tu email.
        *   Acepta los términos de servicio.
        *   Te preguntará si quieres redirigir todo el tráfico HTTP a HTTPS. **Selecciona la opción 2 (Redirect).** ¡Es la más segura!

Certbot obtendrá el certificado, lo instalará y modificará tu archivo de configuración de Nginx para usar SSL. También configurará una renovación automática.

---

## ეტაპი 10: 📈 Mantenimiento y Actualizaciones

*   **Ver el estado de tus servicios:**
    ```bash
sudo systemctl status nginx
sudo systemctl status gunicorn
    ```
*   **Reiniciar servicios después de un cambio:**
    ```bash
sudo systemctl restart nginx
sudo systemctl restart gunicorn
    ```

*   **Para actualizar tu aplicación:**
    1.  Conéctate por SSH.
    2.  Navega a la carpeta del proyecto: `cd ~/it-management-system`.
    3.  Baja los últimos cambios: `git pull`.
    4.  **Backend:**
        *   Activa el entorno virtual: `source backend/venv/bin/activate`.
        *   Instala nuevas dependencias: `pip install -r backend/requirements.txt`.
        *   Aplica migraciones: `python backend/manage.py migrate`.
        *   Recolecta estáticos: `python backend/manage.py collectstatic`.
        *   Reinicia Gunicorn: `sudo systemctl restart gunicorn`.
    5.  **Frontend:**
        *   Instala nuevas dependencias: `npm --prefix frontend install`.
        *   Construye de nuevo: `npm --prefix frontend run build`.
    6.  Reinicia Nginx (buena práctica): `sudo systemctl restart nginx`.

---

### ¡Felicidades! 🥳

Has desplegado una aplicación web moderna, segura y escalable. ¡Ahora a disfrutar de tu trabajo en producción!
