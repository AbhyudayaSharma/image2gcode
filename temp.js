const gcode = require('./bin/svg2gcode');

console.log(gcode.getGcode('./test/star.svg', {toolDiameter: 1}));

process.exit(0);
