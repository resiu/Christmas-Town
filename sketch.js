// declare our global
// arrays (aka "model")
let pageTexts = []; // array of texts
let choicesTexts = []; // array of texts
let pageImages = []; // array of images
let consequences = []; // array of lists (aka as arrays)

let doorColor;
let doorColor_livingroom;

let townMusic;

// Clouds
let frontClouds = [];
let distantClouds = [];

//window lights
let windowLights = [];
let windows = [
    {x:70, y:370, w :55, h:80},
    {x:70, y:520, w :55, h:80},
    {x:210, y:400, w :55, h:70},
    {x:300, y:500, w :55, h:70},
    {x:215, y:600, w :55, h:70},
    {x:385, y:400, w :55, h:70},
    {x:385, y:600, w :55, h:70},
    {x:510, y:515, w :55, h:70},
    {x:855, y:580, w :55, h:80},
    {x:1100, y:370, w :55, h:80},
    {x:1100, y:520, w :55, h:80},
    {x:1330, y:400, w :55, h:70},
    {x:1330, y:500, w :55, h:70},
    {x:1240, y:600, w :55, h:70}
];

//sled
let sledImg;
let sledX, sledY;
//let sledW, sledH;

let sledSliding = false; // animation
let sledSlideSpeed = 6; //speed of sled

let sledTrail = [];
let santaTrail = [];

let playerX = 200;
let playerY = 300;
let playerVY = 0;    // vertical velocity for jumping
let gravity = 0.6;
let jumpForce = -10;

let sledW = 70;
let sledH = 45;

let hillY = 0;
let hillSpeed = 3;

let groundY = 350;

let obstacles = [];
let gameOver = false;

// Audio variables
let fireplaceSound;
let christmasMusic;
let doorOpenSound;
let jumpscareSound;

// Interactive objects state
let treeDecorations = [];
let isRadioPlaying = false;
let fireplaceState = 'off'; // 'off', 'on', 'jumpscare'
let showJumpscare = false;
let jumpscareTimer = 0;

// Interactive object images
let radioImg;

// Particle systems
let fireEmbers = [];
let sparkles = [];
let snowflakes = [];

//stars
let stars = [];

class Cloud {
  constructor(x, y, speed, scale = 1, alphaRange = [150, 200]) {
    this.x = x;
    this.baseY = y;
    this.y = y;
    this.speed = speed;
    this.scale = scale;
    this.alpha = random(alphaRange[0], alphaRange[1]);

    // Fixed random offsets to prevent shaking
    this.spacingOffset = random(-5, 5);
    this.diaOffset = random(-10, 10);
    this.alphaRange = alphaRange;
    this.floatPhase = random(TWO_PI);
  }

  display() {
    // Smooth vertical floating
    this.y = this.baseY + sin(frameCount * 0.002) * 3;

    // Subtle alpha jitter
    this.alpha += random(-1, 1);
    this.alpha = constrain(this.alpha, this.alphaRange[0], this.alphaRange[1]);

    fill(255, this.alpha);
    noStroke();

    // Draw cloud
    let spacing = 35 * this.scale + this.spacingOffset;
    let dia = 65 * this.scale + this.diaOffset;

    drawClouds(this.x, this.y, spacing, dia);
    drawClouds(this.x + 10 * this.scale, this.y + 10 * this.scale, spacing + 5, dia + 10);
    drawClouds(this.x - 20 * this.scale, this.y + 10 * this.scale, spacing + 5, dia + 10);
    drawClouds(this.x, this.y - 10 * this.scale, spacing + 5, dia + 10);
    drawClouds(this.x + 20 * this.scale, this.y - 10 * this.scale, spacing / 3, dia / 2);
  }

  move() {
    this.x += this.speed * random(0.90,1.10);

    if (this.x > width + 80) {
      this.x = random(-80, -20);
      this.baseY = random(this.baseY - 10, this.baseY +10); // vertical range
      this.speed = this.speed;
      this.scale = this.scale;
      this.alpha = random(this.alphaRange[0], this.alphaRange[1]);
      this.spacingOffset = random(-5, 5);
      this.diaOffset = random(-10, 10);
    }
  }
}

