// ============================================================================
// p5.js Sound — Aplicando efeitos em um arquivo MP3
// ============================================================================
// Nesta sketch vamos carregar um arquivo .mp3 e aplicar vários efeitos do
// p5.sound: Reverb, Delay, Distorção, Phaser (quando disponível) e manipulação
// da velocidade de reprodução (rate).
//
// O aluno poderá:
//  - Carregar um arquivo .mp3 do computador
//  - Controlar parâmetros dos efeitos em tempo real
//  - Alterar a velocidade de reprodução (mais rápido/lento)
// ============================================================================

// Variável que guardará o arquivo de áudio carregado
let sf;

// Variável que indica se o arquivo já foi carregado
let isLoaded = false;

// Botões e entradas
let playBtn, stopBtn, fileInput;
let rateSlider; // Controle de velocidade

// --- EFEITOS ---
// Reverb
let reverb;
let revTimeSlider, revDecaySlider, revWetSlider;

// Delay
let delay;
let delTimeSlider, delFeedbackSlider, delFilterSlider, delWetSlider;

// Distorção
let distortion;
let distAmountSlider, distWetSlider;

// Phaser (pode não existir em todas as versões do p5.sound)
let phaser = null;
let phRateSlider, phDepthSlider, phWetSlider;

// Tamanho do canvas
const W = 820, H = 480;

function setup() {
  createCanvas(W, H);
  textFont('monospace');

  // Entrada de arquivo para carregar MP3
  fileInput = createFileInput(handleFile, false);
  fileInput.position(20, 20);

  // Botão para tocar/pausar
  playBtn = createButton('▶ Play/Pause');
  playBtn.position(200, 20);
  playBtn.mousePressed(togglePlay);

  // Botão para parar
  stopBtn = createButton('■ Stop');
  stopBtn.position(320, 20);
  stopBtn.mousePressed(stopPlayback);

  // Controle de velocidade de reprodução (0.25x a 2x)
  rateSlider = createSlider(0.25, 2.0, 1.0, 0.01);
  rateSlider.position(420, 24);

  // ============================================================
  // Configuração dos efeitos e seus controles (sliders)
  // ============================================================

  // --- Reverb ---
  reverb = new p5.Reverb();
  revTimeSlider  = createSlider(0.01, 10.0, 2.5, 0.01);  revTimeSlider.position(20, 90);
  revDecaySlider = createSlider(0.01, 10.0, 3.0, 0.01);  revDecaySlider.position(20, 110);
  revWetSlider   = createSlider(0.0, 1.0, 0.2, 0.01);    revWetSlider.position(20, 130);

  // --- Delay ---
  delay = new p5.Delay();
  delTimeSlider     = createSlider(0.0, 1.0, 0.25, 0.001); delTimeSlider.position(250, 90);
  delFeedbackSlider = createSlider(0.0, 0.99, 0.3, 0.001); delFeedbackSlider.position(250, 110);
  delFilterSlider   = createSlider(50, 20000, 1200, 1);    delFilterSlider.position(250, 130);
  delWetSlider      = createSlider(0.0, 1.0, 0.2, 0.01);   delWetSlider.position(250, 150);

  // --- Distorção ---
  distortion = new p5.Distortion();
  distAmountSlider = createSlider(0.0, 1.0, 0.0, 0.001);   distAmountSlider.position(520, 90);
  distWetSlider    = createSlider(0.0, 1.0, 0.0, 0.01);    distWetSlider.position(520, 110);

  // --- Phaser (opcional) ---
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

  // Nome do arquivo carregado
  textSize(16);
  text('Arquivo: ' + (isLoaded ? sf.file : '(selecione um .mp3)'), 20, 60);

  // Status e velocidade
  textSize(14);
  text('[Playback]', 420, 60);
  text('Velocidade: ' + nf(rateSlider.value(), 1, 2) + 'x', 420, 82);

  // --- Labels para Reverb ---
  text('[Reverb]', 20, 80);
  textSize(12);
  text('Tempo: ' + nf(revTimeSlider.value(), 1, 2) + ' s', 160, 100);
  text('Decaimento: ' + nf(revDecaySlider.value(), 1, 2) + ' s', 160, 120);
  text('Dry/Wet: ' + nf(revWetSlider.value(), 1, 2), 160, 140);

  // --- Labels para Delay ---
  textSize(14);
  text('[Delay]', 250, 80);
  textSize(12);
  text('Tempo (0-1 s): ' + nf(delTimeSlider.value(), 1, 3), 400, 100);
  text('Feedback: ' + nf(delFeedbackSlider.value(), 1, 3), 400, 120);
  text('Filtro LP (Hz): ' + int(delFilterSlider.value()), 400, 140);
  text('Dry/Wet: ' + nf(delWetSlider.value(), 1, 2), 400, 160);

  // --- Labels para Distorção ---
  textSize(14);
  text('[Distorção]', 520, 80);
  textSize(12);
  text('Intensidade: ' + nf(distAmountSlider.value(), 1, 3), 660, 100);
  text('Dry/Wet: ' + nf(distWetSlider.value(), 1, 2), 660, 120);

  // --- Labels para Phaser ---
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

  // ============================================================
  // Aplicação dos valores dos sliders nos efeitos
  // ============================================================
  if (isLoaded) {
    // Velocidade
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

    // Phaser (se existir)
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

// ============================================================================
// Função chamada quando o usuário seleciona um arquivo .mp3
// ============================================================================
function handleFile(file) {
  if (!file || file.type !== 'audio') return;
  if (sf && sf.isPlaying()) sf.stop();

  loadSound(file.data, s => {
    sf = s;
    sf.disconnect(); // desconecta da saída principal, pois vamos processar nos efeitos
    isLoaded = true;

    // Conectando efeitos em série:
    // sf -> distorção -> (phaser opcional) -> delay -> reverb -> saída
    distortion.process(sf);
    if (phaser) {
      phaser.process(distortion);
      delay.process(phaser);
    } else {
      delay.process(distortion);
    }
    reverb.process(delay);

    // Velocidade inicial
    sf.rate(rateSlider.value());
  }, e => {
    print('Erro ao carregar:', e);
  });
}

// ============================================================================
// Controles de reprodução
// ============================================================================
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
