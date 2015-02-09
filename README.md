# Mensaparser in Docker

## Komponenten

### db

PostgreSQL Datenbank mit `JSONB`

### api

NodeJS Webserver

### parser

NodeJS Parser

### delaystart.sh

Wartet 12 Sekunden, damit der Datenbankcontainer fertig starten kann, bevor die NodeJS Server anfangen zu arbeiten.

## Starten

```bash
npm install
sudo fig up
```