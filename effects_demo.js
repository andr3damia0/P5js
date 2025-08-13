// p5.js Sound — Efeitos em arquivo MP3
// Requer p5.js e p5.sound no HTML.
// Efeitos: Reverb, Delay, Distortion, (opcional) Phaser se disponível, e controle de velocidade (rate).

let sf;                 // p5.SoundFile
let isLoaded = false;
let playBtn, stopBtn, fileInput;
let rateSlider;

// Reverb
let reverb;
let revTimeSlider, revDecaySlider, revWetSlider;

// Delay
let delay;
let delTimeSlider, delFeedbackSlider, delFilterSlider, delWetSlider;

// Distortion
let distortion;
let distAmountSlider, distWetSlider;

// Phaser (nem todas as versões de p5.sound têm)
let phaser = null;
let phRateSlider, phDepthSlider, phWetSlider;

// Visuais
const W = 820, H = 480;

function setup() {
  createCanvas(W, H);
  textFont('monospace');
  
  // UI base
  fileInput = createFileInput(handleFile, false);
  fileInput.position(20, 20);

  playBtn = createButton('▶ Play/Pause');
  playBtn.position(200, 20);
  playBtn.mousePressed(togglePlay);

  stopBtn = createButton('■ Stop');
  stopBtn.position(320, 20);
  stopBtn.mousePressed(stopPlayback);

  // Velocidade
  rateSlider = createSlider(0.25, 2.0, 1.0, 0.01);
  rateSlider.position(420, 24);

  // --- EFEITOS ---

  // Reverb
  reverb = new p5.Reverb();
  revTimeSlider   = createSlider(0.01, 10.0, 2.5, 0.01);  revTimeSlider.position(20, 90);
  revDecaySlider  = createSlider(0.01, 10.0, 3.0, 0.01);  revDecaySlider.position(20, 110);
  revWetSlider    = createSlider(0.0,   1.0,  0.2, 0.01);  revWetSlider.position(20, 130);

  // Delay
  delay = new p5.Delay();
  delTimeSlider     = createSlider(0.0, 1.0, 0.25, 0.001); delTimeSlider.position(250, 90);
  delFeedbackSlider = createSlider(0.0, 0.99, 0.3, 0.001); delFeedbackSlider.position(250, 110);
  delFilterSlider   = createSlider(50, 20000, 1200, 1);    delFilterSlider.position(250, 130);
  delWetSlider      = createSlider(0.0, 1.0, 0.2, 0.01);   delWetSlider.position(250, 150);

  // Distortion
  distortion = new p5.Distortion();
  distAmountSlider = createSlider(0.0, 1.0, 0.0, 0.001);   distAmountSlider.position(520, 90);
  distWetSlider    = createSlider(0.0, 1.0, 0.0, 0.01);    distWetSlider.position(520, 110);

  // Phaser (se a classe existir nesta versão do p5.sound)
  if (typeof p5.Phaser === 'function') {
    phaser = new p5.Phaser();
    phRateSlider  = createSlider(0.01, 10.0, 0.5, 0.01);  phRateSlider.position(520, 150);
    phDepthSlider = createSlider(0.0, 1.0, 0.5, 0.01);    phDepthSlider.position(520, 170);
    phWetSlider   = createSlider(0.0, 1.0, 0.0, 0.01);    phWetSlider.position(520, 190);
  }

  background(17);
}

function draw() {
  background(17);
  noStroke();
  fill(240);
  textSize(16);
  text('Arquivo: ' + (isLoaded ? sf.file : '(selecione um .mp3 no topo esquerdo)'), 20, 60);

  // HUD das seções
  textSize(14);
  text('[Playback]', 420, 60);
  text('Rate (velocidade): ' + nf(rateSlider.value(), 1, 2) + 'x', 420, 82);

  // Reverb
  text('[Reverb]', 20, 80);
  textSize(12);
  text('time (s): ' + nf(revTimeSlider.value(), 1, 2), 160, 100);
  text('decay (s): ' + nf(revDecaySlider.value(), 1, 2), 160, 120);
  text('dry/wet: ' + nf(revWetSlider.value(), 1, 2), 160, 140);

  // Delay
  textSize(14); fill(240);
  text('[Delay]', 250, 80);
  textSize(12);
  text('delayTime (0-1 s): ' + nf(delTimeSlider.value(), 1, 3), 400, 100);
  text('feedback (0-0.99): ' + nf(delFeedbackSlider.value(), 1, 3), 400, 120);
  text('lowpass (Hz): ' + int(delFilterSlider.value()), 400, 140);
  text('dry/wet: ' + nf(delWetSlider.value(), 1, 2), 400, 160);

  // Distortion
  textSize(14);
  text('[Distortion]', 520, 80);
  textSize(12);
  text('amount (0-1): ' + nf(distAmountSlider.value(), 1, 3), 660, 100);
  text('dry/wet: ' + nf(distWetSlider.value(), 1, 2), 660, 120);

  // Phaser (se disponível)
  if (phaser) {
    textSize(14);
    text('[Phaser]', 520, 140);
    textSize(12);
    text('rate (Hz): ' + nf(phRateSlider.value(), 1, 2), 660, 160);
    text('depth (0-1): ' + nf(phDepthSlider.value(), 1, 2), 660, 180);
    text('dry/wet: ' + nf(phWetSlider.value(), 1, 2), 660, 200);
  } else {
    textSize(12);
    fill(200);
    text('Phaser não disponível nesta versão do p5.sound.', 520, 150);
  }

  // Aplicar parâmetros em tempo real
  if (isLoaded) {
    // Rate
    sf.rate(rateSlider.value());

    // Reverb — processa em série (source -> distortion -> phaser -> delay -> reverb)
    // A ordem será conectada no handleFile quando o arquivo for carregado.
    reverb.set(revTimeSlider.value(), revDecaySlider.value(), false);
    reverb.drywet(revWetSlider.value());

    // Delay
    delay.delayTime(delTimeSlider.value());
    delay.feedback(delFeedbackSlider.value());
    delay.filter(delFilterSlider.value());
    delay.drywet(delWetSlider.value());

    // Distortion
    distortion.set(distAmountSlider.value(), '2x'); // oversample 2x
    distortion.drywet(distWetSlider.value());

    // Phaser (se existir)
    if (phaser) {
      // Valores típicos: set(rateHz, depth[0..1])
      if (typeof phaser.set === 'function') {
        phaser.set(phRateSlider.value(), phDepthSlider.value());
      }
      if (typeof phaser.drywet === 'function') {
        phaser.drywet(phWetSlider.value());
      }
    }
  }
}

// Carregamento de arquivo local
function handleFile(file) {
  if (!file || file.type !== 'audio') return;
  if (sf && sf.isPlaying()) sf.stop();

  loadSound(file.data, s => {
    sf = s;
    sf.disconnect(); // desconectar de saída master, vai passar pelos efeitos
    isLoaded = true;

    // Conectar cadeia de efeitos em série:
    // sf -> distortion -> (phaser?) -> delay -> reverb -> destino
    distortion.process(sf);
    if (phaser) {
      phaser.process(distortion);
      delay.process(phaser);
    } else {
      delay.process(distortion);
    }
    reverb.process(delay);

    // Definir rate inicial
    sf.rate(rateSlider.value());
  }, e => {
    print('Erro ao carregar:', e);
  });
}

function togglePlay() {
  if (!isLoaded) return;
  if (sf.isPlaying()) {
    sf.pause();
  } else {
    sf.play();
  }
}

function stopPlayback() {
  if (!isLoaded) return;
  sf.stop();
}
