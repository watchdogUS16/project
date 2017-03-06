var speedTest = require('./node_modules/speedtest-net/');
var dweetClient = require('./node_modules/node-dweetio/');
var schedule = require('./node_modules/node-schedule/');
var shell = require('./node_modules/shelljs');

var dweetio = new dweetClient();
var dngl = require("dngl");
var device = new dngl("/dev/ttyUSB2");
var datos;
var cont = 0
test = speedTest.visual({maxTime: 5000, serversUrl:"tokio.com"});


device.on("error", function(err){

	shell.exec("reboot");

});

var j = schedule.scheduleJob('*/30 * * * * *', function(){

		shell.exec("route add default gw 10.64.64.64 ppp0");
		test.on("error", function(err){
			cont++;
			var error = {"error":cont}
        		dweetio.dweet_for("watchdog16", {some:error}, function(err, dwe$

		});

		test.on('data', function(data) {

			datos = data;

			device.once("data", function(data){
				cont = 0;
				error = {"error":cont}
				shell.exec("route del default gw 10.64.64.64 ppp0")
				dweetio.dweet_for("watchdog16", {some:jsonConcat(datos,jsonConcat(data,error))}, function(err, dweet){});

			});

			console.log("Test realizado con Exito!!!");

		});
});

function jsonConcat(o1, o2) {
 for (var key in o2) {
  o1[key] = o2[key];
 }
 return o1;
}
