const gcode = require('./src/gcodegenerator');
const potrace = require('potrace');
const fs = require('fs');

potrace.trace('./test/lines.jpg', {optCurve: false}, async (err, svg) => {
  if (err) {
    throw err;
  }
  fs.writeFileSync('./test.svg', svg);
  const ret = await gcode.generateGCode('./test.svg',
      {toolDiameter: 1, feed: 50});
  console.log(`This is the data: ${ret}`);
  fs.writeFile('./test.gcode', ret, (err) => {
    if (err) {
      console.log(err);
    }
    process.exit(0);
  });
});
