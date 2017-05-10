var speedTest = require('./node_modules/speedtest-net/');
var dweetClient = require('./node_modules/node-dweetio/');
//var schedule = require('./node_modules/node-schedule/');
var shell = require('./node_modules/shelljs');
var dngl = require("dngl");

var dweetio = new dweetClient();
var device = new dngl("/dev/ttyUSB2");
var datos;

		shell.exec("sudo route add 10.64.64.64 ppp0");
		shell.exec("sudo route add default gw 10.64.64.64 ppp0");

		test = speedTest({maxTime: 5000});
		test.once('data', function(data) {

			datos = data;

			device.once('data', function(data){


				shell.exec("sudo route del default gw 10.64.64.64 ppp0");
				shell.exec("sudo route del 10.64.64.64")
				dweetio.dweet_for("watchdog16", {some:jsonConcat(datos,data)}, function(err, dweet){

				if(!err){

					console.log("Test Realizado");
					shell.exec("sleep 5")
					shell.exec("killall node");

				}else{

					console.log("Datos no Enviados");
					shell.exec("sleep 5");
					//shell.exec("sudo reboot");

				}
				});
			});

		});



		test.on('error', function(err){

			console.log("Error en test");
			shell.exec("sleep 5")
			//shell.exec("sudo reboot");
			envioError("Error_Test");

		});

		device.on("error", function(err){

      console.log("Error en device");
			shell.exec("sleep 5");
			envioError("Error_Device")
			//shell.exec("sudo reboot");
      //console.log("Error en device");

		});



//});

function jsonConcat(o1, o2) {
 for (var key in o2) {
  o1[key] = o2[key];
 }
 return o1;
}

function envioError(error){

	datos = [{"error":error}];

	dweetio.dweet_for("watchdog16", {some:datos}, function(err, dweet){

	if(!err){

		console.log("Error Reportado "+error);
		shell.exec("sleep 5");
		shell.exec("killall node");

	}else{

		console.log("Error No Reportado "+error);
		shell.exec("sleep 5");
		//shell.exec("killall node");
		shell.exec("sudo reboot");

		}
		});
	}
