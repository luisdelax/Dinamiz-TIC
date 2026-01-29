### **Guía Completa para Actualizar y Desplegar tu Aplicación Web**

Esta guía se divide en dos partes principales:
1.  **Parte 1: Actualización del código en el repositorio de GitHub.**
2.  **Parte 2: Despliegue de la nueva versión en tu servidor VPS de AWS.**

Sigue los pasos en orden para asegurar que el proceso sea correcto y sin errores.

---

### **Parte 1: Preparación y Actualización del Repositorio en GitHub**

El objetivo aquí es empaquetar todos los cambios que has hecho en tu computadora local y subirlos a tu repositorio en GitHub.

**Paso 0: ¡MUY IMPORTANTE! Crear el archivo `requirements.txt`**

He notado que en tu proyecto no existe un archivo `requirements.txt` para el backend. Este archivo es **crucial** porque le dice a tu servidor qué librerías de Python necesita instalar para que tu aplicación Django funcione.

1.  **Abre una terminal** en la raíz de tu proyecto (`/home/ldelacruz/it-management-system/`).
2.  **Activa tu entorno virtual principal.** Por la estructura de carpetas, parece que usas `venv` o `backend/.venv`. Usaremos el que está dentro de `backend` como ejemplo:
    ```bash
    source backend/.venv/bin/activate
    ```
    *Si tu entorno virtual está en otra ruta, ajústala.*
3.  **Genera el archivo `requirements.txt`**. Este comando congela las versiones de todas las librerías que tienes instaladas en el entorno virtual.
    ```bash
    pip freeze > backend/requirements.txt
    ```
    Esto creará el archivo `requirements.txt` dentro de tu carpeta `backend`. Ahora tu servidor sabrá qué necesita instalar.

**Paso 1: Revisar el estado de tu repositorio local**

Este comando te mostrará qué archivos has modificado, cuáles son nuevos y cuáles no están siendo rastreados por Git.

```bash
git status
```

**Paso 2: Añadir todos los cambios al "Staging Area"**

Esto prepara todos tus archivos modificados (incluyendo el nuevo `backend/requirements.txt`) para ser incluidos en el próximo "commit" (una instantánea de tu código).

```bash
git add .
```
*(El punto `.` significa "añadir todo en el directorio actual y subdirectorios").*

**Paso 3: Crear un "commit" con tus cambios**

Un commit es un punto de guardado en la historia de tu proyecto. Es importante que el mensaje sea descriptivo.

```bash
git commit -m "feat: Añadir módulo de tickets y actualizar componentes de UI"
```
*(Puedes cambiar el mensaje para describir mejor tus cambios específicos).*

**Paso 4: Verificar la configuración de tu repositorio remoto**

Asegúrate de que tu repositorio local está apuntando al lugar correcto en GitHub.

```bash
git remote -v
```

Deberías ver algo como esto, que incluya la URL que mencionaste:
```
origin  https://github.com/luisdelax/Dinamiz-TIC.git (fetch)
origin  https://github.com/luisdelax/Dinamiz-TIC.git (push)
```
*Si no es así, puedes configurarlo con: `git remote set-url origin https://github.com/luisdelax/Dinamiz-TIC.git`*

**Paso 5: Subir tus cambios a GitHub**

Finalmente, empuja tus commits locales al repositorio remoto en GitHub. Asumiremos que tu rama principal se llama `main`. Si se llama `master`, usa ese nombre.

```bash
git push origin main
```

**¡Listo!** En este punto, tu código más reciente ya está seguro en tu repositorio de GitHub.

---

### **Parte 2: Despliegue de la Nueva Versión en el Servidor VPS de AWS**

Ahora vamos a conectarnos a tu servidor en la nube y actualizar la aplicación que está corriendo allí con el código que acabamos de subir.

**Paso 1: Conectarse a tu servidor VPS por SSH**

Necesitarás la dirección IP de tu instancia de AWS y el usuario (comúnmente `ubuntu`, `ec2-user` o `admin`).

```bash
ssh -i /ruta/a/tu/llave.pem tu_usuario@la_ip_de_tu_vps
```
*Reemplaza los placeholders con tus datos reales.*

**Paso 2: Navegar al directorio de tu proyecto**

Una vez dentro del servidor, ve a la carpeta donde tienes clonado tu proyecto.

