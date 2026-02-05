# Documentacion del Proyecto

---

## Backend (lado servidor)

### Tecnologia base: NestJS (Node.js + TypeScript)

El backend del sistema se implemento con **NestJS** como framework principal, aprovechando su enfoque modular para construir una API clara, escalable y facil de mantener.

---

### Motivos de seleccion de NestJS

Se opto por **NestJS** porque ofrece una estructura consistente para proyectos medianos/grandes y promueve buenas practicas desde la arquitectura.

Puntos clave:

- **Diseno por modulos** para separar responsabilidades y ordenar el codigo
- **TypeScript** para tipado fuerte y refactors mas seguros
- **Inyeccion de dependencias** integrada para desacoplar componentes
- **Compatibilidad con microservicios** (si la arquitectura evoluciona)
- **Integracion simple de seguridad** (guards, strategies, validaciones)
- **Estandares y convenciones** que facilitan el trabajo en equipo
- **Base ideal para SOLID** y mantenimiento a largo plazo

Con esto, el backend queda preparado para crecer sin volverse dificil de entender o modificar.

---

### Como se reflejan principios SOLID en el backend

NestJS facilita aplicar SOLID de forma natural por su estructura:

- **SRP (Single Responsibility):** controladores gestionan rutas; servicios concentran la logica de negocio.
- **OCP (Open/Closed):** es facil extender con guards, interceptors o modulos sin tocar lo ya estable.
- **LSP (Liskov Substitution):** estrategias/guards pueden reemplazarse por otras implementaciones sin romper el flujo.
- **ISP (Interface Segregation):** cada modulo expone solo lo necesario, evitando dependencias innecesarias.
- **DIP (Dependency Inversion):** se trabaja con dependencias inyectadas, reduciendo acoplamiento.

Esto mejora la mantenibilidad, las pruebas y la escalabilidad.

---

### Acceso a datos con Prisma (ORM)

Para la persistencia se utiliza **Prisma** como ORM sobre **PostgreSQL**.

Beneficios principales:

- Cliente tipado para TypeScript (menos errores en runtime)
- Migraciones para versionar cambios de esquema
- Consultas claras y consistentes
- Menor riesgo de bugs por consultas mal formadas
- Generacion automatica del cliente de base de datos

Esto hace mas segura y eficiente la gestion de la informacion.

---

### Autenticacion y autorizacion con JWT

La seguridad del backend se basa en **JWT** para validar identidad y permitir control de acceso por roles.

Proceso general:

1. El usuario envia credenciales al endpoint de inicio de sesion.
2. El servidor valida los datos contra la base de datos.
3. Se emite un token JWT con claims esenciales (por ejemplo: `id`, `name`, `role`).
4. El token se entrega al cliente para usarse en solicitudes posteriores.
5. En endpoints protegidos, el backend valida el token y aplica reglas de permisos.

### Uso de Guards en NestJS (JWT y Roles)

En NestJS, los **Guards** son una capa de seguridad que se ejecuta **antes** del controlador y decide si la peticion **puede continuar** o se rechaza. Esto permite centralizar validaciones y no repetir logica en cada endpoint.

**Guards mas comunes:**
- **JwtAuthGuard (autenticacion):** valida que el JWT sea correcto (firma y expiracion) y agrega el usuario al request (ej. `req.user`).


**Flujo en una ruta protegida:**
1. `JwtAuthGuard` valida el token.
2. `RolesGuard` valida el rol.
3. Si ambos pasan, se ejecuta el endpoint.


