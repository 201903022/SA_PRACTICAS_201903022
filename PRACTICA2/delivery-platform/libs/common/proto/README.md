# Configuracion de archivos ``.proto``

## Instalacion de dependencias 

```bash
pnpm add @grpc/grpc-js @grpc/proto-loader

pnpm add ts-proto
```

## Creacion de archivos proto

Creacion de carpeta a guardar, en este caso: ``./types``.

```bash
mkdir types/
```

### Generacion de los archivos

```bash
npx protoc --ts_proto_out=./types/ ./proto/*.proto --ts_proto_opt=nestJs=true

```
