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
  uniform bool u_Clicked;
  void main() {
    if(u_Clicked){
      vec4(1.0,1.0,1.0,1.0);
    }
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
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
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
    } else if (u_whichTexture == 3) {       //use texture3
      gl_FragColor = texture2D(u_Sampler3, v_UV);
    } else if (u_whichTexture == 4) {       //use texture4
      gl_FragColor = texture2D(u_Sampler4, v_UV);
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
let u_Sampler3;
let u_Sampler4;
let u_whichTexture;
let u_Clicked;

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

  // Get the storage location of u_Sampler3
  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get the storage location of u_Sampler3');
    return;
  }

  // Get the storage location of u_Sampler4
  u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
  if (!u_Sampler4) {
    console.log('Failed to get the storage location of u_Sampler4');
    return;
  }

  // Get the storage location of u_whichTexture
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }

  // Get the storage location of u_Clicked
  u_Clicked = gl.getUniformLocation(gl.program, 'u_Clicked');
  if (!u_Clicked) {
    console.log('Failed to get the storage location of u_Clicked');
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
  image0.src = 'sky.jpg';

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
  image2.src = 'ground.png';

  var image3 = new Image(); //create the image object
  if (!image3) {
    console.log("Failed to create the image object");
    return false;
  }
  image3.onload = function() {sendTextureToTEXTURE3(image3);};
  image3.src = 'bamboo.jpeg';

  var image4 = new Image(); //create the image object
  if (!image4) {
    console.log("Failed to create the image object");
    return false;
  }
  image4.onload = function() {sendTextureToTEXTURE4(image4);};
  image4.src = 'cake.png';


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

function sendTextureToTEXTURE3(image3) {
  var texture = gl.createTexture(); //create a texture object
  if (!texture) {
    console.log("Failed to create the texture object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); //flip the image's y axis
  //enable texture unit0
  gl.activeTexture(gl.TEXTURE3);
  //bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  //set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  //set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image3);

  //set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler3, 3);

  console.log('finished loadTexture3');
}

function sendTextureToTEXTURE4(image4) {
  var texture = gl.createTexture(); //create a texture object
  if (!texture) {
    console.log("Failed to create the texture object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); //flip the image's y axis
  //enable texture unit0
  gl.activeTexture(gl.TEXTURE4);
  //bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  //set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  //set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image4);

  //set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler4, 4);

  console.log('finished loadTexture4');
}

var xyCoord = [0,0];
var g_camera;
function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  // canvas.onmousedown = click;
  //click and drag control camera
  // canvas.onmousemove = function(ev) { 
  //   if (ev.buttons == 1) { 
  //   click(ev, 1) 
  //   } else {
  //     if (xyCoord[0] != 0){
  //         xyCoord = [0,0];
  //     }
  //   }
  // }

  //mouse movement to move camera
  canvas.onmousemove = function(ev){
    moveCamera(ev);
  }

  canvas.onmousedown = function(ev){
    check(ev);
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

function check(ev) {
  var picked = false;
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();
  
  if (rect.left <= x && x < rect.right && 
    rect.top <= y && y < rect.bottom) { // inside canvas
    var x_in_canvas = x - rect.left, y_in_canvas = rect.bottom - y;
    gl.uniform1i(u_Clicked, 1);  // Pass true to u_Clicked
    // Read pixel at the clicked position
    var pixels = new Uint8Array(4); // Array for storing the pixel value
    gl.readPixels(x_in_canvas, y_in_canvas, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    // console.log(pixels[0]);
    if (pixels[0] == 255) { // The mouse in on cube if R(pixels[0]) is 255
      picked = true;
      console.log(pixels[0]);
    }

    gl.uniform1i(u_Clicked, 0);  // Pass false to u_Clicked(rewrite the cube)
  }
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

function moveCamera(ev) {
  let [x, y] = convertCoordinatesEventToGL(ev);
  g_camera.panCamera(-x);
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

function keydown(ev) {
  if (ev.keyCode == 68) { //d key
      // g_camera.eye.elements[0] += 0.2;
      g_camera.moveRight();
  }
  else if (ev.keyCode == 65) { //a key
      // g_camera.eye.elements[0] -= 0.2;
      g_camera.moveLeft();
  }
  else if (ev.keyCode == 87) { //w key
      g_camera.moveForward();
      // g_camera.eye.elements[2] -= 0.2;
  }
  else if (ev.keyCode == 83) { //s key
      g_camera.moveBackwards();
  }
  else if (ev.keyCode == 81) { //q key
      g_camera.panLeft();
  }
  else if (ev.keyCode == 69) { //e key
      g_camera.panRight();
  }
  renderAllShapes();
  // console.log(ev.keyCode);
}

// var g_eye = [0, 0, 3];
// var g_at = [0, 0, -100];
// var g_up = [0, 1, 0];

var g_map = [
  [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  [4, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 4],
  [4, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 4],
  [4, 3, 3, 3, 0, 0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 2, 0, 3, 3, 3, 3, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 0, 0, 4],
  [4, 3, 3, 3, 0, 0, 3, 0, 2, 3, 1, 3, 3, 3, 2, 2, 2, 1, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 4],
  [4, 0, 0, 3, 0, 0, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 4],
  [4, 0, 0, 3, 0, 0, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 4],
  [4, 0, 0, 3, 0, 0, 0, 0, 2, 0, 0, 3, 2, 2, 2, 3, 3, 3, 0, 0, 3, 2, 2, 3, 0, 0, 0, 0, 3, 0, 0, 4],
  [4, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 4],
  [4, 0, 0, 2, 0, 0, 2, 2, 2, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 2, 0, 3, 3, 3, 3, 0, 0, 4],
  [4, 0, 0, 2, 0, 0, 2, 0, 2, 0, 0, 3, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 3, 0, 0, 2, 0, 2, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 3, 0, 0, 2, 0, 2, 0, 0, 3, 2, 2, 2, 1, 1, 1, 1, 0, 2, 0, 0, 3, 0, 3, 0, 0, 2, 0, 0, 4],
  [4, 0, 0, 3, 0, 0, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 3, 0, 3, 0, 0, 2, 0, 0, 4],
  [4, 0, 0, 3, 0, 0, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 0, 3, 0, 3, 0, 0, 2, 0, 0, 4],
  [4, 0, 0, 2, 0, 0, 3, 0, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 0, 2, 0, 0, 3, 2, 2, 3, 3, 3, 0, 0, 4],
  [4, 0, 0, 1, 0, 0, 3, 3, 3, 3, 3, 0, 0, 3, 0, 0, 3, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 3, 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 0, 0, 3, 0, 0, 0, 3, 0, 0, 3, 3, 3, 3, 2, 3, 3, 3, 4],
  [4, 0, 0, 2, 3, 3, 3, 2, 0, 0, 1, 2, 3, 3, 0, 0, 3, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 3, 3, 3, 3, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 2, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 4],
  [4, 3, 0, 0, 0, 2, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 3, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 3, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 0, 0, 0, 3, 0, 0, 2, 2, 2, 1, 0, 0, 0, 0, 4],
  [4, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 4],
  [4, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 2, 2, 3, 0, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 0, 0, 4],
  [4, 0, 0, 3, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 4],
  [4, 0, 0, 3, 0, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 4],
  [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
];

function drawMap() {
  // var body = new Cube();
  // for (x = 0; x < 32; x++) {
  //   for (y = 0; y < 32; y++) {
  //     if (x == 0 || x == 31 || y == 0 || y == 31) {
  //       // var body = new Cube();
  //       body.color = [1, 0.8, 1, 1];
  //       body.matrix.setTranslate(0, -0.75, 0);
  //       body.matrix.scale(0.3, 0.3, 0.3);
  //       body.matrix.translate(x - 16, 0, y - 16);
  //       body.renderfasterUV();
  //     }
  //   }
  // }
  var body = new Cube();
  for (let x = 0; x < 32; x++) {
    for (let y = 0; y < 32; y++) {
        if (g_map[x][y] == 1) {
          body.color = [1, 0.8, 1, 1];
          body.textureNum = 3;
          body.matrix.setTranslate(0, -0.75, 0);
          body.matrix.scale(1, 1, 1);
          body.matrix.translate(x - 16, 0, y - 16);
          body.renderfasterUV();
        } else if (g_map[x][y] == 2) {
          // var body = new Cube();
          body.color = [1, 0.8, 1, 1];
          body.textureNum = 3;
          body.matrix.setTranslate(0, -0.75, 0);
          body.matrix.scale(1, 2, 1);
          body.matrix.translate(x - 16, 0, y - 16);
          body.renderfasterUV();
        } else if (g_map[x][y] == 3) {
          // var body = new Cube();
          body.color = [1, 0.8, 1, 1];
          body.textureNum = 3;
          body.matrix.setTranslate(0, -0.75, 0);
          body.matrix.scale(1, 3, 1);
          body.matrix.translate(x - 16, 0, y - 16);
          body.renderfasterUV();
        } else if (g_map[x][y] == 4) {
          // var body = new Cube();
          body.color = [1, 0.8, 1, 1];
          body.textureNum = 3;
          body.matrix.setTranslate(0, -0.75, 0);
          body.matrix.scale(1, 4, 1);
          body.matrix.translate(x - 16, 0, y - 16);
          body.renderfasterUV();
        }
    }
}
}

//Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
  //check the time at the start of the function
  var startTime = performance.now();

  //pass the projection matrix
  var projMat = g_camera.projMat;
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  //pass the view matrix
  var viewMat = g_camera.viewMat;
  viewMat.setLookAt(
    g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2], 
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2], 
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]); // (eye, at, up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  //pass the matrix to u_ModelMatrix attribute
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
  floor.matrix.scale(30, 0, 30);
  floor.matrix.translate(-0.5, 0, -0.5);
  floor.renderfasterUV();

  //draw the sky
  var sky = new Cube();
  sky.color = [0,1,1,1];
  sky.textureNum = 0;
  sky.matrix.scale(50, 50, 50);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.renderfasterUV();

  drawPanda();

  //draw the cake
  var cake = new Cube();
  cake.color = [0,1,1,1];
  cake.textureNum = 4;
  cake.matrix.scale(0.75, 0.75, 0.75);
  cake.matrix.translate(18, -1, -20);
  cake.renderfasterUV();

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

