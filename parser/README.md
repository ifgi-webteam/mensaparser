# Mensaparser für die Seiten des Studentenwerks Münster

## Über

Weil das Studentenwerk keine Schnittstelle für Entwickler bereitstellt, muss geparst werden.

Bisher implementiert sind:

* [Mensa am Ring](http://www.studentenwerk-muenster.de/de/essen-a-trinken/mensen/mensa-am-ring)
* [Mensa am Aasee](http://www.studentenwerk-muenster.de/de/essen-a-trinken/mensen/mensa-am-aasee)
* [Bistro Denkpause](http://www.studentenwerk-muenster.de/de/essen-a-trinken/bistros-a-cafes/denkpause)
* [Mensa Da Vinci](http://www.studentenwerk-muenster.de/de/essen-a-trinken/mensen/da-vinci)
* [Mensa Bispinghof](http://www.studentenwerk-muenster.de/essen-a-trinken/mensen/bispinghof)

Jede Mensa wird mit drei Merkmalen angelegt:

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
* NodeJS mit `cheerio` zum Parsen, weitere Libraries in der [package.json](package.json)
* [go-cron](https://github.com/robfig/cron) zum anstoßen des wöchentlichen Parsens

## Wie benutzen?

Auf dem manuellen Wege: PostgreSQL auf dem lokalen Rechner starten, den eigenen Datenbank-Login in die `parser_*.js` Dateien eintragen und dann den Parser ausführen:

Einzelne Parser ausführen:

```bash
cd mensen
nodejs mensen/aasee.js
nodejs mensen/ring.js
// usw.
```

Alle Parser nacheinander ausführen mit `server.js`:

```bash
cd mensen
nodejs server.js
```