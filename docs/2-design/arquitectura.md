# Arquitectura del Sistema - Montesco

Montesco utiliza una arquitectura **MERN Stack** (MongoDB, Express, React, Node.js), que permite un desarrollo full-stack utilizando JavaScript/TypeScript de extremo a extremo.

## Diagrama Conceptual

```text
[ Cliente (React + Vite) ] <--- HTTP/REST ---> [ Servidor (Node.js + Express) ]
       |                                                |
       v                                                v
[ Context API / State ]                          [ MongoDB / Mongoose ]
                                                        |
                                                 +---> [ Bcrypt / JWT ]
```

## Componentes de la Arquitectura

### 1. Frontend (Presentación)
- **Framework:** React 19 con TypeScript.
- **Estilado:** Tailwind CSS para un diseño moderno y responsivo.
- **Estado Global:** React Context API para gestión de autenticación y carrito.
- **Ruteo:** React Router para la navegación SPA.
- **Animaciones:** Framer Motion para transiciones suaves.
- **Internacionalización:** i18next (Español/Inglés).

### 2. Backend (Lógica de Negocio)
- **Entorno:** Node.js con Express.
- **Seguridad:** 
  - `jsonwebtoken` para autenticación basada en tokens.
  - `bcryptjs` para el hashing de contraseñas.
  - `helmet` y `cors` para protección del servidor.
- **Validación:** Middlewares personalizados para manejo de errores y protección de rutas.

### 3. Base de Datos (Persistencia)
- **Motor:** MongoDB (NoSQL).
- **ODM:** Mongoose para el modelado de datos y validaciones de esquema.
- **Estructura:** Colecciones para Usuarios, Productos, Ordenes y Soporte.

## Principios de Diseño
- **SOLID:** Aplicado especialmente en el backend (Single Responsibility Principle) al separar rutas, controladores y servicios.
- **Clean Code:** Uso de nombres descriptivos, funciones pequeñas y manejo centralizado de errores.
- **Surgical Updates:** El desarrollo se realiza de forma incremental y testeada.
