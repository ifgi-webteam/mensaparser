var parsers = [
	'aasee.js',
	'ring.js',
	'davinci.js',
	'denkpause.js',
	'bispinghof.js',
	];

for(var p in parsers){
	if(parsers.hasOwnProperty(p)){
		try {
			require('./mensen/'+parsers[p]);
		} catch(e) {
			console.log('Error in '+parsers[p]);
			console.log(e);
		}
	}
}