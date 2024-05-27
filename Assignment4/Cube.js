class Cube {
  constructor() {
    this.type = 'cube';
    this.color = [1.0,1.0,1.0,1.0];
    this.matrix = new Matrix4();
    this.normalMatrix = new Matrix4();
    this.textureNum = -2;
    this.cubeVerts = [
      0,0,0, 1,1,0, 1,0,0, //front of cube
      0,0,0, 0,1,0, 1,1,0,
      0,1,0, 0,1,1, 1,1,1, //top of cube
      0,1,0, 1,1,1, 1,1,0,
      1,0,0, 1,1,1, 1,0,1, //right side of cube
      1,0,0, 1,1,0, 1,1,1,
      0,0,1, 1,1,1, 1,0,1, //back of cube
      0,0,1, 0,1,1, 1,1,1,
      0,0,0, 0,1,1, 0,0,1, //left side of cube
      0,0,0, 0,1,0, 0,1,1,
      0,0,0, 0,0,1, 1,0,1, //bottom of cube
      0,0,0, 1,0,1, 1,0,0
    ];
    this.uvVerts = [
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1, //front of cube
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1, //top of cube
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1, //right side of cube
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1, //back of cube
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1, //left side of cube
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1, //bottom of cube
    ];

    this.normalVerts = [
      0,0,-1, 0,0,-1, 0,0,-1,   0,0,-1, 0,0,-1, 0,0,-1, // front
      0,1,0, 0,1,0, 0,1,0,      0,1,0, 0,1,0, 0,1,0, //top
      1,0,0, 1,0,0, 1,0,0,      1,0,0, 1,0,0, 1,0,0, //right
      0,0,1, 0,0,1, 0,0,1,      0,0,1, 0,0,1, 0,0,1, // back
      -1,0,0, -1,0,0, -1,0,0,   -1,0,0, -1,0,0, -1,0,0, //left
      0,-1,0, 0,-1,0, 0,-1,0,   0,-1,0, 0,-1,0, 0,-1,0, //bottom
    ];

  }

  render() {
    var rgba = this.color;

    //pass the texture number
    gl.uniform1i(u_whichTexture, this.textureNum);

    //pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
    //pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Pass the matrix to u_NormalMatrix attribute
    gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

    //front of cube
    drawTriangle3DUVNormal([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0], [0,0,-1, 0,0,-1, 0,0,-1]);
    drawTriangle3DUVNormal([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1], [0,0,-1, 0,0,-1, 0,0,-1]);

    //top of cube
    drawTriangle3DUVNormal([0,1,0, 0,1,1, 1,1,1], [0,0, 1,1, 1,0], [0,1,0, 0,1,0, 0,1,0]);
    drawTriangle3DUVNormal([0,1,0, 1,1,1, 1,1,0], [0,0, 0,1, 1,1], [0,1,0, 0,1,0, 0,1,0]);

    //right side of cube
    drawTriangle3DUVNormal([1,0,0, 1,1,0, 1,1,1], [0,0, 1,0, 1,1], [1,0,0, 1,0,0, 1,0,0]);
    drawTriangle3DUVNormal([1,0,0, 1,0,1, 1,1,1], [0,0, 0,1, 1,1], [1,0,0, 1,0,0, 1,0,0]);

    //back of cube
    drawTriangle3DUVNormal([0,0,1, 1,1,1, 1,0,1], [0,0, 1,1, 1,0], [0,0,1, 0,0,1, 0,0,1]);
    drawTriangle3DUVNormal([0,0,1, 0,1,1, 1,1,1], [0,0, 0,1, 1,1], [0,0,1, 0,0,1, 0,0,1]);

    //left side of cube
    drawTriangle3DUVNormal([0,0,0, 0,1,0, 0,1,1], [0,0, 1,0, 1,1], [-1,0,0, -1,0,0, -1,0,0]);
    drawTriangle3DUVNormal([0,0,0, 0,0,1, 0,1,1], [0,0, 0,1, 1,1], [-1,0,0, -1,0,0, -1,0,0]);

    //bottom of cube
    drawTriangle3DUVNormal([0,0,0, 0,0,1, 1,0,1], [0,0, 1,1, 1,0], [0,-1,0, 0,-1,0, 0,-1,0]);
    drawTriangle3DUVNormal([0,0,0, 1,0,1, 1,0,0], [0,0, 0,1, 1,1], [0,-1,0, 0,-1,0, 0,-1,0]);

    //pass the color of a point to u_FragColor uniform variable
    // gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  }

  renderfast() {
    var rgba = this.color;

    //pass the texture number
    gl.uniform1i(u_whichTexture, this.textureNum);

    //pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
    //pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Pass the matrix to u_NormalMatrix attribute
    gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

    drawTriangle3DUVNormal(this.cubeVerts, this.uvVerts, this.normalVerts);
  }
}
