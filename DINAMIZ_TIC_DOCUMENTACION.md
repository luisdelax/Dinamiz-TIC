# Dinamiz-TIC - Documentación Técnica Completa

## 1. Visión General

**Dinamiz-TIC** es una aplicación web fullstack para la gestión integral de recursos tecnológicos de una organización (tipo SENA). Permite administrar equipos de cómputo, periféricos, equipos de telecomunicaciones, equipos audiovisuales, tickets de soporte, préstamos de equipos, ubicaciones físicas, funcionarios, tareas y más.

### Tecnologías del Stack

| Capa | Tecnología | Versión |
|------|------------|---------|
| Frontend Framework | Next.js | 15.1.0 |
| UI Library | React | 18.3.1 |
| Lenguaje | TypeScript | 5.5.4 |
| Estilos | Tailwind CSS | 3.4.7 |
| ORM | Prisma | 5.17.0 |
| Base de datos | PostgreSQL (Neon) | - |
| Autenticación | JWT (jsonwebtoken) | 9.0.2 |
| Generación PDF | jsPDF | 4.2.0 |
| Generación Excel | xlsx | 0.18.5 |
| Gráficos | Recharts | - |
| Chat IA | OpenRouter API | - |

---

## 2. Estructura del Proyecto

```
dinamiz-tic/
├── app/                        # Next.js App Router
│   ├── api/                    # Rutas de API REST
│   │   ├── auth/              # Autenticación
│   │   ├── ubicaciones/       # API de ubicaciones
│   │   ├── equipos/           # API de equipos
│   │   │   ├── computo/      # Equipos de cómputo
│   │   │   ├── telecom/      # Equipos de telecomunicación
│   │   │   └── impresoras/   # Impresoras
│   │   ├── tickets/           # API de tickets
│   │   ├── evidencias/        # API de evidencias (archivos)
│   │   ├── prestamos/         # API de préstamos
│   │   ├── funcionarios/      # API de funcionarios
│   │   ├── usuarios/          # API de usuarios
│   │   ├── tareas/            # API de tareas
│   │   ├── notificaciones/    # API de notificaciones
│   │   ├── dashboard/         # API del dashboard
│   │   ├── informes/          # API de informes
│   │   ├── chat/             # API de chat IA
│   │   └── ...
│   │
│   ├── dashboard/             # Página del dashboard
│   ├── ubicaciones/           # Página de ubicaciones
│   ├── tickets/              # Página de tickets
│   ├── equipos/              # Módulo de equipos
│   │   ├── computo/          # Equipos de cómputo
│   │   ├── telecom/          # Equipos de telecomunicación
│   │   └── impresoras/       # Impresoras
│   ├── prestamos/             # Página de préstamos
│   ├── tareas/                # Página de tareas
│   ├── funcionarios/          # Página de funcionarios
│   ├── informes/             # Página de informes
│   ├── configuracion/         # Configuración
│   ├── login/                 # Página de login
│   ├── layout.jsx           # Root Layout
│   └── ClientLayout.jsx     # Client Layout con Chat
│
├── components/                # Componentes reutilizables
│   ├── CRUDBase.jsx          # Componente base para CRUD
│   ├── ClientLayout.jsx      # Layout del cliente (chat + footer)
│   ├── OpenCodeChat.jsx     # Componente de chat IA
│   └── ToastGlobal.jsx       # Notificaciones toast
│
├── prisma/
│   └── schema.prisma         # Esquema de la base de datos
│
├── public/                    # Archivos estáticos
│   ├── evidencias/           # Imágenes de evidencias
│   └── hojas-vida/           # Hojas de vida de equipos
│
├── lib/                      # Utilidades
├── .env                      # Variables de entorno
├── package.json              # Dependencias Node.js
├── next.config.js            # Configuración de Next.js
├── tailwind.config.js        # Configuración de Tailwind
└── tsconfig.json             # Configuración de TypeScript
```

---

## 3. Configuración del Entorno

### Variables de Entorno (.env)

