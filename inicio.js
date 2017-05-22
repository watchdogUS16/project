var dblite = require('./node_modules/dblite');
var db = dblite('/home/project/dbReports.sqlite');
var now = new Date();
var shell = require('./node_modules/shelljs');

	db.query('CREATE TABLE IF NOT EXISTS Report (idReport INTEGER PRIMARY KEY, currentDate DATE, codError INTEGER, RBStatus TEXT, imsi INTEGER, imei INTEGER, downloadSpeed DOUBLE, uploadSpeed DOUBLE, operator INTEGER, mode INTEGER, time FLOAT, stat INTEGER, lac INTEGER, cell INTEGER, signal INTEGER)');
	db.query('INSERT INTO Report VALUES(null,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [now,-1,null,null,null,null,null,null,null,null,null,null,null,null,null]);

		shell.exec("sleep 30")
		shell.exec("sudo wvdial");
		shell.exec("sudo /etc/init.d/cron start");
