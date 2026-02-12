# Modelo entidad-relacion (Explicacion de tablas y campos)

> Nota: El modelo esta organizado por *schemas* que representan microservicios (auth, catalog, orders, delivery, notifications). Donde veas campos con nota **External:** significa que se guarda el UUID de otro servicio como referencia logica, pero **no** se crean llaves foraneas cruzando servicios.

---

## Tabla `auth.roles`

**Proposito:** Catalogo de roles del sistema (RBAC basico). Se usa para asignar el tipo de usuario (cliente, comerciante, repartidor, admin).

| Campo         | Descripcion                                                           |
| ------------- | --------------------------------------------------------------------- |
| `id`          | Identificador UUID del rol.                                           |
| `code`        | Codigo unico del rol (ej. `CUSTOMER`, `MERCHANT`, `DRIVER`, `ADMIN`). |
| `description` | Descripcion legible del rol.                                          |
| `is_system`   | Indica si el rol es del sistema (no editable o protegido).            |
| `created_at`  | Fecha/hora de creacion.                                               |
| `updated_at`  | Fecha/hora de ultima actualizacion.                                   |

---

## Tabla `auth.users`

**Proposito:** Usuarios registrados. Contiene datos de login, perfil basico y el rol asignado.

| Campo            | Descripcion                                          |
| ---------------- | ---------------------------------------------------- |
| `id`             | Identificador UUID del usuario.                      |
| `email`          | Correo unico para login (hasta 320).                 |
| `password`       | **Hash** de la contrasena (no debe ser texto plano). |
| `name`           | Nombre del usuario.                                  |
| `phone_number`   | Telefono de contacto.                                |
| `role_id`        | Rol asignado (FK hacia `auth.roles`).                |
| `is_active`      | Si el usuario esta activo.                           |
| `email_verified` | Si el correo ya fue verificado.                      |
| `created_at`     | Fecha/hora de creacion.                              |
| `updated_at`     | Fecha/hora de ultima actualizacion.                  |

---

## Tabla `auth.auth_codes`

**Proposito:** Codigos temporales para verificacion de correo, restablecimiento de contrasena u OTP de login.

| Campo          | Descripcion                                                           |
| -------------- | --------------------------------------------------------------------- |
| `id`           | Identificador UUID del codigo.                                        |
| `user_id`      | Usuario al que pertenece (FK hacia `auth.users`).                     |
| `code_hash`    | Hash del codigo (nunca guardar el codigo en claro).                   |
| `type`         | Tipo de codigo (`EMAIL_VERIFICATION`, `PASSWORD_RESET`, `LOGIN_OTP`). |
| `attempts`     | Intentos consumidos.                                                  |
| `max_attempts` | Maximo de intentos permitidos.                                        |
| `expires_at`   | Fecha/hora de expiracion.                                             |
| `used_at`      | Fecha/hora en que se uso (si aplica).                                 |
| `destination`  | Destino (correo o telefono enmascarado).                              |
| `created_at`   | Fecha/hora de creacion.                                               |

---

## Tabla `catalog.merchant_types`

**Proposito:** Tipos de comercio. Sirve para clasificar si un “merchant” es restaurante, supermercado, farmacia, etc.

| Campo         | Descripcion                                     |
| ------------- | ----------------------------------------------- |
| `id`          | Identificador UUID del tipo.                    |
| `code`        | Codigo unico (ej. `RESTAURANT`, `SUPERMARKET`). |
| `name`        | Nombre legible.                                 |
| `description` | Descripcion opcional.                           |
| `created_at`  | Fecha/hora de creacion.                         |
| `updated_at`  | Fecha/hora de ultima actualizacion.             |

---

## Tabla `catalog.restaurants`

**Proposito:** Registro de restaurantes/tiendas (merchants) disponibles en la plataforma.

| Campo              | Descripcion                                           |
| ------------------ | ----------------------------------------------------- |
| `id`               | Identificador UUID del restaurante/tienda.            |
| `name`             | Nombre comercial.                                     |
| `address`          | Direccion.                                            |
| `phone`            | Telefono.                                             |
| `alias`            | Alias corto (para URLs o busqueda).                   |
| `opening_hours`    | Horario (texto simple).                               |
| `is_active`        | Si esta disponible/activo.                            |
| `merchant_type_id` | Tipo de comercio (FK hacia `catalog.merchant_types`). |
| `created_at`       | Fecha/hora de creacion.                               |
| `updated_at`       | Fecha/hora de ultima actualizacion.                   |

