let poseModelURL = 'https://teachablemachine.withgoogle.com/models/PASTE_YOUR_MODEL_ID_HERE/';

let classifier, video, label = "Calibrating", confidence = 0.0;
let osc;

function setup() {
  createCanvas(640, 520);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  osc = new p5.Oscillator('sine');
  osc.start();
  osc.amp(0); // Muted by default

  classifier = ml5.imageClassifier(poseModelURL + 'model.json', video, () => classifyVideo());
}

function classifyVideo() { classifier.classify(gotResult); }

function gotResult(err, res) {
  if (!err && res.length > 0) {
    label = res[0].label;
    confidence = res[0].confidence;
    modulateAudio();
  }
  classifyVideo();
}

function modulateAudio() {
  if (confidence > 0.80) {
    let p = label.toLowerCase();
    if (p.includes("left")) { osc.amp(0.3, 0.1); osc.freq(520); }
    else if (p.includes("right")) { osc.amp(0.3, 0.1); osc.freq(330); }
    else { osc.amp(0, 0.2); }
  }
}

function draw() {
  background(20);
  push(); translate(width, 0); scale(-1, 1);
  image(video, 0, 0, width, 440);
  pop();

  fill(30); rect(0, 440, width, 80);
  fill(255); textSize(20); textAlign(LEFT, CENTER);
  text("Air Theremin: " + label, 20, 480);