```env
# Base de datos PostgreSQL (Neon)
DATABASE_URL=postgresql://neondb_owner:password@ep-xxx.sa-east-1.aws.neon.tech/dinamiz-tic?sslmode=require

# JWT Secret para autenticación
JWT_SECRET=WHobCWezNu^K!NRgP6rYSgrNyct$Ks!kV2C6fzneS!JznpeG&L

# AWS S3 (Cloudflare R2) - Almacenamiento de archivos
R2_ACCESS_KEY_ID=0180f5169c4c79830f222682a6edb927af6d6
R2_SECRET_ACCESS_KEY=2kBLdbYnOm9F7n3FfULPpKyCRqTRWD400dxfU85o
R2_BUCKET_NAME=evidencias-dinamiz-tic
R2_ACCOUNT_ID=39a5aeb9842b9c358f5f5cf51a7340e2
R2_PUBLIC_URL=https://pub-659559a798fe43339cb8142967781a3f.r2.dev

# IA - OpenRouter (Chat)
OPENAI_API_KEY=sk-or-v1-xxx
AI_PROVIDER=openai

# API de reportes
REPORTS_API_KEY=dinamiz-tic-reports-2024-secure
```

### Base de Datos

- **Proveedor**: Neon (PostgreSQL en la nube)
- **ORM**: Prisma 5.17.0
- **Conexión**: Requiere `sslmode=require`

---

## 4. Esquema de Base de Datos (Prisma)

### Modelos Principales

#### User (Usuario)
```prisma
model User {
  id                  Int       @id @default(autoincrement())
  nombre              String
  apellido            String
  email               String    @unique
  password            String
  rol                 Rol       @default(TecnicoN1)
  emailInstitucional  String?   @unique
  activo              Boolean   @default(true)
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

enum Rol {
  Administrador
  Superusuario
  TecnicoN1
}
```

#### Funcionario
```prisma
model Funcionario {
  id                 Int             @id @default(autoincrement())
  nombre             String
  apellido           String
  tipo               TipoFuncionario  // Docente, Administrativo, Aprendiz, Contratista
  cedula             String          @unique
  telefono           String?
  emailPersonal      String?
  emailInstitucional String          @unique
  dependencia        String?
  cargo              String?
  activo             Boolean         @default(true)
}

enum TipoFuncionario {
  Docente
  Administrativo
  Aprendiz
  Contratista
}
```

#### Ubicacion
```prisma
model Ubicacion {
  id          Int           @id @default(autoincrement())
  nombre      String
  tipo        TipoUbicacion  // IDF, Centro, Ambiente, Oficina, Biblioteca, Aula
  descripcion String?
  activo      Boolean       @default(true)
}

enum TipoUbicacion {
  IDF
  Centro
  Ambiente
  Oficina
  Biblioteca
  Aula
}
```

#### EquipoComputo
```prisma
model EquipoComputo {
  id                Int           @id @default(autoincrement())
  tipo              TipoEquipo    // Desktop, Laptop, AllInOne, Servidor
  marca             String
  modelo            String
  serial            String        @unique
  mac               String?
  placa             String?       @unique
  procesador        String?
  ram               String?
  discoDuro         String?
  unidadDisco       String?
  estado            EstadoEquipo  // Disponible, Asignado, EnReparacion, DadoDeBaja, Prestado
  ubicacion         String?
  ubicacionId       Int?
  dependencia       String?
  fechaAdquisicion  DateTime?
  fechaGarantia     DateTime?
  observaciones     String?
  hojaVidaUrl       String?
  activo            Boolean       @default(true)
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  responsableId     Int?
}

enum TipoEquipo {
  Desktop
  Laptop
  AllInOne
  Servidor
}

enum EstadoEquipo {
  Disponible
  Asignado
  EnReparacion
  DadoDeBaja
  Prestado
}
```

#### Periferico
```prisma
model Periferico {
  id            Int           @id @default(autoincrement())
  tipo          String
  marca         String
  modelo        String
  serial        String        @unique
  estado        EstadoEquipo
  activo        Boolean       @default(true)
}
```

#### EquipoAudiovisual
```prisma
model EquipoAudiovisual {
  id              Int           @id @default(autoincrement())
  tipo            String
  marca           String
  modelo          String
  serial          String        @unique
  estado          EstadoEquipo
  activo          Boolean       @default(true)
}
```

#### Ticket
```prisma
model Ticket {
  id              Int             @id @default(autoincrement())
  titulo          String
  descripcion     String
  estado          EstadoTicket    // Abierto, EnProceso, Resuelto, Cerrado
  prioridad       PrioridadTicket // Baja, Media, Alta, Critica
  ubicacionId     Int?
  creadoPorId     Int
  asignadoAId    Int?
  equipoId       Int?
  fechaCierre     DateTime?
  observaciones   String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}

enum EstadoTicket {
  Abierto
  EnProceso
  Resuelto
  Cerrado
}

enum PrioridadTicket {
  Baja
  Media
  Alta
  Critica
}
```

