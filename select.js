var dblite = require('./node_modules/dblite'),

db = dblite('dbReports.sqlite');
//db.query('SELECT * FROM test WHERE fecha <= "2017/05/16"');
db.query('SELECT * FROM Report');
