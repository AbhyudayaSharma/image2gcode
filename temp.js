const gcode = require('./src/gcodegenerator');

gcode.generateGCode('./test/lines.jpg', {toolDiameter: 1}).then((data) => {
  require('fs').writeFileSync('./test.gcode', data);
}).catch((err) => {
  console.log('error', err);
});
