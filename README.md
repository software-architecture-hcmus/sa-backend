# SOFTWARE - ARCHITECTURE - BACKEND

A Backend is used to save all user, admin and agent information, implement websocket for play quiz game, so on..
## Table of Contents
- [System requirements](#system-requirements)
- [Setup](#setup)
- [Run in Local](#run-in-local)
- [Run with Docker](#run-with-docker)
<!-- - [User manual](#user-manual) -->
## System requirements
List the System requirements needed to run project.
- Redis
- PostgreSQL
- NodeJS

## Setup

###  Configure environment variables (if needed)

``` bash
touch .env
```
In the .env file, fill in the following information
``` bash
PORT=

JWT_SECRET_KEY=

NODE_ENV=development
# NODE_ENV=production

DB_TYPE=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
DB_MAX_CONNECTIONS=         # 100
DB_SSL_ENABLED=             #false
DB_REJECT_UNAUTHORIZED=     #false
REDIS_URL=
```
### Setup PostgreSQL and Redis with Docker
```bash
# Run PostgreSQL and Redis
docker-compose -f db-compose.yml up -d --build

# Down containers
docker-compose -f db-compose.yml down

```
### Migration
```bash
# auto generate migration with entities
yarn migration:generate

# run migrations dev
yarn migration:run:dev

# revert migration:
yarn migration:revert

# run migrations production
yarn migration:run:prod
```
## Run in local
```bash
yarn install
yarn dev
```
## Run with Docker
```bash
docker compose up -d --build
```
