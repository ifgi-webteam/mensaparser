/*
	Parser für die Mensa am Aasee
*/

var mensa = {
			"name": "Mensa am Aasee",
			"uid": "http://data.uni-muenster.de/context/uniaz/70ad738c960cc5e88e5e8d8ac1b5975e",
			"url": "http://www.studentenwerk-muenster.de/de/essen-a-trinken/mensen/mensa-am-aasee"
};

var mensaParser = require("./parser_aasee_ring.js");
var r = new mensaParser.ringparser(mensa);