#!/usr/bin/env node

var moment = require("moment");
var events = require("events");
var modem = require("modem");
var fs = require("fs");

function dngl(device, interval){
	if (!(this instanceof dngl)) return (new dngl(device, interval));
	var self = this;
	
	var interval = (typeof interval !== "number") ? 1000 : parseInt(interval);
	
	// check if modem exists
	if (!fs.existsSync(device)) {
		process.nextTick(function(){
			self.emit("error", new Error("Device does not exist: "+device));
		});
		return self;
	}
	
	self.modem = new modem.Modem();
	self.open = false;
	self.modem.open(device, function(){
		self.open = true;
		self.send("AT", function(err, status, data){
			if (err) return self.emit("error", err);
			if (status !== "OK") return self.emit("error", "AT returned "+status);
			self.prepare(function(err){
				if (err) return self.emit("error", err);
				setInterval(function(){
					self.check();
				}, interval);
				self.check();
			});
		});
		self.modem.on("error", function(err){
			return self.emit("error", err);
		});
		self.modem.on("close", function(err){
			if (self.open) {
				self.open = false;
				self.emit("close");
				try {
					self.modem.close();
				} catch(e) {
					return self.emit("error", e);
				}
			}
		});
	});
	return this;
};

/* clone prototype from event emitter */
dngl.prototype = Object.create(events.EventEmitter.prototype);

dngl.prototype.prepare = function(callback){
	var self = this;
	// enable cell id
	self.send("AT+CREG=2", function(err, status, data){
		if (err) return callback(err);
		if (status !== "OK") return callback(new Error("AT+CREG=2 failed: "+status+" "+data));
		// enable numeric operator format
		self.send("AT+COPS=3,2", function(err, status, data){
			if (err) return callback(err);
			if (status !== "OK") return callback(new Error("AT+COPS=3,2 failed: "+status+" "+data));
			// FIXME: request IMEI, IMSI, etc here
			self.imsi(function(err, imsi){
				if (err) return self.emit("error", err);
				self.imsi = imsi;
				self.imei(function(err, imei){
					if (err) return self.emit("error", err);
					self.imei = imei;
					callback(null);
				});
			});
		});
	});
};

// check get all information and compile it 
dngl.prototype.check = function(){
	var self = this;
	self.signalstrength(function(signal_err, signal){
		if (signal_err) self.emit("error-signal", signal_err);
		self.cellid(function(cellid_err, cellid){
			if (signal_err) self.emit("error-cellid", cellid_err);
			self.service(function(service_err, service){
				if (service_err) self.emit("error-service", service_err);
				self.time(function(time_err, time){
					if (time_err) self.emit("error-time", time_err);
					// FIXME: error checking
					self.emit("data", {
						imsi: self.imsi,
						imei: self.imei,
						signal: signal,
						cell: cellid,
						service: service,
						time: time
					});
				});
			});
		});
	});
		
};

dngl.prototype.imsi = function(callback){
	var self = this;
	self.send("AT+CIMI", function(err, status, data){
		if (err) return callback(err);
		if (status !== "OK") return callback(new Error("Failed AT+CIMI"));
		var result = (data.match(/^([0-9]{6,15})$/));
		if (!result) return callback(new Error("Failed AT+CIMI"));
		callback(null, parseInt(result[1],10));
	});
};

dngl.prototype.imei = function(callback){
	var self = this;
	self.send("AT+CGSN", function(err, status, data){
		if (err) return callback(err);
		if (status !== "OK") return callback(new Error("Failed AT+CGSN"));
		var result = (data.match(/^([0-9]{14,15})/));
		if (!result) return callback(new Error("Failed AT+CGSN"));
		callback(null, parseInt(result[1],10));
	});
};

dngl.prototype.time = function(callback){
	var self = this;
	self.send("AT+CCLK?", function(err, status, data){
		if (err) return callback(err);
		if (status !== "OK") return callback(new Error("Failed AT+CCLK?"));
		var result = (data.match(/^\+CCLK: ([0-9]{4}\/[0-9]{2}\/[0-9]{2},[0-9]{2}:[0-9]{2}:[0-9]{2})/));
		if (!result) return callback(new Error("Failed AT+CCLK?"));
		var datetime = moment(result[1], "YYYY/DD/MM,HH:mm:ss");
		if (!datetime.isValid()) return callback(new Error("Failed AT+CCLK?"));
		callback(null, datetime.unix());
	});
};

dngl.prototype.signalstrength = function(callback){
	var self = this;
	self.send("AT+CSQ", function(err, status, data){
		if (err) return callback(err);
		if (status !== "OK") return callback(new Error("Failed AT+CSQ"));
		var signal = (data.match(/^\+CSQ: ([0-9]{1,2}),99$/));
		if (!signal) return callback(new Error("Failed AT+CSQ"));
		if (signal[1] === "99") return callback(null, -Infinity);
		callback(null, (-113+(parseInt(signal[1],10)*2)));
	});
};

dngl.prototype.cellid = function(callback){
	var self = this;
	self.send("AT+CREG?", function(err, status, data){
		if (err) return callback(err);
		if (status !== "OK") return callback(new Error("Failed Request AT+CREG?"));
		var cellid = data.match(/^\+CREG: ([0-2]),([0-5])(, ?([0-9A-F]+), ?([0-9A-F]+)(, ?([0-7]))?)?$/);
		if (!cellid) return callback(new Error("Parse Error AT+CREG?"));
		callback(null, {
			stat: parseInt(cellid[2],10),
			lac: (typeof cellid[4] === "string") ? parseInt(cellid[4].toLowerCase(),16) : null,
			cell: (typeof cellid[5] === "string") ? parseInt(cellid[5].toLowerCase(),16) : null,
			act: (typeof cellid[7] === "string") ? parseInt(cellid[7],10) : null
		});
	});
};

dngl.prototype.service = function(callback){
	var self = this;
	self.send("AT+COPS?", function(err, status, data){
		if (err) return callback(err);
		if (status !== "OK") return callback(new Error("Failed Request AT+CREG?"));
		var result = data.match(/^\+COPS: ([0-4])(,([0-2]),"([^"]+)"(,([0-7]))?)?$/);
		if (!result) return callback(new Error("Parse Error AT+COPS?"));
		callback(null, {
			operator: (typeof result[4] === "string") ? result[4] : null,
			mode: (typeof result[6] === "string") ? parseInt(result[6],10) : null
		});
	});
};

dngl.prototype.send = function(command, callback, iteration){
	var iteration = (!iteration) ? 0 : iteration;
	if (iteration >= 5) return callback(new Error("SIM does not reply"));
	var self = this;
	self.modem.execute(command, function(data, status){
		status = (typeof status === "string") ? status.trim() : false;
		data = (typeof data === "string") ? data.trim() : "";
		if (status === "+CME ERROR: SIM busy") {
			self.emit("sim-busy");
			return setTimeout(function(){
				self.send(command, callback, iteration++);
			},500);
		};
		self.emit("command", command, data, status);
		callback(null, status, data);
	}, false, 500);	
};

module.exports = dngl;
