// All the paths
let paths = [];
// Are we painting?
let painting = false;
// How long until the next circle
let next = 0;
// Where are we now and where were we?
let current;
let previous;

const dark = '#1C1C1E';
const light = '#FBFAF7';

let bg = light
let fill_color = 0
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    bg = dark
    fill_color = 255
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    bg = event.matches ? light : dark;
    fill_color = event.matches ? 255 : 0;
});

function setup() {
    createCanvas(windowWidth, windowHeight);
    current = createVector(0, 0);
    previous = createVector(0, 0);
}

function draw() {
    background(bg);

    // If it's time for a new point
    if (millis() > next && painting) {

        // Grab mouse position
        current.x = mouseX;
        current.y = mouseY;

        // New particle's force is based on mouse movement
        let force = p5.Vector.sub(current, previous);
        force.mult(0.05);

        // Add new particle
        paths[paths.length - 1].add(current, force);

        // Schedule next circle
        next = millis() + random(100);

        // Store mouse values
        previous.x = current.x;
        previous.y = current.y;
    }

    // Draw all paths
    for (let i = 0; i < paths.length; i++) {
        paths[i].update();
        paths[i].display();
    }
}

// Start it up
function mousePressed() {
    next = 0;
    painting = true;
    previous.x = mouseX;
    previous.y = mouseY;
    paths.push(new Path());
}

// Stop
function mouseReleased() {
    painting = false;
}

// A Path is a list of particles
function Path() {
    this.particles = [];
    this.hue = random(100);
}

Path.prototype.add = function (position, force) {
    // Add a new particle with a position, force, and hue
    this.particles.push(new Particle(position, force, this.hue));
}

// Display plath
Path.prototype.update = function () {
    for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].update();
    }
}

// Display plath
Path.prototype.display = function () {
    // Loop through backwards
    for (let i = this.particles.length - 1; i >= 0; i--) {
        // If we shold remove it
        if (this.particles[i].lifespan <= 0) {
            this.particles.splice(i, 1);
            // Otherwise, display it
        } else {
            this.particles[i].display(this.particles[i + 1]);
        }
    }

}

// Particles along the path
function Particle(position, force, hue) {
    this.position = createVector(position.x, position.y);
    this.velocity = createVector(force.x, force.y);
    this.drag = 0.95;
    this.lifespan = 255;
}

Particle.prototype.update = function () {
    // Move it
    this.position.add(this.velocity);
    // Slow it down
    this.velocity.mult(this.drag);
    // Fade it out
    this.lifespan--;
}

// Draw particle and connect it with a line
// Draw a line to another
Particle.prototype.display = function (other) {
    stroke(fill_color, this.lifespan);
    fill(fill_color, this.lifespan / 2);
    ellipse(this.position.x, this.position.y, 8, 8);
    // If we need to draw a line
    if (other) {
        line(this.position.x, this.position.y, other.position.x, other.position.y);
    }
}
