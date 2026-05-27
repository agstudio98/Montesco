# Guía de Instalación y Configuración - Montesco

Sigue estos pasos para poner en marcha el proyecto en tu entorno local.

## Requisitos Previos
- **Node.js:** Versión 20 o superior.
- **pnpm:** Gestor de paquetes recomendado.
- **MongoDB:** Una instancia local o una URI de MongoDB Atlas.

## Pasos de Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd Montesco
```

### 2. Configurar el Backend
```bash
cd backend
pnpm install
```

Crea un archivo `.env` en la carpeta `backend` con las siguientes variables:
```env
PORT=5000
MONGO_URI=tu_uri_de_mongodb
JWT_SECRET=tu_secreto_para_jwt
NODE_ENV=development
```

### 3. Configurar el Frontend
```bash
cd ../frontend/Montesco
pnpm install
```

### 4. Ejecutar el Proyecto
Para ejecutar ambos en modo desarrollo:

**Terminal 1 (Backend):**
```bash
cd backend
pnpm dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend/Montesco
pnpm dev
```

El frontend estará disponible en `http://localhost:5173` y la API en `http://localhost:5000`.

## Scripts Útiles
- `pnpm test`: Ejecuta los tests en el backend o frontend.
- `pnpm build`: Genera la versión de producción del frontend.
- `pnpm lint`: Verifica el estilo del código en el frontend.
