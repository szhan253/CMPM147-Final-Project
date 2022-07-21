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

let current_health = 3;
const max_health = 3;
const min_health = 0;

let index = 0;
let time = 0;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 40;
}
function p3_tileHeight() {
  return 40;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
  // console.log(i, j);

  let rand = noise(i,j);
  let noiseVal = int(rand * pow);
  let temp = int(rand * pow * 10);

  if( rand <= 0.68 && rand > 0.51){ // if on sand tile
    if( noiseVal % 7 == 0){  // if is a box
      if( temp % 4 == 1){ // if is a bomb
        decreaseHealth();
        explosion.play();
      }
      if(temp % 4 == 0){
        increaseHealth();
      }
    }
  }
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
    drawWater(i,j);
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

function drawWater(i,j){
  var cell = water_map[index];

  let sprite = water_move.get(cell.x, cell.y, 32,32);
  image(sprite,0,0,th,tw);

  time += .1;
  if(time > 20){
    index++;
    if (index > water_map.length - 1) {
      index = 0;
    }
    time = 0;
  }

  tile = "water";

  // autotile
  let randL = noise(i-1, j);
  let randR = noise(i+1, j);
  let randU = noise(i, j-1);
  let randD = noise(i, j+1);

  //when left tile is not water
  if((randL <= 0.85 && randL > 0.40) || randL <= 0.34){
    for(let y = 0; y < tw; y+=tw/AutoTileNum){
      drawAutoRock(0, y);
    }
  }
  //when right tile is not water
  if((randR <= 0.85 && randR > 0.40) || randR <= 0.34){
    for(let y = 0; y < tw; y+=tw/AutoTileNum){
      drawAutoRock(th/AutoTileNum*(AutoTileNum-1), y);
    }
  }
  //when up tile is not water
  if((randU <= 0.85 && randU > 0.40) || randU <= 0.34){
    for(let x = 0; x < th; x+=th/AutoTileNum){
      drawAutoRock(x, 0);
    }
  }
  //when down tile is not water
  if((randD <= 0.85 && randD > 0.40) || randD <= 0.34){
    for(let x = 0; x < th; x+=th/AutoTileNum){
      drawAutoRock(x, tw/AutoTileNum*(AutoTileNum-1));
    }
  }

  // console.log(noise(i,j));
  
}


function drawRock(){
  //background
  image(sand, 0, 0, th, tw);

  //rock
  image(rock, 0, 0, th, tw);

  //declare tile type
  tile = "rock";
  
}

function drawAutoRock(x,y){
  image(autoTileRock, x, y, th/AutoTileNum, tw/AutoTileNum);
}

function drawBox(){
  image(box, 0, 0, th, tw);

  //declare tile type
  tile = "box";
}

function drawEmptyBox(){
  image(emptyBox, 0, 0, th, tw);

  tile = "emptyBox";
}

function drawHeartBox(){
  image(heartBox, 0, 0, th, tw);

  tile = "heartBox";
}

function drawHeart(){
  for(var i = 1; i<=current_health; i++){
    image(heart,i*100,100);
  }
  for(var i = 0; i<max_health-current_health; i++){
    image(heart_empty,300 - i*100,100);
  }
}

function decreaseHealth(){
  if(current_health > min_health){
    current_health = current_health-1;
  }
}

function increaseHealth(){
  if(current_health < max_health){
    current_health += 1;
  }
}

function drawHealthLose(){
  image(sand, 0, 0, th, tw);
  image(healthLose, 0, 0, th, tw);

  tile = "healthLose";
}

function drawItemCollect(){
  let temp = 60;
  if(isBowknot){
    image(bowknot, temp, height - temp, temp, temp);
  }
  if(isCloud){
    image(cryCloud, temp*2, height - temp, temp, temp);
  }
  if(isPaper){
    image(paper, temp*3, height - temp, temp, temp);
  }
  if(isRocket){
    image(rocket, temp*4, height - temp, temp, temp);
  }
  if(isSeed){
    image(seed, temp*5, height - temp, temp, temp);
  }
  if(isStar){
    image(star, 0, height - temp, temp, temp);
  }
}



function drawClick(i, j){
  let rand = noise(i, j);
  let temp;
  let is_bomb = false;

  //if clicked on box
  if(tile == "box"){
    temp = int(rand * pow * 10);

    // boxes contains heart
    console.log(is_bomb);
    if(temp % 4 == 0){
      drawHeartBox();
    }
    else if(temp % 4 == 1){
      drawHealthLose();
    }
    else if(temp % 4 == 2){
      drawEmptyBox();
    }else{
      let t2 = int(rand * pow * pow); //num using for random assign items
      image(sand, 0, 0, th, tw); //back ground
      if(t2 % 10 == 0){
        image(bowknot, 0, 0, th, tw);
        isBowknot = true;
      }else if(t2 % 10 == 1){
        image(cryCloud, 0, 0, th, tw);
        isCloud = true;
      }else if(t2 % 10 == 2){
        image(paper, 0, 0, th, tw);
        isPaper = true;
      }else if(t2 % 10 == 3){
        image(rocket, 0, 0, th, tw);
        isRocket = true;
      }else if(t2 % 10 == 4){
        image(seed, 0, 0, th, tw);
        isSeed = true;
      }else if(t2 % 10 == 5){
        image(star, 0, 0, th, tw);
        isStar = true;
      }

      console.log(t2);
    }
  }

}
