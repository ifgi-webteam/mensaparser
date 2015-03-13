/*
	Parser für die Mensa am Aasee
*/

var mensa = {
			"name": "Bistro Denkpause",
			"uid": "http://data.uni-muenster.de/context/uniaz/9b3af1a05cbfb372bc205d86760a6afa",
			"url": "http://www.studentenwerk-muenster.de/de/essen-a-trinken/bistros-a-cafes/denkpause"
};

var bistroParser = require("./parser_bistro_denkpause.js");
var r = new bistroParser.bistroparser(mensa);