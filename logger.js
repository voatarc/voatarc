

"use strict";

module.exports = Logger

function Logger() { return; }


//---------------------------------------------------------------------
Logger.GetTimestamp =
	function GetTimestamp()
{
	var date = new Date();
	var timestamp = date.toISOString(); //"2011-12-19T15:28:46.493Z"
	return timestamp;
}


//---------------------------------------------------------------------
Logger.LogMessage =
	function LogMessage( Message )
{
	var timestamp = this.GetTimestamp();
	console.log( "======== [ " + timestamp + " ] " + Message );
}


//---------------------------------------------------------------------
Logger.DebugObject =
function DebugObject( SomeObject )
{
	return JSON.stringify( SomeObject, undefined, "    " );
}

