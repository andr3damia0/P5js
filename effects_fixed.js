// ============================================================================
// p5.js Sound — Efeitos em arquivo MP3 (arquivo fixo, sem upload)
// ============================================================================
// Nesta sketch, carregamos um .mp3 definido por um caminho fixo (AUDIO_PATH)
// e aplicamos efeitos do p5.sound: Reverb, Delay, Distorção, Phaser (se existir)
// e controle de velocidade (rate).
//
// Instruções rápidas:
//  - Coloque um arquivo "musica.mp3" na mesma pasta do index.html
//    (ou altere a constante AUDIO_PATH abaixo para o caminho/URL do seu arquivo).
//  - Abra a página e use os botões e sliders para controlar a reprodução e efeitos.
// ============================================================================

// Caminho fixo do arquivo de áudio (altere se quiser usar outro nome/URL)
const AUDIO_PATH = 'musica.mp3';

let sf;                 // p5.SoundFile
let isLoaded = false;
let playBtn, stopBtn;
let rateSlider;

// Reverb
let reverb;
let revTimeSlider, revDecaySlider, revWetSlider;

// Delay
let delay;
let delTimeSlider, delFeedbackSlider, delFilterSlider, delWetSlider;

// Distorção
let distortion;
let distAmountSlider, distWetSlider;

// Phaser (opcional, dependendo da versão do p5.sound)
let phaser = null;
let phRateSlider, phDepthSlider, phWetSlider;

// Visuais
const W = 820, H = 480;

// --------------------------------------------------------------------------
// preload() carrega o arquivo de áudio ANTES do setup(), garantindo que
// esteja disponível quando formos configurar os efeitos.
// --------------------------------------------------------------------------
function preload() {
  // O terceiro parâmetro (successCallback) e quarto (errorCallback) não são
  // necessários aqui porque o preload já bloqueia até o final do carregamento.
  sf = loadSound(AUDIO_PATH);
}

function setup() {
  createCanvas(W, H);
  textFont('monospace');

  // Botões de reprodução
  playBtn = createButton('▶ Play/Pause');
  playBtn.position(20, 20);
  playBtn.mousePressed(togglePlay);

  stopBtn = createButton('■ Stop');
  stopBtn.position(140, 20);
  stopBtn.mousePressed(stopPlayback);

  // Velocidade (rate)
  rateSlider = createSlider(0.25, 2.0, 1.0, 0.01);
  rateSlider.position(240, 24);

  // ============================================================
  // Configuração dos efeitos e seus controles (sliders)
  // ============================================================

  // Reverb
  reverb = new p5.Reverb();
  revTimeSlider  = createSlider(0.01, 10.0, 2.5, 0.01);  revTimeSlider.position(20, 90);
  revDecaySlider = createSlider(0.01, 10.0, 3.0, 0.01);  revDecaySlider.position(20, 110);
  revWetSlider   = createSlider(0.0, 1.0, 0.2, 0.01);    revWetSlider.position(20, 130);

  // Delay
  delay = new p5.Delay();
  delTimeSlider     = createSlider(0.0, 1.0, 0.25, 0.001); delTimeSlider.position(250, 90);
  delFeedbackSlider = createSlider(0.0, 0.99, 0.3, 0.001); delFeedbackSlider.position(250, 110);
  delFilterSlider   = createSlider(50, 20000, 1200, 1);    delFilterSlider.position(250, 130);
  delWetSlider      = createSlider(0.0, 1.0, 0.2, 0.01);   delWetSlider.position(250, 150);

  // Distorção
  distortion = new p5.Distortion();
  distAmountSlider = createSlider(0.0, 1.0, 0.0, 0.001);   distAmountSlider.position(520, 90);
  distWetSlider    = createSlider(0.0, 1.0, 0.0, 0.01);    distWetSlider.position(520, 110);

  // Phaser (se existir nesta versão do p5.sound)
  if (typeof p5.Phaser === 'function') {
    phaser = new p5.Phaser();
    phRateSlider  = createSlider(0.01, 10.0, 0.5, 0.01);  phRateSlider.position(520, 150);
    phDepthSlider = createSlider(0.0, 1.0, 0.5, 0.01);    phDepthSlider.position(520, 170);
    phWetSlider   = createSlider(0.0, 1.0, 0.0, 0.01);    phWetSlider.position(520, 190);
  }

  // ---------------------------------------------
  // Encadeamento dos efeitos ao arquivo carregado
  // sf -> distortion -> (phaser?) -> delay -> reverb -> saída
  // ---------------------------------------------
  sf.disconnect(); // desconecta da saída master para processar nos efeitos
  distortion.process(sf);
  if (phaser) {
    phaser.process(distortion);
    delay.process(phaser);
  } else {
    delay.process(distortion);
  }
  reverb.process(delay);

  // Define o rate inicial
  sf.rate(rateSlider.value());

  // Se chegou até aqui, o preload finalizou com sucesso
  isLoaded = true;
}

