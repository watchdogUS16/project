#!/sur/bin/env node

var dur = module.exports = function(s, d) {
	if (typeof s === "number") return Math.round(s);
	var d = (typeof d === "number") ? Math.round(d) : null;
	if (typeof s !== "string") return d;
	var tot = 0.0;
	var atoms = s.toLowerCase().match(/[0-9]+([\.,][0-9]+)?\s*(weeks|week|day|days|min|mins|minutes|minute|hrs|hr|hour|hours|sec|secs|second|seconds|[wdhms])/g);
	if (!atoms) return d;
	atoms.forEach(function(m){
		var match = m.match(/^(([0-9]+)([\.,][0-9]+)?)\s*(weeks|week|day|days|min|mins|minutes|minute|hrs|hr|hour|hours|sec|secs|second|seconds|[wdhms])$/);
		var num = parseFloat(match[1].replace(/,/g,'.'));
		switch(match[4]) {
			case "s":
			case "sec":
			case "secs":
			case "second":
			case "seconds":
				tot += (num * 1000);
			break;
			case "m":
			case "min":
			case "mins":
			case "minute":
			case "minutes":
				tot += (num * 60000);
			break;
			case "h":
			case "hr":
			case "hrs":
			case "hour":
			case "hours":
				tot += (num * 3600000);
			break;
			case "d":
			case "day":
			case "days":
				tot += (num * 86400000);
			break;
			case "w":
			case "week":
			case "weeks":
				tot += (num * 604800000);
			break;
		}
	});
	return Math.round(tot);
};
