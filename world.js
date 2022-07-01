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

  // beginShape();
  // vertex(0, 0);
  // vertex(0, tw);
  // vertex(th, tw);
  // vertex(th, 0);
  // endShape(CLOSE);

  let rand = noise(i, j);

  if(rand < 0.33){
    drawGrass(i, j);
  }else if(rand < 0.66 && rand >= 0.33){
    drawRock();
  }else{
    drawBlock();
  }

  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    //clicked circle's color
    fill(255, 255, 0, 180);
    ellipse(th/2, tw/2, 10, 10);
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

function drawGrass(i, j){
  fill(138, 163, 43);
  noStroke();
  rect(0, 0, th, tw);
}

function drawRock(){
  fill("#AACAF5");
  noStroke();
  rect(0, 0, th, tw);
}

function drawBlock(){
  fill("#9F77FF");
  noStroke();
  rect(0, 0, th, tw);
}
