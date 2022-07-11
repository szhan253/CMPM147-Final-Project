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
  }else if(rand <= 0.51 && rand > 0.34){  
    drawGrass();
  }else if(rand <= 0.68 && rand > 0.51){
    drawSand();
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

// function drawGrass(i, j){
//   fill(93, 99, 23);
//   noStroke();
//   rect(0, 0, th, tw);

//   if(noise(i+1, j) >= 0.33){
//     fill(203,162,125);
//     rect(th/5*4, 0, th, tw);
//     fill(93, 99, 23);
//     ellipse(th/5*4, tw/8, th/3, tw/4);
//     ellipse(th/5*4, tw/8*3, th/3, tw/4);
//     ellipse(th/5*4, tw/8*5, th/3, tw/4);
//     ellipse(th/5*4, tw/8*7, th/3, tw/4);
//   }
//   if(noise(i-1, j) >= 0.33){
//     fill(203,162,125);
//     rect(0, 0, th/5, tw);
//     fill(93, 99, 23);
//     ellipse(th/5, tw/8, th/3, tw/4);
//     ellipse(th/5, tw/8*3, th/3, tw/4);
//     ellipse(th/5, tw/8*5, th/3, tw/4);
//     ellipse(th/5, tw/8*7, th/3, tw/4);
//   }
//   if(noise(i, j+1) >= 0.33){
//     fill(203,162,125);
//     rect(0, tw/5*4, th, tw);
//     fill(93, 99, 23);
//     ellipse(th/8, tw/5*4, th/4, tw/3);
//     ellipse(th/8*3, tw/5*4, th/4, tw/3);
//     ellipse(th/8*5, tw/5*4, th/4, tw/3);
//     ellipse(th/8*7, tw/5*4, th/4, tw/3);
//   }
//   if(noise(i, j-1) >= 0.33){
//     fill(203,162,125);
//     rect(0, 0, th, tw/5);
//     fill(93, 99, 23);
//     ellipse(th/8, tw/5, th/4, tw/3);
//     ellipse(th/8*3, tw/5, th/4, tw/3);
//     ellipse(th/8*5, tw/5, th/4, tw/3);
//     ellipse(th/8*7, tw/5, th/4, tw/3);
//   }

//   tile = "";
// }


//tile functions
function drawGrass(){
  image(grass, 0, 0, th, tw);

  tile = "grass";
}

function drawLava(){
  image(lava, 0, 0, th, tw);

  tile = "lava";
}

function drawSand(){
  image(sand, 0, 0, th, tw);
  
  tile = "sand";
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
  fill(203,162,125);
  noStroke();
  rect(0, 0, th, tw);

  //rock
  image(rock, 0, 0, th, tw);

  //declare tile type
  tile = "rock";
  
}

function drawBlock(i,j){
  //background
  fill(203,162,125);
  noStroke();
  rect(0, 0, th, tw);

  //box
  if(noise(i, j) < 0.48 && noise(i, j) > 0.46){
    image(box, 0, 0, th, tw);

    //declare tile type
    tile = "box";
  }else{
    tile = "";
  }
  
}

function drawClick(i, j){
  // // fill background color again
  // if(noise(i,j) >= 0.33){
  //   fill(203,162,125);
  //   noStroke();
  //   rect(0, 0, th, tw);
  // }

  //if clicked on box
  if(tile == "box"){
    let rand = noise(i, j);
    // console.log(rand);
    // console.log(tile);
    // console.log("box clicked");
    
    if(rand > 0.47){
      image(heartBox, 0, 0, th, tw);
      // console.log("heart box");
    }else{
      // console.log("other box");
    }
  }
}
