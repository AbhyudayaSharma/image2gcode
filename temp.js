const gcode = require('./src/svg2gcode');
const potrace = require('potrace');
const fs = require('fs');

potrace.trace('./test/lines.png', async (err, svg) => {
  if (err) {
    throw err;
  }
  fs.writeFileSync('./test.svg', svg);
  const ret = await gcode.getGcode('./test.svg', {toolDiameter: 1});
  fs.writeFile('./test.gcode', ret, (err) => {
    if (err) {
      console.log(err);
    }
    process.exit(0);
  });
});
