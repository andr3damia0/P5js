// Part 2 — Individual sliders (no arrays)
// Requires p5.js and p5.sound included in the HTML.
let osc, env;
let attackSlider, decaySlider, sustainSlider, releaseSlider;

function setup() {
  createCanvas(500, 250);

  // Oscillator
  osc = new p5.Oscillator('sine');
  osc.amp(0);
  osc.start();

  // Envelope
  env = new p5.Envelope();

  // Sliders (no arrays)
  attackSlider  = createSlider(0.01, 2.0, 0.1, 0.01);  attackSlider.position(20, 50);
  decaySlider   = createSlider(0.01, 2.0, 0.2, 0.01);  decaySlider.position(20, 90);
  sustainSlider = createSlider(0.00, 1.0, 0.5, 0.01);  sustainSlider.position(20, 130);
  releaseSlider = createSlider(0.01, 2.0, 0.3, 0.01);  releaseSlider.position(20, 170);
}

function draw() {
  background(20);
  fill(240);
  noStroke();
  textSize(14);
  text('Attack',  160, 65);
  text('Decay',   160, 105);
  text('Sustain', 160, 145);
  text('Release', 160, 185);

  env.setADSR(
    attackSlider.value(),
    decaySlider.value(),
    sustainSlider.value(),
    releaseSlider.value()
  );

  textSize(12);
  text('Click the canvas to play', 20, 25);
}

function mousePressed() {
  env.play(osc);
}
