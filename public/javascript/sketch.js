

// Create connection to Node.JS Server
const socket = io();

let canvas;
let roll = 0;
let pitch = 0;
let yaw = 0;
let t = 150;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  //canvas = createCanvas(windowWidth, windowHeight);
  //createEasyCam();
 
}

function draw() {
  background(0);

  //lights();
  //ambientMaterial(100, 0, 100);

  //rotateZ(pitch);
 // rotateX(roll);
 // rotateY(yaw);
  for (let i = 0; i < 150; i += 1) {
    for (let j = 0; j < 150; j += 2) {
      push();
      translate(width/2, height/2);
      rotate(i / 150 * PI + j);
      noStroke();
      fill(40 + pitch * 5, random(0, 255), 255);
      scale(roll * 4);
      circle(sin(j / 150 * TAU + sin(i / 150 * PI * 4)) * i * pitch * 50, cos(j / 150 * TAU)* i, noise(2) * 4);
      pop();
    }
  t += yaw;
  }

}

//process the incoming OSC message and use them for our sketch
function unpackOSC(message){

  /*-------------

  This sketch is set up to work with the gryosc app on the apple store.
  Use either the gyro OR the rrate to see the two different behaviors
  TASK: 
  Change the gyro address to whatever OSC app you are using to send data via OSC
  ---------------*/

  //maps phone rotation directly 
  if(message.address == "/gyrosc/gyro"){
     roll = message.args[0]; 
     pitch = message.args[1];
     yaw = message.args[2];
  }

  //uses the rotation rate to keep rotating in a certain direction
  if(message.address == "/gyrosc/rrate"){
    roll += map(message.args[0],-3,3,-0.1,0.1);
    pitch += map(message.args[1],-1,10,-0.1,0.1);
    yaw += map(message.args[2],-1, 1,-0.01,0.1);
  }
}

//Events we are listening for
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Connect to Node.JS Server
socket.on("connect", () => {
  console.log(socket.id);
});

// Callback function on the event we disconnect
socket.on("disconnect", () => {
  console.log(socket.id);
});

// Callback function to recieve message from Node.JS
socket.on("message", (_message) => {

  console.log(_message);

  unpackOSC(_message);

});
