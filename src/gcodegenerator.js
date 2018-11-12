'use strict';

/**
 * Generates GCode on the given svg filePath
 * @param {String} filePath the path to the svg
 * @param {any} options Options for generating the GCode
 * @return {Promise} promise containing the generated GCode
 */
const generateGCode = async (filePath, options) => {
  // The old getGcode function is deprecated thanks to a
  // bug in the old svg2gcode code. This now runs the svg2gcode
  // as a command and captures its output. This is much more reliable.
  const spawn = require('child_process').spawn;
  const generatorArgs = ['./src/svg2gcode.js'];

  // No need to send feed to the childprocess,
  // Feed is added after 'G90' in the generated gcode.

  if (options.hasOwnProperty('speed')) {
    generatorArgs.push('-s', options.speed.toString());
  }

  if (options.hasOwnProperty('depth')) {
    generatorArgs.push('-d', options.depth.toString());
  }

  if (options.hasOwnProperty('depthOfCut')) {
    generatorArgs.push('-c', options.depthOfCut.toString());
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

  if (options.hasOwnProperty('retract')) {
    generatorArgs.push('-r', options.retract.toString());
  }

  if (options.hasOwnProperty('positive') && options.positive === true) {
    generatorArgs.push('--positive');
  }

  return new Promise(async (resolve, reject) => {
    const path = require('path');
    const ext = path.extname(filePath);
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      const imageUtils = require('./imageutils');
      filePath = await imageUtils.
          flipAndScaleImage(filePath, null, options.width, options.height);
      filePath = await imageUtils.getSVG(filePath);
    } else if (ext !== '.svg') {
      reject(new Error('Unsupported file type'));
    }
    generatorArgs.push(filePath);
    const child = spawn('node', generatorArgs,
        {shell: true, stdio: ['inherit', 'pipe', 'pipe', 'pipe']});
    let gcode = '';
    child.stdout.on('data', (data) => {
      gcode += data.toString();
    });

    child.on('close', (code) => {
      if (code == 0) {
        if (options.hasOwnProperty('feed')) {
          resolve(gcode.replace('G90\n',
              `G90\nF${options.feed.toString()}\n`) + 'M30\n');
        } else {
          resolve(`${gcode}M30\n`);
        }
      } else {
        reject(new Error('Unable to generate GCode'));
      }
    });
  });
};

exports.generateGCode = generateGCode;
