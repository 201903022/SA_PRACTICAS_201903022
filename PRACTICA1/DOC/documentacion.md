
# Documentacion

## Requerimientos funcionales

### RF-01 Gestión de usuarios y autenticación (Auth-Service)

* **RF-01.1** Registrar usuarios con email, contraseña y rol.
* **RF-01.2** Validar email único al registrar.
* **RF-01.3** Almacenar contraseñas de forma segura (hash).
* **RF-01.4** Iniciar sesión (login) con email y contraseña.
* **RF-01.5** Generar JWT al autenticar correctamente.
* **RF-01.6** Validar JWT para autorizar solicitudes.
* **RF-01.7** Soportar roles: CLIENTE, RESTAURANTE/VENDEDOR, REPARTIDOR, ADMINISTRADOR

### RF-02 API Gateway (punto de entrada)

* **RF-02.1** Exponer endpoints REST para el frontend.
* **RF-02.2** Validar JWT en las solicitudes entrantes.
* **RF-02.3** Aplicar autorización básica por roles (según endpoint).
* **RF-02.4** Enrutar llamadas hacia microservicios internos vía gRPC.

### RF-03 Catálogo de restaurantes (Restaurant-Catalog-Service)

* **RF-03.1 (ADMIN)** Crear restaurante.
* **RF-03.2 (ADMIN)** Consultar restaurante(s).
* **RF-03.3 (ADMIN)** Actualizar restaurante.
* **RF-03.4 (ADMIN)** Eliminar restaurante.
* **RF-03.5 (RESTAURANTE)** Crear ítem de menú (nombre, descripción, precio, disponibilidad).
* **RF-03.6 (RESTAURANTE)** Consultar ítems del menú.
* **RF-03.7 (RESTAURANTE)** Actualizar ítem del menú.
* **RF-03.8 (RESTAURANTE)** Eliminar ítem del menú.
* **RF-03.9 (CLIENTE)** Listar restaurantes disponibles.
* **RF-03.10 (CLIENTE)** Ver menú de un restaurante.

### RF-04 Gestión de órdenes (Order-Service)

* **RF-04.1 (CLIENTE)** Crear una orden a partir de un carrito (ítems, cantidades, etc.).
* **RF-04.2 (CLIENTE)** Cancelar una orden (cambia estado a CANCELADO).
* **RF-04.3 (RESTAURANTE)** Ver órdenes recibidas.
* **RF-04.4 (RESTAURANTE)** Aceptar y marcar una orden como EN PROCESO.
* **RF-04.5 (RESTAURANTE)** Marcar una orden como FINALIZADO (lista para entrega).
* **RF-04.6 (RESTAURANTE)** Rechazar una orden (cambia estado a RECHAZADA).

### RF-05 Gestión de entregas (Delivery-Service)

* **RF-05.1 (REPARTIDOR)** Ver órdenes disponibles para entrega cuando estén listas.
* **RF-05.2 (REPARTIDOR)** Aceptar una orden lista y cambiar su estado a EN CAMINO.
* **RF-05.3 (REPARTIDOR)** Marcar una orden como ENTREGADO al finalizar.
* **RF-05.4 (REPARTIDOR)** Cancelar una entrega por percance y marcar estado como CANCELADO.

### RF-06 Notificaciones por correo (Notification-Service)

* **RF-06.1** Enviar correo al cliente cuando se crea la orden (pedido realizado).
* **RF-06.2** Enviar correo al cliente cuando el cliente cancela la orden.
* **RF-06.3** Enviar correo al cliente cuando la orden está EN CAMINO / asignada al repartidor.
* **RF-06.4** Enviar correo al cliente cuando la orden es cancelada por restaurante o repartidor (incluye quién y razón).
* **RF-06.5** Enviar correo al cliente cuando la orden es rechazada por el restaurante.
* **RF-06.6** Incluir en los correos los datos mínimos solicitados (cliente, número de orden, productos, monto total, fechas, estado, etc., según el tipo de notificación).

---

## Requerimientos no funcionales

### RNF-01 Arquitectura

* **RNF-01.1** Implementar arquitectura basada en microservicios.
* **RNF-01.2** Implementar un API Gateway como punto de entrada único para el frontend.
* **RNF-01.3** Usar REST para consumo externo (frontend -> gateway).
* **RNF-01.4** Usar gRPC para comunicación interna (gateway -> microservicios).

### RNF-02 Seguridad

* **RNF-02.1** Autenticación basada en JWT.
* **RNF-02.2** Autorización por roles para proteger endpoints.
* **RNF-02.3** Almacenamiento seguro de contraseñas (hash y buenas prácticas).

### RNF-03 Persistencia y datos

* **RNF-03.1** Persistencia obligatoria (no solo en memoria).
* **RNF-03.2** Modelos de datos definidos para usuarios, restaurantes, menús y órdenes.
* **RNF-03.3 (Recomendado)** Independencia por servicio (cada microservicio con su propia BD o esquema claramente desacoplado).

### RNF-04 Despliegue e infraestructura

* **RNF-04.1** Contenerización con Docker para cada microservicio.
* **RNF-04.2** Orquestación local con Docker Compose (levantamiento de la solución).
* **RNF-04.3** Despliegue en nube, preferiblemente GCP (según criterios del proyecto).
* **RNF-04.4** Configuración reproducible (variables de entorno, archivos de config, etc.).

### RNF-05 Calidad y experiencia de usuario

* **RNF-05.1** UI/UX amigable en el frontend (navegación clara y flujo consistente).
* **RNF-05.2** Respuestas correctas y consistentes (manejo de errores y códigos HTTP apropiados en el gateway).

### RNF-06 Observabilidad y mantenibilidad (recomendado para buena nota)

* **RNF-06.1** Logging por servicio (trazabilidad básica de operaciones y errores).
* **RNF-06.2** Estructura de código mantenible (capas, módulos, responsabilidades claras).
* **RNF-06.3** Documentación técnica básica (endpoints REST del gateway, contratos gRPC, modelos y cómo correr/desplegar).
