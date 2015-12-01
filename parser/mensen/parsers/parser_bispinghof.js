var bispinghofparser = function(mensa) {
	var parser = require('./parser');
	var request = require('request');

	// process the html data and find the data we are interested in
	request(mensa.url, function(error, response, html) {
		// moment library for date conversion
		var moment = require("moment");
		// cheerio library for html parsing
		var cheerio = require('cheerio');
		// html element id list for parsing & extracting data
		var idList = [ "montag", "dienstag", "mittwoch", "donnerstag", "freitag" ];

		// check if request was successfull (html response code 200)
		if(!error && response.statusCode === 200) {
			var $ = cheerio.load(html);

			var content = $("table.contentpaneopen").text();
			//console.log(content);

			// calculate the weekday dates from the title 
			// because there's only 1 food plan for the whole week
			var dateString = $("td#woche").text().trim();
			var weekDates = dateString.match(/Wochenspeiseplan\s+([0-9]{2}\.[0-9]{2}\.[0-9]{4}).+([0-9]{2}\.[0-9]{2}\.[0-9]{4})/);

			//weekDates[1] // monday
			//weekDates[2] // friday
			var monday = moment(weekDates[1], "DD.MM.YYYY");

			for(var i = 0; i < 5; i++) {
				var dateToday = moment(monday).add(i, 'days');
				//console.log(moment(today).format('YYYY-MM-DD'));

				// iterate over the 3 daily menus
				for(var j = 1; j <= 3; j++) {
					var preiseToday = $('#menu' + j + "_preis");
					var preise = ["0", "0"];
					if(preiseToday.text().trim().length > 0) {
						preise = preiseToday.text().match(/([0-9],[0-9]{2})/g);// /Stud\.\s*(\d,\d{2})\s*€\/\s*Bedienst\.\s*(\d,\d{2})\s*€\/Gäste\s*(\d,\d{2})\s*€/g
						console.log(preiseToday.text().trim());
					}

					// JSON Objekt für jedes Menü
					var fooditem = {
						"mensa": {
							"name": mensa.name,
							"uid": mensa.uid
						},
						"date": moment(dateToday, "DD.MM.YYYY").format('YYYY-MM-DD'),
						"name": $( '#menu' + j + '_menu' ).text(),
						"minPrice": parseFloat( preise[0].replace(',','.') ).toFixed(2),
						"maxPrice": parseFloat( preise[1].replace(',','.') ).toFixed(2),
						"menuName": "Menü " + Array(j+1).join('I'),
						"closed": 0
					};
					if( (fooditem.name.toLowerCase().indexOf("geschloss") !== -1) ||
						(fooditem.name.toLowerCase().indexOf("keine ausg") !== -1)) {
						fooditem.minPrice = "0";
						fooditem.maxPrice = "0";
						fooditem.closed = 1;
					}
					console.log("" + fooditem.date + ": " + fooditem.name + " (" + fooditem.minPrice + "/" + fooditem.maxPrice + ")");
					parser.insertData(fooditem);
				}
			}			
		}
	});
}

module.exports.bispinghofparser = bispinghofparser;
