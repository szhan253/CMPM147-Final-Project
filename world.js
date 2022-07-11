"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 32;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
  console.log(i, j);
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();
  //background color of cubes
  fill(noise(i, j) * 255)

  push();

  let rand = noise(i, j);

  if(rand <= 0.17){
    drawRock();
  }else if(rand <= 0.34 && rand > 0.17){
    drawLava();
  }else if(rand <= 0.51 && rand > 0.40){  
    drawGrass();
  }else if(rand <= 0.68 && rand > 0.51){
    drawSand(rand);
  }else if(rand <= 0.85 && rand > 0.68){
    drawSnow();
  }else{
    drawWater();
  }

  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    //clicked circle's color
    drawClick(i, j);
  }

  pop();
}


//green frame showing which block is slected by mouse
function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(0, 0);
  vertex(0, tw);
  vertex(th, tw);
  vertex(th, 0);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("(" + [i, j] + ")", 0, 0);
}

function p3_drawAfter() {}

//tile functions
function drawGrass(){
  image(grass, 0, 0, th, tw);

  tile = "grass";
}

function drawLava(){
  image(lava, 0, 0, th, tw);

  tile = "lava";
}

function drawSand(noiseVal){
  // sand tile
  image(sand, 0, 0, th, tw);

  // draw box
  noiseVal = int(noiseVal * pow);
  if(noiseVal % 7 == 0){
    drawBox();
  }else{
    tile = "sand";
  }
}

function drawSnow(){
  image(snow, 0, 0, th, tw);

  tile = "snow";
}

function drawWater(){
  image(water, 0, 0, th, tw);

  tile = "water";
}


function drawRock(){
  drawSand();

  //rock
  image(rock, 0, 0, th, tw);

  //declare tile type
  tile = "rock";
  
}

function drawBox(){
  image(box, 0, 0, th, tw);

  //declare tile type
  tile = "box";
}

function drawHeartBox(){
  image(heartBox, 0, 0, th, tw);

  tile = "heartBox";
}

function drawClick(i, j){
  let rand = noise(i, j);
  let temp;

  //if clicked on box
  if(tile == "box"){
    temp = int(rand * pow * 10);
    console.log(temp);

    if(temp % 4 == 0){
      drawHeartBox();
    }
  }
}