function draw() {
  background(17);
  noStroke();
  fill(240);

  textSize(16);
  text('Arquivo carregado: ' + AUDIO_PATH, 20, 60);

  textSize(14);
  text('[Playback]', 240, 60);
  text('Velocidade: ' + nf(rateSlider.value(), 1, 2) + 'x', 240, 82);

  // Labels Reverb
  text('[Reverb]', 20, 80);
  textSize(12);
  text('Tempo: ' + nf(revTimeSlider.value(), 1, 2) + ' s', 160, 100);
  text('Decaimento: ' + nf(revDecaySlider.value(), 1, 2) + ' s', 160, 120);
  text('Dry/Wet: ' + nf(revWetSlider.value(), 1, 2), 160, 140);

  // Labels Delay
  textSize(14);
  text('[Delay]', 250, 80);
  textSize(12);
  text('Tempo (0-1 s): ' + nf(delTimeSlider.value(), 1, 3), 400, 100);
  text('Feedback: ' + nf(delFeedbackSlider.value(), 1, 3), 400, 120);
  text('Filtro LP (Hz): ' + int(delFilterSlider.value()), 400, 140);
  text('Dry/Wet: ' + nf(delWetSlider.value(), 1, 2), 400, 160);

  // Labels Distorção
  textSize(14);
  text('[Distorção]', 520, 80);
  textSize(12);
  text('Intensidade: ' + nf(distAmountSlider.value(), 1, 3), 660, 100);
  text('Dry/Wet: ' + nf(distWetSlider.value(), 1, 2), 660, 120);

  // Labels Phaser (se existir)
  if (phaser) {
    textSize(14);
    text('[Phaser]', 520, 140);
    textSize(12);
    text('Rate: ' + nf(phRateSlider.value(), 1, 2) + ' Hz', 660, 160);
    text('Depth: ' + nf(phDepthSlider.value(), 1, 2), 660, 180);
    text('Dry/Wet: ' + nf(phWetSlider.value(), 1, 2), 660, 200);
  } else {
    textSize(12);
    fill(200);
    text('Phaser não disponível nesta versão do p5.sound.', 520, 150);
  }

  // Aplicar parâmetros
  if (isLoaded) {
    // Rate
    sf.rate(rateSlider.value());

    // Reverb
    reverb.set(revTimeSlider.value(), revDecaySlider.value(), false);
    reverb.drywet(revWetSlider.value());

    // Delay
    delay.delayTime(delTimeSlider.value());
    delay.feedback(delFeedbackSlider.value());
    delay.filter(delFilterSlider.value());
    delay.drywet(delWetSlider.value());

    // Distorção
    distortion.set(distAmountSlider.value(), '2x');
    distortion.drywet(distWetSlider.value());

    // Phaser
    if (phaser) {
      if (typeof phaser.set === 'function') {
        phaser.set(phRateSlider.value(), phDepthSlider.value());
      }
      if (typeof phaser.drywet === 'function') {
        phaser.drywet(phWetSlider.value());
      }
    }
  }
}

// --------------------------------------------------------------------------
// Controles de reprodução
// --------------------------------------------------------------------------
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
