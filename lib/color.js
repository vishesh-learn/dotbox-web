function randomColor() {
	var hueList = [];

	game.playerList.forEach(player => {
		if (player.color) {
			hueList.push(hexToHslObject(player.color).h);
		} else if(player.hue) {
			hueList.push(player.hue);
		}
	});

	let hue;
	for (let i = 0; i <= 359; i++) {
		hue = getRndInteger(0, 359);

		if (!(hue in hueList)) {
			return new Color(`hsl(${hue}, 70%, 70%)`).hex;
		}
	}
}

function hexToHslObject(hex) {
	let hsl = new Color(hex).hsl;

	let hslValues = hsl.substring(4, hsl.length - 1).split(',');

	return {
		h: parseInt(hslValues[0]),
		s: parseInt(hslValues[1].substring(0, hslValues[1].length - 1)),
		l: parseInt(hslValues[2].substring(0, hslValues[2].length - 1))
	}
}

function hslToHex(hslObject) {
	let rgbValues = hslToRgb(hslObject.h, hslObject.s, hslObject.l);
	return rgbToHex(rgbValues[0], rgbValues[1], rgbValues[2]);
}

/************ by ChatGPT */
class Color {
	constructor(colorValue) {
		this.colorValue = colorValue;
	}

	set(value) {
		this.colorValue = value;
	}

	get rgb() {
		if (this.colorValue.startsWith('#')) {
			const hex = this.colorValue.substring(1);
			const r = parseInt(hex.substring(0, 2), 16);
			const g = parseInt(hex.substring(2, 4), 16);
			const b = parseInt(hex.substring(4, 6), 16);
			return `rgb(${r}, ${g}, ${b})`;
		} else if (this.colorValue.startsWith('rgb(')) {
			return this.colorValue;
		} else if (this.colorValue.startsWith('hsl(')) {
			const hslValues = this.colorValue.substring(4, this.colorValue.length - 1).split(',');
			const h = parseInt(hslValues[0]);
			const s = parseInt(hslValues[1].substring(0, hslValues[1].length - 1));
			const l = parseInt(hslValues[2].substring(0, hslValues[2].length - 1));
			const rgbValues = hslToRgb(h, s, l);
			return `rgb(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]})`;
		} else {
			throw new Error('Invalid color format');
		}
	}

	get hex() {
		if (this.colorValue.startsWith('#')) {
			return this.colorValue;
		} else if (this.colorValue.startsWith('rgb(')) {
			const rgbValues = this.colorValue.substring(4, this.colorValue.length - 1).split(',');
			const r = parseInt(rgbValues[0]);
			const g = parseInt(rgbValues[1]);
			const b = parseInt(rgbValues[2]);
			return rgbToHex(r, g, b);
		} else if (this.colorValue.startsWith('hsl(')) {
			const hslValues = this.colorValue.substring(4, this.colorValue.length - 1).split(',');
			const h = parseInt(hslValues[0]);
			const s = parseInt(hslValues[1].substring(0, hslValues[1].length - 1));
			const l = parseInt(hslValues[2].substring(0, hslValues[2].length - 1));
			const rgbValues = hslToRgb(h, s, l);
			return rgbToHex(rgbValues[0], rgbValues[1], rgbValues[2]);
		} else {
			throw new Error('Invalid color format');
		}
	}

	get hsl() {
		if (this.colorValue.startsWith('#')) {
			const hex = this.colorValue.substring(1);
			const r = parseInt(hex.substring(0, 2), 16);
			const g = parseInt(hex.substring(2, 4), 16);
			const b = parseInt(hex.substring(4, 6), 16);
			const hslValues = rgbToHsl(r, g, b);
			return `hsl(${hslValues[0]}, ${hslValues[1]}%, ${hslValues[2]}%)`;
		} else if (this.colorValue.startsWith('rgb(')) {
			const rgbValues = this.colorValue.substring(4, this.colorValue.length - 1).split(',');
			const r = parseInt(rgbValues[0]);
			const g = parseInt(rgbValues[1]);
			const b = parseInt(rgbValues[2]);
			const hslValues = rgbToHsl(r, g, b);
			return `hsl(${hslValues[0]}, ${hslValues[1]}%, ${hslValues[2]}%)`;
		} else if (this.colorValue.startsWith('hsl(')) {
			return this.colorValue;
		} else {
			throw new Error('Invalid color format');
		}
	}
}

function rgbToHex(r, g, b) {
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function hslToRgb(h, s, l) {
	// Convert hue to a value between 0 and 360
	if (h < 0) {
		h = h + 360;
	}
	h = h % 360;

	// Convert saturation and lightness to values between 0 and 1
	s = s / 100;
	l = l / 100;

	// If the saturation is 0, the color is a shade of gray
	if (s === 0) {
		const gray = Math.round(l * 255);
		return [gray, gray, gray];
	}

	// Calculate the chroma
	const c = (1 - Math.abs(2 * l - 1)) * s;

	// Calculate the x value
	const x = c * (1 - Math.abs((h / 60) % 2 - 1));

	// Calculate the m value
	const m = l - c / 2;

	let r, g, b;

	// Calculate RGB values based on the hue value
	if (h >= 0 && h < 60) {
		r = c;
		g = x;
		b = 0;
	} else if (h >= 60 && h < 120) {
		r = x;
		g = c;
		b = 0;
	} else if (h >= 120 && h < 180) {
		r = 0;
		g = c;
		b = x;
	} else if (h >= 180 && h < 240) {
		r = 0;
		g = x;
		b = c;
	} else if (h >= 240 && h < 300) {
		r = x;
		g = 0;
		b = c;
	} else {
		r = c;
		g = 0;
		b = x;
	}

	// Convert RGB values to integers between 0 and 255
	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return [r, g, b];
}

function rgbToHsl(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h, s, l = (max + min) / 2;
	if (max === min) {
		h = s = 0;
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}
	return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}
