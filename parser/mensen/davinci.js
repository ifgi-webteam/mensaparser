/*
	Parser für die Mensa am Aasee
*/

var mensa = {
			"name": "Mensa Davinci",
			"uid": "http://data.uni-muenster.de/context/uniaz/70ad738c960cc5e88e5e8d8acbbbbbbb",
			"url": "http://www.studentenwerk-muenster.de/de/essen-a-trinken/mensen/da-vinci"
};

var davinciParser = require("./parser_davinci.js");
var r = new davinciParser.davinciparser(mensa);