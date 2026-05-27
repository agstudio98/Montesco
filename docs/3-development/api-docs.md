# Documentación de la API - Montesco

La API de Montesco sigue los principios REST y utiliza JSON para la comunicación. El prefijo base de las rutas es `/api`.

## Productos (`/api/products`)

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | `/` | Obtener todos los productos | Público |
| GET | `/:id` | Obtener detalle de un producto específico | Público |

## Usuarios (`/api/users`)

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| POST | `/` | Registrar un nuevo usuario | Público |
| POST | `/login` | Autenticar usuario y obtener token | Público |
| PUT | `/profile` | Actualizar perfil del usuario actual | Privado |
| PUT | `/profile/:id` | Actualizar perfil de un usuario específico | Privado |

## Soporte y Reclamos (`/api/support`)

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| POST | `/chat` | Enviar consulta de soporte (opciones predefinidas) | Público |
| GET | `/claims/:userId` | Obtener reclamos realizados por el usuario | Privado |

---

## Seguridad y Autenticación
Las rutas marcadas como **Privado** requieren un encabezado de autorización con un Bearer Token:

```http
Authorization: Bearer <JWT_TOKEN>
```

## Manejo de Errores
La API devuelve errores en el siguiente formato:

```json
{
  "message": "Descripción del error",
  "stack": "Traza del error (solo en modo desarrollo)"
}
```
