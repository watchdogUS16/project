JavaScript uses milliseconds as a representation of time, which hard to read. dur.js converts human readable strings to an integer of milliseconds while it's synchronous, very tolerant on input and easy to use.

## Install

``` 
npm install dur
```

## Usgae

```` javascript

var dur = require("dur");

/* 5 minutes */
console.log(dur("5m")); // = 300000

/* use as much or less units as you like */
console.log(dur("1d3h4m8s")); // = 97448000

/* time units are case insensitive and can be written rather verbose or abbrevated */
console.log(dur("1 Hr and 3 Secs")); // = 3603000

/* you can use floats */
console.log(dur("1 hour 3.4 minutes")); // 3804000

/* but everything will be rounded to milliseconds */
console.log(dur("4.12342323232 seconds")); // 4123

/* if you repeat yourself, it's added up */
console.log(dur("1 d 2d")); // 259200000

/* provide a default value if dealing with user input */
console.log(dur(undefined, 1234)); // 1234

/* else you will get null */
console.log(dur(undefined)); // null

````

## Time Units

* Week: `weeks`, `week`, `w`
* Days: `days`, `day`, `d`
* Hours: `hours`, `hour`, `hrs`, `hr`, `h`
* Minutes: `minutes`, `minute`, `mins`, `min`, `m`
* Seconds: `seconds`, `second`, `secs`, `sec`, `s`

## License

[Public Domain](http://unlicense.org/UNLICENSE).
