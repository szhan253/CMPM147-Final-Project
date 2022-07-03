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

  if(rand < 0.33){
    drawGrass(i, j);
  }else if(rand < 0.66 && rand >= 0.33){
    drawBlock();
  }else{  
    drawRock();
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

function drawGrass(i, j){
  fill(93, 99, 23);
  noStroke();
  rect(0, 0, th, tw);

  if(noise(i+1, j) >= 0.33){
    fill(203,162,125);
    rect(th/5*4, 0, th, tw);
    fill(93, 99, 23);
    ellipse(th/5*4, tw/8, th/3, tw/4);
    ellipse(th/5*4, tw/8*3, th/3, tw/4);
    ellipse(th/5*4, tw/8*5, th/3, tw/4);
    ellipse(th/5*4, tw/8*7, th/3, tw/4);
  }
  if(noise(i-1, j) >= 0.33){
    fill(203,162,125);
    rect(0, 0, th/5, tw);
    fill(93, 99, 23);
    ellipse(th/5, tw/8, th/3, tw/4);
    ellipse(th/5, tw/8*3, th/3, tw/4);
    ellipse(th/5, tw/8*5, th/3, tw/4);
    ellipse(th/5, tw/8*7, th/3, tw/4);
  }
  if(noise(i, j+1) >= 0.33){
    fill(203,162,125);
    rect(0, tw/5*4, th, tw);
    fill(93, 99, 23);
    ellipse(th/8, tw/5*4, th/4, tw/3);
    ellipse(th/8*3, tw/5*4, th/4, tw/3);
    ellipse(th/8*5, tw/5*4, th/4, tw/3);
    ellipse(th/8*7, tw/5*4, th/4, tw/3);
  }
  if(noise(i, j-1) >= 0.33){
    fill(203,162,125);
    rect(0, 0, th, tw/5);
    fill(93, 99, 23);
    ellipse(th/8, tw/5, th/4, tw/3);
    ellipse(th/8*3, tw/5, th/4, tw/3);
    ellipse(th/8*5, tw/5, th/4, tw/3);
    ellipse(th/8*7, tw/5, th/4, tw/3);
  }
}

function drawRock(){
  fill(203,162,125);
  noStroke();
  rect(0, 0, th, tw);

  //rock
  fill(139, 149, 146);
  beginShape();
  vertex(th/7, tw/3);
  vertex(th/7*2, tw/5);
  vertex(th/7*3, tw/6);
  vertex(th/7*4, tw/6);
  vertex(th/7*5, tw/4);
  vertex(th/9*8, tw/7*5);
  vertex(th/11, tw/7*5);
  stroke(20);
  endShape(CLOSE);

  line(th/2, tw/7*2, th/7*3, tw/7*3);
  line(th/6, tw/5*3, th/7*3, tw/7*3);
  line(th/3*2, tw/5*3, th/7*3, tw/7*3);
  stroke(127);
  
}

function drawBlock(){
  //background
  fill(203,162,125);
  noStroke();
  rect(0, 0, th, tw);

  //dots
  stroke(229, 240, 139);
  circle(th/3, tw/3, 1);
  circle(th/5*2, tw/9*5, 1);
  circle(th/7*4, tw/5, 1);
  circle(th/7*5, tw/7*4, 1);
  circle(th/9*7, tw/3, 1);
}

function drawClick(i, j){
  if(noise(i,j) >= 0.33){
    fill(203,162,125);
    noStroke();
    rect(0, 0, th, tw);
  }

  stroke(241, 228, 247);
  fill(241, 228, 247);
  circle(th/2, tw/4, 6);
  circle(th/7*2, tw/7*3, 6);
  circle(th/7*5, tw/7*3, 6);
  circle(th/11*4, tw/7*5, 6);
  circle(th/11*7, tw/7*5, 6);
  stroke(246, 166, 3);
  fill(246, 166, 3);
  circle(th/2, tw/2, 6);
}
