"use strict";

/* global p5 */
/* exported preload, setup, draw, mouseClicked */

// given
let tile_height;
let tile_width;
let tile_columns;
let tile_rows;
let camera_velocity;
let camera_offset;


let randNum;
let pow = 100;
let AutoTileNum = 5
let tile = "";

let isBowknot = false;
let isCloud = false;
let isPaper = false;
let isRocket = false;
let isSeed = false;
let isStar = false;

//image
let rock, grass, lava, sand, snow, water, cryCloud, rocket, star, seed, paper, bowknot;

let box, emptyBox, heartBox, healthLose, autoTileRock,heart,heart_empty;


let water_map = [
  {x: 0, y:0},
  {x: 32, y:0},
  {x: 64, y:0},
]

let water_move;

//sound
let bgm, explosion, collect, clothes, rain, flipPaper;

function preload(){
  // tile load
  rock = loadImage('assets/Rock.png');
  grass = loadImage('assets/grass.png');
  lava = loadImage('assets/lava.png');
  sand = loadImage('assets/sand.png');
  snow = loadImage('assets/snow.png');
  water = loadImage('assets/water.png');

  // image load
  box = loadImage('assets/UnopenBox.png');
  emptyBox = loadImage('assets/emptyBox.png');
  heartBox = loadImage('assets/HeartBox.png');
  healthLose = loadImage('assets/healthLose.png');
  autoTileRock = loadImage('assets/autoTileRock.png');
  heart = loadImage('assets/heart.png');
  heart_empty = loadImage('assets/heart_empty.png');
  cryCloud = loadImage('assets/cryCloud.png');
  rocket = loadImage('assets/rocket.png');
  star = loadImage('assets/star.png');
  seed = loadImage('assets/seed.png');
  paper = loadImage('assets/paper.png');
  bowknot = loadImage('assets/bowknot.png');

  // load animation
  water_move = loadImage('assets/water_map.png');

  //sound load
  soundFormats('mp3', 'ogg', 'wav');
  bgm = loadSound('assets/bgm.mp3'); // reference: Jimmy Lu
  explosion = loadSound('assets/explosion.ogg'); // reference: https://freesound.org/people/derplayer/sounds/587196/
  collect = loadSound('assets/collect.wav'); // reference: https://freesound.org/people/bradwesson/sounds/135936/
  clothes = loadSound('assets/clothes.wav'); // reference: https://freesound.org/people/ZoviPoland/sounds/517725/
  rain = loadSound('assets/rain.mp3'); // reference: https://freesound.org/people/babuababua/sounds/344430/
  flipPaper = loadSound('assets/flipPaper.wav'); // reference: https://freesound.org/people/_bepis/sounds/531895/

}


function setup() {
  //generate random seed using for the current project
  randNum = random(Number.MAX_SAFE_INTEGER);

  camera_offset = new p5.Vector(0, 0);
  camera_velocity = new p5.Vector(0, 0);

  let canvas = createCanvas(1200, 800);
  canvas.parent("container");

  if (window.p3_setup) {
    window.p3_setup();
  }

  let label = createP();
  label.html("World key: ");
  label.parent("container");

  // let input = createInput("cm147");
  let input = createInput(randNum);
  input.parent(label);
  input.input(() => {
    rebuildWorld(input.value());
  });

  createP("Arrow keys scroll. Clicking treasure chest for collecting items.").parent("container");

  rebuildWorld(input.value());

  bgm.loop();
}


function rebuildWorld(key) {
  if (window.p3_worldKeyChanged) {
    window.p3_worldKeyChanged(key);
  }
  tile_width = window.p3_tileWidth ? window.p3_tileWidth() : 32;
  tile_height = window.p3_tileHeight ? window.p3_tileHeight() : 32;
  tile_columns = Math.ceil(width / tile_width);
  tile_rows = Math.ceil(height / tile_height);
}

function cameraToWorldOffset([camera_x, camera_y]) {
  let world_x = camera_x / (tile_width);
  let world_y = camera_y / (tile_height);
  return { x: Math.round(world_x), y: Math.round(world_y) };
}

function draw() {  
  // Keyboard controls!
  if (keyIsDown(LEFT_ARROW)) {
    camera_velocity.x -= 1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    camera_velocity.x += 1;
  }
  if (keyIsDown(DOWN_ARROW)) {
    camera_velocity.y += 1;
  }
  if (keyIsDown(UP_ARROW)) {
    camera_velocity.y -= 1;
  }

  let camera_delta = new p5.Vector(0, 0);
  camera_velocity.add(camera_delta);
  camera_offset.add(camera_velocity);
  camera_velocity.mult(0.95); // cheap easing
  if (camera_velocity.mag() < 0.01) {
    camera_velocity.setMag(0);
  }

  let world_pos = screenToWorld(
    [mouseX, mouseY],
    [camera_offset.x, camera_offset.y]
  );
  let world_offset = cameraToWorldOffset([camera_offset.x, camera_offset.y]);

  background(0);

  if (window.p3_drawBefore) {
    window.p3_drawBefore();
  }

  for (let y = 0; y < tile_rows; y++) {
    for (let x = 0; x < tile_columns; x++) {
      drawTile([x + world_offset.x, y + world_offset.y], [
        camera_offset.x,
        camera_offset.y
      ]);
    }
  }

  describeMouseTile(world_pos, [camera_offset.x, camera_offset.y]);

  drawHeart(current_health);

  if (window.p3_drawAfter) {
    window.p3_drawAfter();
  }

  drawItemCollect();

  //reload page when health goes 0
  if(current_health == 0){
    window.location.reload();
  }
}

function screenToWorld([screen_x, screen_y], [camera_x, camera_y]) {
  screen_x += camera_x;
  screen_y += camera_y;
  screen_x /= tile_width;
  screen_y /= tile_height;
  return [Math.round(screen_x), Math.round(screen_y)];
}

// Display a discription of the tile at world_x, world_y.
function describeMouseTile([world_x, world_y], [camera_x, camera_y]) {
  if (window.p3_drawSelectedTile) {
    push()
    translate(world_x * tile_width - camera_x, world_y * tile_height - camera_y);
    window.p3_drawSelectedTile(world_x, world_y, camera_x, camera_y);
    pop()
  }
}

function drawTileDescription([world_x, world_y], [screen_x, screen_y]) {
  push();
  translate(screen_x, screen_y);
  if (window.p3_drawSelectedTile) {
    window.p3_drawSelectedTile(world_x, world_y, screen_x, screen_y);
  }
  pop();
}

// Draw a tile, mostly by calling the user's drawing code.
function drawTile([world_x, world_y], [camera_x, camera_y]) {
  push();
  translate(world_x * tile_width - camera_x, world_y * tile_height - camera_y);
  if (window.p3_drawTile) {
    window.p3_drawTile(world_x, world_y);
  }
  pop();
}

function mouseClicked() {
  let world_pos = screenToWorld(
    [mouseX, mouseY],
    [camera_offset.x, camera_offset.y]
  );

  if (window.p3_tileClicked) {
    window.p3_tileClicked(world_pos[0], world_pos[1]);
  }
  return false;
}

