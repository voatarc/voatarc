"use strict";

var system = require('system');
var child_process = require('child_process');

module.exports = Logger

function Logger()
{
	return;
}


//---------------------------------------------------------------------
Logger.LogTimestamp = true;
Logger.LogResources = true;


//---------------------------------------------------------------------
Logger.GetTimestamp =
	function GetTimestamp()
	{
		var date = new Date();
		var timestamp = date.toISOString(); //"2011-12-19T15:28:46.493Z"
		return timestamp;
	}


//---------------------------------------------------------------------
Logger.GetResourcesUsed =
	function GetResourcesUsed(callback)
	{
		// Adapted from: http://github.com/mooyoul/phantom-memorymeter
		var os = system.os.name || '';
		if((os === 'linux') || (os === 'unix') || (os === 'mac'))
		{
			// ps --no-headers -o '%cpu,%mem' -C "phantomjs"
			child_process.execFile('ps', ['--no-headers', '-o', '%cpu,%mem', '-C', 'phantomjs'], null,
				function(err, stdout, stderr)
				{
					if(err)
					{
						callback(new Error("Failed to fetch `ps` result!"));
						return;
					}
					if(stderr)
					{
						callback(new Error(stderr));
						return;
					}

					var text = stdout.trim();
					var values = text.split(' ');
					var cpu = values[0].trim();
					text = text.slice(cpu.length).trim();
					values = text.split(' ');
					var memory = values[0].trim();

					// values[0] = parseFloat(values[0]);
					// values[1] = parseFloat(values[1]);
					// callback(null, system.pid, values[0], values[1]);
					callback(null, system.pid, cpu, memory);
				});
		}
		else if(os === 'windows')
		{
			// /** @todo Strange bug. WHY DOESN't WORK `/FI` FLAG??? I NEED MORE SIMPLE METHOD */
			// child_process.execFile('tasklist', ['/NH'], null, function(err, stdout, stderr)
			// {
			// 	if(err)
			// 	{
			// 		callback(new Error("Failed to fetch `tasklist` result!"));
			// 		return;
			// 	}
			// 	if(stderr)
			// 	{
			// 		callback(new Error(stderr));
			// 		return;
			// 	}

			// 	var columnDelimiter = /\s+/,
			// 		fetchedMemSize = 0,
			// 		units = {
			// 			K: 1,
			// 			M: 2,
			// 			G: 3,
			// 			T: 4
			// 		}; // K = 1024 bytes, M = 1024^2 bytes, G = 1024^3 bytes, T = 1024^4 bytes.

			// 	stdout.split("\r\n").forEach(function(item)
			// 	{
			// 		var row = item.split(columnDelimiter);

			// 		if(row && row.length > 2)
			// 		{
			// 			if(row[1] === (pid + ''))
			// 			{
			// 				fetchedMemSize = parseInt(row[row.length - 2].replace(/[^0-9]/g, ''), 10) * Math.pow(1024, units[row[row.length - 1]] || 0);
			// 				return false;
			// 			}
			// 		}
			// 	});
			// 	callback(null, fetchedMemSize, pid);
			// });
		}

	};


//---------------------------------------------------------------------
Logger.LogMessage =
	function LogMessage(Message)
	{
		var head = '========[';
		var tail = '] ' + Message;
		var stats = '';
		if(Logger.LogTimestamp)
		{
			stats += this.GetTimestamp();
		}
		if(Logger.LogResources)
		{
			Logger.GetResourcesUsed(function(err, pid, cpu, memory)
			{
				if(err)
				{
					console.log(err);
				}
				if(stats != '')
				{
					stats += ' | '
				}
				// cpu = cpu.toFixed(1);
				stats += 'c:' + cpu + '%';
				stats += ' | '
					// memory = memory.toFixed(1);
				stats += 'm:' + memory + '%';
				console.log(head + ' ' + stats + ' ' + tail);
			});
		}
		else
		{
			console.log(head + ' ' + stats + ' ' + tail);
		}
	}


//---------------------------------------------------------------------
Logger.DebugObject =
	function DebugObject(SomeObject)
	{
		return JSON.stringify(SomeObject, undefined, "    ");
	}