class SledTrailFlake {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(8, 14);
    this.alpha = 255;
    this.shrinkSpeed = random(0.2, 0.5);
    this.fadeSpeed = random(3, 6);
  }

  update() {
    this.size -= this.shrinkSpeed;
    this.alpha -= this.fadeSpeed;
  }

  display() {
    noStroke();
    fill(255, this.alpha);
    circle(this.x, this.y, this.size);
  }

  isGone() {
    return this.alpha <= 0 || this.size <= 0;
  }
}
class SantaTrailFlake {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(8, 14);
    this.alpha = 255;
    this.shrinkSpeed = random(0.2, 0.5);
    this.fadeSpeed = random(3, 6);
  }

  update() {
    this.size -= this.shrinkSpeed;
    this.alpha -= this.fadeSpeed;
  }

  display() {
    noStroke();
    fill(255, this.alpha);
    circle(this.x, this.y, this.size);
  }

  isGone() {
    return this.alpha <= 0 || this.size <= 0;
  }
}


class Snowflake {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = random(1, 3);
    this.size = random(3, 8);
    this.sway = random(-0.5, 0.5);
  }

  update() {
    this.y += this.speed;
    this.x += this.sway;
    if (this.y > height) {
      this.y = 0;
      this.x = random(width);
    }
  }

  display() {
    fill(255, 255, 255, 200);
    noStroke();
    circle(this.x, this.y, this.size);
  }
}

class FireEmber {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speedY = random(-2, -4);
    this.speedX = random(-1, 1);
    this.size = random(2, 6);
    this.life = 255;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.life -= 5;
    this.size *= 0.97;
  }

  display() {
    noStroke();
    fill(255, random(100, 200), 0, this.life);
    circle(this.x, this.y, this.size);
  }

  isDead() {
    return this.life <= 0;
  }
}

class Sparkle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(3, 8);
    this.life = 255;
    this.fadeSpeed = random(5, 15);
  }

  update() {
    this.life -= this.fadeSpeed;
    this.size *= 0.95;
  }

  display() {
    noStroke();
    fill(255, 215, 0, this.life);
    circle(this.x, this.y, this.size);
    // Add star points
    stroke(255, 255, 200, this.life);
    strokeWeight(2);
    line(this.x - this.size, this.y, this.x + this.size, this.y);
    line(this.x, this.y - this.size, this.x, this.y + this.size);
  }

  isDead() {
    return this.life <= 0;
  }
}

class TreeOrnament {
  constructor(x, y, ornamentColor, ornamentType) {
    this.x = x;
    this.y = y;
    this.color = ornamentColor;
    this.type = ornamentType; // 'ball', 'star', 'candy'
    this.size = random(15, 25);
  }

  display() {
    push();
    translate(this.x, this.y);

    if (this.type === 'ball') {
      // Draw ball ornament
      fill(this.color);
      stroke(200);
      strokeWeight(2);
      circle(0, 0, this.size);
      // Shine
      fill(255, 255, 255, 150);
      noStroke();
      circle(-this.size * 0.2, -this.size * 0.2, this.size * 0.3);
    } else if (this.type === 'star') {
      // Draw star ornament
      fill(this.color);
      stroke(200);
      strokeWeight(1);
      this.drawStar(0, 0, this.size * 0.3, this.size * 0.6, 5);
    } else if (this.type === 'candy') {
      // Draw candy cane
      stroke(this.color);
      strokeWeight(this.size * 0.3);
      noFill();
      // Draw the curved top part
      arc(0, 0, this.size, this.size, PI, TWO_PI);
      // Draw the straight part starting from the arc's endpoint
      line(this.size / 2, 0, this.size / 2, this.size * 1.5);
    }

    pop();
  }

  drawStar(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = -PI / 2; a < TWO_PI - PI / 2; a += angle) {
      let sx = x + cos(a) * radius2;
      let sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius1;
      sy = y + sin(a + halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }
}

//star class
class Star {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseSize = random(2, 4);
    this.twinkleSpeed = random(0.02, 0.05);
    this.phase = random(TWO_PI);
    this.amplitude = random(2, 6); // pulsing range
  }

