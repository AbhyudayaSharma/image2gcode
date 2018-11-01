const gcodeGenerator = require('../src/gcodegenerator');
const imageUtils = require('../src/imageutils');
const assert = require('assert');

describe('Convert to svg', () => {
  describe('Test jpg files', () => {
    it('output should not be empty', () => {
      // check if file exists
      const file = './test/lines.jpg';
      require('fs').exists(file, (exists) => {
        assert.equal(exists, true);
      });
      return imageUtils.getSVG(file);
    });
  });

  describe('Test png files', () => {
    it('output should not be empty', () => {
      // check if file exists
      const file = './test/lines.png';
      require('fs').exists(file, (exists) => {
        assert.equal(exists, true);
      });
      return imageUtils.getSVG(file);
    });
  });
});

describe('Get GCode from SVG', () => {
  describe('star.svg', () => {
    it('should not be empty and contain valid GCode', (done) => {
      const promise = gcodeGenerator.generateGCode('./test/star.svg',
          {toolDiameter: 1});
      promise
          .then((data) => {
            assert.strictEqual(data.indexOf('ERROR'), -1);
            assert.notStrictEqual(data.indexOf('G1'), -1);
            assert.notStrictEqual(data.indexOf('G0'), -1);
            done();
          })
          .catch((err) => {
            done(err);
          });
    });
  });
});

describe('Flip image', () => {
  describe('Flip jpg files', () => {
    it('output should not be empty', async () => {
      // check if file exists
      const file = './test/lines.jpg';
      require('fs').exists(file, (exists) => {
        assert.strictEqual(exists, true);
      });
      const flippedFile = await imageUtils.flipAndScaleImage(file);
      require('fs').exists(flippedFile, (exists) => {
        assert.strictEqual(exists, true);
      });
    });
  });

  describe('Flip png files', () => {
    it('output should not be empty', async () => {
      // check if file exists
      const file = './test/lines.png';
      const flippedFile = './test/lines-flipped.png';
      require('fs').exists(file, (exists) => {
        assert.strictEqual(exists, true);
      });
      await imageUtils.flipAndScaleImage(file, flippedFile);
      require('fs').exists(flippedFile, (exists) => {
        assert.strictEqual(exists, true);
      });
    });
  });
});
