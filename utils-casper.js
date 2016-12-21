"use strict";


module.exports = Utils_Casper


function Utils_Casper(casper, logger)
{


	//=====================================================================
	//=====================================================================
	//
	//  ╔═╗┌─┐┌─┐┌─┐┌─┐┬─┐  ╔═╗┬  ┬┌─┐┌┐┌┌┬┐┌─┐
	//  ║  ├─┤└─┐├─┘├┤ ├┬┘  ║╣ └┐┌┘├┤ │││ │ └─┐
	//  ╚═╝┴ ┴└─┘┴  └─┘┴└─  ╚═╝ └┘ └─┘┘└┘ ┴ └─┘
	//
	//=====================================================================
	//=====================================================================


	//=====================================================================
	casper.on('remote.message', function(msg)
	{
		logger.LogMessage('[Remote Page] ' + msg);
		return;
	});


	//=====================================================================
	casper.on("error", function(msg, trace)
	{
		logger.LogMessage("[Error] " + msg);
		logger.LogMessage("[Error trace] " + JSON.stringify(trace, undefined, 4));
		return;
	});


	//=====================================================================
	casper.on("page.error", function(msg, trace)
	{
		logger.LogMessage("[Remote Page Error] " + msg);
		logger.LogMessage("[Remote Error trace] " + JSON.stringify(trace, undefined, 4));
		return;
	});


	//=====================================================================
	casper.on("run.complete", function()
	{
		logger.LogMessage("Execution complete.");
		this.exit(0);
		return;
	});


	//=====================================================================
	//=====================================================================
	//
	//  ┌─┐┌─┐┌─┐┌─┐┌─┐┬─┐  ┬ ┬┬─┐┌─┐┌─┐┌─┐┌─┐┬─┐┌─┐
	//  │  ├─┤└─┐├─┘├┤ ├┬┘  │││├┬┘├─┤├─┘├─┘├┤ ├┬┘└─┐
	//  └─┘┴ ┴└─┘┴  └─┘┴└─  └┴┘┴└─┴ ┴┴  ┴  └─┘┴└─└─┘
	//
	//=====================================================================
	//=====================================================================


	//=====================================================================
	casper.GetAttributeValue = function GetAttributeValue(Selector, AttributeName, Default)
	{
		if(!this.exists(Selector))
		{
			return Default;
		}
		return this.getElementAttribute(Selector, AttributeName);
	}


	//=====================================================================
	casper.GetElementText = function GetElementText(Selector)
	{
		if(!this.exists(Selector))
		{
			return '';
		}
		return this.fetchText(Selector);
	}


	//=====================================================================
	casper.ExitNow = function ExitNow(Status, Message)
	{
		logger.LogMessage(Message);
		logger.LogMessage('CASPER WILL NOW EXIT!');
		this.exit(Status);
		this.bypass(99999);
		return;
	}


	return;
}