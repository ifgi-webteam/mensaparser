/*
	Parser für die Mensa am Aasee
*/

var mensa = {
			"name": "Mensa Da Vinci",
			"uid": "http://data.uni-muenster.de/context/uniaz/d46d2d2c4b3ea6341254a9649e38678f",
			"url": "http://www.studentenwerk-muenster.de/de/essen-a-trinken/mensen/da-vinci"
};

var davinciParser = require("./parser_davinci.js");
var r = new davinciParser.davinciparser(mensa);