

"use strict";

module.exports = Parsing;

function Parsing()
{
	return;
}



//========================================================================================================================
//========================================================================================================================
//
//  d8888b.  .d8b.  d8888b. .d8888. d888888b d8b   db  d888b  
//  88  `8D d8' `8b 88  `8D 88'  YP   `88'   888o  88 88' Y8b 
//  88oodD' 88ooo88 88oobY' `8bo.      88    88V8o 88 88      
//  88~~~   88~~~88 88`8b     `Y8b.    88    88 V8o88 88  ooo 
//  88      88   88 88 `88. db   8D   .88.   88  V888 88. ~8~ 
//  88      YP   YP 88   YD `8888Y' Y888888P VP   V8P  Y888P  
//
//========================================================================================================================
//========================================================================================================================


//=====================================================================
String.prototype.PadRight = 
	function PadRight( l, c )
	{
		return this + Array( l - this.length + 1 ).join( c || " " );
	};


//=====================================================================
Parsing.Parse_CleanText =
	function Parse_CleanText( Text )
	{
		if( Text === null ) {
			return '';
		}
		var output = "";
		for( var ich = 0; ich < Text.length; ich++ )
		{
			var char_code = Text.charCodeAt( ich );
			if( char_code < 32 )
			{
				output += ' ';
			}
			else if( char_code >= 127 )
			{
				output += ' ';
			}
			else
			{
				output += Text.charAt( ich );
			}
		}
		output = output.trim();
		return output;
	};


//=====================================================================
Parsing.Parse_CleanTextArray =
	function Parse_CleanTextArray( TextArray )
	{
		for( var index = 0; index < TextArray.length; index++ )
		{
			TextArray[ index ] = this.Parse_CleanText( TextArray[ index ] );
		}
		return;
	};


//=====================================================================
Parsing.Parse_GetTextBefore =
	function Parse_GetTextBefore( Text, Token )
	{
		if( Text === null ) {
			return '';
		}
		var ich = Text.indexOf( Token );
		if( ich < 0 ) {
			return Text;
		}
		return Text.substr( 0, ich );
	};


//=====================================================================
Parsing.Parse_GetTextAfter =
	function Parse_GetTextAfter( Text, Token )
	{
		if( Text === null ) {
			return '';
		}
		var ich = Text.indexOf( Token );
		if( ich < 0 ) {
			return '';
		}
		ich += Token.length;
		return Text.substr( ich );
	};


//=====================================================================
Parsing.Parse_GetTextBeforeLast =
	function Parse_GetTextBeforeLast( Text, Token )
	{
		if( Text === null ) {
			return '';
		}
		var ich = Text.lastIndexOf( Token );
		if( ich < 0 ) {
			return Text;
		}
		return Text.substr( 0, ich );
	};


//=====================================================================
Parsing.Parse_GetTextAfterLast =
	function Parse_GetTextAfterLast( Text, Token )
	{
		if( Text === null ) {
			return '';
		}
		var ich = Text.lastIndexOf( Token );
		if( ich < 0 ) {
			return '';
		}
		ich += Token.length;
		return Text.substr( ich );
	};


//=====================================================================
Parsing.Parse_GetTextBetween =
	function Parse_GetTextBetween( Text, StartToken, EndToken, CleanText )
	{
		if( Text === null ) {
			return '';
		}
		//console.log( "Parse_GetTextBetween( '" + Text + "', '" + StartToken + "', '" + EndToken + "', " + CleanText + ")" );
		var ich = -1;
		if( StartToken !== '' )
		{
			ich = Text.indexOf( StartToken );
			if( ich < 0 )
			{
				//console.log( "    StartToken '" + StartToken + "' not found. Returning empty string." );
				return '';
			}
			ich += StartToken.length;
			Text = Text.substr( ich );
		}
		if( EndToken !== '' )
		{
			ich = Text.indexOf( EndToken );
			if( ich < 0 )
			{
				//console.log( "    EndToken '" + EndToken + "' not found. Returning empty string." );
				return '';
			}
			Text = Text.substr( 0, ich );
		}
		if( CleanText )
		{
			Text = this.Parse_CleanText( Text );
		}
		//console.log( "    Found '" + Text + "'." );
		return Text;
	};


//=====================================================================
Parsing.Parse_TextStartsWith =
	function Parse_TextStartsWith( Text, StartsWith, CaseSensitive )
	{
		if( Text === null ) {
			return false;
		}
		if( CaseSensitive === false )
		{
			Text = Text.toLowerCase();
			StartsWith = StartsWith.toLowerCase();
		}
		return (Text.indexOf( StartsWith ) === 0);
	};