---

## Tabla `catalog.restaurant_categories`

**Proposito:** Catalogo global de categorias/etiquetas para restaurantes (ej. “Comida rapida”, “Saludable”).

| Campo         | Descripcion                                   |
| ------------- | --------------------------------------------- |
| `id`          | Identificador UUID de la categoria.           |
| `name`        | Nombre unico de la categoria.                 |
| `description` | Descripcion opcional.                         |
| `is_active`   | Permite desactivar la categoria sin borrarla. |
| `created_at`  | Fecha/hora de creacion.                       |
| `updated_at`  | Fecha/hora de ultima actualizacion.           |

---

## Tabla `catalog.restaurant_category_map`

**Proposito:** Tabla puente **muchos-a-muchos** entre restaurantes y categorias. Un restaurante puede tener varias categorias y una categoria puede pertenecer a muchos restaurantes.

| Campo           | Descripcion                                                    |
| --------------- | -------------------------------------------------------------- |
| `restaurant_id` | Restaurante asignado (FK hacia `catalog.restaurants`).         |
| `category_id`   | Categoria asignada (FK hacia `catalog.restaurant_categories`). |
| `created_at`    | Fecha/hora de asignacion.                                      |

> Incluye un indice unico `(restaurant_id, category_id)` para evitar duplicados.

---

## Tabla `catalog.menu_items`

**Proposito:** Productos/platillos del menu de cada restaurante/tienda.

| Campo           | Descripcion                                               |
| --------------- | --------------------------------------------------------- |
| `id`            | Identificador UUID del item.                              |
| `restaurant_id` | Restaurante duenio (FK hacia `catalog.restaurants`).      |
| `name`          | Nombre del producto.                                      |
| `description`   | Descripcion larga.                                        |
| `price`         | Precio como `numeric(12,2)` (evita errores de flotantes). |
| `currency`      | Moneda ISO (ej. `GTQ`).                                   |
| `is_available`  | Disponibilidad del producto.                              |
| `created_at`    | Fecha/hora de creacion.                                   |
| `updated_at`    | Fecha/hora de ultima actualizacion.                       |

---

## Tabla `catalog.menu_item_categories`

**Proposito:** Categorias del menu **por restaurante** (ej. “Bebidas”, “Postres”). Permite que cada restaurante organice su menu.

| Campo           | Descripcion                                                    |
| --------------- | -------------------------------------------------------------- |
| `id`            | Identificador UUID de la categoria.                            |
| `restaurant_id` | Restaurante al que pertenece (FK hacia `catalog.restaurants`). |
| `name`          | Nombre de la categoria (unico por restaurante).                |
| `description`   | Descripcion opcional.                                          |
| `is_active`     | Permite desactivar sin borrar.                                 |
| `created_at`    | Fecha/hora de creacion.                                        |
| `updated_at`    | Fecha/hora de ultima actualizacion.                            |

> Tiene unicidad `(restaurant_id, name)` para evitar categorias repetidas dentro del mismo restaurante.

---

## Tabla `catalog.menu_item_category_map`

**Proposito:** Tabla puente **muchos-a-muchos** entre items del menu y categorias del menu.

| Campo          | Descripcion                                                   |
| -------------- | ------------------------------------------------------------- |
| `menu_item_id` | Item del menu (FK hacia `catalog.menu_items`).                |
| `category_id`  | Categoria del menu (FK hacia `catalog.menu_item_categories`). |
| `created_at`   | Fecha/hora de asignacion.                                     |

> Incluye un indice unico `(menu_item_id, category_id)` para evitar duplicados.

---

## Tabla `orders.orders`

**Proposito:** Orden principal. Guarda el cliente, el restaurante y datos clave del pedido. Incluye **snapshots** para conservar historico aunque cambie el catalogo.

