// Part 1 — Minimal: oscillator + fixed ADSR
// Requires p5.js and p5.sound included in the HTML.
let osc, env;

function setup() {
  createCanvas(500, 200);

  // Oscillator
  osc = new p5.Oscillator('sine');
  osc.amp(0);   // start silent
  osc.start();

  // Envelope with fixed ADSR
  env = new p5.Envelope();
  env.setADSR(0.1, 0.2, 0.5, 0.3); // attack, decay, sustain, release
}

function draw() {
  background(20);
  fill(240);
  noStroke();
  textSize(16);
  text('Click the canvas to play (fixed ADSR)', 20, 30);
}

function mousePressed() {
  env.play(osc);
}
