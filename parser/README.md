# Mensaparser für die Seiten des Studentenwerks Münster

## Über

Weil das Studentenwerk keine Schnittstelle für Entwickler bereitstellt, muss geparst werden.

Bisher implementiert:

* [Mensa am Ring](http://www.studentenwerk-muenster.de/de/essen-a-trinken/mensen/mensa-am-ring)
* [Mensa am Aasee](http://www.studentenwerk-muenster.de/de/essen-a-trinken/mensen/mensa-am-aasee)

Jede Mensa hat drei wichtige Merkmale:

```Javascript
var mensa = {
			"name": "Mensa ...",
			"uid": "http://data.uni-muenster.de/context/uniaz/...",
			"url": "http://www.studentenwerk-muenster.de/de/..."
};
```

`name`: Name / Bezeichnung
`uid`: Die ID, wie sie in den (Linked Data)[http://www.lodum.de] Datenbanken vorkommt
`url`: Adresse des zu parsenden Dokuments

## Technologie

Eingesetzte Technologien:

* PostgreSQL 9.4 mit `JSONB` Unterstützung
* NodeJS mit `cheerio` zum Parsen

## Wie benutzen

PostgreSQL auf localhost starten, Daten in `parser_aasee_ring.js` eintragen und Parser ausführen:

```bash
cd mensen
nodejs aasee.js
nodejs ring.js
```

## Lizenz

MIT