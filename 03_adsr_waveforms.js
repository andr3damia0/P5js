let osc, envelope, sliders = [], labels = ["Attack", "Decay", "Sustain", "Release"], waveformSelector;

function setup() {
  createCanvas(500, 250);
  osc = new p5.Oscillator('sine');
  osc.amp(0);
  osc.start();

  envelope = new p5.Envelope();
  for (let i = 0; i < 4; i++) {
    sliders[i] = createSlider(0.01, 2.0, 0.1, 0.01);
    sliders[i].position(20, 40 + i * 30);
  }

  waveformSelector = createSelect();
  waveformSelector.position(200, 40);
  waveformSelector.option('sine');
  waveformSelector.option('triangle');
  waveformSelector.option('square');
  waveformSelector.option('sawtooth');
  waveformSelector.changed(() => osc.setType(waveformSelector.value()));
}

function draw() {
  background(20);
  envelope.setADSR(sliders[0].value(), sliders[1].value(), sliders[2].value(), sliders[3].value());
}

function mousePressed() {
  envelope.play(osc);
}
