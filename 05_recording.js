let mic, recorder, soundFile, recordButton, saveButton, isRecording = false;

function setup() {
  createCanvas(400, 200);
  mic = new p5.AudioIn();
  mic.start();
  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);
  soundFile = new p5.SoundFile();

  recordButton = createButton('Gravar');
  recordButton.position(10, 10);
  recordButton.mousePressed(toggleRecording);

  saveButton = createButton('Salvar');
  saveButton.position(100, 10);
  saveButton.mousePressed(() => saveSound(soundFile, 'gravacao.wav'));
}

function toggleRecording() {
  if (!isRecording) {
    soundFile = new p5.SoundFile();
    recorder.record(soundFile);
    isRecording = true;
    recordButton.html('Gravando...');
  } else {
    recorder.stop();
    isRecording = false;
    recordButton.html('Gravar');
  }
}
