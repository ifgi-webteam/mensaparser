var ringparser = function(mensa) {
	var moment = require("moment");
	var cheerio = require('cheerio');
	var request = require('request');
	var idList = [ "montag", "dienstag", "mittwoch", "donnerstag", "freitag" ];

	request(mensa.url, function(error, response, html) {
		if(!error && response.statusCode == 200) {
			var $ = cheerio.load(html);

			// Preise abfragen
			// Ergebnisse in Variable preise: preise[1] (Menü 1 Student), preise[2] (Menü 1 Sonst.), preise[3] (Menü 2 Student)... usw
			var content = $("table.contentpaneopen").text();
			var preise = content.match(/Preise\s+Stud. \/ Sonst. Menü I\s+([0-9],[0-9]+) € \/ ([0-9],[0-9]+) €Menü II\s+([0-9],[0-9]+) € \/ ([0-9],[0-9]+) €Menü III\s+([0-9],[0-9]+) € \/ ([0-9],[0-9]+) €/);

			for (weekDay in idList) { // mo, di, mi, do, fr
				// Datum des Tages parsen
				var dateToday = $( '#' + idList[weekDay] ).text().split(" ").pop().replace("\r\n", "");
				
				//for (menu in idList[weekDay]) {
				for(var i = 1; i <= 3; i++) {
					// JSON Objekt für jedes Menü
					var fooditem = {
						"mensa": {
							"name": mensa.name,
							"uid": mensa.uid
						},
						"date": moment(dateToday, "DD.MM.YYYY").format('YYYY-MM-DD'),
						"name": $( '#' + idList[weekDay] + "_menu" + i ).text(),
						"minPrice": preise[i*2-1],
						"maxPrice": preise[i*2]
					};
					console.log(fooditem);
				}
			}
			
		}
	});
}

module.exports.ringparser = ringparser;