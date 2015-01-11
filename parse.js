var cheerio = require('cheerio');
var request = require('request');
var mensen = require('./mensen.json');
var idList = require('./parsingRules.json');
var dowNamesGer = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"]

var completemenu = {}; // mensa menu object

for (mensa in mensen){ // Mensa Aasee, Mensa Ring
	
	(function(mensa){
		console.log(mensa);

		request(mensa.url, function(error, response, html) {
			console.log("======");
			console.log("===",mensa.name,"===");
			console.log("===",mensa.url,"===");
			console.log("===",mensa.uid,"===");
			console.log("======");
			
			if(!error && response.statusCode == 200) {
			 	var $ = cheerio.load(html);
			 	console.log($("title").text());
				var i = 1;
				
				for (day in idList) { // mo, di, mi, do, fr
					if(completemenu[i] == null) 
						completemenu[i] = {};
					
					if(completemenu[i].meta == null) {
						completemenu[i].meta = {};	
						completemenu[i].meta.date = $('#'+day).text().split(" ").pop().replace(/\r\n/, '');
						completemenu[i].meta.dayOfWeek = i;
						completemenu[i].meta.dayOfWeekNameGer = dowNamesGer[i-1];
					}
					
					if(completemenu[i].fooddata == null)
						completemenu[i].fooddata = {};

					var uid = "http://data.uni-muenster.de/context/uniaz/"+mensa.uid;
					if(completemenu[i].fooddata[uid] == null) {
						completemenu[i].fooddata[uid] = {};
						completemenu[i].fooddata[uid].food = [];
					}

					for (menu in idList[day]) { // mo_menu1, mo_menu2, mo_menu3, di_menu1 ...
						//console.log(idList[day][menu], $('#'+idList[day][menu]).text());
						foodItem = $('#'+idList[day][menu]).text();
						completemenu[i].fooddata[uid].food.push(foodItem);
					}
					
					console.log(completemenu);
					i++;
				}
				
			}
		});
	})(mensen[mensa]);
}

