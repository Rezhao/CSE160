// retrieve <canvas> element
var canvas = document.getElementById('example');
//get the rendering context for 2DCG
var ctx = canvas.getContext('2d');

function main() {
  if (!canvas) {
    console.log('failed to retrieve the <canvas> element');
    return;
  }

  //draw black square
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; //set a black color
  ctx.fillRect(0, 0, canvas.width, canvas.height); //fill a rectangle with the color
  var v1 = new Vector3([2.25, 2.25, 0]);
  drawVector(v1, 'red');
}

function handleDrawEvent() {
  if (!canvas) {
    console.log('failed to retrieve the <canvas> element');
    return;
  }
  //clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //draw black square
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; //set a black color
  ctx.fillRect(0, 0, canvas.width, canvas.height); //fill a rectangle with the color

  let v1x = document.getElementById("v1x").value;
  let v1y = document.getElementById("v1y").value;
  let v2x = document.getElementById("v2x").value;
  let v2y = document.getElementById("v2y").value;

  var v1 = new Vector3([v1x, v1y, 0]);
  var v2 = new Vector3([v2x, v2y, 0]);
  drawVector(v1, 'red');
  drawVector(v2, 'blue');
}

function drawVector(v, color) {
  ctx.strokeStyle = color;
  let cx = canvas.width/2;
  let cy = canvas.height/2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(v.elements[0] * 20 + 200, v.elements[1] * -20 + 200);
  ctx.stroke();
}

function handleDrawOperationEvent() {
  if (!canvas) {
    console.log('failed to retrieve the <canvas> element');
    return;
  }
  //clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //draw black square
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; //set a black color
  ctx.fillRect(0, 0, canvas.width, canvas.height); //fill a rectangle with the color

  //drawing v1 and v2
  let v1x = document.getElementById("v1x").value;
  let v1y = document.getElementById("v1y").value;
  let v2x = document.getElementById("v2x").value;
  let v2y = document.getElementById("v2y").value;

  var v1 = new Vector3([v1x, v1y, 0]);
  var v2 = new Vector3([v2x, v2y, 0]);
  drawVector(v1, 'red');
  drawVector(v2, 'blue');

  //performing specified operation
  var op = document.getElementById("operations").value;
  var scalar = document.getElementById("scalar").value;
  // console.log(op);
  if(op == 'add') {
    v1.add(v2);
    drawVector(v1, 'green');
  } else if(op == 'sub') {
    v1.sub(v2);
    drawVector(v1, 'green');
  } else if(op == 'div') {
    v1.div(scalar);
    drawVector(v1, 'green');
    v2.div(scalar);
    drawVector(v2, 'green');
  } else if(op == 'mul') {
    v1.mul(scalar);
    drawVector(v1, 'green');
    v2.mul(scalar);
    drawVector(v2, 'green');
  } else if(op == 'mag') {
    console.log('Magnitude v1: ' + v1.magnitude());
    console.log('Magnitude v2: ' + v2.magnitude());
  } else if(op == 'norm') {
    v1.normalize();
    drawVector(v1, 'green');
    v2.normalize();
    drawVector(v2, 'green');
  } else if(op == 'ang') {
    angleBetween(v1, v2);
  } else if(op == 'area') {
    areaTriangle(v1, v2);
  }
}

function angleBetween(v1, v2) {
  let dot = Vector3.dot(v1, v2);
  let v1Mag = v1.magnitude();
  let v2Mag = v2.magnitude();
  let eq = dot / (v1Mag * v2Mag);
  let angle = Math.acos(eq) * (180/Math.PI);

  console.log('Angle: ' + angle);
}

function areaTriangle(v1, v2) {
  let cross = Vector3.cross(v1, v2);
  let area = cross.magnitude()/2;

  console.log('Area of the triangle: ' + area);
}