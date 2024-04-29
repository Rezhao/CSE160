class Triangle {
  constructor() {
    this.type = 'triangle';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0,1.0,1.0,1.0];
    this.size = 5.0;
    this.coordinates = [
      0, 0,
      0, 0,
      0, 0
    ];
  }

  render() {
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Pass the size of a point to u_Size variable
    gl.uniform1f(u_Size, size);

    //enable alpha blending
    gl.enable(gl.BLEND);
    //set blending function
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Draw
    var d = this.size/200.0 //delta
    drawTriangle([xy[0], xy[1], xy[0] + d, xy[1], xy[0], xy[1] + d]);
  }

  renderTriangle() {
    var coor = this.coordinates;
    var rgba = this.color;
    // var size = this.size;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    //enable alpha blending
    gl.enable(gl.BLEND);
    //set blending function
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Draw
    // var d = this.size/200.0 //delta
    drawTriangle([coor[0], coor[1], coor[2], coor[3], coor[4], coor[5]]);
  }
}

function drawTriangle(vertices) {
  var n = 3; //number of vertices

  //create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("failed to create buffer object");
    return -1;
  }

  //bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  //write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3D(vertices) {
  var n = 3; //number of vertices

  //create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("failed to create buffer object");
    return -1;
  }

  //bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  //write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}