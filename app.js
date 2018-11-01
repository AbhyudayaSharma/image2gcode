const express = require('express');
const app = express();

app.use('/public', express.static('public'));

app.get('/', async (req, res) => {
  // let gcode = await require('./src/gcodegenerator')
  //     .generateGCode('./test/lines.png', {toolDiameter: 1});
  // gcode = gcode.toString();
  // res.send(gcode.replace(/\n/g, '<br />'));
  res.sendFile('index.html', {root: __dirname}, (err) => {
    if (err) {
      res.send(`ERROR: ${err}`);
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
