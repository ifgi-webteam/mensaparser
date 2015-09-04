# Mensa API

Query Mensa Münster (student canteens) food data. The following commands are available:

* [/](#-)
* [/all](#-all)
* [/mensen](#-mensen)
* [/menu](#-menu)
* [/menu/:mensa](#-menu-mensa)
* [/openmensa/canteen/:mensa](#-openmensa-canteen-mensa)
* [/openmensa/today/:mensa](#-openmensa-today-mensa)

## /

Show a hint to take a look at /docs.

## /all

List the last few database inserts, for debugging purposes.

## /mensen

List all canteens which have some menu currently available.

Example query:

`/mensen`

Example response:

```JSON
[
  {
    "mensa": {
      "uid": "http://data.uni-muenster.de/context/uniaz/70ad738c960cc5e88e5e8d8ac1b5975e",
      "name": "Mensa am Aasee"
    }
  },
  {
    "mensa": {
      "uid": "http://data.uni-muenster.de/context/uniaz/9b3af1a05cbfb372bc205d86760a6afa",
      "name": "Bistro Denkpause"
    }
  }
]
```

## /menu

Get the current menu for all available canteens, date range from >last Sunday to ≤next Sunday.

Example query:

`/menu`

Example response:

```JSON
[
  {
    "data": {
      "date": "2015-06-03",
      "name": "Keine Ausgabe",
      "mensa": {
        "uid": "http://data.uni-muenster.de/context/uniaz/9b3af1a05cbfb372bc205d86760a6afa",
        "name": "Bistro Denkpause"
      },
      "closed": 1,
      "maxPrice": "0",
      "menuName": "Menü III",
      "minPrice": "0"
    }
  },
  {
    "data": {
      "date": "2015-06-02",
      "name": "Nudel-Gemüseauflauf in Käse-Kräutersauce ",
      "mensa": {
        "uid": "http://data.uni-muenster.de/context/uniaz/70ad738c960cc5e88e5e8d8ac1b5975e",
        "name": "Mensa am Aasee"
      },
      "closed": 0,
      "maxPrice": "2.90",
      "menuName": "Menü I",
      "minPrice": "2.30"
    }
  }
]
```

## /menu/:mensa

Get the current menu for a canteen specified by the 32 character identifier.

Example query:

`/menu/70ad738c960cc5e88e5e8d8ac1b5975e`

Response format is the same as [`/mensen`](#-mensen).


## /openmensa/canteen/:mensa

Get the current week's menu for a canteen in [OpenMensa Feed v2 XML format](http://doc.openmensa.org/feed/v2/).

Example query:

`/openmensa/canteen/70ad738c960cc5e88e5e8d8ac1b5975e`


## /openmensa/today/:mensa

Get today's menu for a canteen in [OpenMensa Feed v2 XML format](http://doc.openmensa.org/feed/v2/).

Example query:

`/openmensa/today/70ad738c960cc5e88e5e8d8ac1b5975e`