# Especificación de Requerimientos de Software (SRS) - Montesco

## 1. Introducción
Montesco es una plataforma de comercio electrónico diseñada para la venta de productos gourmet. El sistema busca ofrecer una experiencia de usuario premium, integrando herramientas modernas como asistencia virtual por IA.

## 2. Descripción General
El sistema permite a los usuarios navegar por un catálogo de productos, gestionar un carrito de compras, realizar pedidos y recibir soporte a través de un chat inteligente.

## 3. Requerimientos Funcionales

### RF1: Gestión de Usuarios
- Registro de nuevos usuarios con validación de datos.
- Inicio de sesión seguro mediante JWT (JSON Web Tokens).
- Gestión de perfil de usuario (nombre, dirección, métodos de pago).
- Autenticación de dos factores (opcional).

### RF2: Catálogo de Productos
- Visualización de productos con imágenes, descripción, precio y stock.
- Filtrado de productos por categorías.
- Búsqueda de productos.

### RF3: Carrito de Compras
- Adición, edición y eliminación de productos en el carrito.
- Persistencia del carrito durante la sesión.

### RF4: Gestión de Pedidos
- Creación de órdenes de compra.
- Resumen de la orden antes del pago.
- Seguimiento del estado del pedido (Pagado, Entregado).

### RF5: Soporte al Cliente
- Sistema de soporte mediante opciones predefinidas para consultas frecuentes.
- Sistema de reclamos para usuarios registrados con seguimiento de estado.

## 4. Requerimientos No Funcionales

### RNF1: Seguridad
- Implementación de `helmet` para seguridad de cabeceras HTTP.
- Limitación de tasa (`express-rate-limit`) para prevenir ataques de fuerza bruta.
- Encriptación de contraseñas con `bcryptjs`.

### RNF2: Rendimiento
- Frontend optimizado con Vite para tiempos de carga rápidos.
- Animaciones fluidas mediante Framer Motion.

### RNF3: Usabilidad
- Interfaz responsiva adaptada a móviles y escritorio.
- Soporte multiidioma (i18next).

### RNF4: Escalabilidad
- Arquitectura basada en servicios para facilitar el crecimiento del backend.
