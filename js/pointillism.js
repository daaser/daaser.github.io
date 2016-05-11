var img;
var smallPoint, largePoint;

function preload() {
  img = loadImage("./2-nasacomplete.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  smallPoint = 4;
  largePoint = 40;
  imageMode(CENTER);
  noStroke();
  img.loadPixels();
}

function draw() {
  var pointillize = map(mouseX, 0, width, smallPoint, largePoint);
  var x = floor(random(img.width));
  var y = floor(random(img.height));
  var pix = img.get(x, y);
  fill(pix, 128);
  ellipse(x, y, pointillize, pointillize);
}
