# Modelos de Base de Datos - Montesco

Montesco utiliza MongoDB con Mongoose para gestionar la persistencia de datos. A continuación se detallan los esquemas principales.

## Usuario (`User`)
Almacena la información de los clientes y administradores.

- `name`: String (Requerido)
- `email`: String (Requerido, Único)
- `password`: String (Requerido, Hasheado)
- `isAdmin`: Boolean (Default: false)
- `profileImage`: String
- `address`: String
- `paymentMethods`: Array
  - `type`: Enum (visa, mastercard, mercadopago)
  - `number`: String
  - `holder`: String
  - `expiry`: String
  - `isDefault`: Boolean
- `twoFactorEnabled`: Boolean
- `twoFactorSecret`: String

## Producto (`Product`)
Contiene los datos de los artículos gourmet.

- `user`: ObjectId (Referencia a User - creador)
- `name`: String (Requerido)
- `image`: String (Requerido)
- `brand`: String (Requerido)
- `category`: String (Requerido)
- `description`: String (Requerido)
- `price`: Number (Requerido)
- `countInStock`: Number (Requerido)

## Orden (`Order`)
Registra las transacciones realizadas.

- `user`: ObjectId (Referencia a User)
- `orderItems`: Array
  - `name`, `qty`, `image`, `price`, `product` (Ref)
- `shippingAddress`: Object (address, city, postalCode, country)
- `paymentMethod`: String
- `paymentResult`: Object (id, status, update_time, email)
- `itemsPrice`, `taxPrice`, `shippingPrice`, `totalPrice`: Number
- `isPaid`: Boolean
- `paidAt`: Date
- `isDelivered`: Boolean
- `deliveredAt`: Date

## Soporte (`Support`)
Gestiona las consultas y reclamos.

- `user`: ObjectId (Referencia a User - opcional)
- `message`: String
- `response`: String (Respuesta del sistema o administrador)
- `status`: Enum (pending, resolved)
