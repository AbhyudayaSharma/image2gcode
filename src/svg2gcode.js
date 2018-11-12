'use strict';

const fs = require('fs');
const GCanvas = require('gcanvas');
const canvg = require('canvg');

/**
 * Generates Gcode from an svg
 * DO NOT USE THIS FUNCTION: Use the <code>gcodeGenerator</code>
 * in gcodegenerator.js.
 * This function causes a ghost thread to run asynchronously
 * @param {String} filePath The path to the svg file
 * @param {*} options options for the GCode
 * @return {Promise} A promise containing the gcode as a String
 */
const getGcode = (filePath, options) => {
  let ret = '';
  let oldLog = null;
  if (require.main != module) {
    // hijack console.log if not running as the main module
    // process the data being sent to console as a String
    oldLog = console.log;
    console.log = (msg) => {
      ret += msg + '\n';
    };
  }

  const gctx = new GCanvas();
  const svg = fs.readFileSync(filePath).toString();

  if (options.hasOwnProperty('speed')) {
    gctx.speed = options.speed;
  }

  if (options.hasOwnProperty('feed')) {
    gctx.feed = options.feed;
  }

  if (options.hasOwnProperty('depth')) {
    gctx.depth = options.depth;
  }

  if (options.hasOwnProperty('depthOfCut')) {
    gctx.depthOfCut = options.depthOfCut;
  }

  if (options.hasOwnProperty('top')) {
    gctx.top = options.top;
    if (gctx.top > 0) {
      gctx.motion.rapid({z: 0});
    } else {
      gctx.motion.retract();
    }
  } else if (options.hasOwnProperty('retract')) {
    gctx.retract = options.retract;
  }

  if (options.hasOwnProperty('above')) {
    gctx.aboveTop = options.above;
  }

  if (options.hasOwnProperty('toolDiameter')) {
    gctx.toolDiameter = options.toolDiameter;
  } else {
    throw new Error('Specifying tool diameter is necessary');
  }

  if (options.hasOwnProperty('positive') && options.positive === true) {
    gctx.fill = (windingRule, depth) => {
      gctx.save();
      gctx.strokeStyle = gctx.fillStyle;
      gctx.stroke('outer', depth);
      gctx.restore();
    };
  }

  return new Promise((resolve, reject) => {
    canvg(gctx.canvas, svg);
    ret += 'M30\n';
    if (oldLog != null) {
      console.log = oldLog;
    }
    resolve(ret);
  });
};

if (require.main == module) {
  const program = require('commander');

  program.version(require('../package.json').version)
      .usage('[options] <file ...>')
      .option('-s, --speed <number>', 'spindle speed', eval)
      .option('-f, --feed <number>', 'feed rate', eval)
      .option('-d, --depth <number>', 'z of final cut depth', eval)
      .option('-c, --depthofcut <number>', 'z offset of layered cuts', eval)
      .option('-t, --top <number>', 'z of top of work surface', eval)
      .option('-a, --above <number>', 'z of safe area above the work', eval)
      .option('-D, --tooldiameter <number>', 'diameter of tool', eval)
      .option('-r, --retract <number>', 'distance to retract for fast moves',
          eval)
      .option('-p, --positive',
          'Treat fill as positive, cutting only around the outside');

  program.parse(process.argv);

  const options = {};
  if (program.speed) options.speed = program.speed;
  if (program.feed) options.feed = program.feed;
  if (program.depth) options.depth = program.depth;
  if (program.depthofcut) options.depthOfCut = program.depthofcut;
  if (program.top) options.top = program.top;
  if (program.above) options.aboveTop = program.above;
  if (program.tooldiameter) options.toolDiameter = program.tooldiameter;
  if (program.retract) options.retract = program.retract;

  if (program.args.length === 0 && process.stdin.isTTY) {
    program.outputHelp();
    process.exit(0);
  }

  if (!process.stdin.isTTY) {
    getGcode('/dev/stdin', options);
  }

  program.args.forEach(function(file) {
    getGcode(file, options);
  });

  process.exit(0);
}

exports.getGcode = getGcode;
