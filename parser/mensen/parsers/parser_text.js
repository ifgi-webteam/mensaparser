var textParser = function(mensa) {
	var parser = require('./parser');
	var request = require('request');
	var moment = require("moment");

	function submitJson(menuDate, menuType, menuName, menuPrices) {
		var fooditem = {
			"mensa": {
				"name": mensa.name,
				"uid": mensa.uid
			},
			"date": moment(menuDate, "DD.MM.YYYY").format('YYYY-MM-DD'),
			"name": menuName,
			"minPrice": parseFloat( menuPrices[0].replace(',','.') ).toFixed(2),
			"maxPrice": parseFloat( menuPrices[1].replace(',','.') ).toFixed(2),
			"menuName": menuType,
			"closed": 0
		};

		if( (fooditem.name.toLowerCase().indexOf("geschloss") != -1) ||
			(fooditem.name.toLowerCase().indexOf("keine ausg") != -1)) {
			fooditem.minPrice = "0";
			fooditem.maxPrice = "0";
			fooditem.closed = 1;
		}
		console.log(""+ fooditem.date + " " + fooditem.menuName + ": " + fooditem.name + " (" + fooditem.minPrice + "/" + fooditem.maxPrice + ")");
		parser.insertData(fooditem);
	}

	// process the html data and find the data we are interested in
	request(mensa.url, function(error, response, html) {
		// cheerio library for html parsing
		var cheerio = require('cheerio');
		// html element id list for parsing & extracting data
		var weekdaysGer = [ "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"]; // freitag extra behandeln unten

		// check if request was successfull (html response code 200)
		if(!error && response.statusCode === 200) {
			var $ = cheerio.load(html);

			$("table.contentpaneopen br").replaceWith("\n");
			var content = $("table.contentpaneopen").text();
			var contentByLine = content.split(/(?:\r)?\n/)

			// trim every entry
			for(var i in contentByLine) {
				contentByLine[i] = contentByLine[i].trim();
			}
			// remove empty entries
			contentByLine = contentByLine.filter(function(value){
				return value!=='';
			});
			console.log(contentByLine);

			// kind-of state machine for parsing each line of the menu
			var inContent = true;
			var menuDate = null;
			var menuType = null;
			var menuName = null;
			var menuPrices = null;
			var menuPricesGlobal = {};
			var endString = "In den Menüpreisen";
			try {
				for(var i=0; i < contentByLine.length; i++) {
					var s = contentByLine[i].trim();

					if(!inContent) break;

					if((_pricing = contentByLine[i].match(/(Menü (III|II|I)|Tagesaktion|Eintopf)\s*(\d,\d{2})\s*€\s*\/\s*(\d,\d{2})\s*€\s*\/\s*(\d,\d{2})\s*€/i))) {
						if(menuPricesGlobal[_pricing[1].toLowerCase()] && _pricing[1].toLowerCase() == "menü ii"){
							// did someone accidentally write down prices for Menu II twice?
							_pricing[1] = "menü iii";
						}
						menuPricesGlobal[_pricing[1].toLowerCase()] = [ 
								_pricing[3],
								_pricing[4],
								_pricing[5]
							];
					}

					if((_date = contentByLine[i].match(/(Montag|Dienstag|Mittwoch|Donnerstag|Freitag)\s+([0-9]{2}\.[0-9]{2}\.[0-9]{4})/))) {
						inDay = true; // next lines are the menu name, price etc.
						menuDate = _date[2];
					}

					if(menuDate && (_type = contentByLine[i].match(/(Menü (III|II|I)|Tagesaktion|Eintopf)/))) {
						menuType = _type[0];
						menuName = contentByLine[i+1];

						if((_menuPrices = contentByLine[i+2].match(/Stud\.\s*(\d,\d{2})\s*€.+Gäste\.?\s*(\d,\d{2})\s*€/))) {
							menuPrices = [_menuPrices[1], _menuPrices[2]];
						} else {
							if(menuPricesGlobal[menuType.toLowerCase()]) {
								var _pstudent = menuPricesGlobal[menuType.toLowerCase()][0];
								var _pother = menuPricesGlobal[menuType.toLowerCase()][0]
								menuPrices = [_pstudent, _pother];
							}
						}
						
						if(menuType !== null && menuName !== null && menuPrices !== null)
							submitJson(menuDate, menuType, menuName, menuPrices);
						
						menuType = menuName = menuPrices = null;
					}

					if(contentByLine[i].indexOf(endString) != -1) {
						// end reached
						//console.log("End of menu");
						inContent = false;
						break;
					}
					
				}	
			} catch(error) {
				console.log(error);
				console.log("Failed getting menu");
			}

		}
	});
}

module.exports.textparser = textParser;
