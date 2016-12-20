var system = require('system');


var JQuery_js_Filename = 'jquery-2.1.0.js';
var Client_js_Filename = 'dom-code.js';

var casper_options = {
	userAgent: 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)',
	// verbose: true,
	logLevel: 'debug',
	pageSettings:
	{
		loadImages: true,
		loadPlugins: false
	},
	clientScripts: [
		// JQuery_js_Filename
		// , Client_js_Filename
	]
};

var casper = require('casper').create(casper_options);
var xpath = require('casper').selectXPath;
var utils = require('utils');
var fs = require('fs');

var logger = require('logger');
var parsing = require('parsing');

require('utils-casper')(casper, logger);


//=====================================================================
//=====================================================================
//
//  ┬┌┐┌┌┬┐┬┌─┐┬  ┬┌─┐┌─┐┌┬┐┬┌─┐┌┐┌
//  ││││ │ │├─┤│  │┌─┘├─┤ │ ││ ││││
//  ┴┘└┘ ┴ ┴┴ ┴┴─┘┴└─┘┴ ┴ ┴ ┴└─┘┘└┘
//
//=====================================================================
//=====================================================================


//=====================================================================
// Log the startup.
logger.LogMessage('Casper Status: ');
casper.status(true);
logger.LogMessage("Casper CLI passed args:");
utils.dump(casper.cli.args);
logger.LogMessage("Casper CLI passed options:");
utils.dump(casper.cli.options);


//=====================================================================
// Parse the command line.
var subverse_name = '';
if(casper.cli.has('subverse'))
{
	subverse_name = casper.cli.get('subverse');
	logger.LogMessage('Using the subverse [' + subverse_name + '].');
}
else
{
	// logger.LogMessage('Error: No subverse specified.');
	// process.exit(1);
	casper.ExitNow(1, 'Error: No subverse specified.');
}


var max_pages = 20;
if(casper.cli.has('max_pages'))
{
	var number = casper.cli.get('max_pages');
	if(!isNaN(parseFloat(number)) && isFinite(number))
	{
		max_pages = number;
		if(max_pages < 1)
		{
			max_pages = 1;
		}
		else if(max_pages > 20)
		{
			max_pages = 20;
		}
	}
	logger.LogMessage('Using max index pages [' + max_pages + '].');
}


//=====================================================================
// Start with front page of the subverse.
var start_url = 'https://voat.co/v/' + subverse_name;

logger.LogMessage("Scrape starting at [" + start_url + "].");
casper.start(start_url);


//=====================================================================
// Create the output folder.
var output_folder = 'subverse-' + subverse_name;
if(!fs.exists(output_folder))
{
	fs.makeDirectory(output_folder);
}


//=====================================================================
//=====================================================================
//
//  ╔╦╗┌─┐┬┌┐┌  ╔═╗─┐ ┬┌─┐┌─┐┬ ┬┌┬┐┬┌─┐┌┐┌
//  ║║║├─┤││││  ║╣ ┌┴┬┘├┤ │  │ │ │ ││ ││││
//  ╩ ╩┴ ┴┴┘└┘  ╚═╝┴ └─└─┘└─┘└─┘ ┴ ┴└─┘┘└┘
//
//=====================================================================
//=====================================================================


//=====================================================================
// Load the index pages of a subverse.
var submission_index_page_urls = [];
for(var page_number = 0; page_number < max_pages; page_number++)
{
	submission_index_page_urls.push('https://voat.co/v/' + subverse_name + '?page=' + page_number);
}


//=====================================================================
// Visit each page and build an index of submissions.
var submission_ids = [];
var submission_index_entries = [];


casper.eachThen(
	submission_index_page_urls,
	function ScrapeSubmissionIndexPage(submission_index_page_url)
	{
		this.thenOpen(
			submission_index_page_url.data,
			function ScrapeSubmissionsIDs()
			{
				logger.LogMessage('Scraping submission index page [' + this.getCurrentUrl() + '].');

				var ids = this.getElementsAttribute('div.submission', 'data-fullname');

				for(var i = 0; i < ids.length; i++)
				{
					var id = ids[i];

					if(!(id in submission_ids))
					{
						submission_ids.push(id);

						var submission_selector = 'div.id-' + id;

						var submission_index = {};
						submission_index.submission_id = id;
						submission_index.title = this.GetElementText(submission_selector + ' a.title');
						submission_index.timestamp = this.GetAttributeValue(submission_selector + ' time', 'datetime', '');
						submission_index.username = this.GetAttributeValue(submission_selector + ' a.author', 'data-username', '');
						submission_index.submission_url = 'https://voat.co/v/' + subverse_name + '/' + id;
						submission_index.thumbnail_url = this.GetAttributeValue(submission_selector + ' a.thumbnail img', 'src', '');
						submission_index.up_votes = this.GetAttributeValue(submission_selector, 'data-ups', '0');
						submission_index.down_votes = this.GetAttributeValue(submission_selector, 'data-downs', '0');

						submission_index_entries.push(submission_index);
					}
				}

				casper.resources = [];

				return;
			}
		);
	}
);


//=====================================================================
//=====================================================================
//
//  ┌─┐┬ ┬┬ ┬┌┬┐┌┬┐┌─┐┬ ┬┌┐┌
//  └─┐├─┤│ │ │  │││ │││││││
//  └─┘┴ ┴└─┘ ┴ ─┴┘└─┘└┴┘┘└┘
//
//=====================================================================
//=====================================================================


casper.then(
	function BeforeExit()
	{
		logger.LogMessage("Script is finished.");

		var content = JSON.stringify(submission_index_entries, undefined, 4);
		var filename = output_folder + '/submission-index.json';
		logger.LogMessage('Writing submission index file [' + filename + '].');
		logger.LogMessage(submission_index_entries.length + ' submissions were indexed in ' + max_pages + ' pages.');
		fs.write(filename, content, 'w');

	}
);


casper.run(function(self)
{
	this.exit();
});
