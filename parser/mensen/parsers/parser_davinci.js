var davinciparser = function(mensa) {
	var parser = require('./parser');
	var request = require('request');

	// process the html data and find the data we are interested in
	request(mensa.url, function(error, response, html) {
		// moment library for date conversion
		var moment = require("moment");
		// cheerio library for html parsing
		var cheerio = require('cheerio');
		// html element id list for parsing & extracting data
		var idList = [ "montag", "dienstag", "mittwoch", "donnerstag", "freitag"]; // freitag extra behandeln unten

		// check if request was successfull (html response code 200)
		if(!error && response.statusCode === 200) {
			var $ = cheerio.load(html);

			var content = $("table.contentpaneopen tr:contains('Montag')").text();

			// Montag-Donnerstag
			// iterate idList as week days
			for (var weekDay in idList) {
				if(idList.hasOwnProperty(weekDay)){
				try {
					// Datum des Tages parsen
					var dateToday = $( '#' + idList[weekDay] ).text().split(" ").pop().replace("\r\n", "");

					// iterate over the 3 daily menus
					for(var i = 1; i <= 3; i++) {
						// Menu 3 / Vegetarisch nicht immer im Angebot
						if($('#' + idList[weekDay] + '_menu' + i).length>0) {
							// Preise variieren pro Tag & Menü
							var preiseToday = $('#' + idList[weekDay] + '_menu' + i + "_preis");
							var preise = ["0", "0"];
							if(preiseToday.text().trim().length > 0) {
								preiseStud = preiseToday.text().match(/Stud\.\s*(\d,\d{2})\s*€/);
								preiseGuest = preiseToday.text().match(/(Sonst|Gäste)\.?\s*(\d,\d{2})\s*€/); 
								if(preiseGuest && preiseStud){
									preise = [ preiseStud[1], preiseGuest[2] ];
								}
							}

							// JSON Objekt für jedes Menü
							var fooditem = {
								"mensa": {
									"name": mensa.name,
									"uid": mensa.uid
								},
								"date": moment(dateToday, "DD.MM.YYYY").format('YYYY-MM-DD'),
								"name": $( '#' + idList[weekDay] + "_menu" + i ).text(),
								"minPrice": parseFloat( preise[0].replace(',','.') ).toFixed(2),
								"maxPrice": parseFloat( preise[1].replace(',','.') ).toFixed(2),
								"menuName": "Menü " + (new Array(i+1)).join('I'),
								"closed": 0
							};

							if( (fooditem.name.toLowerCase().indexOf("geschloss") != -1) ||
								(fooditem.name.toLowerCase().indexOf("keine ausg") != -1)) {
								fooditem.minPrice = "0";
								fooditem.maxPrice = "0";
								fooditem.closed = 1;
							}
							console.log("" + fooditem.date + ": " + fooditem.name + " (" + fooditem.minPrice + "/" + fooditem.maxPrice + ")");
							parser.insertData(fooditem);
						} else {
							// If no data found, assume closed or parsing error and insert nothing
							console.log("No results for "+idList[weekDay]+", assume closed");

							/*
							var fooditem = {
								"mensa": {
									"name": mensa.name,
									"uid": mensa.uid
								},
								"date": moment(dateToday, "DD.MM.YYYY").format('YYYY-MM-DD'),
								"name": "Geschlossen",
								"minPrice": 0,
								"maxPrice": 0,
								"menuName": "Menü " + Array(i+1).join('I'),
								"closed": 1
							};
							console.log("" + fooditem.date + ": " + fooditem.name + " (" + fooditem.minPrice + "/" + fooditem.maxPrice + ")");
							insertData(fooditem);
							*/
						}
					}
				} catch(error) {
					console.log(error);
					console.log("Failed getting menu for "+ '#' + idList[weekDay]);
				} // end try..catch
				} // end if
			} // end for (weekDay in idList)

			// Freitag
			/*
			var contentFri = content.split(/(Freitag\s*[0-9]+\.[0-9]+\.[0-9]+)/);
			var menusFriday = contentFri.pop().split(/Menü III|Menü II|Menü I|Vegetarisches Angebot/);
			menusFriday.forEach(function(e, i, a){
				var menu = e.split(/Stud\./);
				var dateToday = contentFri[1].split(" ").pop();
				if(menu.length>1) {
					if(menu[1]) {
						var preise = menu[1].match(/([0-9],[0-9]{2}).+?\/.+?([0-9],[0-9]{2})?/);
						//console.log(menu[1]);

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
						parser.insertData(fooditem);
					}
				}
			});
			*/

		}
	});
}

module.exports.davinciparser = davinciparser;
