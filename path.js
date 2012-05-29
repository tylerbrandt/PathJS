/*jslint sloppy: true, white: true, plusplus: true, maxerr: 50, indent: 4 */

var Path = function(init) {
	
	/**
	 * Initialize a Path from SVG string [init]
	 */
	var parseSVGString = function(init) {
		var i, len, tokens, token, tuple = null, coord, lastPoint,
			initialTokens = ['M'],
			interiorTokens = ['L','l'],
			endTokens = ['z'];	

		if(init !== '') {
			// SVG String should be whitespace-separated	
			tokens = init.split(/\s+/);
			for (i = 0, len = tokens.length; i < len; i++) {
				// each triple of (command, x, y) represents a path element
				token = tokens[i];
				if (tuple === null) {
					// next token should be a command
					if(i === 0 && initialTokens.indexOf(token) !== -1) {
						// absolute moveto
						tuple = [token];
					} else if(i > 0) {
						if(interiorTokens.indexOf(token) !== -1) {
							tuple = [token];
						} else if (i === len - 1 && endTokens.indexOf(token) !== -1) {
							// last token can be a z
							this.closed = true;
						} else {
							throw new Error('Interior token must be one of: [' + interiorTokens.join(',') + ']');
						}
					} else {
						throw new Error('SVG String must start with one of: [' + initialTokens.join(',') + ']');
					}
				} else {
					coord = parseInt(token, 10);
					if(isNaN(coord)) {
						throw new Error('SVG String must contain only integral points');
					} else {
						if (tuple[0] === 'l') {
							// relative lineto -- note: once converted into a Path, all points 
							// become absolute points, regardless of their original specification
							// (since the "array" only holds coordinates, not directives)
							coord += lastPoint[tuple.length - 1];
						}

						tuple.push(coord);
						if (tuple.length === 3) {
							// second and third elements of tuple represent the point coordinates
							lastPoint = tuple.slice(1,3);
							this.push(lastPoint);
							tuple = null;
						}
					}
				}
			}

			if (tuple !== null) {
				// extra stuff on the end
				throw new Error('Extra content on the end of SVG string');
			}
		}
	};

	if (arguments.length === 1 && typeof init === 'string') {
		parseSVGString.call(this, init);
	} else if (arguments.length === 1 && init instanceof Array) {
		// multiple points specified as an Array
		if(init.length !== 0 && init[0] instanceof Array) {
			this.push.apply(this, init);
		}
	} else if (arguments.length > 1) {
		throw new Error("Path takes a single argument of string or array (of points) type");
	}
};

// Path inherits from Array
Path.prototype = [];

/**
 * Generate a new Path from the Points of the current instance, with the same properties (e.g. closed)
 */
Path.prototype.clone = function() {
	var clone = this.slice(0);
	if (this.closed) {
		clone.closed = true;
	}
	return clone;
};

/**
 * Return an SVG-formatted string from Path instance
 */
Path.prototype.toString = function() {
	var i, len = this.length, tokens = [];

	if(len === 0) {
		return '';
	}

	for (i = 0; i < len; i++) {
		if(i === 0) {
			tokens.push('M');
		} else {
			tokens.push('L');
		}
		tokens.push(this[i][0]);
		tokens.push(this[i][1]);
	}

	if (this.closed) {
		tokens.push('z');
	}

	return tokens.join(' ');
};

// Standard Array functions

Path.prototype.map = function() {
	return new Path(Array.prototype.map.apply(this, arguments));
};

Path.prototype.filter = function() {
	return new Path(Array.prototype.filter.apply(this, arguments));
};

Path.prototype.slice = function() {
	return new Path(Array.prototype.slice.apply(this, arguments));
};