/*
	Parser für die Mensa am Aasee
*/

var mensa = {
			"name": "Bistro Denkpause",
			"uid": "http://data.uni-muenster.de/context/uniaz/70ad738c960cc5e88e5e8d8acaacccccc",
			"url": "http://www.studentenwerk-muenster.de/de/essen-a-trinken/bistros-a-cafes/denkpause"
};

var bistroParser = require("./parser_bistro_denkpause.js");
var r = new bistroParser.bistroparser(mensa);