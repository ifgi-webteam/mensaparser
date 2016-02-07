# Mensaparser in Docker

[![Dependency Status](https://gemnasium.com/chk1/mensaparser.svg)](https://gemnasium.com/chk1/mensaparser)
[![Code Climate](https://codeclimate.com/github/chk1/mensaparser/badges/gpa.svg)](https://codeclimate.com/github/chk1/mensaparser)
[![Build Status](https://travis-ci.org/chk1/mensaparser.svg?branch=master)](https://travis-ci.org/chk1/mensaparser)

Docker-Compose-Konfiguration, die einen Parser, eine Datenbank und eine API bereitstellt, um die Mensadaten des Studentenwerks Münster maschinenlesbar bereitzustellen.

Aktuell werden die Daten verwendet bei:
* [WWU Campusplan App](https://app.uni-muenster.de)
* [OpenMensa](https://openmensa.org/#14/51.9654/7.6059)

## Komponenten

Weitere Infos in den READMEs in den Ordnern der jeweiligen Komponenten.

### db

Docker Container mit PostgreSQL Datenbank v. 9.4 mit `JSONB` Unterstützung, der die geparsten Daten speichert.

### api

Docker Container mit NodeJS Webserver, stellt Daten im `JSON` bzw. XML-Format für die Nutzung bereit.

### parser

Docker Container mit NodeJS Parser, der die Mensadaten vom Studentenwerk abruft in die Datenbank einträgt.

## Starten

Repository clonen, dann

```bash
cd mensaparser
sudo docker-compose build
sudo docker-compose up
```

Die Container werden gestartet und ein erster Parser-Durchgang wird angestoßen. Danach wiederholt sich das Parsen jede Sonntag Nacht per Cronjob automatisch.

## Lizenz

Scripte und Configs: MIT Lizenz

Gezeigte (Beispiel-)Daten basieren auf Daten vom [Studentenwerk Münster](http://www.studentenwerk-muenster.de/) und [LODUM Projekt](http://www.lodum.de/).
