// Part 3 — Sliders + waveform selector (no arrays)
// Requires p5.js and p5.sound included in the HTML.
let osc, env;
let attackSlider, decaySlider, sustainSlider, releaseSlider;
let waveformSelector;

function setup() {
  createCanvas(500, 260);

  // Oscillator
  osc = new p5.Oscillator('sine');
  osc.amp(0);
  osc.start();

  // Envelope
  env = new p5.Envelope();

  // Sliders (no arrays)
  attackSlider  = createSlider(0.01, 2.0, 0.1, 0.01);  attackSlider.position(20, 60);
  decaySlider   = createSlider(0.01, 2.0, 0.2, 0.01);  decaySlider.position(20, 100);
  sustainSlider = createSlider(0.00, 1.0, 0.5, 0.01);  sustainSlider.position(20, 140);
  releaseSlider = createSlider(0.01, 2.0, 0.3, 0.01);  releaseSlider.position(20, 180);

  // Waveform selector
  waveformSelector = createSelect();
  waveformSelector.position(300, 60);
  waveformSelector.option('sine');
  waveformSelector.option('triangle');
  waveformSelector.option('square');
  waveformSelector.option('sawtooth');
  waveformSelector.changed(() => {
    osc.setType(waveformSelector.value());
  });
}

function draw() {
  background(20);
  fill(240);
  noStroke();

  textSize(12);
  text('Click the canvas to play', 20, 25);

  textSize(14);
  text('Attack',  160, 75);
  text('Decay',   160, 115);
  text('Sustain', 160, 155);
  text('Release', 160, 195);

  text('Waveform:', 300, 50);

  env.setADSR(
    attackSlider.value(),
    decaySlider.value(),
    sustainSlider.value(),
    releaseSlider.value()
  );
}

function mousePressed() {
  env.play(osc);
}
