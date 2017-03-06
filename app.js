var speedTest = require('./node_modules/speedtest-net/');
var dweetClient = require('./node_modules/node-dweetio/');
var dweetio = new dweetClient();
var schedule = require('./node_modules/node-schedule/');

var dngl = require("dngl");
var device = new dngl("/dev/ttyUSB2");
var datos
var j = schedule.scheduleJob('*/30 * * * * *', function(){

		test = speedTest.visual({maxTime: 5000});
		test.on('data', function(data) {

			datos = data;

			device.once("data", function(data){

				dweetio.dweet_for("watchdog16", {some:jsonConcat(datos,data)}, function(err, dweet){});

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