| Campo                      | Descripcion                                          |
| -------------------------- | ---------------------------------------------------- |
| `id`                       | Identificador UUID de la orden.                      |
| `customer_user_id`         | UUID externo del usuario (Auth).                     |
| `restaurant_id`            | UUID externo del restaurante (Catalog).              |
| `status`                   | Estado de la orden (`CREATED`, `IN_PROGRESS`, etc.). |
| `restaurant_name_snapshot` | Nombre del restaurante al momento de compra.         |
| `delivery_address`         | Direccion de entrega.                                |
| `total_amount`             | Total como `numeric(12,2)`.                          |
| `currency`                 | Moneda ISO (ej. `GTQ`).                              |
| `canceled_at`              | Fecha/hora de cancelacion.                           |
| `canceled_by_user_id`      | UUID externo del usuario que cancelo (si aplica).    |
| `rejection_reason`         | Motivo de rechazo (si aplica).                       |
| `created_at`               | Fecha/hora de creacion.                              |
| `updated_at`               | Fecha/hora de ultima actualizacion.                  |

---

## Tabla `orders.order_items`

**Proposito:** Detalle de productos dentro de una orden. Guarda snapshots del producto para historico.

| Campo                | Descripcion                                           |
| -------------------- | ----------------------------------------------------- |
| `id`                 | Identificador UUID del item de orden.                 |
| `order_id`           | Orden a la que pertenece (FK hacia `orders.orders`).  |
| `menu_item_id`       | UUID externo del item del menu (Catalog).             |
| `item_name_snapshot` | Nombre del producto al momento de compra.             |
| `unit_price`         | Precio unitario `numeric(12,2)` al momento de compra. |
| `quantity`           | Cantidad (>= 1).                                      |
| `line_total`         | Total de linea (`unit_price * quantity`).             |

---

## Tabla `delivery.deliveries`

**Proposito:** Entrega asociada a una orden y asignada a un repartidor.

| Campo            | Descripcion                                                       |
| ---------------- | ----------------------------------------------------------------- |
| `id`             | Identificador UUID de la entrega.                                 |
| `order_id`       | UUID externo de la orden (Orders).                                |
| `driver_user_id` | UUID externo del repartidor (Auth).                               |
| `status`         | Estado de la entrega (reutiliza `order_status` para simplificar). |
| `accepted_at`    | Fecha/hora en que el repartidor acepto.                           |
| `picked_up_at`   | Fecha/hora de recoleccion.                                        |
| `delivered_at`   | Fecha/hora de entrega.                                            |
| `canceled_at`    | Fecha/hora de cancelacion.                                        |
| `cancel_reason`  | Motivo de cancelacion.                                            |
| `created_at`     | Fecha/hora de creacion.                                           |
| `updated_at`     | Fecha/hora de ultima actualizacion.                               |

---

## Tabla `delivery.delivery_events`

**Proposito:** Bitacora de eventos de una entrega (auditoria y trazabilidad).

| Campo         | Descripcion                                                             |
| ------------- | ----------------------------------------------------------------------- |
| `id`          | Identificador UUID del evento.                                          |
| `delivery_id` | Entrega asociada (FK hacia `delivery.deliveries`).                      |
| `event`       | Tipo de evento (ej. `ACCEPTED`, `ON_THE_WAY`, `DELIVERED`, `CANCELED`). |
| `note`        | Nota opcional.                                                          |
| `created_at`  | Fecha/hora del evento.                                                  |

---

## Tabla `notifications.notification_outbox`

**Proposito:** Outbox de notificaciones por correo. Permite reintentos, control de estado y trazabilidad de envios.

| Campo              | Descripcion                                  |
| ------------------ | -------------------------------------------- |
| `id`               | Identificador UUID del registro.             |
| `type`             | Tipo de notificacion (ej. `ORDER_CREATED`).  |
| `status`           | Estado (`PENDING`, `SENT`, `FAILED`).        |
| `to_email`         | Correo destinatario.                         |
| `order_id`         | UUID externo de la orden (si aplica).        |
| `customer_user_id` | UUID externo del cliente (si aplica).        |
| `attempts`         | Numero de intentos de envio.                 |
| `last_error`       | Ultimo error (si fallo).                     |
| `scheduled_at`     | Fecha/hora programada para envio (opcional). |
| `sent_at`          | Fecha/hora de envio exitoso.                 |
| `created_at`       | Fecha/hora de creacion.                      |
| `updated_at`       | Fecha/hora de ultima actualizacion.          |

**Como se usa (resumen):** cuando Order/Delivery generan un evento, Notification-Service crea un registro en outbox con `status = PENDING`. Un worker lo procesa, envia el correo y actualiza a `SENT` o `FAI
