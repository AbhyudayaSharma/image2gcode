const app = require('express')();

app.get('/', async (req, res) => {
  let gcode = await require('./src/gcodegenerator')
      .generateGCode('./test/lines.png', {toolDiameter: 1});
  gcode = gcode.toString();
  res.send(gcode.replace(/\n/g, '<br />'));
});

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
