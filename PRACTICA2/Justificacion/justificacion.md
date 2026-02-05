# Justificacion de tecnologias elegidas (Backend y Frontend)

**Proyecto:** Delivereats  
**Stack:** Backend **NestJS (TypeScript)** + Frontend **React + Vite**

---

## Contexto del proyecto
Delivereats es una plataforma tipo delivery disenada con **arquitectura de microservicios**, con un **API Gateway** como punto de entrada y servicios separados (autenticacion, catalogo, ordenes, delivery y notificaciones). El proyecto requiere **JWT**, manejo de **roles**, comunicacion **REST** hacia el frontend y **gRPC** entre servicios, ademas de **Docker** y despliegue en nube.

En ese contexto, la seleccion de frameworks no fue “por moda”: se eligio lo que reduce riesgo, mejora la organizacion del codigo y permite crecer sin reescribir el sistema.

---

## Por que se eligio NestJS para el backend

### 1) Porque el proyecto necesita orden desde el dia 1
En microservicios, lo mas caro no es escribir endpoints: es mantener el sistema vivo mientras crece. **NestJS** obliga a una estructura clara (modulos, controladores, servicios, DTOs) y eso evita que el backend se convierta en un conjunto de archivos sueltos sin reglas.

**Resultado:** el codigo se entiende mas facil, se documenta mejor y es mas sencillo agregar features sin romper otras partes.

### 2) Porque TypeScript reduce errores y acelera el desarrollo
Al ser TypeScript-first, NestJS ayuda a detectar fallos temprano (tipos, contratos, refactors). En un sistema con varios servicios y contratos (REST + gRPC), esto es clave.

**Resultado:** menos bugs “tontos”, mejor autocompletado y cambios mas seguros.

### 3) Porque encaja natural con seguridad (JWT + roles)
El proyecto exige **manejo de JWT para sesiones** y proteccion de endpoints sensibles. NestJS lo resuelve con un enfoque limpio usando **Guards**, **strategies** y validacion centralizada.

**Resultado:** no se “parcha” la seguridad en cada endpoint; se aplica como politica del sistema.

### 4) Porque facilita microservicios y gRPC sin reinventar la rueda
Cuando tu arquitectura ya plantea un API Gateway y comunicacion interna, necesitas herramientas que ya contemplen ese mundo. NestJS ofrece soporte directo para patrones de microservicios y **gRPC**, con contratos claros.

**Resultado:** integracion mas limpia entre servicios y menos tiempo perdido en infraestructura.

### 5) Porque mejora pruebas y mantenibilidad
La **inyeccion de dependencias** (DI) hace que los servicios sean mas testeables y desacoplados.

**Resultado:** el proyecto se vuelve mas defendible: puedes explicar decisiones, justificar el comportamiento y demostrar calidad.

---

## Por que se eligio React para el frontend

### 1) Porque la interfaz del delivery es dinamica
Una app tipo delivery no es una pagina estatica: hay listas (restaurantes, menus), estados (carrito, orden en proceso), formularios (registro/login) y pantallas que cambian con frecuencia.

**React** se basa en componentes reutilizables, lo que permite construir una UI consistente y escalable.

**Resultado:** interfaz coherente, facil de mantener y con menos duplicacion.

### 2) Porque encaja bien con consumo de APIs
El frontend necesita consumir el API Gateway y manejar sesion (token). React tiene un ecosistema amplio para rutas, manejo de estado, validacion de formularios y patrones comunes de consumo de API.

**Resultado:** integracion fluida con el backend sin complicar la arquitectura.

### 3) Porque es una apuesta segura
React es estandar en la industria. Si alguien nuevo entra al proyecto, es mas probable que ya lo conozca.

**Resultado:** menos curva de aprendizaje y mejor trabajo en equipo.

---

## Por que se eligio Vite

### 1) Porque el tiempo de desarrollo importa
Vite mejora el flujo de trabajo con **recarga en caliente rapida (HMR)** y tiempos de arranque muy bajos.

**Resultado:** iteras mas rapido, pruebas mas rapido y avanzas mas en menos tiempo.

### 2) Porque genera builds modernos y optimizados
Vite produce bundles eficientes para produccion sin complicar la configuracion.

**Resultado:** mejor rendimiento y menos friccion al desplegar.

---

## Manejo y uso de JWT (resumido)

### Que es y para que se usa
Un **JWT (JSON Web Token)** es una credencial digital firmada que permite identificar al usuario y **autorizar** solicitudes sin manejar sesiones en el servidor (enfoque *stateless*).

### Flujo en el sistema (login → consumo)
1. **Login (Auth-Service):** valida email/contrasena y genera un **Access Token** (corto) y opcionalmente un **Refresh Token** (largo).
2. **Frontend:** envia el access token en cada request al API Gateway mediante:
   - `Authorization: Bearer <access_token>`
3. **API Gateway:** valida firma y expiracion del token; si es valido, enruta la solicitud al microservicio correspondiente.

### Access vs Refresh Token
- **Access Token:** corta duracion (minutos/horas). Se usa para acceder a endpoints protegidos.
- **Refresh Token:** mayor duracion (dias/semanas). Se usa para emitir un nuevo access token cuando el anterior expira, sin volver a iniciar sesion.

### Buenas practicas clave
- Access token con **TTL corto**.
- Refresh token con **rotacion y revocacion** (logout invalida).
- No incluir datos sensibles en el JWT (solo claims basicos como `sub`, `email`, `role`).
- Usar **HTTPS** siempre.
