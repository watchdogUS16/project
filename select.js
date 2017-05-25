var dblite = require('./node_modules/dblite'),

db = dblite('dbReports.sqlite');
db.query('SELECT * FROM Report');
