//data variables
let migrantsData; // variable to hold migrant data

//coordinates grid (ocean map)
let sizes = []; 
let cols; let rows; let size = 4.5;
let xoff = 0; let yoff = 0; let inc = 10;
let zoff = 0;

//migrant video
let video;

// pixelated cloud
let cloud;
let cloudAlpha = 255; // transparency

//drone (human)
let droneX; 
let droneY;
let delay = 15;
let delayFrameCount = 0;
let droneVisible = false;

//sound signal
let signal; let beep;
let playSoundTrigger1 = true;
let playSoundTrigger2 = true;

//search timer
let searchStartTime; //initiate timer for beginning of search
let searchTime = 0; //calculating time for search

// webcam (motion/object tracking?)
let capture;

// preload() CSV data (migrants data) + files
function preload() {
  migrantsData = loadTable('MissingMigrants-Global-2024-01-26--01_47_22.csv', "csv", "header"); 
  video = createVideo('assets/migrants.mp4');
  cloud = loadImage('assets/cloud.jpeg');
  signal = loadSound("assets/signal.mp3");
  beep = loadSound("assets/long_beep.mp3");
  car = loadImage('assets/car.png');
  building = loadImage('assets/building.png');
  water = loadImage('assets/water.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('IBM Plex Mono');
  textSize(13);
  rectMode(CENTER);
  cols = width/size;
  rows = height/size;
  
  searchStartTime = millis(); // Beginning of search timer

  cloud.loadPixels();
  droneX = random(width);
  droneY = random(height);

  // webcam setup (future consideration to replace mouse position)
  capture = createCapture(VIDEO);
  capture.size(width, height);
  capture.hide(); // hide the video element

  video.hide(); // Hide the video element
  video.loop(); // Loop the video

//----- PRINTING CSV DATA (MIGRANTS DATA) ------//
  console.log(migrantsData); //printing data on console

//SELECTING DATA POINTS (Central & Eastern Mediterranean)
  console.log(migrantsData.rows[2].arr);
  //console.log(migrantsData.rows[2].arr[2]); //no. of missing/dead 
  //console.log(migrantsData.rows[2].arr[3]); //cause of death (Libya)
  //console.log(migrantsData.rows[2].arr[5]); //location of death (Libya)
  //console.log(migrantsData.rows[2].arr[6]); //coordinates (37.69253013, 26.99162098

  console.log(migrantsData.rows[242].arr);
  //console.log(migrantsData.rows[242].arr[2]); //no. of missing/dead 
  //console.log(migrantsData.rows[242].arr[3]); //cause of death
  //console.log(migrantsData.rows[242].arr[5]); //location of death 
  //console.log(migrantsData.rows[242].arr[6]); //coordinates (38.93008746, 16.920575)

  console.log(migrantsData.rows[133].arr);
  //console.log(migrantsData.rows[133].arr[2]); //no. of missing/dead 
  //console.log(migrantsData.rows[133].arr[3]); //cause of death
  //console.log(migrantsData.rows[133].arr[5]); //location of death 
  //console.log(migrantsData.rows[133].arr[6]); //coordinates (40.84678664, 14.259993)

  console.log(migrantsData.rows[187].arr);
  //console.log(migrantsData.rows[187].arr[2]); //no. of missing/dead 
  //console.log(migrantsData.rows[187].arr[3]); //cause of death
  //console.log(migrantsData.rows[187].arr[5]); //location of death 
  //console.log(migrantsData.rows[187].arr[6]); //coordinates (32.78104669, 13.90542)
  
  console.log(migrantsData.rows[261].arr);
  //console.log(migrantsData.rows[261].arr[2]); //no. of missing/dead 
  //console.log(migrantsData.rows[261].arr[3]); //cause of death (Libya)
  //console.log(migrantsData.rows[261].arr[5]); //location of death (Libya)
  //console.log(migrantsData.rows[261].arr[6]); //coordinates (32.12385825, 24.235389)

  console.log(migrantsData.rows[943].arr);
  //console.log(migrantsData.rows[943].arr[2]); //no. of missing/dead 
  //console.log(migrantsData.rows[943].arr[3]); //cause of death (Libya)
  //console.log(migrantsData.rows[943].arr[5]); //location of death (Libya)
  //console.log(migrantsData.rows[943].arr[6]); //coordinates (34.934474, 12.410204)
}


function draw() {
  background(0,4,53);
  xoff = 0;
  
    // mapping coordinate points
    push();
    for (let i = 0; i < migrantsData.getRowCount(); i++) {
      let latitude = parseFloat(migrantsData.rows[i].arr[6].split(',')[0]);
      let longitude = parseFloat(migrantsData.rows[i].arr[6].split(',')[1]);
      let mappedX = map(longitude, -180, 180, 0, width-10);
      let mappedY = map(latitude, -90, 90, height, 0);
  
      fill(0, 255, 0, 255); //mapping data
      noStroke();
      ellipse(mappedX, mappedY, 5, 5);
    }
    pop();

    // cloud image (reveal)
    //tint(255, cloudAlpha); // Set transparency (alpha) value
    image(cloud, 0, 0, width, height);
    //noTint(); // prevent other transparent

    // transparency speed
    if (cloudAlpha > 0) {
     cloudAlpha -= 4; //(speed of fading)
    }

    // mapping drone distance from selected coordinates
  push();
  let selectedCoordinates = [
   { latitude: 37.69253013, longitude: 26.99162098 }, //2
   { latitude: 38.93008746, longitude: 16.920575 },  //242   
   { latitude: 40.84678664, longitude: 14.259993 }, //133 
   { latitude: 32.78104669, longitude: 13.90542 },  //187  
   { latitude: 32.12385825, longitude: 24.235389 }, //261 
   { latitude: 34.934474, longitude: 12.410204 } // 943   
  ];

  for (let i = 0; i < selectedCoordinates.length; i++) {
    let latitude = selectedCoordinates[i].latitude;
    let longitude = selectedCoordinates[i].longitude;
    let mappedX = map(longitude, -180, 180, 0, width - 10);
    let mappedY = map(latitude, -90, 90, height, 0);

    // distance between drone and mapped coordinate
    let distance = dist(mouseX, mouseY, mappedX, mappedY);
    console.log(distance);

    // mapping distance to sound - closer to coordinate, louder the SOS signal
    //drone will follow sound signal to navigate when searching
    let volume = map(constrain(distance, 0, 700), 0, 700, 1, 0);
    signal.setVolume(volume);

    //time taken for drone to search for migrant
    searchTime = millis() - searchStartTime;

    //surveillance images - environment searching
    if (distance > 500 ){
     fill(255);
     stroke(0);
     textSize(15);
     textStyle(BOLD);
     textAlign(CENTER, RIGHT); 
     text("SEARCHING...", mouseX, mouseY + 50);
    }

    if (distance >= 500 && distance < 550 ){
      //display car
      image(car, 30, 30, mouseX, mouseY);
      fill(255,0,0);
      stroke(0);
      textSize(15);
      textStyle(BOLD);
      textAlign(CENTER, RIGHT); 
      text("CAR DETECTED...", mouseX, mouseY - 50);
     }

     if (distance >= 310 && distance < 319 ){
      //display building
      image(building,300, 40, mouseX, mouseY);
      fill(255,0,0);
      stroke(0);
      textSize(15);
      textStyle(BOLD);
      textAlign(CENTER, RIGHT); 
      text("BUILDING DETECTED...", mouseX, mouseY - 50);
     }

     if (distance >= 172 && distance < 200 ){
      //display 
      image(water, 500, 40, mouseX, mouseY);
      fill(255,0,0);
      stroke(0);
      textSize(15);
      textStyle(BOLD);
      textAlign(CENTER, RIGHT); 
      text("WATER DETECTED...", mouseX, mouseY - 50);
     }

    //coordinates detected
    if (distance <= 50) {
      if (playSoundTrigger2) {
        beep.play();
        playSoundTrigger2 = false;
      }

      signal.stop();

      // time taken for search
      fill(255);
      textSize(15);
      textStyle(BOLD);
      textAlign(CENTER, RIGHT);
      text("LOCATION IDENTIFIED:" + migrantsData.rows[242].arr[5], width / 2, height - 100);
      text("CAUSE OF DEATH: " + migrantsData.rows[242].arr[3], width / 2, height - 60);
      text("Time taken to search for missing migrant: " + nf(searchTime / 1000, 0, 2) + " hours", width / 2, height - 30);
      //migrant video
      image(video, 0, 0, width, height);
      video.loop(); // Loop the video
      
      // mapping CSV coordinate points
      push();
      for (let i = 0; i < migrantsData.getRowCount(); i++) {
        let latitude = parseFloat(migrantsData.rows[i].arr[6].split(',')[0]);
        let longitude = parseFloat(migrantsData.rows[i].arr[6].split(',')[1]);
        let mappedX = map(longitude, -180, 180, 0, width-10);
        let mappedY = map(latitude, -90, 90, height, 0);
    
        fill(0, 255, 0, 255); //mapping data points
        noStroke();
        ellipse(mappedX, mappedY, 5, 5);
      }
      pop();
    
     // migrant detected
      fill(255,0,0);
      textSize(15);
      stroke(0);
      textAlign(CENTER, RIGHT); 
      text("MIGRANT DETECTED", mouseX, mouseY + 50);

      fill(255);
      text("You have found " + migrantsData.rows[242].arr[2] + " migrants", mouseX, mouseY + 90);
    
      fill(0,255,0);
      text(migrantsData.rows[242].arr[6], mouseX, mouseY + 120);

      tint(255, cloudAlpha); // Set transparency (alpha) value
      image(cloud, 0, 0, width, height);
      //noTint(); // prevent other transparent
    
     // transparency speed
     if (cloudAlpha > 0) {
      cloudAlpha -= 6; //(speed of fading)
     }
  } else {
    if (cloudAlpha < 255) {
      cloudAlpha += 4; // Increase alpha for gradual fade-in
    }
  }
  }

pop();
   // drone detection
   if (delayFrameCount >= delay) {
    // drone (human)
    fill(0, 255, 0);
    rect(mouseX, mouseY, 35, 50);
    droneVisible = true;
    fill(255,0,0);
    ellipse(mouseX, mouseY, 10, 10);
    
    // drone detected
    fill(0,255,0);
    textSize(15);
    stroke(0);
    textAlign(CENTER, RIGHT);
    text("drone detected", mouseX, mouseY);
    
    //sound signal
    if (playSoundTrigger1) {
      signal.loop();
      signal.play();
      playSoundTrigger1 = false;
    }

  } else {
    delayFrameCount++;
  }

  // ocean map
  for (let i = 0; i<cols; i++){
    sizes[i] = [];
    yoff = 0;
    for (let j = 0; j<rows; j++){
      sizes[i][j] = map(noise (xoff,yoff, zoff), 0,1,0,size);
      yoff += inc;
      
      fill(0,0,200);
      noStroke();
      rect(size/2+i*size, size/2 + j*size, sizes[i][j],
  sizes[i][j]);
    }
     xoff += inc;
     zoff += 0.001;
    
  }
  for (let i = 0; i < cols; i ++){
    for (let j = 0; j<rows; j++){
    }
  }

  // coordinate grid lines
  stroke(255, 70);
  strokeWeight(3);
  for (let i = 1; i < cols; i += 15) {
    let x = i * size;
    line(x, 0, x, height);
  }
  for (let j = 1; j < rows; j += 15) {
    let y = j * size;
    line(0, y, width, y);
  }

}