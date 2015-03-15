# Mensaparser für die Seiten des Studentenwerks Münster

## Über

Weil das Studentenwerk keine Schnittstelle für Entwickler bereitstellt, muss geparst werden.

Bisher implementiert sind:

* [Mensa am Ring](http://www.studentenwerk-muenster.de/de/essen-a-trinken/mensen/mensa-am-ring)
* [Mensa am Aasee](http://www.studentenwerk-muenster.de/de/essen-a-trinken/mensen/mensa-am-aasee)
* [Bistro Denkpause](http://www.studentenwerk-muenster.de/de/essen-a-trinken/bistros-a-cafes/denkpause)
* [Mensa Da Vinci](http://www.studentenwerk-muenster.de/de/essen-a-trinken/mensen/da-vinci)

Jede Mensa hat drei wichtige Merkmale:

```Javascript
var mensa = {
			"name": "Mensa ...",
			"uid": "http://data.uni-muenster.de/context/uniaz/...",
			"url": "http://www.studentenwerk-muenster.de/de/..."
};
```

`name`: Name / Bezeichnung der Mensa.

`uid`: Die ID, wie sie in den [Linked Data](http://www.lodum.de) Datenbanken von LODUM vorkommt. Siehe auch [App der Uni Münster](http://app.uni-muenster.de).

`url`: Adresse des zu parsenden Dokuments auf den Seiten des Studentenwerks.

## Technologie

Eingesetzte Technologien:

* PostgreSQL 9.4 mit `JSON` Unterstützung
* NodeJS mit `cheerio` zum Parsen

## Wie benutzen

PostgreSQL auf localhost starten, Daten in `parser_aasee_ring.js` eintragen und Parser ausführen:

Einzeln:

```bash
cd mensen
nodejs mensen/aasee.js
nodejs mensen/ring.js
// usw.
```

Alle nacheinander:

```bash
cd mensen
nodejs server.js
```