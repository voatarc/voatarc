<?php


function SqlText( $Text )
{
	// $Text = preg_replace('/\\/g', '\\\\', $Text);
	// $Text = preg_replace('/"/g', '\\"', $Text);
	$Text = str_replace('\\', '\\\\', $Text);
	$Text = str_replace('"', '\\"', $Text);
	return $Text;
}


//=====================================================================
//	Get Command Line Arguments
//=====================================================================


$argv_count = count( $argv );

echo $argv_count." Parameters:\n";
for( $index = 0; $index < $argv_count; $index++ )
{
	echo $index." > [".$argv[ $index ]."]\n";
}

$SUBVERSE_NAME = '';
$SUBVERSE_FOLDER = '';
$SQL_FILENAME = '';
$LOG_FILE = '';
$MAX_PAGES = '';

// Subverse name
if( count( $argv ) >= 2 )
{
	$SUBVERSE_NAME = $argv[ 1 ];
	$SUBVERSE_FOLDER = 'subverse-'.$SUBVERSE_NAME;
	$SQL_FILENAME = $SUBVERSE_FOLDER.'/submission-rows.sql';
	$LOG_FILE = $SUBVERSE_FOLDER.'/voatarc.log';
}
else
{
	exit("Error: Missing parameter\nUsage: php voatarc.php subverse_name [max_pages]");
}

// Max pages
if( count( $argv ) >= 3 )
{
	$MAX_PAGES = $argv[ 2 ];
}


//=====================================================================
echo "=== Initialize Environment\n";
//=====================================================================


try
{
	exec( "rm ".$SUBVERSE_FOLDER."/*" );
}
catch( Exception $exception )
{
	exit( "Exception while initializing environment:\n" . $exception->getMessage() );
}


//=====================================================================
echo "=== Execute : voatarc-1-build-index\n";
//=====================================================================


try
{
	// Prepare the command.
	$command_line = "casperjs voatarc-1-build-index.js --subverse=".$SUBVERSE_NAME;
	if( $MAX_PAGES != '' ) { $command_line .= " --max_pages=".$MAX_PAGES; }
	
	// Run the command.
	$script_stdout_lines = [];
	$script_return_value = '';
	exec( $command_line, $script_stdout_lines, $script_return_value );
	$script_stdout = implode( "\n", $script_stdout_lines )."\n";

	// Append to the master log.
	$log_handle = fopen( $LOG_FILE, "a" );
	fwrite( $log_handle, $script_stdout );
	fwrite( $log_handle, "=====================================================================\n\n" );
	fclose( $log_handle );
}
catch( Exception $exception )
{
	exit( "Exception while processing voatarc-1-build-index:\n".$exception->getMessage() );
}


//=====================================================================
echo "=== Load the Submissions Index\n";
//=====================================================================


$submission_index = json_decode(file_get_contents($SUBVERSE_FOLDER."/submission-index.json"), true);
$submission_count = count( $submission_index );
echo "\tLoaded ".$submission_count." submissions.\n";


//=====================================================================
echo "=== Execute : voatarc-2-scrape-submission\n";
//=====================================================================


for( $index = 0; $index < $submission_count; $index++ )
{
	$submission_entry = $submission_index[ $index ];
	$submission_id = $submission_entry["submission_id"];
	echo "\tProcessing submission ".($index + 1). " of ".$submission_count." [".$submission_id."].\n";
	// print_r( $submission_entry );

	try
	{
		// echo "\t\tSleeping ...\n";
		// sleep( 1 );
		
		echo "\t\tReading the remote page.\n";
		$data_filename = $SUBVERSE_FOLDER.'/'.$submission_id.'.json';
		// Prepare the command.
		$command_line = "casperjs voatarc-2-scrape-submission.js --subverse=".$SUBVERSE_NAME;
		$command_line .= " --submission_id=".$submission_id;
		$command_line .= " --data_filename=".$data_filename;
		
		// Run the command.
		$script_stdout_lines = [];
		$script_return_value = '';
		exec( $command_line, $script_stdout_lines, $script_return_value );
		$script_stdout = implode( "\n", $script_stdout_lines )."\n";
	
		// Append to the master log.
		echo "\t\tWriting [".$LOG_FILE."].\n";
		$log_handle = fopen( $LOG_FILE, "a" );
		fwrite( $log_handle, $script_stdout );
		fwrite( $log_handle, "=====================================================================\n\n" );
		fclose( $log_handle );
		
		echo "\t\tReading [".$data_filename."].\n";
		$submission = json_decode(file_get_contents($data_filename), true);
		// print_r( $submission );

		// Construct the submission insert.
		$sql = 'INSERT INTO submission';
		$sql .= ' (submission_id, title, timestamp, username, vote_score, comment_count, submission_link, submission_text)';
		$sql .= ' VALUES (';
		$sql .= '' . $submission["submission_id"];
		$sql .= ', "' . SqlText($submission["title"]) . '"';
		$sql .= ', "' . $submission["timestamp"] . '"';
		$sql .= ', "' . SqlText($submission["username"]) . '"';
		$sql .= ', "' . $submission["vote_score"] . '"';
		$sql .= ', "' . $submission["comment_count"] . '"';
		$sql .= ', "' . $submission["submission_link"] . '"';
		$sql .= ', "' . SqlText($submission["submission_text"]) . '"';
		$sql .= ');'."\n";
		
		$comments = $submission["comments"];
		foreach( $comments as $comment )
		{
			$sql .= 'INSERT INTO comment';
			$sql .= ' (submission_id, comment_id, parent_comment_id, timestamp, username, up_votes, down_votes, vote_score, comment_text)';
			$sql .= ' VALUES (';
			$sql .= $comment["submission_id"];
			$sql .= ', "'.$comment["comment_id"].'"';
			$sql .= ', "'.$comment["parent_comment_id"].'"';
			$sql .= ', "'.$comment["timestamp"].'"';
			$sql .= ', "'.SqlText($comment["username"]).'"';
			$sql .= ', "'.$comment["up_votes"].'"';
			$sql .= ', "'.$comment["down_votes"].'"';
			$sql .= ', "'.$comment["vote_score"].'"';
			$sql .= ', "'.SqlText($comment["comment_text"]).'"';
			$sql .= ');'."\n";
		}

		echo "\t\tWriting [".$SQL_FILENAME."].\n";
		$sql_handle = fopen( $SQL_FILENAME, "a" );
		fwrite( $sql_handle, $sql );
		fwrite( $sql_handle, "\n\n" );
		fclose( $sql_handle );
		
	}
	catch( Exception $exception )
	{
		exit( "Exception while processing submission [".$submission_id."]:\n".$exception->getMessage() );
	}

}