#### Evidencia
```prisma
model Evidencia {
  id            Int         @id @default(autoincrement())
  ticketId      Int
  tipoArchivo   TipoEvidencia  // imagen, pdf
  urlArchivo    String
  nombreArchivo String
  createdAt     DateTime    @default(now())
}

enum TipoEvidencia {
  imagen
  pdf
}
```

#### Prestamo
```prisma
model Prestamo {
  id                Int             @id @default(autoincrement())
  usuarioId         Int             // Funcionario
  usuario           Funcionario     @relation(fields: [usuarioId], references: [id])
  equipoComputoId   Int?
  equipoComputo     EquipoComputo?  @relation(fields: [equipoComputoId], references: [id])
  perifericoId      Int?
  periferico       Periferico?     @relation(fields: [perifericoId], references: [id])
  audiovisualId     Int?
  audiovisual       EquipoAudiovisual? @relation(fields: [audiovisualId], references: [id])
  estado            EstadoPrestamo  // Pendiente, Aprobado, Rechazado, Devuelto
  fechaPrestamo     DateTime
  fechaDevolucion   DateTime?
  observaciones     String?
  bolso             Boolean         @default(false)
  cargador          Boolean         @default(false)
  memoriaSd         Boolean         @default(false)
  guaya             Boolean         @default(false)
  padMouse          Boolean         @default(false)
  mouse             Boolean         @default(false)
  activo            Boolean         @default(true)
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
}

enum EstadoPrestamo {
  Pendiente
  Aprobado
  Rechazado
  Devuelto
}
```

#### Tarea
```prisma
model Tarea {
  id          Int           @id @default(autoincrement())
  titulo      String
  descripcion String?
  estado      EstadoTarea   // Pendiente, EnProceso, Completada, Cancelada
  prioridad   PrioridadTarea // Baja, Media, Alta, Urgente
  fechaInicio DateTime?
  fechaFin    DateTime?
  activo      Boolean       @default(true)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

enum EstadoTarea {
  Pendiente
  EnProceso
  Completada
  Cancelada
}

enum PrioridadTarea {
  Baja
  Media
  Alta
  Urgente
}
```

#### ReservaAuditorio
```prisma
model ReservaAuditorio {
  id          Int       @id @default(autoincrement())
  titulo      String
  solicitante String
  fechaInicio DateTime
  fechaFin    DateTime
  estado      String    // Pendiente, Aprobado, Rechazado
  activo      Boolean   @default(true)
}
```

---

## 5. Arquitectura de la API

### Rutas de API (Next.js App Router)

```
app/api/
├── auth/
│   ├── login/route.js      # POST - Inicio de sesión
│   ├── register/route.js   # POST - Registro
│   ├── me/route.js         # GET - Usuario actual
│   └── tecnicos/route.js   # GET - Lista de técnicos
│
├── ubicaciones/
│   ├── route.js            # GET (lista), POST (crear)
│   └── [id]/
│       └── route.js        # GET, PUT, DELETE (por ID)
│
├── tickets/
│   ├── route.js            # GET (lista), POST (crear)
│   └── [id]/
│       └── route.js        # GET, PUT, DELETE
│
├── evidencias/
│   ├── route.js            # GET (lista), POST (subir archivo)
│   └── [id]/
│       └── route.js        # DELETE
│
├── equipos/
│   ├── computo/route.js   # Equipos de cómputo
│   ├── telecom/route.js   # Equipos de telecom
│   └── impresoras/route.js # Impresoras
│
├── prestamos/route.js      # Préstamos
├── funcionarios/route.js   # Funcionarios
├── usuarios/route.js       # Usuarios del sistema
├── tareas/route.js        # Tareas
├── dashboard/route.js     # Estadísticas y KPIs
├── informes/route.js      # Informes/Reportes PDF/Excel
├── chat/route.js          # Chat IA (OpenRouter)
└── notificaciones/route.js # Notificaciones
```

### Autenticación

- **Método**: JWT en cookies HTTP-only
- **Cookie**: `token`
- **Secret**: `JWT_SECRET` del .env
- **Verificación**: Función `verifyAuth()` en cada ruta

```javascript
async function verifyAuth(request) {
  const token = request.cookies.get('token')?.value
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}
```

### Subida de Archivos (Evidencias)

- **Ubicación local**: `/var/www/dinamiz-tic/public/evidencias/`
- **Naming**: `{ticketId}_{timestamp}.{ext}` (ej: `7_1772228243006.jpg`)
- **API**: `POST /api/evidencias`
- **Método**: FormData con campos `file` y `ticketId`
- **Validaciones**:
  - Tamaño máximo: 10MB
  - Tipos permitidos: JPG, JPEG, PNG, PDF

