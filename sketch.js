// declare our global
// arrays (aka "model")
let pageTexts = []; // array of texts
let choicesTexts = []; // array of texts
let pageImages = []; // array of images
let consequences = []; // array of lists (aka as arrays)

let doorColor;
let doorColor_livingroom;

let clouds = [];


class Cloud {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
  }
  display() {
    fill(255);
    noStroke();
    drawClouds(this.x, this.y, 35, 65);
    drawClouds(this.x + 10, this.y + 10, 40, 75);
    drawClouds(this.x - 20, this.y + 10, 40, 75);
    drawClouds(this.x, this.y - 10, 40, 75);
    drawClouds(this.x + 20, this.y - 10, 10, 45);
  }


  move() {
    this.x += this.speed;
    if (this.x > width + 80) {
      this.x = -80;
      this.y = random(50, height / 2);
    }
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
  // "Christmas Town"
  // ********************

  let tempI = 0;
  pageImages[tempI] = loadImage('christmas_town.png');

  tempI = 1;
  pageImages[tempI] = loadImage('christmas_livingroom.png');

}

function draw() {
  displayCurrentPage();

  // Only show clouds when on the first scene (index 0)
  if (currentPageIndex === 0) {
    updateAndDrawClouds();
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

  for (let i = 0; i < 5; i++) {
    let xPos = random(0, width);
    let yPos = random(50, height / 2);
    let cloudSpeed = random(0.5, 2);
    clouds.push(new Cloud(xPos, yPos, cloudSpeed));
  }


  // build audio objects
//   Object.keys(pageAudioSrc).forEach(k => {
//     const a = new Audio(pageAudioSrc[k]);
//     a.preload = 'auto';
//     a.volume = 0.9; // adjust as needed
//     pageAudio[k] = a;
//   });
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
  if (detectColor(doorColor)) {
    currentPageIndex = 1; // go to next scene
  }
  else if (currentPageIndex === 1 && detectColor(doorColor_livingroom)) {
    currentPageIndex = 0; // go back to town
  }

}


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
  for (let i = 0; i < clouds.length; i++) {
    clouds[i].move();
    clouds[i].display();
  }
}

