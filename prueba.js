var shell = require('./node_modules/shelljs');
var now = new Date()

shell.exec("now >> log.txt");
