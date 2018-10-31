/**
 * Creates a (horizontally) mirrored image which is stored
 * at the outputImagePath. If no outputImagePath is provided,
 * '-flipped' is appended to the name. Supports JPG and PNG files.
 * @param {String} imagePath The path to the image
 * @param {String} outputImagePath The path to the output image
 * @return {Promise} when completed containing the new filepath.
 *                   Contains error if unable to flip
 */
const flipImage = (imagePath, outputImagePath) => {
  const gm = require('gm');
  if (outputImagePath == null) {
    const path = require('path');
    outputImagePath = path.join(path.dirname(imagePath),
        path.parse(imagePath).name + '-flipped' + path.extname(imagePath));
  }
  return new Promise((resolve, reject) => {
    gm(imagePath).flop().write(outputImagePath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(outputImagePath);
      }
    });
  });
};

/**
 * Returns an SVG from a JPG or a PNG file
 * @param {String} filePath the path to the file
 * @param {String} outputImagePath file is written to this path.
 * @return {Promise} a promise containing the outputImagePath if successfull
 *                   or containing the err if not.
 */
const getSVG = (filePath, outputImagePath) => {
  if (outputImagePath == null) {
    const path = require('path');
    outputImagePath = path.join(path.dirname(filePath),
        (path.parse(filePath).name + '.svg'));
  }
  return new Promise((resolve, reject) => {
    require('potrace').trace(filePath, (err, svg) => {
      if (err) {
        reject(err);
      } else {
        require('fs').writeFile(outputImagePath, svg, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(outputImagePath);
          }
        });
      }
    });
  });
};

exports.flipImage = flipImage;
exports.getSVG = getSVG;
