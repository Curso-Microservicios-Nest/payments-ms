<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 🐳 Docker

```sh
# Crear el contenedor de NATS
docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats
```

```sh
# Crear la imagen de producción
docker build -f Dockerfile.prod -t payments-ms .
```
