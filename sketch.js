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

//snowman
let snowmanImg;
let obstacles = [];

let snowmanSpawn = false;
let gameOver = false;

//santa
let santaImg;
let santaX, santaY;

let santaSliding = false;
let santaSlideSpeed= 6 ;
let santaTrail = [];

let santaW = 70;
let santaH = 45;
let moveRight = false;

let crashSnow = [];

let btnHome;
let btnRetry;
let buttonSpacing = 50;

// Audio variables
let fireplaceSound;
let christmasMusic;
let doorOpenSound;
let jumpscareSound;
let santaSound;
let sleighRideSound;
let endingSound;

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

  // Load santa image 
  santaImg = loadImage('santa.png');

  //Load snowman image
  snowmanImg = loadImage('snowman.png');

  // ********************
  // Load Audio
  // ********************
  townMusic = loadSound('audio/snow.mp3');
  fireplaceSound = loadSound('audio/fireplace.mp3');
  doorOpenSound = loadSound('audio/door opening.mp3');
  christmasMusic = loadSound('audio/christmas_song.mp3');
  sparkleSound = loadSound('audio/sparkle.wav');
  jumpscareSound = loadSound('audio/ho_ho_ho.wav');
  santaSound = loadSound('audio/santaclaus.mp3');
  sleighRideSound = loadSound('audio/sleighride.mp3');
  endingSound = loadSound('audio/wonderfultime.mp3');
}

