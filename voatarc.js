
var casper = require('casper').create();

casper.start();

casper.then(function()
{
	this.echo( 'Hello, World!' );
});

casper.run();
