class Cube {
  constructor() {
    this.type = 'cube';
    this.color = [1.0,1.0,1.0,1.0];
    this.matrix = new Matrix4();
    this.textureNum = -2;
    this.cubeVerts = new Float32Array([
      0,0,0, 1,1,0, 1,0,0,
      0,0,0, 0,1,0, 1,1,0,
      0,1,0, 0,1,1, 1,1,1,
      0,1,0, 1,1,1, 1,1,0,
      1,0,0, 1,1,0, 1,1,1,
      1,0,0, 1,0,1, 1,1,1,
      0,0,1, 1,1,1, 1,0,1,
      0,0,1, 0,1,1, 1,1,1,
      0,0,0, 0,1,0, 0,1,1,
      0,0,0, 0,0,1, 0,1,1,
      0,0,0, 0,0,1, 1,0,1,
      0,0,0, 1,0,1, 1,0,0
    ]);
    this.uvVerts = new Float32Array([
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
      0,0, 1,0, 1,1,  0,0, 0,1, 1,1,
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
      0,0, 1,0, 1,1,  0,0, 0,1, 1,1,
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
    ]);

  }

  render() {
    var rgba = this.color;

    //pass the texture number
    gl.uniform1i(u_whichTexture, this.textureNum);

    //pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
    //pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    //front of cube
    drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0]);
    drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1]);

    //pass the color of a point to u_FragColor uniform variable
    gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

    //top of cube
    drawTriangle3DUV([0,1,0, 0,1,1, 1,1,1], [0,0, 1,1, 1,0]);
    drawTriangle3DUV([0,1,0, 1,1,1, 1,1,0], [0,0, 0,1, 1,1]);

    //pass the color of a point to u_FragColor uniform variable
    gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);

    //right side of cube
    drawTriangle3DUV([1,0,0, 1,1,0, 1,1,1], [0,0, 1,0, 1,1]);
    drawTriangle3DUV([1,0,0, 1,0,1, 1,1,1], [0,0, 0,1, 1,1]);

    //pass the color of a point to u_FragColor uniform variable
    gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);

    //back of cube
    drawTriangle3DUV([0,0,1, 1,1,1, 1,0,1], [0,0, 1,1, 1,0]);
    drawTriangle3DUV([0,0,1, 0,1,1, 1,1,1], [0,0, 0,1, 1,1]);

    //pass the color of a point to u_FragColor uniform variable
    gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);

    //left side of cube
    drawTriangle3DUV([0,0,0, 0,1,0, 0,1,1], [0,0, 1,0, 1,1]);
    drawTriangle3DUV([0,0,0, 0,0,1, 0,1,1], [0,0, 0,1, 1,1]);

    //pass the color of a point to u_FragColor uniform variable
    gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

    //bottom of cube
    drawTriangle3DUV([0,0,0, 0,0,1, 1,0,1], [0,0, 1,1, 1,0]);
    drawTriangle3DUV([0,0,0, 1,0,1, 1,0,0], [0,0, 0,1, 1,1]);
  }

  renderfast() {
    var rgba = this.color;

    //pass the texture number
    gl.uniform1i(u_whichTexture, this.textureNum);

    //pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
    //pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    var allverts = [];

    //front of cube
    allverts = allverts.concat([0,0,0, 1,1,0, 1,0,0]);
    allverts = allverts.concat([0,0,0, 0,1,0, 1,1,0]);

    // //pass the color of a point to u_FragColor uniform variable
    // gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

    //top of cube
    allverts = allverts.concat([0,1,0, 0,1,1, 1,1,1]);
    allverts = allverts.concat([0,1,0, 1,1,1, 1,1,0]);

    // //pass the color of a point to u_FragColor uniform variable
    // gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);

    //right side of cube
    allverts = allverts.concat([1,0,0, 1,1,0, 1,1,1]);
    allverts = allverts.concat([1,0,0, 1,0,1, 1,1,1]);

    // //pass the color of a point to u_FragColor uniform variable
    // gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);

    //back of cube
    allverts = allverts.concat([0,0,1, 1,1,1, 1,0,1]);
    allverts = allverts.concat([0,0,1, 0,1,1, 1,1,1]);

    // //pass the color of a point to u_FragColor uniform variable
    // gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);

    //left side of cube
    allverts = allverts.concat([0,0,0, 0,1,0, 0,1,1]);
    allverts = allverts.concat([0,0,0, 0,0,1, 0,1,1]);

    // //pass the color of a point to u_FragColor uniform variable
    // gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

    //bottom of cube
    allverts = allverts.concat([0,0,0, 0,0,1, 1,0,1]);
    allverts = allverts.concat([0,0,0, 1,0,1, 1,0,0]);

    drawTriangle3D(allverts);
  }

  renderfaster() {
    var rgba = this.color;

    //pass the texture number
    gl.uniform1i(u_whichTexture, this.textureNum);

    //pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
    //pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    if (g_vertexBuffer == null) {
      initTriangle3D();
    }

    //write date into the buffer object
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.cubeVerts), gl.DYNAMIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, this.cubeVerts, gl.DYNAMIC_DRAW);

    gl.drawArrays(gl.TRIANGLES, 0, 36);

  }

  renderfasterUV() {
    var rgba = this.color;

    //pass the texture number
    gl.uniform1i(u_whichTexture, this.textureNum);

    //pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
    //pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // if (g_vertexBuffer == null) {
    //   initTriangle3D();
    // }

    //write date into the buffer object
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.cubeVerts), gl.DYNAMIC_DRAW);
    // gl.bufferData(gl.ARRAY_BUFFER, this.cubeVerts, gl.DYNAMIC_DRAW);

    // gl.drawArrays(gl.TRIANGLES, 0, 36);

    drawTriangle3DUV(this.cubeVerts, this.uvVerts);

  }
}
