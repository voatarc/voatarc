var system = require('system');
var utils = require('utils');
var fs = require('fs');

var logger = require('logger');
var parsing = require('parsing');

var casper_options = {
	userAgent: 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)',
	// verbose: true,
	logLevel: 'debug',
	pageSettings:
	{
		loadImages: false,
		loadPlugins: false
	},
	clientScripts: []
};

var casper = require('casper').create(casper_options);

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
	process.exit(1);
}


var log_debug_objects = false;


logger.LogMessage("Generating sql insert statements.");


//=====================================================================
// Identify the output folder.
var output_folder = 'subverse-' + subverse_name;
if(!fs.exists(output_folder))
{
	logger.LogMessage('Error: Output folder does not exist [' + output_folder + '].');
	process.exit(1);
}

var sql_filename = output_folder + '/submission-inserts.sql';
if(fs.exists(sql_filename))
{
	fs.remove(sql_filename);
}


//=====================================================================
// Read the submission index file.
var submission_index_filename = output_folder + '/submission-index.json';
if(!fs.exists(submission_index_filename))
{
	logger.LogMessage('Error: Submission index file does not exist [' + submission_index_filename + '].');
	process.exit(1);
}
logger.LogMessage('Reading submission index file [' + submission_index_filename + '].');
var submission_index_entries = JSON.parse(fs.read(submission_index_filename));
var submission_index_count = submission_index_entries.length;
logger.LogMessage('Found [' + submission_index_count + '] submissions.');


function SqlText(Text)
{
	Text = Text.replace(/\\/g, '\\\\');
	Text = Text.replace(/"/g, '\\"');
	return Text;
}


//=====================================================================
// Iterate through the submission index and generate sql insert statements.
submission_index_entries.forEach(function(submission_index_entry, submission_index_number)
{
	logger.LogMessage('==========================================');
	logger.LogMessage('Processing submission ' + (submission_index_number + 1) + ' of ' + submission_index_count + '.');
	if(log_debug_objects)
	{
		logger.LogMessage(JSON.stringify(submission_index_entry, undefined, '    '));
	}

	var submission_entry_filename = output_folder + '/' + submission_index_entry.submission_id + '.json';
	var submission_entry = JSON.parse(fs.read(submission_entry_filename));

	var sql = 'INSERT INTO submission';
	sql += ' (submission_id, title, timestamp, username, vote_score, comment_count, submission_link, submission_text)';
	sql += ' VALUES (';
	sql += '' + submission_entry.submission_id;
	sql += ', "' + SqlText(submission_entry.title) + '"';
	sql += ', "' + submission_entry.timestamp + '"';
	sql += ', "' + SqlText(submission_entry.username) + '"';
	sql += ', "' + submission_entry.vote_score + '"';
	sql += ', "' + submission_entry.comment_count + '"';
	sql += ', "' + submission_entry.submission_link + '"';
	sql += ', "' + SqlText(submission_entry.submission_text) + '"';
	sql += ');\n';

	fs.write(sql_filename, sql, 'wa');

	submission_entry.comments.forEach(function(comment, comment_number)
	{
		sql = 'INSERT INTO comment';
		sql += ' (submission_id, comment_id, parent_comment_id, timestamp, username, up_votes, down_votes, vote_score, comment_text)';
		sql += ' VALUES (';
		sql += '' + comment.submission_id;
		sql += ', "' + comment.comment_id + '"';
		sql += ', "' + comment.parent_comment_id + '"';
		sql += ', "' + comment.timestamp + '"';
		sql += ', "' + SqlText(comment.username) + '"';
		sql += ', "' + comment.up_votes + '"';
		sql += ', "' + comment.down_votes + '"';
		sql += ', "' + comment.vote_score + '"';
		sql += ', "' + SqlText(comment.comment_text) + '"';
		sql += ');\n';

		fs.write(sql_filename, sql, 'wa');

	});

});


logger.LogMessage("Script is finished.");


casper.exit(0);
