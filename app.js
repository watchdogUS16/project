var speedTest = require('./node_modules/speedtest-net/');
var dweetClient = require('./node_modules/node-dweetio/');
var dweetio = new dweetClient();
var schedule = require('./node_modules/node-schedule/');
var ping = require('./node_modules/ping');

var cont = 0;
var j = schedule.scheduleJob('*/59 * * * * *', function(){

	var host = '8.8.8.8';
	ping.sys.probe(host, function(isAlive){

		if(isAlive){
		cont = 0;
		test = speedTest({maxTime: 5000});
		test.on('data', function(data) {

			dweetio.dweet_for("watchdog16", {some:data}, function(err, dweet){
			});
			console.log("Test realizado con Exito!!!")
		});
		}else{
			cont +=1;
		}
		if(cont==3){
			console.log("Reintentando conexion...3..2..1..");
			cont = 0
		}


	});
});