---

## 6. Componentes Frontend

### CRUDBase.jsx

Componente principal que contiene todos los elementos reutilizables para CRUD:

```javascript
// Exports
export default function CRUDBase({ children, title, subtitle })
export function DataTable({ columns, data, onEdit, onDelete, onView, searchFields })
export function Modal({ isOpen, onClose, title, children, size })
export function Button({ children, variant, type, onClick, disabled })
export function Input({ label, type, placeholder, required })
export function useUpperCase(initialValue) // Hook para inputs uppercase
```

### ClientLayout.jsx

Layout del cliente que envuelve todas las páginas excepto login:

```javascript
// app/components/ClientLayout.jsx
'use client'

import { usePathname } from 'next/navigation'
import OpenCodeChat from '@/components/OpenCodeChat'

export default function ClientLayout({ children }) {
  const pathname = usePathname()
  const showChat = pathname !== '/login'
  
  return (
    <>
      {children}
      {showChat && (
        <>
          <OpenCodeChat />
          <Footer />
        </>
      )}
    </>
  )
}
```

### OpenCodeChat.jsx

Componente de chat con IA integrado:

- **Posición**: Botón flotante en esquina inferior derecha
- **Arrastrable**: Se puede mover por la pantalla
- **API**: `/api/chat`
- **Proveedor**: OpenRouter (modelo: openai/gpt-4o-mini)

### Estructura de Página Típica

```javascript
// app/ubicaciones/page.jsx
'use client'

import { useState, useEffect } from 'react'
import CRUDBase, { DataTable, Modal, Button, Input, useUpperCase } from '@/components/CRUDBase'

export default function UbicacionesPage() {
  const [ubicaciones, setUbicaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)

  const nombre = useUpperCase('')
  const descripcion = useUpperCase('')

  useEffect(() => { fetchUbicaciones() }, [])

  const fetchUbicaciones = async () => {
    const res = await fetch('/api/ubicaciones', { credentials: 'include' })
    if (res.ok) setUbicaciones(await res.json())
  }

  const columns = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'tipo', header: 'Tipo' },
    { key: 'activo', header: 'Estado', render: (val, row) => ... }
  ]

  return (
    <CRUDBase title="Ubicaciones" subtitle="Gestión de ubicaciones">
      <Button onClick={() => setModalOpen(true)}>Nueva Ubicación</Button>
      <DataTable columns={columns} data={ubicaciones} onEdit={handleEdit} onDelete={handleDelete} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {/* Formulario */}
      </Modal>
    </CRUDBase>
  )
}
```

---

## 7. Configuración de Despliegue

### Servidor (EC2 AWS)

- **Instancia**: EC2 t3.medium
- **OS**: Ubuntu 22.04
- **Puerto**: 3000 (Next.js)
- **Directorio**: `/var/www/dinamiz-tic/`

### Conexión SSH

```bash
ssh -i "dinamiz-tic-key.pem" ubuntu@ec2-18-222-197-227.us-east-2.compute.amazonaws.com
```

### Nginx (Reverse Proxy)

```nginx
server {
    server_name mikronetservices.com www.mikronetservices.com;

    # Archivos estáticos de evidencias
    location /evidencias/ {
        alias /var/www/dinamiz-tic/public/evidencias/;
        expires 1y;
    }

    # Archivos hojas de vida
    location /hojas-vida/ {
        alias /var/www/dinamiz-tic/public/hojas-vida/;
        expires 1y;
    }

    # Proxy a Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/mikronetservices.com/fullchain.pem;
}
```

### PM2 (Process Manager)

```bash
# Iniciar aplicación
pm2 start npm --name dinamiz-tic -- start

# Comandos útiles
pm2 status            # Ver estado
pm2 logs dinamiz-tic # Ver logs
pm2 restart dinamiz-tic # Reiniciar
```

### Sincronización desde Local

```bash
rsync -avz --exclude='node_modules' --exclude='.next' --exclude='.git' \
  -e "ssh -i /ruta/key.pem" /local/dir/ ubuntu@18.222.197.227:/var/www/dinamiz-tic/
```

### Construcción y Reinicio

```bash
# En el servidor
cd /var/www/dinamiz-tic
npm run build
pm2 restart dinamiz-tic
```

---

## 8. Módulos de la Aplicación

### 8.1 Ubicaciones
- **Ruta**: `/ubicaciones`
- **API**: `/api/ubicaciones`
- **Funcionalidad**: CRUD de ubicaciones físicas (IDF, Centro, Ambiente, Oficina, Biblioteca, Aula)

