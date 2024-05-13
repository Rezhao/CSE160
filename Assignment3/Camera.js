class Camera {
	constructor() {
    this.fov = 60;
		this.eye = new Vector3([0, 0, -5]);
		this.at = new Vector3([0, 0, 100]);
		this.up = new Vector3([0, 1, 0]);

    //pass the projection matrix
    this.projMat = new Matrix4();
    this.projMat.setPerspective(this.fov, canvas.width/canvas.height, .1, 100);

    //pass the view matrix
    this.viewMat = new Matrix4();
    this.viewMat.setLookAt(
      this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
      this.at.elements[0], this.at.elements[1], this.at.elements[2], 
      this.up.elements[0], this.up.elements[1], this.up.elements[2]); // (eye, at, up)

    this.speed = 0.2;
    this.alpha = 2;
	}

	moveForward() {
    var f = new Vector3();
    f.set(this.at);
    f.sub(this.eye);
    f.normalize();
    f.mul(this.speed);
    this.eye.add(f);
    this.at.add(f);
	}

	moveBackwards() {
    var f = new Vector3();
    f.set(this.eye);
    f.sub(this.at);
    f.normalize();
    f.mul(this.speed);
    this.eye.add(f);
    this.at.add(f);
	}

	moveLeft() {
    var f = new Vector3();
    f.set(this.at);
    f.sub(this.eye);
    var s = Vector3.cross(this.up, f);
    s.normalize();
    s.mul(this.speed);
    this.eye.add(s);
    this.at.add(s);
  }

  moveRight() {
    var f = new Vector3();
    f.set(this.at);
    f.sub(this.eye);
    var s = Vector3.cross(f, this.up);
    s.normalize();
    s.mul(this.speed);
    this.eye.add(s);
    this.at.add(s);
  }

  panLeft() {
    var f = new Vector3();
    f.set(this.at);
    f.sub(this.eye);
    var rotationMatrix = new Matrix4();
    rotationMatrix.setRotate(this.alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    var f_prime = rotationMatrix.multiplyVector3(f);
    var e = new Vector3();
    e.set(this.eye);
    this.at = e.add(f_prime);
  }

  panRight() {
    var f = new Vector3();
    f.set(this.at);
    f.sub(this.eye);
    var rotationMatrix = new Matrix4();
    rotationMatrix.setRotate(-this.alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    var f_prime = rotationMatrix.multiplyVector3(f);
    var e = new Vector3();
    e.set(this.eye);
    this.at = e.add(f_prime);
  }

  panCamera(deg) {
    var f = new Vector3();
    f.set(this.at);
    f.sub(this.eye);
    var rotationMatrix = new Matrix4();
    rotationMatrix.setRotate(deg, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    var f_prime = rotationMatrix.multiplyVector3(f);
    var e = new Vector3();
    e.set(this.eye);
    this.at = e.add(f_prime);
  }
}