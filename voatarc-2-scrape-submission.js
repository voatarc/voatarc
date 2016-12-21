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
	logger.LogMessage('Error: No subverse specified.');
	casper.exit(1);
}


var submission_id = '';
if(casper.cli.has('submission_id'))
{
	submission_id = casper.cli.get('submission_id');
	logger.LogMessage('Scraping Submission ID [' + submission_id + '].');
}
else
{
	logger.LogMessage('Error: No submission_id specified.');
	casper.exit(1);
}


var data_filename = '';
if(casper.cli.has('data_filename'))
{
	data_filename = casper.cli.get('data_filename');
	logger.LogMessage('Outputting to data file [' + data_filename + '].');
}
else
{
	logger.LogMessage('Error: No data_filename specified.');
	casper.exit(1);
}


if(casper.cli.has('log_resources'))
{
	logger.LogResources = true;
}


var take_snapshots = casper.cli.has('snapshots');


//=====================================================================
var log_debug_objects = false;


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
function ClickToDeath(selector)
{
	casper.waitForSelector(selector,
		function OnResource()
		{
			if(casper.exists(selector))
			{
				logger.LogMessage('ClickToDeath [' + selector + ']');
				casper.click(selector);
				// casper.wait(2000, ClickToDeath(selector));
				ClickToDeath(selector);
			}
		},
		function OnTimeout()
		{},
		5000);

	return;
}


//=====================================================================
// Start with front page of the subverse.
var start_url = 'https://voat.co/v/' + subverse_name + '/' + submission_id;
logger.LogMessage("Scrape starting at [" + start_url + "].");
casper.start(start_url);


casper.then(function ScrapeSubmissionPage()
{
	ClickToDeath('a#loadmorebutton');
	// ClickToDeath('a.inline-loadcomments-btn');
	// this.wait(2000, ClickToDeath(this, 'a#loadmorebutton'));

	this.then(function()
	{
		var submission_id = casper.GetAttributeValue('div.submission', 'data-fullname', '');
		if(submission_id == '')
		{
			submission_id = casper.GetAttributeValue('div.submission', 'id', '');
			submission_id = parsing.Parse_GetTextAfter(submission_id, 'submissionid-');
		}

		logger.LogMessage('Scraping submission ' + submission_id + ' in subverse [' + subverse_name + '].');
		if(take_snapshots)
		{
			var snapshot_filename = data_filename + '.jpg';
			this.capture(snapshot_filename);
			logger.LogMessage('Saved snapshot to [' + snapshot_filename + '].');
		}

		// Scrape the submission.
		var submission = {};
		submission.submission_id = submission_id;
		submission.title = casper.GetAttributeValue('a.title', 'title', '');
		submission.timestamp = casper.GetAttributeValue('div.submission time', 'datetime', '');
		submission.username = casper.GetAttributeValue('div.submission span.userattrs a', 'data-username', '');
		submission.submission_text = casper.GetElementText('div.submission textarea');
		submission.submission_link = casper.GetAttributeValue('div.submission a.title', 'href', '');
		submission.vote_score = casper.GetElementText('div.submission div.score.unvoted');
		submission.comment_count = casper.GetElementText('div.submission a.comments');
		submission.comment_count = parsing.Parse_GetTextBefore(submission.comment_count, ' comment');

		if(log_debug_objects)
		{
			logger.LogMessage(JSON.stringify(submission, undefined, '    '));
		}

		// Get the comments.
		submission.comments = [];
		var comment_ids = casper.getElementsAttribute('div.child.comment div.noncollapsed', 'id');
		comment_ids.forEach(function(comment_id)
		{
			logger.LogMessage('Scraping comment ' + comment_id + '.');

			var comment = {};
			comment.comment_id = comment_id;
			comment.parent_comment_id = '';
			comment.submission_id = submission.submission_id;

			var selector = "[id='" + comment_id + "']";

			comment.timestamp = casper.GetAttributeValue(selector + ' p.tagline time', 'datetime', '');
			comment.username = casper.GetAttributeValue(selector + ' p.tagline a.author', 'data-username', '');
			comment.up_votes = casper.GetElementText(selector + ' p.tagline span.score.likes span.number');
			comment.down_votes = casper.GetElementText(selector + ' span.score.dislikes span.number');
			comment.vote_score = casper.GetElementText(selector + ' span.score.unvoted span.number');
			comment.comment_text = casper.GetElementText(selector + ' textarea.commenttextarea');

			if(casper.exists(selector + ' ul li a'))
			{
				var infos = casper.getElementsInfo(selector + ' ul li a');
				// logger.LogMessage(JSON.stringify(infos, undefined, 4));
				infos.forEach(function(info)
				{
					if(info.text == 'parent')
					{
						var ids = info.attributes.href.split('/');
						if(ids.length > 0)
						{
							comment.parent_comment_id = ids[ids.length - 1];
						}
					}
				});
			}
			submission.comments.push(comment);
		});
		logger.LogMessage('Scraped ' + submission.comments.length + ' comments.');

		// Write the submission to a file.
		var content = JSON.stringify(submission, undefined, 4);
		logger.LogMessage('Writing submission file [' + data_filename + '].');
		fs.write(data_filename, content, 'w');

		casper.resources = [];
		return;
	});

	casper.resources = [];
	return;
});


//=====================================================================
//=====================================================================
//
//  ┌─┐┬ ┬┬ ┬┌┬┐┌┬┐┌─┐┬ ┬┌┐┌
//  └─┐├─┤│ │ │  │││ │││││││
//  └─┘┴ ┴└─┘ ┴ ─┴┘└─┘└┴┘┘└┘
//
//=====================================================================
//=====================================================================


casper.then(function BeforeExit()
{
	logger.LogMessage("Script is finished.");
});


casper.run(function(self)
{
	this.exit();
});
