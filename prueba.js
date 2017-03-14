var schedule = require('./node_modules/node-schedule/');


var j = schedule.scheduleJob('*/30 * * * * *', function(){

    require('./app.js');

});
