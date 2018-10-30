'use strict';

/**
 * Generates GCode on the given svg filepath
 * @param {String} filePath the path to the svg
 * @param {any} options Options for generating the GCode
 * @return {Promise} promise containing the generated GCode
 */
const generateGCode = async (filePath, options) => {
  // The old getGcode function is deprecated thanks to a
  // bug in the old svg2gcode code. This now runs the svg2gcode
  // as a command and captures its output. This is much more reliable.
  const spawnSync = require('child_process').spawnSync;
  const generatorArgs = ['./src/svg2gcode.js'];

  if (options.hasOwnProperty('speed')) {
    generatorArgs.push('-s', options.speed.toString());
  }

  if (options.hasOwnProperty('feed')) {
    generatorArgs.push('-f', options.feed.toString());
  }

  if (options.hasOwnProperty('depth')) {
    generatorArgs.push('-d', options.depth.toString());
  }

  if (options.hasOwnProperty('depthOfCut')) {
    generatorArgs.push('-c', options.depthOfCut.toString());
  }

  if (options.hasOwnProperty('width')) {
    generatorArgs.push('-w', options.width.toString());
  }

  if (options.hasOwnProperty('height')) {
    generatorArgs.push('-h', options.height.toString());
  }

  if (options.hasOwnProperty('top')) {
    generatorArgs.push('-t', options.top.toString());
  }

  if (options.hasOwnProperty('above')) {
    generatorArgs.push('-a', options.above.toString());
  }

  if (options.hasOwnProperty('toolDiameter')) {
    generatorArgs.push('-D', options.toolDiameter.toString());
  } else {
    throw new Error('Specifying tool diameter is necessary');
  }

  if (options.hasOwnProperty('positive') && options.positive === true) {
    generatorArgs.push('--positive');
  }

  return new Promise((resolve, reject) => {
    generatorArgs.push('./test/star.svg');
    const child = spawnSync('node', generatorArgs,
        {shell: true, stdio: ['inherit', 'pipe', 'pipe', 'pi']});
    resolve(child.stdout.toString());
  });
};

exports.generateGCode = generateGCode;
