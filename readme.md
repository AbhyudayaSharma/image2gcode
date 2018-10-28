# image2gcode

Converts an image to GCode. Forked from [svg2gcode](https://github.com/em/svg2gcode).
## Usage

  Usage: `svg2gcode [options] <file ...>`

  Options:
  ```
  -V, --version                output the version number
  -s, --speed <number>         spindle speed
  -f, --feed <number>          feed rate
  -d, --depth <number>         z of final cut depth
  -c, --depthofcut <number>    z offset of layered cuts
  -t, --top <number>           z of top of work surface
  -a, --above <number>         z of safe area above the work
  -D, --tooldiameter <number>  diameter of tool (mandatory)
  -w, --width                  width to which the image is to be scaled down
  -h, --height                 height to which the image is to be scaled down
  -p, --positive               Treat fill as positive, cutting only around the outside
  -h, --help                   output usage information
```
