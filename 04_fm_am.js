let carrier, modulator, modFreqSlider, modDepthSlider;

function setup() {
  createCanvas(400, 200);
  carrier = new p5.Oscillator('sine');
  modulator = new p5.Oscillator('sine');
  modulator.disconnect();
  modulator.freq(10);
  modulator.amp(100);
  modulator.start();
  carrier.freq(modulator);
  carrier.amp(0.5);
  carrier.start();

  modFreqSlider = createSlider(0, 1000, 10, 1);
  modFreqSlider.position(10, height - 40);
  modDepthSlider = createSlider(0, 300, 100, 1);
  modDepthSlider.position(10, height - 20);
}

function draw() {
  background(30);
  modulator.freq(modFreqSlider.value());
  modulator.amp(modDepthSlider.value());
}
