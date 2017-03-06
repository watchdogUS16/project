var speedTest = require('./node_modules/speedtest-net/');
var dweetClient = require('./node_modules/node-dweetio/');
var dweetio = new dweetClient();
var schedule = require('./node_modules/node-schedule/');

var j = schedule.scheduleJob('*/10 * * * * *', function(){

		test = speedTest.visual({maxTime: 5000});
		var modem_data = require(modem);
		test.on('data', function(data) {

			dweetio.dweet_for("watchdog16", {some:modem_data}, function(err, dweet){
			});
			console.log("Test realizado con Exito!!!");
		});
});
