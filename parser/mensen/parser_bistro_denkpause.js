// main method for module export & start point
var bistroparser = function(mensa){
	var request = require('request');
	request(mensa.url, process);

	// PostgreSQL
	var pg = require('pg');
	var conString = "postgres://docker:docker123@db/docker";
	var client = new pg.Client(conString);
	// asynchronous database requests counter to know when to disconnect
	var requestCounter = 0;

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
		var idList = [ "montag", "dienstag", "mittwoch", "donnerstag", "freitag" ];

		// check if request was successfull (html response code 200)
		if(!error && response.statusCode == 200) {
			var $ = cheerio.load(html, { normalizeWhitespace: true });
			var contentElement = $("table.contentpaneopen");

			// Preise abfragen
			// Ergebnisse in Variable preise: 
			// preise[0] (Menü 1 Student), 
			// preise[1] (Menü 1 Sonst.), 
			// preise[2] (Menü 2 Student), 
			// preise[3] (Menü 2 Sonst.), 
			// preise[4] (Menü 3 Student),
			// preise[5] (Menü 3 Sonst.),
			// preise[6] (Eintopf Student),
			// preise[7] (Eintopf Sonst.)
			var preiseMatch = contentElement.text().match(/([0-9],[0-9]{2}) €\/Sonst. ([0-9],[0-9]{2})/g);
			var preisePartials = [];
			var preise = [];
			preiseMatch.forEach(function(el, index, array){
				var parts = el.match(/([0-9],[0-9]{2}) €\/Sonst. ([0-9],[0-9]{2})/);
				preisePartials.push(parts[1]);
				preisePartials.push(parts[2]);
			});
			preise[0] = preisePartials[0];
			preise[1] = preisePartials[1];
			preise[2] = preisePartials[0];
			preise[3] = preisePartials[1];
			preise[4] = preisePartials[2];
			preise[5] = preisePartials[3];
			preise[6] = preisePartials[4];
			preise[7] = preisePartials[5];
			//console.log("Preise: ", preisePartials, preise);

			// Tägliche Menüs
			var weekdayTables = contentElement.text().split(/((Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag) [0-9]+\.[0-9]+\.[0-9]+)/);

			// contentElement.text().split() produziert ein Array, welches 3x die Länge
			// der Wochentage hat, also 3x 6 Tage = 18 Einträge
			// deshalb hier wieder geteilt durch 3
			for(var i=1; i<= weekdayTables.length/3 ; i++){
				var dateToday = weekdayTables[i*3-2].split(" ").pop(); // Teil nach " "
				var menusTodayAll = weekdayTables[i*3];

				// III, II, I in absteigender Reihenfolge
				var menusToday = menusTodayAll.split(/Menü III|Menü II|Menü I|Eintopf/)
					.filter(function(el){
						// leere Elemente rausfiltern
						return el.trim().length!=0;
					});

				// Ergebnis ist ein Array mit 3 oder 4 Einträgen:
				// Menü I, II, III, Eintopf (Eintopf wird nicht jeden Tag angeboten)
				//console.log( dateToday, menusToday );

				["Menü I", "Menü II", "Menü III", "Eintopf"].forEach(function(el, index, array){
					// JSON Objekt für jedes Menü
					if(menusToday[index]){ // index-Nummern stimmen mit index von menusToday & preise überein
						var fooditem = {
							"mensa": {
								"name": mensa.name,
								"uid": mensa.uid
							},
							"date": moment(dateToday, "DD.MM.YYYY").format('YYYY-MM-DD'),
							"name": menusToday[index].trim(),
							"minPrice": parseFloat( preise[index*2].replace(',','.') ).toFixed(2),
							"maxPrice": parseFloat( preise[index*2+1].replace(',','.') ).toFixed(2),
							"menuName": el,
							"closed": 0
							};

						if(fooditem.name.toLowerCase().indexOf("geschloss") != -1
							|| fooditem.name.toLowerCase().indexOf("keine ausg") != -1) {
							fooditem.minPrice = "0";
							fooditem.maxPrice = "0";
							fooditem.closed = 1;
						}

						if(fooditem.name.indexOf("Änderungen vorb")) {
							fooditem.name = fooditem.name.split("Änderungen vorb")[0].trim();
						}
						
						console.log("" + fooditem.date + ": " + fooditem.name + " (" + fooditem.minPrice + "/" + fooditem.maxPrice + ")");
						insertData(fooditem);
					}
				});
			}
		}
	}
}
module.exports.bistroparser = bistroparser;
