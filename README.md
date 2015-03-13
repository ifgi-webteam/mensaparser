# Mensaparser in Docker

Docker/Fig Konfiguration, die einen Parser, eine Datenbank und eine API bereitstellt, um die Mensadaten des Studentenwerks Münster maschinenlesbar bereitzustellen.

## Komponenten

Weitere Infos in den READMEs in den Ordnern der Komponenten.

### db

Docker Container mit PostgreSQL Datenbank v. 9.4 mit `JSONB` Unterstützung.

### api

Docker Container mit NodeJS Webserver

### parser

Docker Container mit NodeJS Parser

### delaystart.sh

Wartet 12 Sekunden, damit der Datenbankcontainer fertig starten kann, bevor die NodeJS Server anfangen zu arbeiten.

## Starten

```bash
npm install
sudo fig up
```