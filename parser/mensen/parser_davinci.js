// main method for module export & start point
var davinciparser = function(mens) {
	var request = require('request');
	var mensa = mens;
	request(mensa.url, process);

	// PostgreSQL
	var pg = require('pg');
	var conString = "postgres://docker:docker123@db/docker";
	var client = new pg.Client(conString);
	// asynchronous database requests counter to know when to disconnect
	var requestCounter = 0;
	// initialize empty mensa object, to be filled by main ringparser() method
	var mensa = new Object();

	// connect to PostgreSQL database
	client.connect(function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}
		console.log('Connected to database');
	});

	// disconnect from PostgreSQL database
	function disconnect() {
		console.log("Disconnecting from database");
		client.end();
	}

	// insert data into PostgreSQL database
	function insertData(toInsert) {
		var fooditem = toInsert;
		requestCounter++;
		console.log("" + requestCounter + " -> calling db insert");
		
		client.query('INSERT INTO menus (data) VALUES ($1)', [fooditem], function(err, result) {
			requestCounter--;
			console.log("" + requestCounter + " -> inserted");

			// no more database requests to be filled, disconnect
			if(requestCounter===0) {
				disconnect();
			}

			if(err) {
				return console.error('error running query', err);
			}		
			//console.log(requestCounter);
			//console.log(result);
		});
	}

	// process the html data and find the data we are interested in
	function process(error, response, html) {
		// moment library for date conversion
		var moment = require("moment");
		// cheerio library for html parsing
		var cheerio = require('cheerio');
		// html element id list for parsing & extracting data
		var idList = [ "montag", "dienstag", "mittwoch", "donnerstag"]; // freitag extra behandeln unten

		// check if request was successfull (html response code 200)
		if(!error && response.statusCode == 200) {
			var $ = cheerio.load(html);

			var content = $("table.contentpaneopen tr:contains('Montag')").text();;

			// Montag-Donnerstag
			// iterate idList as week days
			for (weekDay in idList) {
				// Datum des Tages parsen
				var dateToday = $( '#' + idList[weekDay] ).text().split(" ").pop().replace("\r\n", "");

				// iterate over the 3 daily menus
				for(var i = 1; i <= 3; i++) {
					// Menu 3 / Vegetarisch nicht immer im Angebot
					if($('#' + idList[weekDay] + '_menu' + i)) {
						// Preise variieren pro Tag & Menü
						var preiseToday = $('#' + idList[weekDay] + '_menu' + i + "_preis").text();
						var preise = [0,0];
						if(preiseToday.trim().length > 0) {
							preise = preiseToday.match(/([0-9],[0-9]{2})/g);
						}
						console.log("Preise: ", preise);

						// JSON Objekt für jedes Menü
						var fooditem = {
							"mensa": {
								"name": mensa.name,
								"uid": mensa.uid
							},
							"date": moment(dateToday, "DD.MM.YYYY").format('YYYY-MM-DD'),
							"name": $( '#' + idList[weekDay] + "_menu" + i ).text(),
							"minPrice": preise[0],
							"maxPrice": preise[1]
						};
						console.log("" + fooditem.date + ": " + fooditem.name + " (" + fooditem.minPrice + "/" + fooditem.maxPrice + ")");
						insertData(fooditem);
					}

				}
			}

			// Freitag
			var contentFri = content.split(/(Freitag [0-9]+\.[0-9]+\.[0-9]+)/);
			var menusFriday = contentFri.pop().split(/Menü III|Menü II|Menü I|Vegetarisches Angebot/);
			menusFriday.forEach(function(e, i, a){
				var menu = e.split("Stud.");
				var dateToday = contentFri[1].split(" ").pop();
				if(menu.length>1) {
					
					if(menu[1]) {
						var preise = menu[1].match(/([0-9],[0-9]{2}).+?\/.+?([0-9],[0-9]{2}) /);

						// JSON Objekt für jedes Menü
						var fooditem = {
							"mensa": {
								"name": mensa.name,
								"uid": mensa.uid
							},
							"date": moment(dateToday, "DD.MM.YYYY").format('YYYY-MM-DD'),
							"name": menu[0].trim(),
							"minPrice": preise[1],
							"maxPrice": preise[2]
						};
						console.log("" + fooditem.date + ": " + fooditem.name + " (" + fooditem.minPrice + "/" + fooditem.maxPrice + ")");
						insertData(fooditem);
					}
				}
			});

		}
	}
}

module.exports.davinciparser = davinciparser;
