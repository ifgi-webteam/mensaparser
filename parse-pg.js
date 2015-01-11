// database
var pg = require('pg');
var conString = "postgres://postgres:mysecretpassword@172.17.0.6/docker";
var client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('INSERT INTO menus (data) VALUES (\'{"something": "hello"}\')', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result);
    client.end();
  });
});


// mensa and html parsing
var cheerio = require('cheerio');
var request = require('request');
var mensen = require('./mensen.json');
var idList = require('./parsingRules.json');

// localization strings
var dowNamesGer = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"]

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

					for (menu in idList[day]) { // mo_menu1, mo_menu2, mo_menu3, di_menu1 ...

					}
					
					i++;
				}
				
			}
		});
	})(mensen[mensa]);
}

