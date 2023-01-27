function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function hueString(h, s, l) {
	return `hsl(${h}, ${s}, ${l})`;
}

function randomHue(players) {
    var hues = [];

    for(var p of players){
        hues.push(p.hue);
    }

    for(let i=0; i < 10; i++){
        var hue = getRndInteger(0, 359);

        if(!(hue in hues)){
            break;
        }
    }

    return hue;
}

function hsl_to_rgb(h, s, l){
	var s = s / 100;
	var l = l / 100;

	s = s.toFixed(2);
	l = l.toFixed(2);

	let c = (1 - Math.abs(2 * l - 1)) * s,
		x = c * (1 - Math.abs((h / 60) % 2 - 1)),
		m = l - c/2,
		r = 0,
		g = 0,
		b = 0;

	if (0 <= h && h < 60) {
		r = c; g = x; b = 0;
	} else if (60 <= h && h < 120) {
		r = x; g = c; b = 0;
	} else if (120 <= h && h < 180) {
		r = 0; g = c; b = x;
	} else if (180 <= h && h < 240) {
		r = 0; g = x; b = c;
	} else if (240 <= h && h < 300) {
		r = x; g = 0; b = c;
	} else if (300 <= h && h < 360) {
		r = c; g = 0; b = x;
	}

	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return {r: r, g:g, b:b}
}

function rgb_to_hex(rgb){
	let hr = rgb.r.toString(16);
	let hg = rgb.g.toString(16);
	let hb = rgb.b.toString(16);

	if(hr == "0")
		hr = "00";
	if(hg == "0")
		hg = "00";
	if(hb == "0")
		hb = "00";

	return "#"+hr+hg+hb;
}
