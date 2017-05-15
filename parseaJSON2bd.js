var speedTest = require('./node_modules/speedtest-net/');
var dweetClient = require('./node_modules/node-dweetio/');
var shell = require('./node_modules/shelljs');
var dngl = require("dngl");
var dblite = require('./node_modules/dblite'),

db = dblite('dbReports.sqlite');
var dweetio = new dweetClient();
var device = new dngl("/dev/ttyUSB2");
var datos;
var temp = shell.exec("/opt/vc/bin/vcgencmd measure_temp");
var ramT = shell.exec("egrep --color 'MemTotal' /proc/meminfo | egrep '[0-9.]{4,}'");
var ramF = shell.exec("egrep --color 'MemFree' /proc/meminfo | egrep '[0-9.]{4,}'");
var cpu = shell.exec("top -d 0.5 -b -n2 | grep 'Cpu(s)'|tail -n 1 | awk '{print $2 + $4}'");
var ps = shell.exec("ps -a");
db.query('CREATE TABLE IF NOT EXISTS test (imsi INTEGER PRIMARY KEY, downloadSpeed DOUBLE, uploadSpeed DOUBLE, imei INTEGER, operator INTEGER, mode INTEGER, RBStatus TEXT)');

		shell.exec("sudo route add 10.64.64.64 ppp0");
		shell.exec("sudo route add default gw 10.64.64.64 ppp0");

		test = speedTest({maxTime: 5000});
		test.once('data', function(data) {

			datos = data;
			datos1 = jsonConcat({"error":[{"error":" "}]},datos);
			var now = new Date();
			var jsonDate = now.toJSON();
			datos1 = jsonConcat({"actualDate":[{"date":jsonDate}]},datos1);
			device.once('data', function(data){


				shell.exec("sudo route del default gw 10.64.64.64 ppp0");
				shell.exec("sudo route del 10.64.64.64")
				dweetio.dweet_for("watchdog16", {some:jsonConcat(datos1,data)}, function(err, dweet){

				if(!err){

					console.log("Test Realizado");
					anadeaBD(jsonConcat(datos1,data),db);
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

function anadeaBD(json,db){
	db.query('INSERT INTO test VALUES(null,?,?,?,?,?,?)', [json.speeds.download, json.speeds.upload, json.imei, json.service.operator, json.service.mode,concat(temp,ramT,ramF,cpu,ps)]);
//	console.log(concatena(temp,ramT,ramF,ramT-ramF,cpu,ps));
//	db.query('INSERT INTO test VALUES(null, ?)', ['some text']);
	db.query('SELECT * FROM test');
}

function concat(o1,o2,o3,o4,o5){
	
	o4 = "CpuUsed: "+o4+"% ";
	o5 = "Ps: "+o5;
	
	return (o1+o2+o3+o4+o5).replace(/\n/gi," ");

}

function jsonConcat(o1, o2) {
 for (var key in o2) {
  o1[key] = o2[key];
 }
 return o1;
}

function cut(temp,n,m){
	
return temp.substring(n,m);	

}

function envioError(error){

	datos = {"error":[{"error":error}]};
	var now = new Date();
        var jsonDate = now.toJSON();
        datos1 = jsonConcat({"actualDate":[{"date":jsonDate}]},datos1);
	dweetio.dweet_for("watchdog16", {some:datos1}, function(err, dweet){

	if(!err){

		console.log(error+" Enviado");
		shell.exec("sleep 5");
		shell.exec("killall node");

	}else{

		console.log("Error No Reportado "+error);
		shell.exec("sleep 5");
		//shell.exec("killall node");
		shell.exec("reboot")

		}
		});
	}
