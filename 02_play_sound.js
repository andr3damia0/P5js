let som;

function preload() {
  soundFormats('mp3', 'ogg');
  som = loadSound('kick.wav');
}

function setup() {
  createCanvas(400, 200);
  textAlign(CENTER, CENTER);
  text("Clique para tocar", width/2, height/2);
}

function mousePressed() {
  if (som.isPlaying()) {
    som.stop();
  } else {
    som.play();
  }
}
