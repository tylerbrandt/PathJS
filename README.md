# path.js

Implements an SVG Path constructor based on the following spec:

## path

Without using any external libraries, create a 2D "Path" constructor in JavaScript that accepts either an array of points (which are arrays themselves of length two) or a subset of an SVG path string (see http://www.w3.org/TR/SVG/paths.html), where only the moveto, closepath and lineto commands are accepted. The path must be connected, so the moveto command must only appear at the beginning and the closepath may optionally appear only at the end. The lineto must accept both absolute and relative integer coordinates.

The Path objects must inherit from Arrays, so all array methods should work on Path objects. This means that new Path instanceof Path and new Path instanceof Array must both return true.

A Path object must have a clone method that returns a new Path with the same points and a toString method that returns an SVG path string representing the Path. Additionally, the methods map, filter, and slice must return Path objects rather than pure arrays.

This implementation only needs to function in the latest versions of Firefox and Safari.

## Notes

Only a subset of the SVG path string is implemented. In particular:

* Only the instructions 'M', 'L', 'l', and 'z' are recognized
* Paths must begin with the 'M' instruction and have only 'L' or 'l' instructions in the interior
* Spaces between the instruction character and the coordinates are NOT optional
* It is necessary to specify an instruction for each element of the Path, even for repeated applications of the same instruction.

It is not guaranteed that (new Path(str)).toString() === str. This is because the SVG input string may include relative coordinates ('l'), but Paths are represented internally as an Array of 2-element Arrays. Thus, all Path output strings will be in ABSOLUTE ('L') terms.