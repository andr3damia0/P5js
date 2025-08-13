let osc, envelope, sliders = [], labels = ["Attack", "Decay", "Sustain", "Release"];
let waveformSelector, recorder, soundFile, recordButton, saveButton, isRecording = false;

function setup() {
  createCanvas(500, 300);
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

  recorder = new p5.SoundRecorder();
  soundFile = new p5.SoundFile();
  recordButton = createButton('Gravar');
  recordButton.position(20, 200);
  recordButton.mousePressed(toggleRecording);
  saveButton = createButton('Salvar');
  saveButton.position(100, 200);
  saveButton.mousePressed(() => saveSound(soundFile, 'synth.wav'));
}

function draw() {
  background(20);
  envelope.setADSR(sliders[0].value(), sliders[1].value(), sliders[2].value(), sliders[3].value());
}

function mousePressed() {
  envelope.play(osc);
  if (isRecording) recorder.record(soundFile);
}

function toggleRecording() {
  if (!isRecording) {
    soundFile = new p5.SoundFile();
    recorder.record(soundFile);
    isRecording = true;
    recordButton.html("Gravando...");
  } else {
    recorder.stop();
    isRecording = false;
    recordButton.html("Gravar");
  }
}
