//vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }
`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

//Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

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
// let g_selectedSeg = 10;
let g_globalAngle = 0;
let g_leftLegAngle = 0;
let g_rightLegAngle = 0;
let g_feetAngle = 0;
let g_calfAngle = 0;
let g_headAngle = 0;
// let g_legAngle = 0;
// let g_magentaAngle = 0;
// let g_rightLegAnimation = false;
// let g_leftLegAnimation = false;
let g_legAnimation = false;
let g_feetAnimation = false;
let g_calfAnimation = false;
let g_headAnimation = false;
// let g_magentaAnimation = false;

//set up actions for the HTML UI elements
function addActionsForHtmlUI() {
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
  // document.getElementById('animationRightLegOffButton').onclick = function() {g_rightLegAnimation = false;};
  // document.getElementById('animationRightLegOnButton').onclick = function() {g_rightLegAnimation = true;};

  //block slider events
  document.getElementById('feetSlide').addEventListener('mousemove', function() {g_feetAngle = this.value; renderAllShapes();});
  document.getElementById('calfSlide').addEventListener('mousemove', function() {g_calfAngle = this.value; renderAllShapes();});
  document.getElementById('legSlide').addEventListener('mousemove', function() {g_leftLegAngle = this.value; g_rightLegAngle = -this.value; renderAllShapes();});
  document.getElementById('headSlide').addEventListener('mousemove', function() {g_headAngle = this.value; renderAllShapes();});


  //camera angle slider events
  document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes();});
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  // canvas.onmousedown = click;
  // canvas.onmousemove = click;
  // canvas.onmousemove = function(ev) {if(ev.buttons == 1) {click(ev);}};

  // Specify the color for clearing <canvas> (color: 16, 110, 41)
  gl.clearColor(0.06, 0.43, 0.16, 1.0);

  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

//called by browser repeatedly whenever its time
function tick() {
  //save the current time
  g_seconds = performance.now()/1000.0 - g_startTime;
  // console.log(g_seconds);

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


// var g_shapesList = [];

// function click(ev) {
//   let [x, y] = convertCoordinatesEventToGL(ev);

//   //Create and store the new point
//   let point;
//   if (g_selectedType == POINT) {
//     point = new Point();
//   } else if (g_selectedType == TRIANGLE) {
//     point = new Triangle();
//   } else {
//     point = new Circle();
//     point.segments = g_selectedSeg;
//   }

//   point.position = [x, y];
//   point.color = g_selectedColor.slice();
//   point.size = g_selectedSize;
//   g_shapesList.push(point);

//   //draw every shape that is supposed to be in the canvas
//   renderAllShapes();

// }

// //Extract the event click and return it in WebGL coordinates
// function convertCoordinatesEventToGL(ev) {
//   var x = ev.clientX; // x coordinate of a mouse pointer
//   var y = ev.clientY; // y coordinate of a mouse pointer
//   var rect = ev.target.getBoundingClientRect();

//   x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
//   y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

//   return([x,y]);
// }

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
}

//Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
  //check the time at the start of the function
  var startTime = performance.now();

  //pass the matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //panda body
  var body = new Cube();
  body.matrix.setTranslate(-0.2, -.5, 0.0);
  var bodyCoor = new Matrix4(body.matrix);
  body.matrix.scale(0.5, 0.8, 0.9);
  body.render();

  //panda tail
  var tail = new Cube();
  tail.color = [0, 0, 0, 1];
  tail.matrix = new Matrix4(bodyCoor);
  tail.matrix.setTranslate(0, 0, 0.8);
  tail.matrix.scale(0.2, 0.2, 0.2);
  tail.render();

  //panda black top chest
  var chest = new Cube();
  chest.color = [0, 0, 0, 1];
  chest.matrix = new Matrix4(bodyCoor);
  chest.matrix.setTranslate(-0.201, -0.1, -0.001);
  chest.matrix.scale(0.502, 0.4, 0.3);
  chest.render();

  //panda front left leg
  var fontLeftLeg = new Cube();
  fontLeftLeg.color = [0, 0, 0, 1];
  fontLeftLeg.matrix = new Matrix4(bodyCoor);
  fontLeftLeg.matrix.setTranslate(-0.401, 0.1, -0.001);
  fontLeftLeg.matrix.rotate(g_leftLegAngle, 1, 0, 0);
  var fontLeftLegCoordinates = new Matrix4(fontLeftLeg.matrix);
  fontLeftLeg.matrix.scale(0.301, -0.5, 0.3);
  fontLeftLeg.render();

  //panda front left calf
  var fontLeftCalf = new Cube();
  fontLeftCalf.color = [0, 0, 0, 1];
  fontLeftCalf.matrix = new Matrix4(fontLeftLegCoordinates);
  // fontLeftCalf.matrix = new Matrix4(bodyCoor);
  fontLeftCalf.matrix.translate(-0.001, -0.5, -0.00);
  fontLeftCalf.matrix.rotate(g_calfAngle, 1, 0, 0);
  var fontLeftCalfCoordinates = new Matrix4(fontLeftCalf.matrix);
  fontLeftCalf.matrix.scale(0.301, -0.4, 0.3);
  fontLeftCalf.render();

  //panda front left foot
  var fontLeftFoot = new Cube();
  fontLeftFoot.color = [0, 0, 0, 1];
  fontLeftFoot.matrix = fontLeftCalfCoordinates;
  fontLeftFoot.matrix.translate(-0.001, -0.32, 0.315);
  fontLeftFoot.matrix.rotate(g_feetAngle, 1, 0, 0);
  fontLeftFoot.matrix.scale(0.303, -0.15, -0.401);
  fontLeftFoot.render();

  //panda front right leg
  var fontRightLeg = new Cube();
  fontRightLeg.color = [0, 0, 0, 1];
  fontRightLeg.matrix = new Matrix4(bodyCoor);
  fontRightLeg.matrix.setTranslate(0.201, 0.1, -0.001);
  fontRightLeg.matrix.rotate(g_rightLegAngle, 1, 0, 0);
  var fontRightLegCoordinates = new Matrix4(fontRightLeg.matrix);
  fontRightLeg.matrix.scale(0.301, -0.5, 0.3);
  fontRightLeg.render();

  //panda front right calf
  var fontRightCalf = new Cube();
  fontRightCalf.color = [0, 0, 0, 1];
  fontRightCalf.matrix = new Matrix4(fontRightLegCoordinates);
  fontRightCalf.matrix.translate(-0.001, -0.5, -0.00);
  fontRightCalf.matrix.rotate(g_calfAngle, 1, 0, 0);
  var fontRightCalfCoordinates = new Matrix4(fontRightCalf.matrix);
  fontRightCalf.matrix.scale(0.301, -0.4, 0.3);
  fontRightCalf.render();

  //panda front right foot
  var fontRightFoot = new Cube();
  fontRightFoot.color = [0, 0, 0, 1];
  fontRightFoot.matrix = fontRightCalfCoordinates;
  fontRightFoot.matrix.translate(-0.001, -0.32, 0.315);
  fontRightFoot.matrix.rotate(g_feetAngle, 1, 0, 0);
  fontRightFoot.matrix.scale(0.303, -0.15, -0.401);
  fontRightFoot.render();

  //panda back left leg
  var backLeftLeg = new Cube();
  backLeftLeg.color = [1, 1, 1, 1];
  backLeftLeg.matrix = new Matrix4(bodyCoor);
  backLeftLeg.matrix.setTranslate(-0.4, 0.1, 0.601);
  backLeftLeg.matrix.rotate(g_rightLegAngle, 1, 0, 0);
  var backLeftLegCoordinates = new Matrix4(backLeftLeg.matrix);
  backLeftLeg.matrix.scale(0.3, -0.5, 0.3);
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
  backRightLeg.color = [1, 1, 1, 1];
  backRightLeg.matrix = new Matrix4(bodyCoor);
  backRightLeg.matrix.setTranslate(0.201, 0.1, 0.601);
  backRightLeg.matrix.rotate(g_leftLegAngle, 1, 0, 0);
  var backRightLegCoordinates = new Matrix4(backRightLeg.matrix);
  backRightLeg.matrix.scale(0.301, -0.5, 0.3);
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
  // leftEyeball.matrix.translate(0.15, 0.27, -0.0015);
  leftEyeball.matrix.translate(0.15, 0.3, -0.0015);
  leftEyeball.matrix.rotate(-45, 0, 0, 1);
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
  // rightEyeball.matrix.translate(0.43, 0.27, -0.0015);
  rightEyeball.matrix.translate(0.45, 0.27, -0.0015);
  rightEyeball.matrix.rotate(45, 0, 0, 1);
  rightEyeball.matrix.scale(0.05, 0.05, 0.2);
  rightEyeball.render();

  //panda snout
  var snout = new Cube();
  snout.color = [1, 1, 1, 1];
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


  // //draw a cube
  // var body = new Cube();
  // body.color = [1.0, 0.0, 0.0, 1.0];
  // body.matrix.translate(-.25, -.75, 0.0);
  // body.matrix.rotate(-5, 1, 0, 0);
  // body.matrix.scale(0.5, 0.3, 0.5);
  // body.render();

  // //draw a left arm
  // var yellow = new Cube();
  // yellow.color = [1, 1, 0, 1];
  // yellow.matrix.setTranslate(0, -0.5, 0.0);
  // yellow.matrix.rotate(-5, 1, 0, 0);
  // yellow.matrix.rotate(-g_legAngle, 0, 0, 1);
  // var yellowCoordinates = new Matrix4(yellow.matrix);
  // yellow.matrix.scale(0.25, 0.7, 0.5);
  // yellow.matrix.translate(-0.5, 0, 0);
  // yellow.render();

  // //test box
  // var box = new Cube();
  // box.color = [1, 0, 1, 1];
  // box.matrix = yellowCoordinates;
  // box.matrix.translate(0, 0.65, 0);
  // box.matrix.rotate(g_magentaAngle, 0, 0, 1);
  // box.matrix.scale(0.3, 0.3, 0.3);
  // box.matrix.translate(-0.5, 0, -0.001);
  // box.render();

  // //a bunch of rotating cubes
  // var K=10.0;
  // for (var i = 1; i < K; i++) {
  //   var c = new Cube();
  //   c.matrix.translate(-0.8, 1.9 * i/K - 1.0, 0);
  //   c.matrix.rotate(g_seconds * 100, 1, 1, 1);
  //   c.matrix.scale(0.1, 0.5/K, 1.0/K);
  //   c.render();
  // }

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

