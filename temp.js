const gcode = require('./bin/svg2gcode');
const potrace = require('potrace');
const fs = require('fs');

potrace.trace('./test/lines.png', (err, svg) => {
  if (err) {
    throw err;
  }
  fs.writeFileSync('./test.svg', svg);
  fs.writeFileSync('./test.gcode', gcode.getGcode('./test.svg',
      {toolDiameter: 1}));
  process.exit(0);
});
