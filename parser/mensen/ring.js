/*
	Parser für die Mensa am Ring
*/

var mensa = {
			"name": "Mensa am Ring",
			"uid": "http://data.uni-muenster.de/context/uniaz/hiermusseineidhindieichnichtweiss",
			"url": "http://www.studentenwerk-muenster.de/de/essen-a-trinken/mensen/mensa-am-ring"
};

var mensaParser = require("./parser_aasee_ring.js");
var r = new mensaParser.ringparser(mensa);