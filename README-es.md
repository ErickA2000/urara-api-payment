[Ingles](README.md)

# SERVICIO DE PAGO PARA URARA

Este proyecto se desarrolla con Typescript y luego se transpila a javascript.
El proyecto necesita algunas variables de entorno, mire el archivo`.env.example`.

## Prerrequisitos

1. Nodejs >= v16
2. MongoDB

Opcional

3. Docker. Para ejecutar en contenedor.

## Ejecutar proyecto

1. Instalar dependencias
```shell
$ npm install
```

2. Construir el proyecto

```shell
$ npm run build
```

o

```shell
$ npm run build:watch
```
para escuchar los cambios.

3. Ejecutar

```shell
$ npm run dev
```
para desarrollo

o

```shell
$ npm run start
```
para produccion.

- Opcionalmente
```shell
$ npm run start:build
```
para construir e inmediatamente ejecutar.

## Ejecutar proyecto con Docker

1. Generar imagen
```shell
$ docker build -t name-image:tag .
```
Expone por defecto el puerto `3003`.

2. Ejecutar contenedor
```shell
$ docker run -d -p 3003:3003 --name name-container --env-file .env name-image
```