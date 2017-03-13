var speedTest = require('./node_modules/speedtest-net/');
var dweetClient = require('./node_modules/node-dweetio/');
var schedule = require('./node_modules/node-schedule/');
var shell = require('./node_modules/shelljs');
var dngl = require("dngl");

var dweetio = new dweetClient();
//var device = new dngl("/dev/ttyUSB2");
var datos;

var j = schedule.scheduleJob('*/45 * * * * *', function(){

	var device = new dngl("/dev/ttyUSB2");

		shell.exec("route del default gw 192.168.0.1 eth0");
		shell.exec("route add default gw 10.64.64.64 ppp0");

		test = speedTest({maxTime: 5000});
		test.on('data', function(data) {

			datos = data;
			console.log("Test realizado con Exito!!!");

		});

		device.once('data', function(data){

			shell.exec("sleep 10");
			shell.exec("route del default gw 10.64.64.64 ppp0");
			shell.exec("route add default gw 192.168.0.1 eth0");
			dweetio.dweet_for("watchdog16", {some:jsonConcat(datos,data)}, function(err, dweet){});

		});

		test.on('error', function(err){

			//shell.exec("reboot");
			console.log("Error en Test");

		});

		device.on("error", function(err){

       			 //shell.exec("reboot");
        		console.log("Error en device");

		});



});

function jsonConcat(o1, o2) {
 for (var key in o2) {
  o1[key] = o2[key];
 }
 return o1;
}
