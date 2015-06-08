# Mensaparser in Docker

Docker/Docker-Compose/Fig-Konfiguration, die einen Parser, eine Datenbank und eine API bereitstellt, um die Mensadaten des Studentenwerks Münster maschinenlesbar bereitzustellen.

Verwendung der Daten bei
* [WWU Campusplan App](https://app.uni-muenster.de)
* [OpenMensa](https://openmensa.org/#14/51.9654/7.6059)

## Komponenten

Weitere Infos in den READMEs in den Ordnern der jeweiligen Komponenten.

### db

Docker Container mit PostgreSQL Datenbank v. 9.4 mit `JSONB` Unterstützung.

### api

Docker Container mit NodeJS Webserver, stellt Daten im `JSON` Format bereit.

### parser

Docker Container mit NodeJS Parser, der die Daten in die Datenbank einträgt.

### delaystart.sh Script

Wartet 12 Sekunden, damit der Datenbankcontainer fertig starten kann, bevor die NodeJS Scripte anfangen zu arbeiten.

## Starten

Repository clonen, dann

```bash
cd mensaparser
sudo docker-compose build
sudo docker-compose up # or 'fig up' if you are on an older version of Docker
```

Die Container werden gestartet und ein erster Parser-Durchgang wird angestoßen. Danach wiederholt sich das Parsen jede Sonntag Nacht per Cronjob automatisch.

## Lizenz

Scripte und Configs: MIT Lizenz

Gezeigte (Beispiel-)Daten basieren auf Daten vom [Studentenwerk Münster](http://www.studentenwerk-muenster.de/) und [LODUM Projekt](http://www.lodum.de/).