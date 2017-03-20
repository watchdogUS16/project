# dngl

Use a 3g/4g USB data dongle to log mobile network data. Works with Huawei 3g-modems e173 and e220 with somewhat recent firmware, not tested with any other.

## install

```
npm install dngl
```

## usage

``` javascript
var dngl = require("dngl");

var device = new dngl("/dev/cu.HUAWEIMobile-Modem"); // put your device here

device.on("data", function(data){
	console.log(data);
});

device.on("error", function(err){
	console.error("error:", err);
});

device.on("close", function(){
	console.log("device is gone.");
});

``` 


## data

The data object looks like 

``` javascript
{
	imsi: 262075211009024,
	imei: 865633017939267,
	signal: -83,
	cell: { 
		stat: 1, 
		lac: 21934, 
		cell: 12831, 
		act: null 
	},
	service: { 
		operator: '26207', 
		mode: 2
	},
	time: 328659477
}
``` 

### imsi and imei

The [International Mobile Subscriber Identity](http://en.wikipedia.org/wiki/International_mobile_subscriber_identity) `imsi` and [International Mobile Equipment Identity](http://en.wikipedia.org/wiki/International_Mobile_Station_Equipment_Identity) `imei`.

### signal

`signal` is the received signal strength in [dBm](http://en.wikipedia.org/wiki/DBm); According to the spec, this is somewhere bewtween -113 (worst) and -51 (best) or -Infinity (no signal);

### cell

`stat` indicates the network registration status. 

* **0** not registered, not searching new operator
* **1** registered, home network
* **2** not registered, searching new operator
* **3** registration denied
* **4** unknown (probably no service)
* **5** registered, roaming
* **6** registered, home network, sms only (only for lte/4g)
* **7** registered, roaming, sms only (only for lte/4g)
* **8** emergency services only
* **9** registered, home network (only for lte/4g)
* **10** registered, roaming (only for lte/4g)

(this is very brief, if interested, read the specs.)

`lac` [Location Area Code](http://en.wikipedia.org/wiki/Location_area#Location_area) in decimal notation

`cell` [Cell ID](http://en.wikipedia.org/wiki/Cell_ID) in decimal notation

`act` is the access technology (as obtained by AT+CREG?). *this is optional and seems never to be provided. use `service.mode` instead.*

* **0** GSM
* **1** GSM Compact (this does not exist)
* **2** UTRAN (what normal people call "3g" or "UMTS")
* **3** GSM w/EGPRS (also known as EDGE)
* **4** UTRAN w/HSDPA (3g with download-booster)
* **5** UTRAN w/HSUPA (3g with upload-booster)
* **6** UTRAN w/HSDPA and HSUPA (3g with up- and download-booster)
* **7** E-UTRAN (what is known as "4g" or "LTE")

### service

`operator` the [Mobile Country Code](http://en.wikipedia.org/wiki/Mobile_Country_Code) and [Mobile Network Code](http://en.wikipedia.org/wiki/Mobile_Network_Code) tuple.

`service` is the access technology (as obtained by AT+COPS?). 

* **0** GSM
* **1** GSM Compact (this does not exist)
* **2** UTRAN (what normal people call "3g" or "UMTS")
* **3** GSM w/EGPRS (also known as EDGE)
* **4** UTRAN w/HSDPA (3g with download-booster)
* **5** UTRAN w/HSUPA (3g with upload-booster)
* **6** UTRAN w/HSDPA and HSUPA (3g with up- and download-booster)
* **7** E-UTRAN (what is known as "4g" or "LTE")

### time

`time` the current time on the clock of the SIM as a unix timestamp. *be aware that this most certainly does not give you the current time.*

## license

[Public Domain](http://unlicense.org/UNLICENSE)

## contributions

contributions welcome, send pull requests. if you want your device supported, send me one. 

[![Flattr this git repo](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=yetzt&url=https://github.com/yetzt/node-dngl&title=dngl&language=de&tags=github&category=software)




