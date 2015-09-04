/*
	Parser für die Mensa Bispinghof
*/

var mensa = {
			"name": "Mensa Bispinghof",
			"uid": "http://data.uni-muenster.de/context/uniaz/MensaBispinghof",
			"url": "http://www.studentenwerk-muenster.de/essen-a-trinken/mensen/bispinghof"
};

var bispinghofParser = require("./parsers/parser_bispinghof.js");
var r = new bispinghofParser.bispinghofparser(mensa);