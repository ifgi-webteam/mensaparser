var pg = require('pg');
var conString = "postgres://docker:docker123@127.0.0.1/docker";
var client = new pg.Client(conString);
var requestCounter = 0;
var fooditems = [];
var mensa = new Object();

client.connect(function(err) {
	if(err) {
		return console.error('could not connect to postgres', err);
	}
	console.log('Connected to database');
});

function disconnect() {
	console.log("Disconnecting from database");
	client.end();
}

function insertData(toInsert) {
	var fooditem = toInsert;
	requestCounter++;
	console.log("" + requestCounter + " -> calling db insert");
	
	client.query('INSERT INTO menus (data) VALUES ($1)', [fooditem], function(err, result) {
		requestCounter--;
		console.log("" + requestCounter + " -> inserted");
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

function process(error, response, html) {
	var moment = require("moment");
	var cheerio = require('cheerio');
	var idList = [ "montag", "dienstag", "mittwoch", "donnerstag", "freitag" ];

	if(!error && response.statusCode == 200) {
		var $ = cheerio.load(html);

		// Preise abfragen
		// Ergebnisse in Variable preise: preise[1] (Menü 1 Student), preise[2] (Menü 1 Sonst.), preise[3] (Menü 2 Student)... usw
		var content = $("table.contentpaneopen").text();
		var preise = content.match(/[0P]reise\s+Stud. \/ Sonst. Menü I\s+([0-9],[0-9]+) € \/ ([0-9],[0-9]+) €Menü II\s+([0-9],[0-9]+) € \/ ([0-9],[0-9]+) €Menü III\s+([0-9],[0-9]+) € \/ ([0-9],[0-9]+) €/);

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
				console.log("" + fooditem.date + ": " + fooditem.name);
				insertData(fooditem);
				//fooditems.push(fooditem);
			}
		}
	}
}

function ringparser(mens) {
	var request = require('request');
	mensa = mens;
	request(mensa.url, process);
}

module.exports.ringparser = ringparser;
