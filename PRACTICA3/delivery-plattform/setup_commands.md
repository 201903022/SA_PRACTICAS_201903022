# Inicializacion de delivery-platform (NestJS + microservicios + pnpm)

- [Inicializacion de delivery-platform (NestJS + microservicios + pnpm)](#inicializacion-de-delivery-platform-nestjs--microservicios--pnpm)
  - [1. Prerrequisitos](#1-prerrequisitos)
  - [2. Creacion del proyecto base](#2-creacion-del-proyecto-base)
  - [3. Creacion de aplicaciones (API Gateway y microservicios)](#3-creacion-de-aplicaciones-api-gateway-y-microservicios)
  - [4. Creacion de libreria compartida](#4-creacion-de-libreria-compartida)
  - [5. Eliminacion de la aplicacion inicial](#5-eliminacion-de-la-aplicacion-inicial)
  - [6. Correccion de configuracion del workspace (nest-cli.json)](#6-correccion-de-configuracion-del-workspace-nest-clijson)
    - [6.1 Problema observado](#61-problema-observado)
    - [6.2 Causa](#62-causa)
    - [6.3 Solucion aplicada](#63-solucion-aplicada)
  - [7. Ajuste de scripts de ejecucion (package.json)](#7-ajuste-de-scripts-de-ejecucion-packagejson)
  - [8. Limpieza de build y ejecucion](#8-limpieza-de-build-y-ejecucion)
  - [9. Estructura final esperada](#9-estructura-final-esperada)
  - [11. Dependencias instaladas](#11-dependencias-instaladas)
    - [11.1 Dependencias globales (entorno)](#111-dependencias-globales-entorno)
    - [11.2 Dependencias del proyecto (runtime)](#112-dependencias-del-proyecto-runtime)
    - [11.3 Dependencias para autenticacion y JWT (runtime)](#113-dependencias-para-autenticacion-y-jwt-runtime)
    - [11.4 Tipos TypeScript](#114-tipos-typescript)
    - [11.5 Prisma (opcional, para persistencia en el Auth Service)](#115-prisma-opcional-para-persistencia-en-el-auth-service)

## 1. Prerrequisitos

Instalar las herramientas globales necesarias:

```bash
npm i -g pnpm @nestjs/cli
```

## 2. Creacion del proyecto base

Crear el proyecto principal con pnpm e instalar dependencias:

```bash
nest new delivery-platform --package-manager pnpm
cd delivery-platform
pnpm install
```

Resultado esperado: el proyecto queda listo para generar aplicaciones (apps) y librerias (libs) dentro del mismo repositorio.

## 3. Creacion de aplicaciones (API Gateway y microservicios)

Generar el API Gateway y los microservicios iniciales:

```bash
nest g app api-gateway
nest g app auth-service
```

Opcionalmente, pueden generarse mas servicios siguiendo el mismo patron:

```bash
# nest g app orders-service
# nest g app delivery-service
```

## 4. Creacion de libreria compartida

Crear una libreria para componentes reutilizables (DTOs, guards, decorators, constantes y utilidades):

```bash
nest g lib common
```

Durante la creacion, el CLI solicita un prefijo para la libreria. Se recomienda `@app` para estandarizar imports como `@app/common`.

## 5. Eliminacion de la aplicacion inicial

`nest new` crea una aplicacion inicial por defecto. Si el punto de entrada real sera `api-gateway`, se recomienda eliminar dicha app para evitar confusion:

```bash
rm -rf apps/delivery-platform
```

## 6. Correccion de configuracion del workspace (nest-cli.json)

### 6.1 Problema observado

Al ejecutar:

```bash
pnpm run start:dev
```

Nest intentaba iniciar el proyecto por defecto previamente asociado a la app eliminada, generando el error:

* `Cannot find module .../dist/main`

### 6.2 Causa

El `defaultProject` y/o el `sourceRoot` global del workspace seguian apuntando a la aplicacion eliminada (delivery-platform), o el proyecto aun existia en la seccion `projects`.

### 6.3 Solucion aplicada

Actualizar `nest-cli.json` para:

* Establecer `defaultProject` en `api-gateway`.
* Ajustar `sourceRoot` global a `apps/api-gateway/src`.
* Eliminar cualquier referencia a `delivery-platform` dentro de `projects`.
* Evitar fijar un `tsConfigPath` global amarrado a una app eliminada.

## 7. Ajuste de scripts de ejecucion (package.json)

Para evitar que `start:dev` arranque un proyecto equivocado, se recomendo ejecutar explicitamente el gateway.

Ejemplo de scripts recomendados:

```json
{
  "scripts": {
    "start:dev": "nest start api-gateway --watch",
    "start:dev:gateway": "nest start api-gateway --watch",
    "start:dev:auth": "nest start auth-service --watch",
    "build": "nest build"
  }
}
```

## 8. Limpieza de build y ejecucion

Eliminar el directorio de salida y levantar las aplicaciones en modo desarrollo:

```bash
rm -rf dist
pnpm run start:dev
```

Para ejecutar el microservicio de autenticacion:

```bash
pnpm run start:dev:auth
```

## 9. Estructura final esperada

```text
delivery-platform/
├── apps/
│   ├── api-gateway/
│   └── auth-service/
├── libs/
│   └── common/
├── nest-cli.json
├── package.json
└── tsconfig.json
```

## 11. Dependencias instaladas

### 11.1 Dependencias globales (entorno)

Se instalaron herramientas globales para la creacion y administracion del workspace:

* `pnpm`
* `@nestjs/cli`

Comando ejecutado:

```bash
npm i -g pnpm @nestjs/cli
```

### 11.2 Dependencias del proyecto (runtime)

Dependencias agregadas para habilitar microservicios, configuracion por variables de entorno y validacion de DTOs:

* `@nestjs/microservices`
* `@nestjs/config`
* `class-validator`
* `class-transformer`

Comandos ejecutados:

```bash
pnpm add @nestjs/microservices @nestjs/config
pnpm add class-validator class-transformer
```

### 11.3 Dependencias para autenticacion y JWT (runtime)

Dependencias agregadas para autenticacion basada en JWT y hashing seguro de contraseñas:

* `@nestjs/jwt`
* `@nestjs/passport`****
* `passport`
* `passport-jwt`
* `bcrypt`

Comando ejecutado:

```bash
pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
```

### 11.4 Tipos TypeScript

Tipados instalados para mejorar el soporte de TypeScript durante el desarrollo:

* `@types/bcrypt`
* `@types/passport-jwt`

Comando ejecutado:

```bash
pnpm add -D @types/bcrypt @types/passport-jwt
```

### 11.5 Prisma (opcional, para persistencia en el Auth Service)

Dependencias agregadas para ORM y cliente de base de datos:

* `prisma`
* `@prisma/client`

Comando ejecutado:

```bash
pnpm add prisma @prisma/client
```