  display() {
    let pulse = sin(frameCount * this.twinkleSpeed + this.phase) * this.amplitude;
    let starSize = this.baseSize + pulse;

    // Glow layer 1: soft yellow-white
    noStroke();
    fill(255, 255, 200, 80); // warm glow
    circle(this.x, this.y, starSize * 3);

    // Glow layer 2: light blue to match sky
    fill(180, 220, 255, 60); // cool blue glow
    circle(this.x, this.y, starSize * 2);

    // Core star
    fill(255, 255, 200, 220);
    circle(this.x, this.y, starSize);
  }
}



// declare global var
// to represent current page number (aka "state")
let currentPageIndex = 0;

// declare global var
// to store previously displayed page
let previousPageIndex = 0;

function preload() {
  // ********************
  // Load Images
  // ********************

  let tempI = 0;
  pageImages[tempI] = loadImage('christmas_town.png');

  tempI = 1;
  pageImages[tempI] = loadImage('christmas_livingroom.png');

  // Load interactive object images
  radioImg = loadImage('radio.png');

  // Load sled image
  sledImg = loadImage('sled.png');


  // ********************
  // Load Audio
  // ********************
  townMusic = loadSound('audio/snow.mp3');
  fireplaceSound = loadSound('audio/fireplace.mp3');
  doorOpenSound = loadSound('audio/door opening.mp3');
  christmasMusic = loadSound('audio/christmas_song.mp3');
  sparkleSound = loadSound('audio/sparkle.wav');
  jumpscareSound = loadSound('audio/ho_ho_ho.wav');
}

function draw() {
  displayCurrentPage();
  // Only show clouds when on the first scene (index 0)
  if (currentPageIndex === 0) {
    //bg music
    if(!townMusic.isPlaying()) {
      townMusic.loop();
      townMusic.setVolume(0.8);
    }
    // Add snowflakes in town scene
    updateAndDrawSnowflakes();
    displayTownText();

    //draw stars
    for (let star of stars) {
      star.display();
    }

    //clouds on top 
    updateAndDrawClouds();
    
    //window lights
    displayWindowLights();

    //draw sled
    image(sledImg, sledX, sledY, sledW, sledH);

    // If sled is sliding, animate it
    if (sledSliding) {
        sledX += sledSlideSpeed;   // slide horizontally

        //leaves snow trail puff
        sledTrail.push(new SledTrailFlake(sledX, sledY +sledH/2));

    // When it slides off screen, switch to sledding screen
    if (sledX > width + 200) {
        sledSliding = false;
        currentPageIndex = 2; // Go to sledding screen
    }
    }   
   // Draw sled trail
    for (let i = sledTrail.length - 1; i >= 0; i--) {
         let t = sledTrail[i];
        t.update();
        t.display();
  
        if (t.isGone()) {
            sledTrail.splice(i, 1);
        }
    }
  }
    // --- Hover detection for interactive objects ---
  if (currentPageIndex === 0 && detectColor(doorColor)) {
    cursor(HAND); // town door
  } else if (currentPageIndex === 1) {
    if (detectColor(doorColor_livingroom)) {
      cursor(HAND); // living room door
    } else if (isNearTree(mouseX, mouseY)) {
      cursor(HAND); // tree
    } else if (isNearRadio(mouseX, mouseY)) {
      cursor(HAND); // radio
    } else if (isNearFireplace(mouseX, mouseY)) {
      cursor(HAND); // fireplace
    } else {
      cursor(ARROW); // default
    }
  } else {
    cursor(ARROW);
  }



  // Living room interactive elements (scene 1)
    if (currentPageIndex === 1) {
      // stop town music
      if (townMusic.isPlaying()) {
        townMusic.stop();   // <-- use stop instead of setVolume(0)
    }


    // Draw radio
    displayRadio();

    // Draw tree decorations
    for (let ornament of treeDecorations) {
      ornament.display();
    }

    // Draw fireplace effects
    if (fireplaceState === 'on') {
      updateAndDrawFireEmbers();
    }

    // Draw sparkles
    updateAndDrawSparkles();

    // Handle jumpscare
    if (showJumpscare) {
      displayJumpscare();
    }

    // Display interaction hints
    displayInteractionHints();
  }

  //Sled Game (scene 2)
  if (currentPageIndex === 2) {

  // Stop everything if crashed
   if (gameOver) {
    background(0, 0, 0, 180);
    textAlign(CENTER, CENTER);
    fill(255, 0, 0);
    textSize(60);
    text("CRASH!", width / 2, height / 2);
    return;
  }

  // HILL SCROLL
  hillY += hillSpeed;
  if (hillY > height) hillY = 0;

  drawHill(hillY);
  drawHill(hillY - height);

  // GRAVITY (flappy-bird style)
  playerVY += gravity;
  playerY += playerVY;

  // GROUND COLLISION
  let realGround = height - 200; // <<< FIXED GROUND //where the sled image will stop on the screen vertically
  if (playerY > realGround) {
    playerY = realGround;
    playerVY = 0;
  }

  // Draw sled
  image(sledImg, playerX, playerY, sledW, sledH);

  // SPAWN OBSTACLES
  if (frameCount % 100 === 0) {
    createObstacle(realGround);
  }

  // MOVE + DRAW OBSTACLES
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let ob = obstacles[i];
    ob.x -= 6;

    fill(150);
    rect(ob.x, ob.y, ob.w, ob.h);

    if (ob.x < -200) {
      obstacles.splice(i, 1);
      continue;
    }

    // COLLISION
    if (
      playerY + sledW > ob.x &&
      playerX < ob.x + ob.w &&
      sledY + sledH > ob.y
    ) {
      gameOver = true;
    }
  }
}
}

