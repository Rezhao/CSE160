//vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }
`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;           //use color
    } else if (u_whichTexture == -1) {      //use UV debug color
      gl_FragColor = vec4(v_UV, 1.0, 1.0); 
    } else if (u_whichTexture == 0) {       //use texture0
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1) {       //use texture1
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else if (u_whichTexture == 2) {       //use texture2
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else {                                // error, put redish
      gl_FragColor = vec4(1, 0.2, 0.2, 1);
    }
  }`;

//Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;

function setupWebGL() {
  canvas = document.getElementById("webgl");
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if(!gl) {
    console.log('failed to get WebGL context');
    return -1;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  //get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  //get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  //get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  // Get the storage location of u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }

  // Get the storage location of u_Sampler1
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }

  // Get the storage location of u_Sampler2
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return;
  }

  // Get the storage location of u_whichTexture
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }

  //set an intial value for this matrix to identity
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

//constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

//global variables related to UI
let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;

let g_AngleX = 0;
let g_AngleY = 0;
let g_globalAngle = 0;
let g_leftLegAngle = 0;
let g_rightLegAngle = 0;
let g_feetAngle = 0;
let g_calfAngle = 0;
let g_headAngle = 0;

let shift_key = false;

let g_legAnimation = false;
let g_feetAnimation = false;
let g_calfAnimation = false;
let g_headAnimation = false;
let g_allAnimation = false;

//set up actions for the HTML UI elements
function addActionsForHtmlUI() {
  //all animation buttons
  document.getElementById('animationAllOffButton').onclick = function() {g_allAnimation = false;};
  document.getElementById('animationAllOnButton').onclick = function() {g_allAnimation = true;};
  //feet animation buttons
  document.getElementById('animationFeetOffButton').onclick = function() {g_feetAnimation = false;};
  document.getElementById('animationFeetOnButton').onclick = function() {g_feetAnimation = true;};
  // leg animation buttons
  document.getElementById('animationLegOffButton').onclick = function() {g_legAnimation = false;};
  document.getElementById('animationLegOnButton').onclick = function() {g_legAnimation = true;};
  // calf animation buttons
  document.getElementById('animationCalfOffButton').onclick = function() {g_calfAnimation = false;};
  document.getElementById('animationCalfOnButton').onclick = function() {g_calfAnimation = true;};
  // head animation buttons
  document.getElementById('animationHeadOffButton').onclick = function() {g_headAnimation = false;};
  document.getElementById('animationHeadOnButton').onclick = function() {g_headAnimation = true;};

  //block slider events
  document.getElementById('feetSlide').addEventListener('mousemove', function() {g_feetAngle = this.value; renderAllShapes();});
  document.getElementById('calfSlide').addEventListener('mousemove', function() {g_calfAngle = this.value; renderAllShapes();});
  document.getElementById('legSlide').addEventListener('mousemove', function() {g_leftLegAngle = this.value; g_rightLegAngle = -this.value; renderAllShapes();});
  document.getElementById('headSlide').addEventListener('mousemove', function() {g_headAngle = this.value; renderAllShapes();});


  //camera angle slider events
  document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes();});
}

function initTextures() {
  var image0 = new Image(); //create the image object
  if (!image0) {
    console.log("Failed to create the image object");
    return false;
  }

  //register the event handler to be called on loading an image
  image0.onload = function() {sendTextureToTEXTURE0(image0);};
  //tell the browser to load an image
  image0.src = 'sky.png';

  //add more texture loading
  var image1 = new Image(); //create the image object
  if (!image1) {
    console.log("Failed to create the image object");
    return false;
  }
  image1.onload = function() {sendTextureToTEXTURE1(image1);};
  image1.src = 'whiteFur.jpeg';

  var image2 = new Image(); //create the image object
  if (!image2) {
    console.log("Failed to create the image object");
    return false;
  }
  image2.onload = function() {sendTextureToTEXTURE2(image2);};
  image2.src = 'grass.jpeg';

  return true;
}