```bash
cd /ruta/a/tu/proyecto/Dinamiz-TIC
```
*Esta ruta puede variar. Podría ser `/var/www/Dinamiz-TIC` o `/home/ubuntu/Dinamiz-TIC`, por ejemplo.*

**Paso 3: Descargar los cambios desde GitHub**

Este comando baja todos los commits que subiste en la Parte 1.

```bash
git pull origin main
```

**Paso 4: Actualizar el Backend (Django)**

Aquí instalaremos dependencias, actualizaremos la base de datos y prepararemos los archivos estáticos.

1.  **Activa el entorno virtual del servidor:**
    ```bash
    source venv/bin/activate
    ```
    *(La ruta `venv/bin/activate` puede variar según cómo lo hayas configurado en tu servidor).*

2.  **Instala las dependencias con el nuevo `requirements.txt`:**
    ```bash
    pip install -r backend/requirements.txt
    ```

3.  **Aplica las migraciones de la base de datos:** Si hiciste cambios en los modelos de Django (`models.py`), este paso es fundamental.
    ```bash
    python backend/manage.py migrate
    ```

4.  **Recolecta los archivos estáticos:** Esto agrupa todos los archivos estáticos (CSS, JS, imágenes de Django Admin) en un solo lugar para que el servidor web (como Nginx) los pueda servir.
    ```bash
    python backend/manage.py collectstatic --noinput
    ```
    *(`--noinput` hace que el comando acepte automáticamente sin pedir confirmación).*

**Paso 5: Actualizar el Frontend (React + Vite)**

Ahora compilaremos la versión más reciente de tu interfaz de usuario.

1.  **Navega al directorio del frontend:**
    ```bash
    cd frontend
    ```

2.  **Instala las dependencias de Node.js:**
    ```bash
    npm install
    ```

3.  **Construye la aplicación para producción:** Este comando, definido en tu `package.json`, crea una versión optimizada de tu aplicación React en la carpeta `dist`.
    ```bash
    npm run build
    ```

4.  **Regresa al directorio raíz de tu proyecto (importante para el siguiente paso):**
    ```bash
    cd ..
    ```

**Paso 6: Reiniciar el Servidor de Aplicación**

Este es el paso final y más crítico. Tu aplicación Django no se sirve con `manage.py runserver` en producción. Normalmente se usa un servidor de aplicaciones como **Gunicorn** o **uWSGI**, gestionado por un servicio como `systemd` y a menudo detrás de un proxy inverso como **Nginx**.

Debes reiniciar el servicio que corre tu aplicación. Aquí hay algunos ejemplos comunes. **Debes saber cuál estás usando.**

*   **Si usas Gunicorn con systemd:**
    Busca el nombre de tu servicio (`sudo systemctl list-units --type=service`) y reinícialo. El nombre podría ser `gunicorn`, `django`, o el nombre de tu proyecto.
    ```bash
    sudo systemctl restart gunicorn.service
    ```

*   **Si usas Nginx como proxy inverso:** A veces también es necesario reiniciar Nginx.
    ```bash
    sudo systemctl restart nginx
    ```

*   **Si usas Apache con `mod_wsgi`:**
    ```bash
    sudo systemctl restart apache2
    ```

Si no estás seguro de cómo se está ejecutando tu aplicación, puedes intentar buscar el proceso:
`ps aux | grep gunicorn` o `ps aux | grep uwsgi`.

Una vez reiniciado el servicio, el servidor de aplicaciones cargará todo tu nuevo código.

**Paso 7: Verificación Final**

1.  Abre tu navegador y visita la URL de tu aplicación.
2.  **Limpia la caché de tu navegador** (Ctrl + Shift + R o Cmd + Shift + R) para asegurarte de que estás viendo los archivos más nuevos del frontend.
3.  Navega por la aplicación y prueba las nuevas funcionalidades para confirmar que todo funciona como se espera.
4.  Si algo sale mal, revisa los logs de tu aplicación para encontrar pistas:
    *   Para systemd/gunicorn: `sudo journalctl -u gunicorn.service -f`
    *   Para Nginx: `tail -f /var/log/nginx/error.log`

¡Y eso es todo! Siguiendo esta guía, habrás actualizado y desplegado tu aplicación de manera ordenada y profesional.