function drawHill(yOffset){
    noStroke();
    fill(255); // white snow

     beginShape();
  for (let x = 0; x <= width; x += 10) {
    let y = (height - 150) + 50 * sin((x * 0.02) + (frameCount * 0.05)) - yOffset;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}


function createObstacle() {
  let h = random(40, 100);  // obstacle height
  //let y = random(200, height - h - 50);
  let ob = {
    x: width + 50,           // start off-screen right
    y: groundY - h,    // adjust height of obstacle
    w: 40,              // width of obstacle
    h: h               // height of obstacle
  };
  obstacles.push(ob);
}

function keyPressed() {
   if (currentPageIndex === 2 && !gameOver) {   // only jump on sledding screen
    if (key === ' ') {   // press space
      playerVY = jumpForce;    // jump force
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(LEFT, TOP);
  textSize(20);
  textFont('Georgia');
  textStyle(BOLD);
  background(0);

  doorColor = color('#893f00');
  doorColor_livingroom = color('#5b3022');

  //Call the setupClouds function
  setupClouds();

  //window Lights
  setupWindowLights();

  //sled
  sledW = 200; //its width
  sledH = sledW * (sledImg.height/ sledImg.width); //helps keep the aspect ratio 
  sledX = 1050; //position
  sledY = 650; //position

  // Initialize snowflakes
  for (let i = 0; i < 50; i++) {
    snowflakes.push(new Snowflake(random(width), random(height)));
  }

  // Set audio properties
  if (fireplaceSound) {
    fireplaceSound.setVolume(0.3);
    fireplaceSound.setLoop(true);
  }
  if (christmasMusic) {
    christmasMusic.setVolume(0.5);
    christmasMusic.setLoop(true);
  }
  if (doorOpenSound) {
    doorOpenSound.setVolume(0.7);
  }

  //setting up stars
  for (let i = 0; i < 80; i++) { // number of stars
  let x = random(width);
  let y = random(height * 0.4); // only in upper sky
  stars.push(new Star(x, y));
}
}

function setupClouds() {
  frontClouds = [];
  distantClouds = [];

  // Front clouds - fewer and spread vertically to prevent blotch
  for (let i = 0; i < 12; i++) {
    let x = random(0, width);
    let y = random(50, 180); // narrower vertical range
    let speed = random(0.3, 1);
    let scale = random(0.9,1.1);
    frontClouds.push(new Cloud(x, y, speed, 1, [150, 200]));
  }

  // Distant clouds - smaller, higher, more transparent
  for (let i = 0; i < 6; i++) {
    let x = random(0, width);
    let y = random(30, 130);
    let speed = random(0.05, 0.25);
    let scale = random(0.6, 0.8);
    distantClouds.push(new Cloud(x, y, speed, scale, [80, 130]));
  }
}

function setupWindowLights(){
    windowLights = [];

   for (let win of windows) {
    let lightsPerWindow = 20; // more lights per window
        for (let i = 0; i < lightsPerWindow; i++) {
            let x = win.x + random(0, win.w);
            let y = win.y + random(0, win.h);
            let baseBrightness = random(200, 220);
            let size = random(3, 4);

            // Each light gets a random phase for smooth twinkle
            let phase = random(TWO_PI);
            let speed = random(0.02, 0.06); // twinkle speed

            windowLights.push({ x, y, baseBrightness, size, phase, speed });
        }
  }
}

// Styling for the page layout
function displayCurrentPage() {
  let leftMargin = 100;
  let topMargin = leftMargin;
  let contentWidth = windowWidth - leftMargin * 2;
  let contentMargin = 50;
  let pageTextHeight = windowWidth * 0.4;
  let choicesTextHeight = 125;
  let choicesTextY = topMargin + pageTextHeight + contentMargin;
  // let pageNumX = windowWidth / 2;
  // let pageNumY = windowHeight * 0.95;

  // background image or solid
  if (typeof pageImages[currentPageIndex] === 'undefined') {
    background(0);
  } else {
    background(pageImages[currentPageIndex]);
  }
}

function detectColor(targetColor) { //function that when click on x, y scene/image will be shown
  const img = pageImages[currentPageIndex];
  if (!img) return false;

  // Map mouse coords → image pixel coords
  const ix = floor(map(mouseX, 0, width, 0, img.width));
  const iy = floor(map(mouseY, 0, height, 0, img.height));

  if (ix < 0 || ix >= img.width || iy < 0 || iy >= img.height) return false;

  img.loadPixels();
  const idx = (ix + iy * img.width) * 4;
  const r = img.pixels[idx];
  const g = img.pixels[idx + 1];
  const b = img.pixels[idx + 2];

  // Exact match check
  return (r === red(targetColor) &&
          g === green(targetColor) &&
          b === blue(targetColor));

}

function mousePressed() {
  // Resume audio context if blocked
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }

  // Optional: trigger music if in town scene
  if (currentPageIndex === 0 && !townMusic.isPlaying()) {
    townMusic.loop();
    townMusic.setVolume(0.8);
  }

  // Navigation between scenes
  if (detectColor(doorColor)) {
    currentPageIndex = 1; // go to living room scene
    if (doorOpenSound) doorOpenSound.play(0,2,0.5,3,1);
  }
  else if (currentPageIndex === 1 && detectColor(doorColor_livingroom)) {
    currentPageIndex = 0; // go back to town
    if (doorOpenSound) doorOpenSound.play(0,2,0.5,3,1);
    // Stop music when leaving living room
    if (christmasMusic && christmasMusic.isPlaying()) {
      christmasMusic.stop();
      isRadioPlaying = false;
    }
    if (fireplaceSound && fireplaceSound.isPlaying()) {
      fireplaceSound.stop();
    }
    fireplaceState = 'off';
  }

  // Sled Click
  if (currentPageIndex === 0 && mouseX > sledX && 
    mouseX < sledX + sledW && mouseY > sledY && mouseY < sledY + sledH) {
   sledSliding = true;
  }



  // Living room interactions
  if (currentPageIndex === 1) {
    // Christmas tree decoration
    if (isNearTree(mouseX, mouseY)) {
      let colors = [
        color(230, 130, 130),    // Red
        color(130, 230, 130),    // Green
        color(130, 130, 230),    // Blue
        color(245, 205, 90),  // Gold
        color(255, 192, 203) // Pink
      ];
      let types = ['ball', 'star', 'candy'];

      let ornamentColor = random(colors);
      let ornamentType = random(types);
      let ornament = new TreeOrnament(mouseX, mouseY, ornamentColor, ornamentType);
      treeDecorations.push(ornament);

      // Add sparkles
      for (let i = 0; i < 5; i++) {
        sparkles.push(new Sparkle(mouseX + random(-20, 20), mouseY + random(-20, 20)));
      }
      sparkleSound.play(0, 1, 0.3, 0, 2);
    }

    // Radio interaction
    if (isNearRadio(mouseX, mouseY)) {
      if (!isRadioPlaying) {
        if (christmasMusic) {
          christmasMusic.play();
          isRadioPlaying = true;
        }
      } else {
        if (christmasMusic) {
          christmasMusic.stop();
          isRadioPlaying = false;
        }
      }
    }

    // Fireplace interaction
    // Fireplace interaction
    if (isNearFireplace(mouseX, mouseY)) {
      if (fireplaceState === 'off') {
        fireplaceState = 'on';
        if (fireplaceSound) fireplaceSound.play();
      } else if (fireplaceState === 'on') {
        // Extinguish fire - trigger jumpscare
        fireplaceState = 'off';
        if (fireplaceSound) fireplaceSound.stop();

        // Call the trigger function so sound plays once
        triggerJumpscare();

        fireEmbers = []; // Clear embers
      }
    }
  }
}

//--draw single cloud--
function drawClouds(x,y,spacing,dia){

  push();
  translate(x,y);// using translate to move shapes together

  fill(250, 250, 250, 150);
  circle(0,0,dia);// center puff
  circle(-spacing,0,dia);// left puff
  circle(spacing,0,dia);// right puff
  circle(0,-spacing,dia);// upper puff

  pop();
}

function updateAndDrawClouds() {
//first draw distant clouds
  for (let cloud of distantClouds) {
    cloud.move();
    cloud.display();
  }

//second draw front clouds on top
  for (let cloud of frontClouds){
    cloud.move();
    cloud.display();
  }
}

function displayWindowLights(){
    for (let light of windowLights) {
        //smooth brightness using sin wave
        let twinkle = sin(frameCount * light.speed + light.phase) * 150;
        let brightness = constrain(light.baseBrightness + twinkle, 150, 255);

        noStroke();

        //core glow
        fill(255, 255, 200, brightness);
        circle(light.x, light.y, light.size);

        //soft halo
        fill(255, 255, 180, brightness * 0.5);
        circle(light.x, light.y, light.size * 4);

        fill(255, 255, 150, brightness * 0.3);
        circle(light.x, light.y, light.size * 8);
    }
}

function updateAndDrawSnowflakes() {
  for (let flake of snowflakes) {
    flake.update();
    flake.display();
  }
}

function updateAndDrawFireEmbers() {
  // Generate new embers from fireplace area (center of room)
  if (random(1) < 0.3) {
    let emberX = width * 0.5 + random(-30, 30);
    let emberY = height * 0.55 + random(-20, 20);
    fireEmbers.push(new FireEmber(emberX, emberY));
  }

  // Update and draw embers
  for (let i = fireEmbers.length - 1; i >= 0; i--) {
    fireEmbers[i].update();
    fireEmbers[i].display();
    if (fireEmbers[i].isDead()) {
      fireEmbers.splice(i, 1);
    }
  }
}

function updateAndDrawSparkles() {
  for (let i = sparkles.length - 1; i >= 0; i--) {
    sparkles[i].update();
    sparkles[i].display();
    if (sparkles[i].isDead()) {
      sparkles.splice(i, 1);
    }
  }
}

function displayRadio() {
  if (!radioImg) return;

  push();

  // Radio position and size
  let radioX = width * 0.47;  // Left side of the room
  let radioY = height * 0.28;  // Lower area
  let radioWidth = width * 0.08;  // Adjust size as needed
  let radioHeight = radioWidth * (radioImg.height / radioImg.width); // Maintain aspect ratio

  // Draw glow effect if music is playing
  if (isRadioPlaying) {
    // Pulsing glow effect
    let glowSize = 10 + sin(frameCount * 0.1) * 5;
    fill(255, 215, 0, 100);
    noStroke();
    ellipse(radioX + radioWidth/2, radioY + radioHeight/2, radioWidth + glowSize, radioHeight + glowSize);
  }

  // Draw the radio image
  imageMode(CORNER);
  image(radioImg, radioX, radioY, radioWidth, radioHeight);

  // Draw music notes if playing
  if (isRadioPlaying) {
    fill(255, 215, 0);
    textSize(20);
    textAlign(CENTER);
    text("♪", radioX + radioWidth + 10, radioY + sin(frameCount * 0.1) * 5);
    text("♫", radioX + radioWidth + 25, radioY + 15 + cos(frameCount * 0.15) * 5);
  }

  pop();
}

function displayInteractionHints() {
  push();
  noStroke();
  fill(128, 128, 128, 200);
  textAlign(CENTER);
  textSize(14);

  // Tree hint (right side)
  text("Click tree to decorate", width * 0.78, height * 0.15);

  // Radio hint (left side, lower area)
  let radioHint = isRadioPlaying ? "Click radio to stop music" : "Click radio for music";
  text(radioHint, width * 0.35, height * 0.28);

  // Fireplace hint (center-left)
  let fireplaceHint = fireplaceState === 'off' ? "Click fireplace to light" : "Click fireplace to extinguish";
  text(fireplaceHint, width * 0.42, height * 0.85);

  pop();
}

function displayJumpscare() {
  push();
  // Dark overlay
  fill(0, 0, 0, 200);
  rect(0, 0, width, height);

  // Jumpscare text (you can replace this with an image)
  fill(255, 0, 0);
  textAlign(CENTER, CENTER);
  textSize(80);
  text("HO HO HO!", width / 2, height / 2);

  textSize(40);
  fill(255);
  text("SANTA'S WATCHING!", width / 2, height / 2 + 80);

  pop();

  // Timer to hide jumpscare
  jumpscareTimer++;
  if (jumpscareTimer > 120) { // Show for 2 seconds at 60fps
    showJumpscare = false;
    jumpscareTimer = 0;
  }
}

function isNearTree(x, y) {
  // Tree is on the right side of the living room
  // Based on actual image positioning
  let treeX = width * 0.76;        // Center X of tree (shifted slightly left)
  let treeTopY = height * 0.18;    // Top of tree (star)
  let treeBottomY = height * 0.70; // Bottom of tree (base/presents)
  let treeBaseWidth = width * 0.10; // Half-width at base (expanded)

  // Check if point is within vertical bounds
  if (y < treeTopY || y > treeBottomY) {
    return false;
  }

  // Calculate the allowed width at this Y position (triangular shape)
  // Width increases linearly from top (narrow) to bottom (wide)
  let heightRatio = (y - treeTopY) / (treeBottomY - treeTopY);
  let allowedWidth = treeBaseWidth * heightRatio;

  // Check if X is within the triangular bounds at this Y
  return x > treeX - allowedWidth && x < treeX + allowedWidth;
}

function isNearRadio(x, y) {
  // Radio is on the left side, lower area
  let radioX = width * 0.48;
  let radioY = height * 0.28;
  let radioWidth = width * 0.08;
  let radioHeight = radioWidth * 1.2; // Approximate aspect ratio

  // Check if click is within the radio image bounds
  return x > radioX && x < radioX + radioWidth &&
         y > radioY && y < radioY + radioHeight;
}

function isNearFireplace(x, y) {
  // Fireplace is in the center of the room
  let fireplaceX = width * 0.5;
  let fireplaceY = height * 0.52;
  let fireplaceWidth = width * 0.12;
  let fireplaceHeight = height * 0.25;

  return x > fireplaceX - fireplaceWidth / 2 && x < fireplaceX + fireplaceWidth / 2 &&
         y > fireplaceY - fireplaceHeight / 2 && y < fireplaceY + fireplaceHeight;
}

function displayTownText() {
  push();
    textFont('Georgia');
    textSize(20);
    fill(100,100,120);
    strokeWeight(3);
    //stroke(200,200,200);
    text("Click a door to enter", 30, height-30);
  pop();

  push();
    textFont('Georgia');
    textSize(20);
    fill(100,100,120);
    strokeWeight(3);
    //stroke(200,200,200);
    text("Click sled for fun", width-450, height-30);
  pop();
}

function triggerJumpscare() {
  // Resume audio context if blocked
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }

  showJumpscare = true;
  jumpscareTimer = 0;

  if (jumpscareSound && jumpscareSound.isLoaded()) {
    jumpscareSound.setVolume(0.7); // safe volume
    jumpscareSound.play();         // play once
  }
}