function sendTextureToTEXTURE0(image) {
  var texture = gl.createTexture(); //create a texture object
  if (!texture) {
    console.log("Failed to create the texture object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); //flip the image's y axis
  //enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  //bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  //set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  //set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  //set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);

  //gl.clear(gl.COLOR_BUFFER_BIT); //clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); //draw the rectangle
  console.log('finished loadTexture0');
}

function sendTextureToTEXTURE1(image1) {
  var texture = gl.createTexture(); //create a texture object
  if (!texture) {
    console.log("Failed to create the texture object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); //flip the image's y axis
  //enable texture unit0
  gl.activeTexture(gl.TEXTURE1);
  //bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  //set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  //set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image1);

  //set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler1, 1);

  console.log('finished loadTexture1');
}

function sendTextureToTEXTURE2(image2) {
  var texture = gl.createTexture(); //create a texture object
  if (!texture) {
    console.log("Failed to create the texture object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); //flip the image's y axis
  //enable texture unit0
  gl.activeTexture(gl.TEXTURE2);
  //bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  //set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  //set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image2);

  //set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler2, 2);

  console.log('finished loadTexture2');
}

var xyCoord = [0,0];
var g_camera;
function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  //mouse control to rotate animal
  canvas.onmousemove = function(ev) { 
    if (ev.buttons == 1) { 
    click(ev, 1) 
    } else {
      if (xyCoord[0] != 0){
          xyCoord = [0,0];
      }
    }
  }

  //sets special animation to false when shift key is released
  document.addEventListener('keyup', function(event) {
    if (event.key === 'Shift') {
      shift_key = false;
    }
  });

  g_camera = new Camera();
  document.onkeydown = keydown;

  initTextures();

  // Specify the color for clearing <canvas> (color: 16, 110, 41)
  gl.clearColor(0.06, 0.43, 0.16, 1.0);
  // gl.clearColor(0.0, 0.0, 0.0, 1.0);

  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

//called by browser repeatedly whenever its time
function tick() {
  //save the current time
  g_seconds = performance.now()/1000.0 - g_startTime;

  //update animation angles
  updateAnimationAngles();

  //draw everything
  renderAllShapes();

  //tell the browser to update again when it has time
  requestAnimationFrame(tick);
}

function clear() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function click(ev){
  // if shift click then animate wink and rainbow arc
  if(ev.shiftKey){
    shift_key = true;
  } 

  // make rotation on y and x axis
  let [x, y] = convertCoordinatesEventToGL(ev);
  if (xyCoord[0] == 0){
      xyCoord = [x, y];
  }
  g_AngleX += xyCoord[0]-x;
  g_AngleY += xyCoord[1]-y;
  if (Math.abs(g_AngleX / 360) > 1){
      g_AngleX = 0;
  }
  if (Math.abs(g_AngleY / 360) > 1){
      g_AngleY = 0;
  }
}

//Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function updateAnimationAngles() {
  if (g_legAnimation) {
    g_leftLegAngle = (30*Math.sin(2*g_seconds));
    g_rightLegAngle = (-30*Math.sin(2*g_seconds));
  }
  if (g_feetAnimation) {
    g_feetAngle = (10*Math.sin(3*g_seconds));
  }
  if (g_calfAnimation) {
    g_calfAngle = -Math.abs(30*Math.sin(2*g_seconds));
  }
  if (g_headAnimation) {
    g_headAngle = (10*Math.sin(2*g_seconds));
  }
  if (g_allAnimation) {
    //leg animation
    g_leftLegAngle = (30*Math.sin(2*g_seconds));
    g_rightLegAngle = (-30*Math.sin(2*g_seconds));
    //feet animation
    g_feetAngle = (10*Math.sin(3*g_seconds));
    //calf animation
    g_calfAngle = -Math.abs(30*Math.sin(2*g_seconds));
    //head animation
    g_headAngle = (10*Math.sin(2*g_seconds));
  }
  if (shift_key) {
    g_AngleX = (30*Math.sin(2*g_seconds));
  }
}

// function keydown(ev) {
//   if (ev.keyCode == 39) { //right arrow
//     g_eye[0] += 0.2;
//   } else if (ev.keyCode == 37) { //left arrow
//     g_eye[0] -= 0.2;
//   }
//   renderAllShapes();
//   console.log(ev.keyCode);
// }

function keydown(ev) {
  if (ev.keyCode == 68) { //d key
      g_camera.eye.elements[0] += 0.2;
  }
  else if (ev.keyCode == 65) { //a key
      g_camera.eye.elements[0] -= 0.2;
  }
  else if (ev.keyCode == 87) { //w key
      g_camera.forward();
  }
  else if (ev.keyCode == 83) { //s key
      g_camera.back();
  }
  // else if (ev.keyCode == 81) { //q key
  //     g_camera.panLeft();
  // }
  // else if (ev.keyCode == 69) { //e key
  //     g_camera.panRight();
  // }
  renderAllShapes();
  console.log(ev.keyCode);
}

// var g_eye = [0, 0, 3];
// var g_at = [0, 0, -100];
// var g_up = [0, 1, 0];

var g_map = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
];

function drawMap() {
  var body = new Cube();
  for (x = 0; x < 32; x++) {
    for (y = 0; y < 32; y++) {
      if (x == 0 || x == 31 || y == 0 || y == 31) {
        // var body = new Cube();
        body.color = [0.8, 1, 1, 1];
        body.matrix.setTranslate(0, -0.75, 0);
        body.matrix.scale(0.3, 0.3, 0.3);
        body.matrix.translate(x - 16, 0, y - 16);
        body.renderfaster();
      }
    }
  }
}

//Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
  //check the time at the start of the function
  var startTime = performance.now();

  //pass the projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(50, canvas.width/canvas.height, .1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  //pass the view matrix
  var viewMat = new Matrix4();
  // viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]); // (eye, at, up)
  viewMat.setLookAt(
    g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2], 
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2], 
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]); // (eye, at, up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  //pass the matrix to u_ModelMatrix attribute
  // var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  var globalRotMat = new Matrix4().rotate(g_AngleX, 0, -1, 0);
  globalRotMat.rotate(g_globalAngle, 0, 1, 0);
  globalRotMat.rotate(g_AngleY, -1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  drawMap();

  //draw the floor
  var floor = new Cube();
  // floor.color = [102/255, 81/255, 69/255, 1]; //102, 81, 69
  floor.textureNum = 2;
  floor.matrix.translate(0, -.75, 0);
  floor.matrix.scale(10, 0, 10);
  floor.matrix.translate(-0.5, 0, -0.5);
  floor.render();

  //draw the sky
  var sky = new Cube();
  sky.color = [1,0,0,1];
  sky.textureNum = 0;
  sky.matrix.scale(50, 50, 50);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.render();

  //panda body
  var body = new Cube();
  // body.color = [1, 1, 1, 1];
  body.textureNum = 1;
  body.matrix.setTranslate(-0.2, -.5, 0.0);
  var bodyCoor = new Matrix4(body.matrix);
  body.matrix.scale(0.5, 0.8, 0.9);
  body.render();

  //panda tail
  var tail = new Cube();
  tail.color = [0, 0, 0, 1];
  tail.matrix = new Matrix4(bodyCoor);
  tail.matrix.setTranslate(-0.05, 0, 0.8);
  tail.matrix.scale(0.2, 0.2, 0.2);
  tail.render();

  //panda black top chest
  var chest = new Cube();
  chest.color = [0, 0, 0, 1];
  chest.matrix = new Matrix4(bodyCoor);
  chest.matrix.setTranslate(-0.201, -0.1, -0.001);
  chest.matrix.scale(0.502, 0.401, 0.3);
  chest.render();

  //panda front left leg
  var frontLeftLeg = new Cube();
  frontLeftLeg.color = [0, 0, 0, 1];
  frontLeftLeg.matrix = new Matrix4(bodyCoor);
  frontLeftLeg.matrix.setTranslate(-0.401, 0.1, -0.001);
  frontLeftLeg.matrix.rotate(g_leftLegAngle, 1, 0, 0);
  var frontLeftLegCoordinates = new Matrix4(frontLeftLeg.matrix);
  frontLeftLeg.matrix.scale(0.302, -0.5, 0.3);
  frontLeftLeg.render();

  //panda front left calf
  var frontLeftCalf = new Cube();
  frontLeftCalf.color = [0, 0, 0, 1];
  frontLeftCalf.matrix = new Matrix4(frontLeftLegCoordinates);
  frontLeftCalf.matrix.translate(-0.001, -0.5, -0.00);
  frontLeftCalf.matrix.rotate(g_calfAngle, 1, 0, 0);
  var frontLeftCalfCoordinates = new Matrix4(frontLeftCalf.matrix);
  frontLeftCalf.matrix.scale(0.301, -0.4, 0.3);
  frontLeftCalf.render();

  //panda front left foot
  var frontLeftFoot = new Cube();
  frontLeftFoot.color = [0, 0, 0, 1];
  frontLeftFoot.matrix = frontLeftCalfCoordinates;
  frontLeftFoot.matrix.translate(-0.001, -0.32, 0.315);
  frontLeftFoot.matrix.rotate(g_feetAngle, 1, 0, 0);
  frontLeftFoot.matrix.scale(0.303, -0.15, -0.401);
  frontLeftFoot.render();

  //panda front right leg
  var frontRightLeg = new Cube();
  frontRightLeg.color = [0, 0, 0, 1];
  frontRightLeg.matrix = new Matrix4(bodyCoor);
  frontRightLeg.matrix.setTranslate(0.201, 0.1, -0.001);
  frontRightLeg.matrix.rotate(g_rightLegAngle, 1, 0, 0);
  var frontRightLegCoordinates = new Matrix4(frontRightLeg.matrix);
  frontRightLeg.matrix.scale(0.302, -0.5, 0.3);
  frontRightLeg.render();

  //panda front right calf
  var frontRightCalf = new Cube();
  frontRightCalf.color = [0, 0, 0, 1];
  frontRightCalf.matrix = new Matrix4(frontRightLegCoordinates);
  frontRightCalf.matrix.translate(-0.001, -0.5, -0.00);
  frontRightCalf.matrix.rotate(g_calfAngle, 1, 0, 0);
  var frontRightCalfCoordinates = new Matrix4(frontRightCalf.matrix);
  frontRightCalf.matrix.scale(0.301, -0.4, 0.3);
  frontRightCalf.render();

  //panda front right foot
  var frontRightFoot = new Cube();
  frontRightFoot.color = [0, 0, 0, 1];
  frontRightFoot.matrix = frontRightCalfCoordinates;
  frontRightFoot.matrix.translate(-0.001, -0.32, 0.315);
  frontRightFoot.matrix.rotate(g_feetAngle, 1, 0, 0);
  frontRightFoot.matrix.scale(0.303, -0.15, -0.401);
  frontRightFoot.render();

  //panda back left leg
  var backLeftLeg = new Cube();
  backLeftLeg.textureNum = 1;
  // backLeftLeg.color = [1, 1, 1, 1];
  backLeftLeg.matrix = new Matrix4(bodyCoor);
  backLeftLeg.matrix.setTranslate(-0.4, 0.1, 0.601);
  backLeftLeg.matrix.rotate(g_rightLegAngle, 1, 0, 0);
  var backLeftLegCoordinates = new Matrix4(backLeftLeg.matrix);
  backLeftLeg.matrix.scale(0.302, -0.5, 0.3);
  backLeftLeg.render();
  
  //panda back left calf
  var backLeftCalf = new Cube();
  backLeftCalf.color = [0, 0, 0, 1];
  backLeftCalf.matrix = new Matrix4(backLeftLegCoordinates);
  backLeftCalf.matrix.translate(-0.001, -0.5, -0.00);
  backLeftCalf.matrix.rotate(g_calfAngle, 1, 0, 0);
  var backLeftCalfCoordinates = new Matrix4(backLeftCalf.matrix);
  backLeftCalf.matrix.scale(0.301, -0.4, 0.3);
  backLeftCalf.render();

  //panda back left foot
  var backLeftFoot = new Cube();
  backLeftFoot.color = [0, 0, 0, 1];
  backLeftFoot.matrix = backLeftCalfCoordinates;
  backLeftFoot.matrix.translate(-0.001, -0.32, 0.315);
  backLeftFoot.matrix.rotate(g_feetAngle, 1, 0, 0);
  backLeftFoot.matrix.scale(0.303, -0.15, -0.401);
  backLeftFoot.render();

  //panda back right leg
  var backRightLeg = new Cube();
  backRightLeg.textureNum = 1;
  // backRightLeg.color = [1, 1, 1, 1];
  backRightLeg.matrix = new Matrix4(bodyCoor);
  backRightLeg.matrix.setTranslate(0.202, 0.1, 0.601);
  backRightLeg.matrix.rotate(g_leftLegAngle, 1, 0, 0);
  var backRightLegCoordinates = new Matrix4(backRightLeg.matrix);
  backRightLeg.matrix.scale(0.302, -0.5, 0.3);
  backRightLeg.render();

  //panda back left calf
  var backRightCalf = new Cube();
  backRightCalf.color = [0, 0, 0, 1];
  backRightCalf.matrix = new Matrix4(backRightLegCoordinates);
  backRightCalf.matrix.translate(-0.001, -0.5, -0.00);
  backRightCalf.matrix.rotate(g_calfAngle, 1, 0, 0);
  var backRightCalfCoordinates = new Matrix4(backRightCalf.matrix);
  backRightCalf.matrix.scale(0.301, -0.4, 0.3);
  backRightCalf.render();

  //panda back right foot
  var backRightFoot = new Cube();
  backRightFoot.color = [0, 0, 0, 1];
  backRightFoot.matrix = backRightCalfCoordinates;
  backRightFoot.matrix.translate(-0.001, -0.32, 0.315);
  backRightFoot.matrix.rotate(g_feetAngle, 1, 0, 0);
  backRightFoot.matrix.scale(0.303, -0.15, -0.401);
  backRightFoot.render();

  //panda head
  var head = new Cube();
  head.textureNum = 1;
  head.matrix = bodyCoor;
  head.matrix.translate(-0.1, 0.6, -0.4);
  head.matrix.rotate(g_headAngle, 1, 0, 1);
  var headCoordinates = new Matrix4(head.matrix);
  head.matrix.scale(0.65, 0.55, 0.55);
  head.render();

  //panda left ear
  var leftEar = new Cube();
  leftEar.color = [0, 0, 0, 1];
  leftEar.matrix = new Matrix4(headCoordinates);
  leftEar.matrix.translate(0, 0.4, -0.001);
  leftEar.matrix.rotate(45, 0, 0, 1);
  leftEar.matrix.scale(0.2, 0.15, 0.2);
  leftEar.render();

  //panda right ear
  var rightEar = new Cube();
  rightEar.color = [0, 0, 0, 1];
  rightEar.matrix = new Matrix4(headCoordinates);
  rightEar.matrix.translate(0.65, 0.4, -0.001);
  rightEar.matrix.rotate(45, 0, 0, 1);
  rightEar.matrix.scale(0.15, 0.2, 0.2);
  rightEar.render();

  //panda left eye
  var leftEye = new Cube();
  leftEye.color = [0, 0, 0, 1];
  leftEye.matrix = new Matrix4(headCoordinates);
  leftEye.matrix.translate(0.05, 0.25, -0.001);
  leftEye.matrix.rotate(-45, 0, 0, 1);
  leftEye.matrix.scale(0.12, 0.2, 0.2);
  leftEye.render();

  //panda left eyeball
  var leftEyeball = new Cube();
  leftEyeball.color = [1, 1, 1, 1];
  leftEyeball.matrix = new Matrix4(headCoordinates);
  leftEyeball.matrix.translate(0.15, 0.3, -0.0015);
  leftEyeball.matrix.rotate(-45, 0, 0, 1);
  var leftEyeBallCoordinates = new Matrix4(leftEyeball.matrix);
  leftEyeball.matrix.scale(0.05, 0.05, 0.2);
  leftEyeball.render();

  //panda right eye
  var rightEye = new Cube();
  rightEye.color = [0, 0, 0, 1];
  rightEye.matrix = new Matrix4(headCoordinates);
  rightEye.matrix.translate(0.5, 0.17, -0.001);
  rightEye.matrix.rotate(45, 0, 0, 1);
  rightEye.matrix.scale(0.12, 0.2, 0.2);
  rightEye.render();

  //panda right eyeball
  var rightEyeball = new Cube();
  rightEyeball.color = [1, 1, 1, 1];
  rightEyeball.matrix = new Matrix4(headCoordinates);
  rightEyeball.matrix.translate(0.45, 0.27, -0.0015);
  rightEyeball.matrix.rotate(45, 0, 0, 1);
  var rightEyeBallCoordinates = new Matrix4(rightEyeball.matrix);
  rightEyeball.matrix.scale(0.05, 0.05, 0.2);
  rightEyeball.render();

  if (shift_key) {
    //panda left eye wink
    var leftWink = new Cube();
    leftWink.color = [0, 0, 0, 1];
    leftWink.matrix = new Matrix4(leftEyeBallCoordinates);
    leftWink.matrix.translate(0.017, -0.02, -0.0015);
    leftWink.matrix.scale(0.05, 0.05, 0.2);
    leftWink.render();

    //panda right eye wink
    var rightWink = new Cube();
    rightWink.color = [0, 0, 0, 1];
    rightWink.matrix = new Matrix4(rightEyeBallCoordinates);
    rightWink.matrix.translate(-0.018, -0.02, -0.0015);
    rightWink.matrix.scale(0.05, 0.05, 0.2);
    rightWink.render();

    //rainbow arc cubes
    var c1 = new Cube();
    c1.color = [130/255, 205/255, 1, 1]; //130, 205, 255
    c1.matrix.translate(-0.01, 0.9, 0);
    c1.matrix.rotate(g_seconds * 100, 1, 1, 1);
    c1.matrix.scale(0.08, 0.08, 0.08);
    c1.render();

    var c2 = new Cube();
    c2.color = [115/255, 1, 136/255, 1]; //115, 255, 136
    c2.matrix.translate(-0.3, 0.82, 0);
    c2.matrix.rotate(g_seconds * 100, 1, 1, 1);
    c2.matrix.scale(0.08, 0.08, 0.08);
    c2.render();

    var c3 = new Cube();
    c3.color = [1, 225/255, 117/255, 1]; //255, 225, 117
    c3.matrix.translate(-0.55, 0.6, 0);
    c3.matrix.rotate(g_seconds * 100, 1, 1, 1);
    c3.matrix.scale(0.08, 0.08, 0.08);
    c3.render();

    var c4 = new Cube();
    c4.color = [1, 170/255, 117/255, 1]; //255, 170, 117
    c4.matrix.translate(-0.72, 0.3, 0);
    c4.matrix.rotate(g_seconds * 100, 1, 1, 1);
    c4.matrix.scale(0.08, 0.08, 0.08);
    c4.render();

    var c5 = new Cube();
    c5.color = [1, 156/255, 212/255, 1];
    c5.matrix.translate(-0.8, 0, 0);
    c5.matrix.rotate(g_seconds * 100, 1, 1, 1);
    c5.matrix.scale(0.08, 0.08, 0.08);
    c5.render();

    var c6 = new Cube();
    c6.color = [115/255, 1, 136/255, 1];
    c6.matrix.translate(0.3, 0.82, 0);
    c6.matrix.rotate(g_seconds * 100, 1, 1, 1);
    c6.matrix.scale(0.08, 0.08, 0.08);
    c6.render();

    var c7 = new Cube();
    c7.color = [1, 225/255, 117/255, 1];
    c7.matrix.translate(0.55, 0.6, 0);
    c7.matrix.rotate(g_seconds * 100, 1, 1, 1);
    c7.matrix.scale(0.08, 0.08, 0.08);
    c7.render();

    var c8 = new Cube();
    c8.color = [1, 170/255, 117/255, 1];
    c8.matrix.translate(0.72, 0.3, 0);
    c8.matrix.rotate(g_seconds * 100, 1, 1, 1);
    c8.matrix.scale(0.08, 0.08, 0.08);
    c8.render();

    var c9 = new Cube();
    c9.color = [1, 156/255, 212/255, 1];
    c9.matrix.translate(0.8, 0.02, 0);
    c9.matrix.rotate(g_seconds * 100, 1, 1, 1);
    c9.matrix.scale(0.08, 0.08, 0.08);
    c9.render();
  }

  //panda snout
  var snout = new Cube();
  snout.textureNum = 1;
  // snout.color = [1, 1, 1, 1];
  snout.matrix = new Matrix4(headCoordinates);
  snout.matrix.translate(0.19, 0.03, -0.1);
  snout.matrix.scale(0.25, 0.17, 0.2);
  snout.render();

  //panda nose
  var nose = new Cube();
  nose.color = [0, 0, 0, 1];
  nose.matrix = new Matrix4(headCoordinates);
  nose.matrix.translate(0.27, 0.08, -0.15);
  nose.matrix.scale(0.1, 0.1, 0.2);
  nose.render();

  var hat = new Cone();
  hat.color = [168/255, 119/255, 252/255, 1]; //168, 119, 252
  hat.matrix = new Matrix4(headCoordinates);
  hat.matrix.translate(0.32, 0.75, 0.2);
  hat.matrix.rotate(90, 1, 0, 0);
  hat.matrix.scale(1.2, 1.4, 1.2);
  hat.render();

  //check the time at the end of the function and show on web page
  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
}

//set text of html element
function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm) {
    console.log('failed to get ' + htmlID + ' from html');
    return;
  }
  htmlElm.innerHTML = text;
}

