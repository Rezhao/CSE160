class Triangle {
  constructor() {
    this.type = 'triangle';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0,1.0,1.0,1.0];
    this.size = 5.0;
    // this.coordinates = [
    //   0, 0,
    //   0, 0,
    //   0, 0
    // ];
    this.buffer = null;
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
    // gl.enable(gl.BLEND);
    // //set blending function
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // // Draw
    // var d = this.size/200.0 //delta
    // drawTriangle([xy[0], xy[1], xy[0] + d, xy[1], xy[0], xy[1] + d]);
  }
}


function drawTriangle3D(vertices) {
  var n = 3; //number of vertices

  //create a buffer object
  if (this.buffer == null) {
    this.buffer = gl.createBuffer();
    if (!this.buffer) {
    console.log('Failed to create the buffer object');
    return -1;
    }
  }

  //bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
  //write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}