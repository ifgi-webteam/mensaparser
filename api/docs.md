# Mensa API

Query Mensa menus. The following commands are available:

* [/](#-)
* [/all](#-all)
* [/mensen](#-mensen)
* [/menu](#-menu)
* [/menu/:mensa](#-menu-mensa)
* [/openmensa/canteen/:mensa](#-openmensa-canteen-mensa)
* [/openmensa/today/:mensa](#-openmensa-today-mensa)

## /

Show a hint to take a look at /docs

## /all

List the last few database inserts, for debugging purposes.

##/mensen

List all Mensas which have some menu currently available.

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

Get the current menu for all available Mensas, date range from >last Sunday to next <=Sunday.

Example query:

`/menu`

Example response:

```JSON
[
  {
    "id": 1,
    "data": {
      "date": "2015-03-16",
      "name": "Schweineschnitzel \"Jäger Art\"Teigwaren, BIO-Möhren",
      "mensa": {
        "uid": "http://data.uni-muenster.de/context/uniaz/9b3af1a05cbfb372bc205d86760a6afa",
        "name": "Bistro Denkpause"
      },
      "maxPrice": "3,05",
      "minPrice": "2,45"
    }
  },
  {
    "id": 2,
    "data": {
      "date": "2015-03-16",
      "name": "Gemüseragout \"Toscana\" auf Spiralnudeln",
      "mensa": {
        "uid": "http://data.uni-muenster.de/context/uniaz/8ac770e149aa52077f85189c390e9571",
        "name": "Mensa am Ring"
      },
      "maxPrice": "2,90",
      "minPrice": "2,30"
    }
  }
]
```

## /menu/:mensa

Get the current menu for a Mensa specified by the 32 character identifier.

Example query:

`/menu/70ad738c960cc5e88e5e8d8ac1b5975e`

Response format same as `/menu`.


## /openmensa/canteen/:mensa

Example query:

`/openmensa/canteen/70ad738c960cc5e88e5e8d8ac1b5975e`

Get the current week's menu for a Mensa in [OpenMensa Feed v2 XML format](http://doc.openmensa.org/feed/v2/).


## /openmensa/today/:mensa

Example query:

`/openmensa/today/70ad738c960cc5e88e5e8d8ac1b5975e`

Get the today's menu for a Mensa in [OpenMensa Feed v2 XML format](http://doc.openmensa.org/feed/v2/).