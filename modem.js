var dngl = require("dngl");

var device = new dngl("/dev/ttyUSB2");
var jsonfile = require("jsonfile");
device.once("data", function(data){
	
	console.log(data);
	
        jsonfile.writeFile("./prueba.json", data, function(err){
       		 if(err){
                	return console.log(err);
        	}else{
        		console.log("The file is saved!");
			process.exit(1);
		}
	});
});
