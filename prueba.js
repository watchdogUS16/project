var shell = require('shelljs');

shell.exec("route del default gw 10.64.64.64 ppp0")