### 8.2 Tickets
- **Ruta**: `/tickets`
- **API**: `/api/tickets`, `/api/evidencias`
- **Funcionalidad**: Sistema de soporte técnico con estados, prioridades, asignación de técnicos y evidencias (imágenes/PDF)

### 8.3 Equipos
- **Rutas**: 
  - `/equipos/computo` - Equipos de cómputo (Desktop, Laptop, AllInOne, Servidor)
  - `/equipos/telecom` - Equipos de telecomunicación
  - `/equipos/impresoras` - Impresoras
- **Estados**: Disponible, Asignado, EnReparacion, DadoDeBaja, Prestado

### 8.4 Préstamos
- **Ruta**: `/prestamos`
- **API**: `/api/prestamos`
- **Funcionalidad**: Préstamo de equipos a funcionarios con seguimiento de accesorios (bolso, cargador, mouse, etc.)

### 8.5 Funcionarios
- **Ruta**: `/funcionarios`
- **API**: `/api/funcionarios`
- **Tipos**: Docente, Administrativo, Aprendiz, Contratista

### 8.6 Tareas
- **Ruta**: `/tareas`
- **API**: `/api/tareas`
- **Estados**: Pendiente, EnProceso, Completada, Cancelada
- **Prioridades**: Baja, Media, Alta, Urgente

### 8.7 Dashboard
- **Ruta**: `/dashboard`
- **API**: `/api/dashboard`
- **Funcionalidad**: Estadísticas, KPIs y gráficos (tickets, equipos, préstamos, tareas)

### 8.8 Informes
- **Ruta**: `/informes`
- **API**: `/api/informes`
- **Funcionalidad**: Generación de reportes PDF y Excel

### 8.9 Chat IA
- **Componente**: `OpenCodeChat` (botón flotante)
- **API**: `/api/chat`
- **Proveedor**: OpenRouter (GPT-4o Mini)
- **Funcionalidad**: Asistente virtual para redacción de correos, resúmenes, ideas y asistencia administrativa

---

## 9. Permisos y Roles

| Rol | Permisos |
|-----|----------|
| Administrador | Acceso total: crear, editar, eliminar cualquier registro |
| Superusuario | Acceso completo al sistema |
| TecnicoN1 | Puede gestionar tickets y equipos |

---

## 10. Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Construir para producción
npm run build

# Iniciar en producción
npm run start

# Generar cliente Prisma
npm run db:generate

# Push esquema a DB
npm run db:push
```

---

## 11. API de Chat IA

### Endpoint

```
POST /api/chat
```

### Request

```json
{
  "message": "Hola, necesito ayuda para redactar un correo",
  "history": [],
  "systemPrompt": "Eres un asistente virtual útil..."
}
```

### Response

```json
{
  "response": "Claro, con gusto te ayudo..."
}
```

### Configuración

- **Proveedor**: OpenRouter
- **Modelo**: openai/gpt-4o-mini
- **Variable de entorno**: `OPENAI_API_KEY`

---

## 12. Notas Importantes

### Next.js 15+ params
Enrutamiento dinámico requiere `await params`:

```javascript
export async function GET(request, { params }) {
  const { id } = await params  // ✅ Correcto
  // params.id  // ❌ Incorrecto
}
```

### Archivos de Ruta Redundantes
Los archivos de ruta de API en Next.js App Router siguen una jerarquía específica:
- `route.js` en raíz captura requests sin parámetros
- `[id]/route.js` captura requests con parámetros dinámicos

### Imágenes de Evidencias
- Se almacenan en `/var/www/dinamiz-tic/public/evidencias/`
- Naming: `{ticketId}_{timestamp}.{ext}`
- Se sirven a través de Nginx

### Hojas de Vida de Equipos
- Se almacenan en `/var/www/dinamiz-tic/public/hojas-vida/`
- PDF generados automáticamente

### Estado de React
Al actualizar datos, se debe actualizar el estado local manualmente ya que Next.js App Router no actualiza automáticamente los estados de los componentes.

---

## 13. Credenciales de Acceso

- **Email**: admin@dinamiz.com
- **Password**: admin123
- **Rol**: Administrador

---

## 14. Contacto y Soporte

Para dudas técnicas sobre la estructura, consulte este documento o el código fuente en `/var/www/dinamiz-tic/`.

---

*Documento actualizado el 28 de Febrero de 2026*
*Versión de la aplicación: 1.0.1*
