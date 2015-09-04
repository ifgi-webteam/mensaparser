/*
	Parser für die Mensa am Ring
*/

var mensa = {
			"name": "Mensa am Ring",
			"uid": "http://data.uni-muenster.de/context/uniaz/8ac770e149aa52077f85189c390e9571",
			"url": "http://www.studentenwerk-muenster.de/de/essen-a-trinken/mensen/mensa-am-ring"
};

var mensaParser = require("./parsers/parser_aasee_ring.js");
var r = new mensaParser.ringparser(mensa);