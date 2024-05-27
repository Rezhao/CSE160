function drawPanda() {
  //panda body
  var body = new Cube();
  // body.color = [1, 1, 1, 1];
  if (g_normalOn) {
    body.textureNum = -3;
  } else {
    body.textureNum = 1;
  }
  body.matrix.setTranslate(-0.2, -.5, 0.0);
  var bodyCoor = new Matrix4(body.matrix);
  body.matrix.scale(0.5, 0.8, 0.9);
  body.normalMatrix.setInverseOf(body.matrix).transpose();
  body.renderfast();

  //panda tail
  var tail = new Cube();
  tail.color = [0, 0, 0, 1];
  if (g_normalOn) {
    tail.textureNum = -3;
  }
  tail.matrix = new Matrix4(bodyCoor);
  tail.matrix.setTranslate(-0.05, 0, 0.8);
  tail.matrix.scale(0.2, 0.2, 0.2);
  tail.normalMatrix.setInverseOf(tail.matrix).transpose();
  tail.renderfast();

  //panda black top chest
  var chest = new Cube();
  chest.color = [0, 0, 0, 1];
  if (g_normalOn) {
    chest.textureNum = -3;
  }
  chest.matrix = new Matrix4(bodyCoor);
  chest.matrix.setTranslate(-0.201, -0.1, -0.001);
  chest.matrix.scale(0.502, 0.401, 0.3);
  chest.normalMatrix.setInverseOf(chest.matrix).transpose();
  chest.renderfast();

  //panda front left leg
  var frontLeftLeg = new Cube();
  frontLeftLeg.color = [0, 0, 0, 1];
  if (g_normalOn) {
    frontLeftLeg.textureNum = -3;
  }
  frontLeftLeg.matrix = new Matrix4(bodyCoor);
  frontLeftLeg.matrix.setTranslate(-0.401, 0.1, -0.001);
  frontLeftLeg.matrix.rotate(g_leftLegAngle, 1, 0, 0);
  var frontLeftLegCoordinates = new Matrix4(frontLeftLeg.matrix);
  frontLeftLeg.matrix.scale(0.302, -0.5, 0.3);
  frontLeftLeg.normalMatrix.setInverseOf(frontLeftLeg.matrix).transpose();
  frontLeftLeg.renderfast();

  //panda front left calf
  var frontLeftCalf = new Cube();
  frontLeftCalf.color = [0, 0, 0, 1];
  if (g_normalOn) {
    frontLeftCalf.textureNum = -3;
  }
  frontLeftCalf.matrix = new Matrix4(frontLeftLegCoordinates);
  frontLeftCalf.matrix.translate(-0.001, -0.5, -0.00);
  frontLeftCalf.matrix.rotate(g_calfAngle, 1, 0, 0);
  var frontLeftCalfCoordinates = new Matrix4(frontLeftCalf.matrix);
  frontLeftCalf.matrix.scale(0.301, -0.4, 0.3);
  frontLeftCalf.normalMatrix.setInverseOf(frontLeftCalf.matrix).transpose();
  frontLeftCalf.renderfast();

  //panda front left foot
  var frontLeftFoot = new Cube();
  frontLeftFoot.color = [0, 0, 0, 1];
  if (g_normalOn) {
    frontLeftFoot.textureNum = -3;
  }
  frontLeftFoot.matrix = frontLeftCalfCoordinates;
  frontLeftFoot.matrix.translate(-0.001, -0.32, 0.315);
  frontLeftFoot.matrix.rotate(g_feetAngle, 1, 0, 0);
  frontLeftFoot.matrix.scale(0.303, -0.15, -0.401);
  frontLeftFoot.normalMatrix.setInverseOf(frontLeftFoot.matrix).transpose();
  frontLeftFoot.renderfast();

  //panda front right leg
  var frontRightLeg = new Cube();
  frontRightLeg.color = [0, 0, 0, 1];
  if (g_normalOn) {
    frontRightLeg.textureNum = -3;
  }
  frontRightLeg.matrix = new Matrix4(bodyCoor);
  frontRightLeg.matrix.setTranslate(0.201, 0.1, -0.001);
  frontRightLeg.matrix.rotate(g_rightLegAngle, 1, 0, 0);
  var frontRightLegCoordinates = new Matrix4(frontRightLeg.matrix);
  frontRightLeg.matrix.scale(0.302, -0.5, 0.3);
  frontRightLeg.normalMatrix.setInverseOf(frontRightLeg.matrix).transpose();
  frontRightLeg.renderfast();

  //panda front right calf
  var frontRightCalf = new Cube();
  frontRightCalf.color = [0, 0, 0, 1];
  if (g_normalOn) {
    frontRightCalf.textureNum = -3;
  }
  frontRightCalf.matrix = new Matrix4(frontRightLegCoordinates);
  frontRightCalf.matrix.translate(-0.001, -0.5, -0.00);
  frontRightCalf.matrix.rotate(g_calfAngle, 1, 0, 0);
  var frontRightCalfCoordinates = new Matrix4(frontRightCalf.matrix);
  frontRightCalf.matrix.scale(0.301, -0.4, 0.3);
  frontRightCalf.normalMatrix.setInverseOf(frontRightCalf.matrix).transpose();
  frontRightCalf.renderfast();

  //panda front right foot
  var frontRightFoot = new Cube();
  frontRightFoot.color = [0, 0, 0, 1];
  if (g_normalOn) {
    frontRightFoot.textureNum = -3;
  }
  frontRightFoot.matrix = frontRightCalfCoordinates;
  frontRightFoot.matrix.translate(-0.001, -0.32, 0.315);
  frontRightFoot.matrix.rotate(g_feetAngle, 1, 0, 0);
  frontRightFoot.matrix.scale(0.303, -0.15, -0.401);
  frontRightFoot.normalMatrix.setInverseOf(frontRightFoot.matrix).transpose();
  frontRightFoot.renderfast();

  //panda back left leg
  var backLeftLeg = new Cube();
  if (g_normalOn) {
    backLeftLeg.textureNum = -3;
  } else {
    backLeftLeg.textureNum = 1;
  }
  // backLeftLeg.color = [1, 1, 1, 1];
  backLeftLeg.matrix = new Matrix4(bodyCoor);
  backLeftLeg.matrix.setTranslate(-0.4, 0.1, 0.601);
  backLeftLeg.matrix.rotate(g_rightLegAngle, 1, 0, 0);
  var backLeftLegCoordinates = new Matrix4(backLeftLeg.matrix);
  backLeftLeg.matrix.scale(0.302, -0.5, 0.3);
  backLeftLeg.normalMatrix.setInverseOf(backLeftLeg.matrix).transpose();
  backLeftLeg.renderfast();
  
  //panda back left calf
  var backLeftCalf = new Cube();
  backLeftCalf.color = [0, 0, 0, 1];
  if (g_normalOn) {
    backLeftCalf.textureNum = -3;
  }
  backLeftCalf.matrix = new Matrix4(backLeftLegCoordinates);
  backLeftCalf.matrix.translate(-0.001, -0.5, -0.00);
  backLeftCalf.matrix.rotate(g_calfAngle, 1, 0, 0);
  var backLeftCalfCoordinates = new Matrix4(backLeftCalf.matrix);
  backLeftCalf.matrix.scale(0.301, -0.4, 0.3);
  backLeftCalf.normalMatrix.setInverseOf(backLeftCalf.matrix).transpose();
  backLeftCalf.renderfast();

  //panda back left foot
  var backLeftFoot = new Cube();
  backLeftFoot.color = [0, 0, 0, 1];
  if (g_normalOn) {
    backLeftFoot.textureNum = -3;
  }
  backLeftFoot.matrix = backLeftCalfCoordinates;
  backLeftFoot.matrix.translate(-0.001, -0.32, 0.315);
  backLeftFoot.matrix.rotate(g_feetAngle, 1, 0, 0);
  backLeftFoot.matrix.scale(0.303, -0.15, -0.401);
  backLeftFoot.normalMatrix.setInverseOf(backLeftFoot.matrix).transpose();
  backLeftFoot.renderfast();

  //panda back right leg
  var backRightLeg = new Cube();
  if (g_normalOn) {
    backRightLeg.textureNum = -3;
  } else {
    backRightLeg.textureNum = 1;
  }
  // backRightLeg.color = [1, 1, 1, 1];
  backRightLeg.matrix = new Matrix4(bodyCoor);
  backRightLeg.matrix.setTranslate(0.202, 0.1, 0.601);
  backRightLeg.matrix.rotate(g_leftLegAngle, 1, 0, 0);
  var backRightLegCoordinates = new Matrix4(backRightLeg.matrix);
  backRightLeg.matrix.scale(0.302, -0.5, 0.3);
  backRightLeg.normalMatrix.setInverseOf(backRightLeg.matrix).transpose();
  backRightLeg.renderfast();

  //panda back left calf
  var backRightCalf = new Cube();
  backRightCalf.color = [0, 0, 0, 1];
  if (g_normalOn) {
    backRightCalf.textureNum = -3;
  }
  backRightCalf.matrix = new Matrix4(backRightLegCoordinates);
  backRightCalf.matrix.translate(-0.001, -0.5, -0.00);
  backRightCalf.matrix.rotate(g_calfAngle, 1, 0, 0);
  var backRightCalfCoordinates = new Matrix4(backRightCalf.matrix);
  backRightCalf.matrix.scale(0.301, -0.4, 0.3);
  backRightCalf.normalMatrix.setInverseOf(backRightCalf.matrix).transpose();
  backRightCalf.renderfast();

  //panda back right foot
  var backRightFoot = new Cube();
  backRightFoot.color = [0, 0, 0, 1];
  if (g_normalOn) {
    backRightFoot.textureNum = -3;
  }
  backRightFoot.matrix = backRightCalfCoordinates;
  backRightFoot.matrix.translate(-0.001, -0.32, 0.315);
  backRightFoot.matrix.rotate(g_feetAngle, 1, 0, 0);
  backRightFoot.matrix.scale(0.303, -0.15, -0.401);
  backRightFoot.normalMatrix.setInverseOf(backRightFoot.matrix).transpose();
  backRightFoot.renderfast();

  //panda head
  var head = new Cube();
  if (g_normalOn) {
    head.textureNum = -3;
  } else {
    head.textureNum = 1;
  }
  head.matrix = bodyCoor;
  head.matrix.translate(-0.1, 0.6, -0.4);
  head.matrix.rotate(g_headAngle, 1, 0, 1);
  var headCoordinates = new Matrix4(head.matrix);
  head.matrix.scale(0.65, 0.55, 0.55);
  head.normalMatrix.setInverseOf(head.matrix).transpose();
  head.renderfast();

  //panda left ear
  var leftEar = new Cube();
  leftEar.color = [0, 0, 0, 1];
  if (g_normalOn) {
    leftEar.textureNum = -3;
  }
  leftEar.matrix = new Matrix4(headCoordinates);
  leftEar.matrix.translate(0, 0.4, -0.001);
  leftEar.matrix.rotate(45, 0, 0, 1);
  leftEar.matrix.scale(0.2, 0.15, 0.2);
  leftEar.normalMatrix.setInverseOf(leftEar.matrix).transpose();
  leftEar.renderfast();

  //panda right ear
  var rightEar = new Cube();
  rightEar.color = [0, 0, 0, 1];
  if (g_normalOn) {
    rightEar.textureNum = -3;
  }
  rightEar.matrix = new Matrix4(headCoordinates);
  rightEar.matrix.translate(0.65, 0.4, -0.001);
  rightEar.matrix.rotate(45, 0, 0, 1);
  rightEar.matrix.scale(0.15, 0.2, 0.2);
  rightEar.normalMatrix.setInverseOf(rightEar.matrix).transpose();
  rightEar.renderfast();

  //panda left eye
  var leftEye = new Cube();
  leftEye.color = [0, 0, 0, 1];
  if (g_normalOn) {
    leftEye.textureNum = -3;
  }
  leftEye.matrix = new Matrix4(headCoordinates);
  leftEye.matrix.translate(0.05, 0.25, -0.001);
  leftEye.matrix.rotate(-45, 0, 0, 1);
  leftEye.matrix.scale(0.12, 0.2, 0.2);
  leftEye.normalMatrix.setInverseOf(leftEye.matrix).transpose();
  leftEye.renderfast();

  //panda left eyeball
  var leftEyeball = new Cube();
  leftEyeball.color = [1, 1, 1, 1];
  if (g_normalOn) {
    leftEyeball.textureNum = -3;
  }
  leftEyeball.matrix = new Matrix4(headCoordinates);
  leftEyeball.matrix.translate(0.15, 0.3, -0.0015);
  leftEyeball.matrix.rotate(-45, 0, 0, 1);
  var leftEyeBallCoordinates = new Matrix4(leftEyeball.matrix);
  leftEyeball.matrix.scale(0.05, 0.05, 0.2);
  leftEyeball.normalMatrix.setInverseOf(leftEyeball.matrix).transpose();
  leftEyeball.renderfast();

  //panda right eye
  var rightEye = new Cube();
  rightEye.color = [0, 0, 0, 1];
  if (g_normalOn) {
    rightEye.textureNum = -3;
  }
  rightEye.matrix = new Matrix4(headCoordinates);
  rightEye.matrix.translate(0.5, 0.17, -0.001);
  rightEye.matrix.rotate(45, 0, 0, 1);
  rightEye.matrix.scale(0.12, 0.2, 0.2);
  rightEye.normalMatrix.setInverseOf(rightEye.matrix).transpose();
  rightEye.renderfast();

  //panda right eyeball
  var rightEyeball = new Cube();
  rightEyeball.color = [1, 1, 1, 1];
  if (g_normalOn) {
    rightEyeball.textureNum = -3;
  }
  rightEyeball.matrix = new Matrix4(headCoordinates);
  rightEyeball.matrix.translate(0.45, 0.27, -0.0015);
  rightEyeball.matrix.rotate(45, 0, 0, 1);
  var rightEyeBallCoordinates = new Matrix4(rightEyeball.matrix);
  rightEyeball.matrix.scale(0.05, 0.05, 0.2);
  rightEyeball.normalMatrix.setInverseOf(rightEyeball.matrix).transpose();
  rightEyeball.renderfast();

  if (shift_key) {
    //panda left eye wink
    var leftWink = new Cube();
    leftWink.color = [0, 0, 0, 1];
    if (g_normalOn) {
      leftWink.textureNum = -3;
    }
    leftWink.matrix = new Matrix4(leftEyeBallCoordinates);
    leftWink.matrix.translate(0.017, -0.02, -0.0015);
    leftWink.matrix.scale(0.05, 0.05, 0.2);
    leftWink.normalMatrix.setInverseOf(leftWink.matrix).transpose();
    leftWink.renderfast();

    //panda right eye wink
    var rightWink = new Cube();
    rightWink.color = [0, 0, 0, 1];
    if (g_normalOn) {
      rightWink.textureNum = -3;
    }
    rightWink.matrix = new Matrix4(rightEyeBallCoordinates);
    rightWink.matrix.translate(-0.018, -0.02, -0.0015);
    rightWink.matrix.scale(0.05, 0.05, 0.2);
    rightWink.normalMatrix.setInverseOf(rightWink.matrix).transpose();
    rightWink.renderfast();

    //rainbow arc cubes
    var c1 = new Cube();
    c1.color = [130/255, 205/255, 1, 1]; //130, 205, 255
    if (g_normalOn) {
      c1.textureNum = -3;
    }
    c1.matrix.translate(-0.01, 0.9, 0);
    c1.matrix.rotate(g_seconds * 100, 1, 1, 1);
    c1.matrix.scale(0.08, 0.08, 0.08);
    c1.normalMatrix.setInverseOf(c1.matrix).transpose();
    c1.renderfast();

    var c2 = new Cube();
    c2.color = [115/255, 1, 136/255, 1]; //115, 255, 136
    if (g_normalOn) {
      c2.textureNum = -3;
    }
    c2.matrix.translate(-0.3, 0.82, 0);
    c2.matrix.rotate(g_seconds * 100, 1, 1, 1);
    c2.matrix.scale(0.08, 0.08, 0.08);
    c2.normalMatrix.setInverseOf(c2.matrix).transpose();
    c2.renderfast();

    var c3 = new Cube();
    c3.color = [1, 225/255, 117/255, 1]; //255, 225, 117
    if (g_normalOn) {
      c3.textureNum = -3;
    }
    c3.matrix.translate(-0.55, 0.6, 0);
    c3.matrix.rotate(g_seconds * 100, 1, 1, 1);
    c3.matrix.scale(0.08, 0.08, 0.08);
    c3.normalMatrix.setInverseOf(c3.matrix).transpose();
    c3.renderfast();

    var c4 = new Cube();
    c4.color = [1, 170/255, 117/255, 1]; //255, 170, 117
    if (g_normalOn) {
      c4.textureNum = -3;
    }
    c4.matrix.translate(-0.72, 0.3, 0);
    c4.matrix.rotate(g_seconds * 100, 1, 1, 1);
    c4.matrix.scale(0.08, 0.08, 0.08);
    c4.normalMatrix.setInverseOf(c4.matrix).transpose();
    c4.renderfast();

    var c5 = new Cube();
    c5.color = [1, 156/255, 212/255, 1];
    if (g_normalOn) {
      c5.textureNum = -3;
    }
    c5.matrix.translate(-0.8, 0, 0);
    c5.matrix.rotate(g_seconds * 100, 1, 1, 1);
    c5.matrix.scale(0.08, 0.08, 0.08);
    c5.normalMatrix.setInverseOf(c5.matrix).transpose();
    c5.renderfast();

    var c6 = new Cube();
    c6.color = [115/255, 1, 136/255, 1];
    if (g_normalOn) {
      c6.textureNum = -3;
    }
    c6.matrix.translate(0.3, 0.82, 0);
    c6.matrix.rotate(g_seconds * 100, 1, 1, 1);
    c6.matrix.scale(0.08, 0.08, 0.08);
    c6.normalMatrix.setInverseOf(c6.matrix).transpose();
    c6.renderfast();

    var c7 = new Cube();
    c7.color = [1, 225/255, 117/255, 1];
    if (g_normalOn) {
      c7.textureNum = -3;
    }
    c7.matrix.translate(0.55, 0.6, 0);
    c7.matrix.rotate(g_seconds * 100, 1, 1, 1);
    c7.matrix.scale(0.08, 0.08, 0.08);
    c7.normalMatrix.setInverseOf(c7.matrix).transpose();
    c7.renderfast();

    var c8 = new Cube();
    c8.color = [1, 170/255, 117/255, 1];
    if (g_normalOn) {
      c8.textureNum = -3;
    }
    c8.matrix.translate(0.72, 0.3, 0);
    c8.matrix.rotate(g_seconds * 100, 1, 1, 1);
    c8.matrix.scale(0.08, 0.08, 0.08);
    c8.normalMatrix.setInverseOf(c8.matrix).transpose();
    c8.renderfast();

    var c9 = new Cube();
    c9.color = [1, 156/255, 212/255, 1];
    if (g_normalOn) {
      c9.textureNum = -3;
    }
    c9.matrix.translate(0.8, 0.02, 0);
    c9.matrix.rotate(g_seconds * 100, 1, 1, 1);
    c9.matrix.scale(0.08, 0.08, 0.08);
    c9.normalMatrix.setInverseOf(c9.matrix).transpose();
    c9.renderfast();
  }

  //panda snout
  var snout = new Cube();
  if (g_normalOn) {
    snout.textureNum = -3;
  } else {
    snout.textureNum = 1;
  }
  // snout.color = [1, 1, 1, 1];
  snout.matrix = new Matrix4(headCoordinates);
  snout.matrix.translate(0.19, 0.03, -0.1);
  snout.matrix.scale(0.25, 0.17, 0.2);
  snout.normalMatrix.setInverseOf(snout.matrix).transpose();
  snout.renderfast();

  //panda nose
  var nose = new Cube();
  nose.color = [0, 0, 0, 1];
  if (g_normalOn) {
    nose.textureNum = -3;
  }
  nose.matrix = new Matrix4(headCoordinates);
  nose.matrix.translate(0.27, 0.08, -0.15);
  nose.matrix.scale(0.1, 0.1, 0.2);
  nose.normalMatrix.setInverseOf(nose.matrix).transpose();
  nose.renderfast();

  var hat = new Cone();
  hat.color = [168/255, 119/255, 252/255, 1]; //168, 119, 252
  if (g_normalOn) {
    hat.textureNum = -3;
  }
  hat.matrix = new Matrix4(headCoordinates);
  hat.matrix.translate(0.32, 0.75, 0.2);
  hat.matrix.rotate(90, 1, 0, 0);
  hat.matrix.scale(1.2, 1.4, 1.2);
  hat.normalMatrix.setInverseOf(hat.matrix).transpose();
  hat.render();
}