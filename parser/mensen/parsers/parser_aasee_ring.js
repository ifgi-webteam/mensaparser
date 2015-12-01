var ringparser = function(mensa) {
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

			// Preise abfragen
			// Ergebnisse in Variable preise: 
			// preise[0] komplettes pattern match
			// preise[1] (Menü 1 Student), 
			// preise[2] (Menü 1 Sonst.), 
			// preise[3] (Menü 2 Student),
			// preise[4] (Menü 2 Sonst.),
			// preise[5] (Menü 3 Student),
			// preise[6] (Menü 3 Sonst.)
			var content = $("table.contentpaneopen").text();
			//console.log(content);
			//var preise = content.match(/[0P]reise\s*Stud.\s*\/\s*Sonst.\s*Menü\s*I\s*([0-9],[0-9]+)\s*€\s*\/\s*([0-9],[0-9]+)\s*€\s*Menü\s*II\s*([0-9],[0-9]+)\s*€\s*\/\s*([0-9],[0-9]+)\s*€\s*Menü\s*III\s*([0-9],[0-9]+)\s*€\s*\/\s*([0-9],[0-9]+)\s*€/);
			var preiseI = content.match(/Menü\s*I\s*(\d,\d+)\s*€\s*\/\s*(\d,\d+)\s*€\s*(\d,\d+)\s*€\s*\/\s*(\d,\d+)\s*€\s*\/\s*(\d,\d+)\s*€/);
			var preiseII = content.match(/Menü\s*II\s*(\d,\d+)\s*€\s*\/\s*(\d,\d+)\s*€\s*(\d,\d+)\s*€\s*\/\s*(\d,\d+)\s*€\s*\/\s*(\d,\d+)\s*€/);
			var preiseIII = content.match(/Menü\s*III\s*(\d,\d+)\s*€\s*\/\s*(\d,\d+)\s*€\s*(\d,\d+)\s*€\s*\/\s*(\d,\d+)\s*€\s*\/\s*(\d,\d+)\s*€/);

			var preise = [ preiseI[3], preiseI[5],
				preiseII[3], preiseII[5],
				preiseIII[3], preiseIII[5] ];
			//console.log(preise);

			// iterate idList as week days
			for (var weekDay in idList) { // mo, di, mi, do, fr
				if(idList.hasOwnProperty(weekDay)){
					// Datum des Tages parsen
					var dateToday = $( '#' + idList[weekDay] ).text().split(" ").pop().replace("\r\n", "");
					
					// iterate over the 3 daily menus
					for(var i = 1; i <= 3; i++) {
						// JSON Objekt für jedes Menü
						var fooditem = {
							"mensa": {
								"name": mensa.name,
								"uid": mensa.uid
							},
							"date": moment(dateToday, "DD.MM.YYYY").format('YYYY-MM-DD'),
							"name": $( '#' + idList[weekDay] + "_menu" + i ).text(),
							"minPrice": parseFloat( preise[i*2-2].replace(',','.') ).toFixed(2),
							"maxPrice": parseFloat( preise[i*2-1].replace(',','.') ).toFixed(2),
							"menuName": "Menü " + (new Array(i+1)).join('I'),
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
		}
	});
}

module.exports.ringparser = ringparser;
