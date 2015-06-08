var parsers = [
	'aasee.js',
	'ring.js',
	'davinci.js',
	'denkpause.js',
	'bispinghof.js',
	];

for(p in parsers){
	try {
		require('./mensen/'+parsers[p]);
	} catch(e) {
		console.log('Error in '+parsers[p]);
		console.log(e);
	}
}