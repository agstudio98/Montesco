# Historias de Usuario - Montesco

Este documento lista las necesidades de los usuarios finales expresadas como historias de usuario para guiar el desarrollo.

| ID | Historia de Usuario | Prioridad | Estado |
|----|-------------------|-----------|--------|
| HU01 | Como **visitante**, quiero **ver el catálogo de productos** para conocer la oferta gourmet. | Alta | Completado |
| HU02 | Como **visitante**, quiero **filtrar productos por categoría** para encontrar rápidamente lo que busco. | Media | Completado |
| HU03 | Como **cliente**, quiero **registrarme e iniciar sesión** para gestionar mis pedidos de forma segura. | Alta | Completado |
| HU04 | Como **cliente**, quiero **añadir productos al carrito** para comprarlos posteriormente. | Alta | Completado |
| HU05 | Como **cliente**, quiero **completar mi perfil con dirección y pago** para agilizar mis compras. | Media | En Progreso |
| HU06 | Como **cliente**, quiero **realizar el pago de mi pedido** para confirmar la compra. | Alta | Pendiente |
| HU07 | Como **usuario**, quiero **utilizar el sistema de soporte** para resolver dudas sobre los productos mediante opciones predefinidas. | Media | Completado |
| HU08 | Como **admin**, quiero **gestionar el stock de productos** para mantener la tienda actualizada. | Alta | Pendiente |
| HU09 | Como **cliente**, quiero **ver el historial de mis pedidos** para hacer seguimiento de mis compras. | Media | Pendiente |

## Criterios de Aceptación (Ejemplo HU03)
- El usuario debe proporcionar nombre, email y contraseña.
- El email debe ser único en la base de datos.
- La contraseña debe almacenarse hasheada.
- Tras el login exitoso, se debe devolver un token JWT.
