var particles = [];
var mouse;

var colorA;
var colorB;
var colorC;
var colorD;

var now;
var delta;
var lastUpdate;

var follow;

function setup() {
  createCanvas(windowWidth,windowHeight);
  frameRate(30);

  stroke(0);
  strokeWeight(2);
  noFill();

  // colorA = color(26, 188, 156);
  // colorB = color(46, 204, 113);
  // colorC = color(52, 152, 219);
  // colorD = color(155, 89, 182);

  colorA = color('#C30000');
  colorB = color('46, 204, 113');
  colorC = color('#112B3A');
  colorD = color('#10754B');

  mouseX = mouseX || width/2;
  mouseY = mouseY || 152.4;

  mouse = createVector(mouseX, mouseY);
  MnowPos = createVector(mouseX, mouseY);
  Macc = createVector(3,-3);

  now = millis();
  delta = 0.0;
  lastUpdate = now;

  follow = true;
}

function draw() {
  now = millis();
  delta = now - lastUpdate;
  lastUpdate = now;

  if (follow) {
    mouse.set(mouseX,mouseY);
  }

  for (var i = 0; i < particles.length; i++) {
    var particle = particles[i];
    if (particle.nowPos.x >= width-10 || particle.nowPos.x <= 10 || particle.nowPos.y >= height-10 || particle.nowPos.y <= 10  || particle.lifespan < particle.aliveFor) {
      particles.splice(i,1);
    }
  }

  for (var i = 0, l = particles.length; i < l; i++) {
    particles[i].update(delta);
  }

  if (particles.length < 200 && follow) {
    MnowPos.set(mouse);
    MnowPos.add(random(-15, 15), random(-15, 15));
    var mLoc = int(map(mouseX, 0, width, 0, 3));
    var inter = map(mouseX, 0, width, 0, 1);
    if(mLoc == 0){
      var c = lerpColor(colorA, colorB, inter);
    }
    else if (mLoc == 1){
      var c = lerpColor(colorB, colorC, inter);
    }
    else if (mLoc == 2){
      var c = lerpColor(colorC, colorD, inter);
    }
    particles.push(new Particle(MnowPos,Macc,c));
  }

  for (var i = 0, l = particles.length; i < l; i++) {
    var particle = particles[i];
    particle.draw();
    var noiseRot = map(noise(particle.nowPos.x * .006, particle.nowPos.y * .006), .2, .8, 0, TAU);
    particle.acc.set(cos(noiseRot)*PI, sin(noiseRot)*PI);
  }
}

function mouseClicked() {
  follow = !follow;
}

function Particle(posN, accN, colorIn) {
  this.prevPos = createVector(posN.x, posN.y);
  this.nowPos = createVector(posN.x, posN.y);
  this.acc = createVector(accN.x, accN.y);

  this.created = millis();
  this.aliveFor = 0.0;
  this.lifespan = random(2000, 4000);

  this.colorN = colorIn;
}

Particle.prototype.update = function(delta) {
  this.aliveFor += delta;
  this.nowPos.add(this.acc);
}

Particle.prototype.draw = function() {
  var redN = red(this.colorN);
  var blueN = blue(this.colorN);
  var greenN = green(this.colorN);
  var alphaN = max(0, map(min(1 - this.aliveFor / this.lifespan, 1), 0, 1, 0, 64));

  stroke(color(redN, blueN, greenN, alphaN));
  line(this.nowPos.x, this.nowPos.y, this.prevPos.x, this.prevPos.y);

  this.prevPos.x = this.nowPos.x;
  this.prevPos.y = this.nowPos.y;
}
