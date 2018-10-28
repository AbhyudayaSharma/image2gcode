// const svg2gcode = require('../bin/svg2gcode');
const assert = require('assert');

describe('Convert to svg', () => {
  const potrace = require('potrace');
  describe('Test jpg files', () => {
    it('output should not be empty', (done) => {
      // check if file exists
      const file = './test/lines.jpg';
      require('fs').exists(file, (exists) => {
        assert.equal(exists, true);
      });
      potrace.trace(file, (err, svg) => {
        if (err) done(err);
        done();
      });
    });
  });

  describe('Test png files', () => {
    it('output should not be empty', (done) => {
      // check if file exists
      const file = './test/lines.png';
      require('fs').exists(file, (exists) => {
        assert.equal(exists, true);
      });
      potrace.trace(file, (err, svg) => {
        if (err) done(err);
        done();
      });
    });
  });
});

// describe('Get GCode from SVG', () => {
//   describe('star.svg', () => {
//     it('should not be empty and contain valid GCode', () => {
//       console.log('running test');
//       const gcode = svg2gcode.getGcode('./test/star.svg', {toolDiameter: 1});
//       console.log(gcode);
//       assert.strictEqual(gcode.indexOf('ERROR'), -1);
//       assert.notStrictEqual(gcode.indexOf('G1', -1));
//       assert.notStrictEqual(gcode.indexOf('G0'), -1);
//     });
//   });
// });
