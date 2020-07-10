let settings = {
  filename: 'songs/mp3s/pobbles.mp3',
  bpm: 138,
  timeBeforeStart: 1.09,
  background: '#000000',
  colors: [
    '#ff4757',
    '#ff6348',
    '#ffa502',
    '#2ed573',
    '#1e90ff',
    '#3742fa',
  ]
}

// inner outer
// . keep keep
// x off off
// o on on
// < on off
// > off on
// { on keep
// } keep on
// [ keep off
// ] off keep
// | on match


let actions = `
  <.x....<
  .x<.x.<.
  x......<
  .x<.x<.x
  <.x....<
  .x<.x.<.
  x......<
  .x<.x.<x

  ${''/* bass comes in */}
  o.x....o
  .xo.x.o.
  x......o
  .xo.xo.x
  o.x....o
  .xo.x.o.
  x......o
  .xo.xo.x

  ${''/* section */}
  o.x.....
  ........
  ........
  .....o.x
  o.x.....
  ........
  ........
  .....o.x
  o.x...o.
  x.......
  o.x...o.
  x.o.xo.x
  o.x...o.
  x.......
  o.xo..x.
  .o.x.o.x

  ${''/* section */}
  >.....x.
  >.x>..x.
  <.....x.
  .>.x>.x.
`

export default {
  settings, actions
}