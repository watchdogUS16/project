var dblite = require('./node_modules/dblite');
var db = dblite('dbReports.sqlite');
var shell = require('./node_modules/shelljs');

db.query('SELECT * FROM Report', {
  idReport: Number,
  value: JSON.parse, // value unserialized
  value2: JSON.parse
}, function (err, rows) {

var cont = 0;
var now = new Date();
var temp = shell.exec("/opt/vc/bin/vcgencmd measure_temp");
var ramT = shell.exec("egrep --color 'MemTotal' /proc/meminfo | egrep '[0-9.]{4,}'");
var ramF = shell.exec("egrep --color 'MemFree' /proc/meminfo | egrep '[0-9.]{4,}'");
var cpu = shell.exec("top -d 0.5 -b -n2 | grep 'Cpu(s)'|tail -n 1 | awk '{print $2 + $4}'");
var ps = shell.exec("ps -a");

for(var i=rows.length-1; i>=rows.length-3; i--){
 	var record = rows[i];
	if(record.value2>0){
	
		cont++;
	
	}
}
	if(cont>2){

		db.query('INSERT INTO Report VALUES(null,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [now,-1,concat(temp,ramT,ramF,cpu,ps),null,null,null,null,null,null,null,null,null,null,null,null]);
		//console.log("Hubo mas de 3 errores");
		shell.exec("sleep 5");
		shell.exec("sudo reboot");

	}else{

		//console.log("OK");
	}


});

function concat(o1,o2,o3,o4,o5){

	o4 = "CpuUsed: "+o4+"% ";
	o5 = "Ps: "+o5;

	return (o1+o2+o3+o4+o5).replace(/\n/gi," ");

}	
