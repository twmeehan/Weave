import { Vec3 } from "../math/Vec3";
import { Scene } from "../core/Scene";
import { GraphicsContext as WEAVE } from "../GraphicsContext";

// DO NOT ATTACH TO A CAMERA MOUNTED TO AN OBJECT
export class CameraController {

    constructor(camera, domElement) {
  
      this.camera = camera;

      if (!(camera.parent instanceof Scene)) {
        throw Error("Cannot attach controls to a camera that is attached to another object");
      }
      this.domElement = domElement;
      // target is the point being rotated around
      this.target = new Vec3();
      this.EPS = 0.001;
  
      // spherical coords of camera
      this.radius = 1;
      this.theta = 0;
      this.phi = 0;
  
      // interaction state
      this.state = { rotating: false, panning: false, x: 0, y: 0 };
  
      // speeds
      this.rotateSpeed = 0.006;
      this.panSpeed = 0.17;
      this.zoomSpeed = 0.001;
  
      this.initCamera();
      this.initEventListeners();
    }
  
    // update camera's xyz based off spherical coords
    updateCamera() {
      const cosPhi = Math.cos(this.phi);
      const sinPhi = Math.sin(this.phi);

      this.camera.position = new Vec3(
        this.target.x + this.radius * sinPhi * Math.cos(this.theta),
        this.target.y + this.radius * cosPhi,
        this.target.z + this.radius * sinPhi * Math.sin(this.theta)
      );
      this.camera.dirty = true;
      
      this.camera.lookAt(this.target);
      const uViewPos = WEAVE.gl.getUniformLocation(WEAVE.gl.getParameter(WEAVE.gl.CURRENT_PROGRAM), "uViewPos");
      WEAVE.gl.uniform3fv(uViewPos, this.camera.position.toArray());
      this.camera.updateWorldMatrix();
    }
  
    initCamera() {
      
      console.log(this.camera.getGlobalPosition());
      const offset = this.camera.position.subtract(this.target);
      this.radius = offset.length();
      this.theta = Math.atan2(offset.z, offset.x);
      this.phi = Math.acos(offset.y / this.radius);
  
      if (this.phi < this.EPS) this.phi = this.EPS;
      else if (this.phi > Math.PI - this.EPS) this.phi = Math.PI - this.EPS;
      this.updateCamera();
    }
  
    // uses event listeners to get input from the user
    initEventListeners() {
      this.domElement.addEventListener("mousedown", this.onMouseDown.bind(this));
      this.domElement.addEventListener("mousemove", this.onMouseMove.bind(this));
      this.domElement.addEventListener("mouseup", this.onMouseUp.bind(this));
      this.domElement.addEventListener("wheel", this.onMouseWheel.bind(this), {
        passive: false,
      });
      this.domElement.addEventListener("contextmenu", (e) => e.preventDefault());
      window.addEventListener("keydown", this.onKeyDown.bind(this));
      window.addEventListener("keyup", this.onKeyUp.bind(this));
    }
  
    onKeyDown(event) {
      if (event.key === "Shift") {
        this.shift = true;
      }
    }
  
    onKeyUp(event) {
      if (event.key === "Shift") {
        this.shift = false;
      }
    }
  
    onMouseDown(event) {
      event.preventDefault();
  
      this.state.rotating = !this.shift;
      this.state.panning = this.shift;
  
      this.state.x = event.clientX;
      this.state.y = event.clientY;

  
      const offset = this.camera.position.subtract(this.target);
      this.radius = offset.length();
      this.theta = Math.atan2(offset.z, offset.x);
      this.phi = Math.acos(offset.y / this.radius);
    }
  
    onMouseMove(event) {

      const dx = event.clientX - this.state.x;
      const dy = event.clientY - this.state.y;
  
  
      if (this.phi < this.EPS) this.phi = this.EPS;
      else if (this.phi > Math.PI - this.EPS) this.phi = Math.PI - this.EPS;

      if (this.state.panning) {
        const forwards = this.target
          .subtract(this.camera.position)
          .normalize();
        const right = forwards
          .cross(new Vec3(0, 1, 0))
          .normalize();
        const up = right.cross(forwards).normalize();
  
        // move camera by pan value
        const pan = new Vec3()
          .add(right.multiply((-dx * this.panSpeed * this.radius) / 200))
          .add(up.multiply((dy * this.panSpeed * this.radius) / 200));
        this.target=this.target.add(pan);
        this.camera.position=this.camera.position.add(pan);
        this.camera.lookAt(this.target);
        this.updateCamera();
  
      } else if (this.state.rotating) {
  
        // change spherical coords
        this.theta += dx * this.rotateSpeed;
        this.phi -= dy * this.rotateSpeed;
        if (this.phi < this.EPS) this.phi = this.EPS;
        else if (this.phi > Math.PI - this.EPS) this.phi = Math.PI - this.EPS;
        this.updateCamera();
  
      }
  
      // old x and y of mouse
      this.state.x = event.clientX;
      this.state.y = event.clientY;
  
    }
  
    onMouseUp(event) {
      this.state.rotating = this.state.panning = false;
    }
  
    // zoom
    onMouseWheel(event) {
      event.preventDefault();
      this.radius *= 1 + event.deltaY * this.zoomSpeed;
      // stop at 0.1
      if (this.radius < 0.1) this.radius = 0.1;
      this.updateCamera();
    }

  }