var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    // gl_PointSize = 10.0;
    gl_PointSize = u_Size;
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

function setupWebGL() {
  canvas = document.getElementById("webgl");
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if(!gl) {
    console.log('failed to get WebGL context');
    return -1;
  }
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

  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

//constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

//global variables related to UI
let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSeg = 10;

//set up actions for the HTML UI elements
function addActionsForHtmlUI() {
  //button events
  document.getElementById('green').onclick = function() {g_selectedColor = [0.0,1.0,0.0,1.0];};
  document.getElementById('red').onclick = function() {g_selectedColor = [1.0,0.0,0.0,1.0];};
  document.getElementById('clear').onclick = function() {g_shapesList = []; clear();};

  document.getElementById('point').onclick = function() {g_selectedType = POINT;};
  document.getElementById('triangle').onclick = function() {g_selectedType = TRIANGLE;};
  document.getElementById('circle').onclick = function() {g_selectedType = CIRCLE;};

  //color slider events
  document.getElementById('redSlide').addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100;});
  document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100;});
  document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100;});
  document.getElementById('alpSlide').addEventListener('mouseup', function() {g_selectedColor[3] = this.value/100;});

  //size slider events
  document.getElementById('sizeSlide').addEventListener('mouseup', function() {g_selectedSize = this.value;});

  //segments slider events
  document.getElementById('segSlide').addEventListener('mouseup', function() {g_selectedSeg = this.value;});
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  // canvas.onmousemove = click;
  canvas.onmousemove = function(ev) {if(ev.buttons == 1) {click(ev);}};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

}

function clear() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}


var g_shapesList = [];

function click(ev) {
  let [x, y] = convertCoordinatesEventToGL(ev);

  //Create and store the new point
  let point;
  if (g_selectedType == POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
    point.segments = g_selectedSeg;
  }

  point.position = [x, y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);

  //draw every shape that is supposed to be in the canvas
  renderAllShapes();

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

//Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
  var startTime = performance.now();

  // // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;

  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  //check the time at the end of the function and show on web page
  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
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

function drawMilk() {
  //milk front side
  //milk front face
  createTriangle([1/4, 1/4, -3/4, 1/4, -3/4, -3/4], [1.0,1.0,1.0,1.0]);
  createTriangle([1/4, 1/4, -3/4, -3/4, 1/4, -3/4], [1.0,1.0,1.0,1.0]);
  //blue front bottom rectangle
  createTriangle([-3/4, -3/8, -3/4, -3/4, 1/4, -3/8], [0.67,0.796,1.0,1.0]);
  createTriangle([1/4, -3/8, -3/4, -3/4, 1/4, -3/4], [0.67,0.796,1.0,1.0]);

  //milk right side face
  //milk side face #dae3f5
  createTriangle([1/4, 1/4, 3/4, 3/8, 3/4, -5/8], [0.855,0.89,0.96,1.0]);
  createTriangle([1/4, 1/4, 1/4, -3/4, 3/4, -5/8], [0.855,0.89,0.96,1.0]);
  //blue side bottom rectangle a2b8db
  createTriangle([3/4, -1/4, 1/4, -3/8, 1/4, -3/4], [0.635,0.722,0.859,1.0]);
  createTriangle([3/4, -1/4, 1/4, -3/4, 3/4, -5/8], [0.635,0.722,0.859,1.0]);
  //side square #6f93d9
  createTriangle([2.5/8, 0.5/8, 5.5/8, 1.35/8, 5.5/8, -1.25/8], [0.435,0.576,0.85,1.0]);
  createTriangle([2.5/8, 0.5/8, 2.5/8, -1/4, 5.5/8, -1.25/8], [0.435,0.576,0.85,1.0]);
  //side bottom square #6f93d9
  createTriangle([2.5/8, -3.85/8, 2.5/8, -5/8, 5.5/8, -3/8], [0.435,0.576,0.85,1.0]);
  createTriangle([5.5/8, -3/8, 2.5/8, -5/8, 5.5/8, -4.15/8], [0.435,0.576,0.85,1.0]);

  //milk top sides
  //milk side top surface #c2c6cf 999fad
  createTriangle([1/2, 5/8, 3/8, 1/2, 3/4, 3/8], [0.6,0.624,0.678,1.0]);
  createTriangle([1/4, 1/4, 3/4, 3/8, 3/8, 1/2], [0.76,0.776,0.812,1.0]);
  //milk blue top surface #abcbff
  createTriangle([1/2, 5/8, -1/2, 5/8, -3/4, 1/4], [0.67,0.796,1.0,1.0]);
  createTriangle([1/2, 5/8, -3/4, 1/4, 1/4, 1/4], [0.67,0.796,1.0,1.0]);

  //milk top white handle
  createTriangle([1/2, 3/4, -1/2, 3/4, -1/2, 5/8], [1.0,1.0,1.0,1.0]);
  createTriangle([1/2, 3/4, -1/2, 5/8, 1/2, 5/8], [1.0,1.0,1.0,1.0]);

  //milk face
  //nose #453a36
  createTriangle([-2.5/8, -1.5/8, -1.5/8, -1.5/8, -1/4, -1/4], [0.27,0.227,0.212,1.0]);
  //left cheek #ffc9dc
  createTriangle([-4.5/8, -0.75/8, -5.5/8, -0.75/8, -5.5/8, -1.5/8], [1.0,0.788,0.863,1.0]);
  createTriangle([-4.5/8, -0.75/8, -5.5/8, -1.5/8, -4.5/8, -1.5/8], [1.0,0.788,0.863,1.0]);
  //right cheek #ffc9dc
  createTriangle([0.5/8, -0.75/8, 1.5/8, -0.75/8, 1.5/8, -1.5/8], [1.0,0.788,0.863,1.0]);
  createTriangle([0.5/8, -0.75/8, 0.5/8, -1.5/8, 1.5/8, -1.5/8], [1.0,0.788,0.863,1.0]);
  //eyes #453a36
  createTriangle([0, 0, 0, -1/8, 1/8, -1/8], [0.27,0.227,0.212,1.0]);
  createTriangle([-1/2, 0, -5/8, -1/8, -1/2, -1/8], [0.27,0.227,0.212,1.0]);
  //eyebrows #453a36
  createTriangle([-1/2, 1/8, -1/2, 0.65/8, -5/8, 0.25/8], [0.27,0.227,0.212,1.0]);
  createTriangle([0, 1/8, 0, 0.65/8, 1/8, 0.25/8], [0.27,0.227,0.212,1.0]);
  //hands #453a36
  createTriangle([-5/8, -1/2, -3/8, -1/2, -4/8, -5/8], [0.27,0.227,0.212,1.0]);
  createTriangle([-1/8, -1/2, 1/8, -1/2, 0, -5/8], [0.27,0.227,0.212,1.0]);


}

function createTriangle(coor, color) {
  var tri = new Triangle();
  tri.coordinates = coor;
  tri.color = color;
  tri.renderTriangle();
}

