var speedTest = require('./node_modules/speedtest-net/');
var dweetClient = require('./node_modules/node-dweetio/');
var dweetio = new dweetClient();
var schedule = require('./node_modules/node-schedule/');

var dngl = require("dngl");
var device = new dngl("/dev/ttyUSB2");
var jsonfile = require("jsonfile");
var datos

device.once("data", function(data){

	datos = data;

	dweetio.dweet_for("watchdog16", {some:datos}, function(err, dweet){
	});
	// console.log(data);
	//
  //       jsonfile.writeFile("./prueba.json", data, function(err){
  //      		 if(err){
  //               	return console.log(err);
  //       	}else{
  //       		console.log("The file is saved!");
	// 		process.exit(1);
		// }
	// });
});

// var j = schedule.scheduleJob('*/10 * * * * *', function(){
//
// 		test = speedTest.visual({maxTime: 5000});
// 		var modem_data = require(modem);
// 		test.on('data', function(data) {
//
// 			dweetio.dweet_for("watchdog16", {some:data}, function(err, dweet){
// 			});
// 			console.log("Test realizado con Exito!!!");
// 		});
// });