function draw() {
  displayCurrentPage();
  // Only show clouds when on the first scene (index 0)
  if (currentPageIndex === 0) {
    //bg music
    if(!townMusic.isPlaying()) {
      townMusic.loop();
    }
    townMusic.setVolume(0.8);
       
    // Add snowflakes in town scene
    updateAndDrawSnowflakes();
    displayTownText();

    //draw stars
    for (let star of stars) {
      star.display();
    }

    //clouds on top 
    updateAndDrawClouds();


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

    //draw santa
    if (!santaSliding) {
        // Show initial Santa image
        image(santaImg, santaX, santaY, santaW, santaH);
    } else {
        // Draw Santa with flip if moving left/right
        push();
        translate(santaX + santaW / 2, santaY + santaH / 2); //move origin to center of santa image so easier to flip
        if (moveRight) {
            scale(-1, 1); // flip image when moving left
        }   
    image(santaImg, -santaW / 2, -santaH / 2, santaW, santaH);
    pop();
    }

  
    if (santaSliding) {
        if(moveRight) {
            santaX += santaSlideSpeed;   // slide horizontally (goes to the left)
            santaTrail.push(new SantaTrailFlake(santaX, santaY + santaH / 2)); // trail on left
        } else {
            santaX -= santaSlideSpeed;
            santaTrail.push(new SantaTrailFlake(santaX + santaW, santaY + santaH / 2)); // trail on right
        }
    }   

   // Draw santa trail
    for (let i = santaTrail.length - 1; i >= 0; i--) {
        let t = santaTrail[i];
        t.update();
        t.display();
        if (t.isGone()) {
            santaTrail.splice(i, 1);
        }
    }

    // Loop Santa back when off-screen
    if (moveRight && santaX > width) {
        moveRight = false;   // reverse direction
        santaX = width;        // start from right
    } else if (!moveRight && santaX + santaW < 0) {
        moveRight = true;    // reverse direction
        santaX = -santaW;      // start from left
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
  }


    // Living room interactive elements (scene 1)
    if (currentPageIndex === 1) {
        //stop town music
        if (townMusic.isPlaying()) {
            // townMusic.stop();
            townMusic.setVolume(0);
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
        if (townMusic.isPlaying()) {
            townMusic.stop(); // Stops town music
        }
       if (!gameOver && !sleighRideSound.isPlaying()) {
            sleighRideSound.loop();  // Start the audio, and loop it during the game
        } 

        // Stop everything if crashed
        if (gameOver) {
            if (sleighRideSound.isPlaying()) {
                sleighRideSound.stop(); // Stop the sled game music if it's playing
            } 

        if (!endingSound.isPlaying()) {
            endingSound.loop();  // Start the audio, and loop it during the game
        } 
            background(30, 60, 120, 220);

            drawSnowOverlay();

            push();
            textAlign(CENTER, CENTER);

            fill(150, 220, 255, 120);
            textSize(127);
            text("❄ CRASH! ❄", width / 2, 145);  // glow

            fill(180, 240, 255);
            textSize(115);
            text("❄ CRASH! ❄", width / 2, 150); // front text
            pop();

            // Button dimensions
            let btnWidth = 200;
            let btnHeight = 80;
            btnHome = { x: width/2 - btnWidth - buttonSpacing/2, y: 420, w: btnWidth, h: btnHeight };
            btnRetry = { x: width/2 + buttonSpacing/2, y: 420, w: btnWidth, h: btnHeight };

            // Draw glowing buttons
            drawGlowButton(btnHome.x, btnHome.y, btnHome.w, btnHome.h, "HOME");
            drawGlowButton(btnRetry.x, btnRetry.y, btnRetry.w, btnRetry.h, "RETRY");

            return;
        }

        // HILL SCROLL
        background(30, 60, 120);

        drawHill(hillY);

        if (hillY < height) {             // draw a second hill above until first fully scrolls
        drawHill(hillY - height);     
        }

        hillY += hillSpeed;
        
        // Check if the hill has completely scrolled off the screen
        if (hillY >= height) {
            // Hill is off the screen, start spawning snowmen
            if (!snowmanSpawn) {
                snowmanSpawn = true; // Set flag to true to prevent multiple spawns
            }

            // Handle snowman spawning after hill is off-screen
                if (frameCount % 40 === 0) {
                    createSnowman(); // Call your function to create a snowman
                }
        }
        //snowfall
        drawSnowOverlay();

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

    //on screen text
    push();
      fill(90,90,180);
      noStroke();
      textSize(20);
      textFont('Georgia');
      text("Click spacebar to steer up", width-width*.98, height-height*.95);
      text("Avoid snowman", width-width*.98, height-height*.90);
    pop();

    // MOVE + DRAW SNOWMAN
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let ob = obstacles[i];
        ob.x -= 6;

        image(snowmanImg, ob.x, ob.y, ob.w, ob.h);

        if (ob.x < -200) {
            obstacles.splice(i, 1);
            continue;
        }

        // ===== CUSTOM TIGHT HITBOX =====

        // how big the REAL sled body is inside the PNG:
        let hitboxWidth = sledW * 0.55;   // 55% of width
        let hitboxHeight = sledH * 0.6;   // 60% of height

        // offset to center the hitbox on the sled
        let hitboxOffsetX = (sledW - hitboxWidth) * 0.05;
        let hitboxOffsetY = (sledH - hitboxHeight) / 2;

        // compute hitbox edges
        let hitLeft   = playerX + hitboxOffsetX;
        let hitRight  = hitLeft + hitboxWidth;
        let hitTop    = playerY + hitboxOffsetY;
        let hitBottom = hitTop + hitboxHeight;

        // collision check
        if (
            hitRight > ob.x &&
            hitLeft < ob.x + ob.w &&
            hitBottom > ob.y &&
            hitTop < ob.y + ob.h
        ) {
            gameOver = true;
        }
    }
}
    
}
 
function createSnowman() {
  let w = 40;               // obstacle width
  let h = random(40, 100);  // obstacle height

  // Random Y position along the right side (from top to near ground)
  let yMin = 50;                    // top limit
  let yMax = height - h - 50;       // bottom limit
  let y = random(yMin, yMax);

  let ob = {
    x: width + 50,   // start off-screen right
    y: y,            // random vertical position
    w: w,
    h: h
  };
  
  obstacles.push(ob);
}


function drawGlowButton(x, y, w, h, label) {
    push();
    rectMode(CORNER);
    textAlign(CENTER, CENTER);
    textSize(30);

    
    // Check if mouse is over the button
    let isHover = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;

       // Calculate pulsing effect for glow
    let pulse = isHover ? 5 * sin(frameCount * 0.2) : 0; // pulse only on hover

    // Glow effect
    for (let i = 10; i > 0; i--) {
        noFill();
        stroke(150, 220, 255, isHover ? 120 + 60 * sin(frameCount * 0.3) : 50); // dynamic alpha
        strokeWeight(i + pulse); // pulsate stroke weight
        rect(x - i/2 - pulse/2, y - i/2 - pulse/2, w + i + pulse, h + i + pulse, 12);
    }

    // Button background
    noStroke();
    fill(isHover ? color(200, 255, 255) : color(180, 240, 255)); // lighter when hovered
    rect(x, y, w, h, 12);

    // Button text
    fill(20, 50, 80); // darker text for contrast
    text(label, x + w/2, y + h/2);
    pop();
}

function drawSnowOverlay() {
    // Create new snowflakes
    if (frameCount % 3 === 0) {
        crashSnow.push({
            x: random(width),
            y: -10,
            size: random(2, 5),
            speed: random(1, 3)
        });
    }

    // Draw & update snowflakes
   for (let i = crashSnow.length - 1; i >= 0; i--) {
    let s = crashSnow[i];
    
    // Add glow / bluish tint
    stroke(180, 200, 255, 150); // faint outline
    strokeWeight(1);
    fill(200, 220, 255, 200); // bluish snow
    
    circle(s.x, s.y, s.size);
    
    noStroke(); // reset for next frame
    
    s.y += s.speed;
    
    if (s.y > height) crashSnow.splice(i, 1);
    }

}

function drawHill(yOffset){
    noStroke();
    fill(255); // white snow

    beginShape();
    for (let x = 0; x <= width; x++) {
    let y = (height - 400) + 350 * noise(x * 0.015 + yOffset *0.01) - yOffset;
    y+= random(-2,2);
    vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
}


function createObstacle() {
  let w = 40;               // obstacle width
  let h = random(40, 100);  // obstacle height

  // Random Y position along the right side (from top to near ground)
  let yMin = 50;                    // top limit
  let yMax = height - h - 50;       // bottom limit
  let y = random(yMin, yMax);

  let ob = {
    x: width + 50,   // start off-screen right
    y: y,            // random vertical position
    w: w,
    h: h
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

  //sled
  sledW = 200; //its width
  sledH = sledW * (sledImg.height/ sledImg.width); //helps keep the aspect ratio 
  sledX = 1050; //position
  sledY = 650; //position

  //santa
  santaW = 350 // its width
  santaH = santaW * (santaImg.height / santaImg.width); //helps keep the aspect ratio
  santaX = 1000; //position
  santaY = 50; //position

    btnHome = { x: width/2 - 160 - buttonSpacing/2, y: 420, w: 160, h: 60 };
    btnRetry = { x: width/2 + buttonSpacing/2, y: 420, w: 160, h: 60 };

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

 // Santa Click
  if (currentPageIndex === 0 && mouseX > santaX && 
    mouseX < santaX + santaW && mouseY > santaY && mouseY < santaY + santaH) {
   santaSliding = true;

     // Play the sound once when the Santa image is clicked
    if (!santaSound.isPlaying()) {
      santaSound.play();
    }
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
  

  // Check if game over screen is active
  if (gameOver) {
    // HOME button
    if (
      mouseX >= btnHome.x &&
      mouseX <= btnHome.x + btnHome.w &&
      mouseY >= btnHome.y &&
      mouseY <= btnHome.y + btnHome.h
    ) {
      goHome();
    }

    // RETRY button
    if (
      mouseX >= btnRetry.x &&
      mouseX <= btnRetry.x + btnRetry.w &&
      mouseY >= btnRetry.y &&
      mouseY <= btnRetry.y + btnRetry.h
    ) {
      retrySledGame();
    }
  }
}

// Function to return to home screen
function goHome() {
  hillY = 0;
  currentPageIndex = 0; // or whatever your home index is
  gameOver = false;

  if (endingSound.isPlaying()) {
    endingSound.stop();  // Stop crash sound
  }

    if (townMusic.isPlaying()) {
    townMusic.stop();  // If you're in a different scene, stop the town music
  }

  // Reset sled/game variables if needed
  sledX = 1050;
  sledY = 650;
  playerY = 300;
  playerVY = 0;
  obstacles = [];
  sledSliding = false;

  
  // Start home music or any other relevant audio
  if (!townMusic.isPlaying()) {
    townMusic.loop();  // Loop town music when back to home screen
  }

}

// Function to retry sled game
function retrySledGame() {
  currentPageIndex = 2; // sledding screen
  gameOver = false;

  if (endingSound.isPlaying()) {
    endingSound.stop();  // Stop crash sound
  }

  // Reset sled/game variables
  playerY = 300;
  playerVY = 0;
  playerX = 200;      // optional, reset sled horizontal position
  sledX = 1050;       // if using sled sliding again
  sledY = 650;
  sledSliding = false;

  // Clear obstacles and particles
  obstacles = [];
  sledTrail = [];
  crashSnow = [];

  // Reset background hill scroll
  hillY = 0;
  hillSpeed = 3;
  
  // Reset background music
  if (!sleighRideSound.isPlaying()) {
    sleighRideSound.loop();
  }
  snowmanSpawn = false; // Reset snowman spawn flag
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
    text("Click sled for fun", width-width*0.3, height-height*.05);
  pop();

  push();
    textFont('Georgia');
    textSize(20);
    fill(200,200,220);
    strokeWeight(3);
    //stroke(200,200,200);
    text("Click Santa to help deliver presents", width-width*0.4, height-height*.75);
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