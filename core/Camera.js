import { Mat4 } from '../math/Mat4.js';
import { Vec3 } from '../math/Vec3.js';
import { GameObject } from './GameObject.js';

/*
 * Camera is a GameObject that contains the functions necessary to obtain
 * the view matrix and projection matrix. Multiple cameras can exist at a
 * time but only 1 can be active. The scene will be rendered from the
 * perspective of the active camera.
 */
export class Camera extends GameObject {

  static ORTHOGRAPHIC = 0;
  static PERSPECTIVE = 1;
  
  constructor(
    cameraType = Camera.PERSPECTIVE, 
    position = new Vec3(5, 5, 5), 
    target = new Vec3(0, 0, 0), 
    fov = Math.PI / 4, 
    near = 0.1, 
    far = 100
  ) {

    super(position);
    // Can be orthographic or perspective
    this.cameraType = cameraType;
    this.name = "Camera";

    this.viewMatrix = null;
    this.projectionMatrix = null;

    this.lookAt(target);
    this.updateProjectionMatrix(fov, window.innerWidth / window.innerHeight, near, far);
  }
  
  // Same as all GameObjects but also updates the viewMatrix when called
  updateWorldMatrix(updateObjectToParentMatrix = true) {
    super.updateWorldMatrix(updateObjectToParentMatrix);
    this.updateViewMatrix();
  }

  updateProjectionMatrix(fov, aspect, near, far) {

    // TODO: ORTHOGRAPHIC
    if (this.cameraType === Camera.ORTHOGRAPHIC) {
      const top = Math.tan(fov / 2) * near;
      const bottom = -top;
      const right = top * aspect;
      const left = -right;
        
      const m = new Mat4(
            2 / (right - left), 0, 0, -(right + left) / (right - left),
            0, 2 / (top - bottom), 0, -(top + bottom) / (top - bottom),
            0, 0, -2 / (far - near), -(far + near) / (far - near),
            0, 0, 0, 1
      );
        this.projectionMatrix = m;
    } else {
      
      // Calculates the appropriate perspective matrix
      const f = 1.0 / Math.tan(fov / 2);
      const m = new Mat4(
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) / (near - far), (2 * far * near) / (near - far),
            0, 0, -1, 0
      );
      this.projectionMatrix = m;
    }
  }

  // Call this whenever the camera is moved to set this.viewMatrix
  updateViewMatrix() {
  
    // Extract euler from getGlobalRotation()
    // Must use global rotation and position since camera may be the child of another GameObject
    const { x, y, z } = this.getGlobalRotation();
  
    const cx = Math.cos(x), sx = Math.sin(x);
    // y must be negative idk why
    const cy = Math.cos(-y), sy = Math.sin(-y);
    const cz = Math.cos(z), sz = Math.sin(z);
  
    const r00 = cy * cz + sy * sx * sz;
    const r01 = -cy * sz + sy * sx * cz;
    const r02 = sy * cx;
  
    const r10 = cx * sz;
    const r11 = cx * cz;
    const r12 = -sx;
  
    const r20 = -sy * cz + cy * sx * sz;
    const r21 = sy * sz + cy * sx * cz;
    const r22 = cy * cx;
  
    const t00 = r00, t01 = r10, t02 = r20;
    const t10 = r01, t11 = r11, t12 = r21;
    const t20 = r02, t21 = r12, t22 = r22;
  
    const pos = this.getGlobalPosition();
    const px = pos.x, py = pos.y, pz = pos.z;
  
    const tx = -(t00 * px + t01 * py + t02 * pz);
    const ty = -(t10 * px + t11 * py + t12 * pz);
    const tz = -(t20 * px + t21 * py + t22 * pz);
  
    this.viewMatrix = new Mat4(
        t00, t01, t02, tx,
        t10, t11, t12, ty,
        t20, t21, t22, tz,
        0,   0,   0,   1
      );
  }


  // Moves the camera to be facing a target location
  lookAt(target) {
    
    this.updateWorldMatrix();
    const forward = target.subtract(this.getGlobalPosition()).normalize();
    const yaw = Math.atan2(forward.x, -forward.z);
    const pitch = Math.asin(forward.y);
    const parentRotation = this.parent ? this.parent.getGlobalRotation() : Vec3.zeros();
    this.rotation.x = pitch - parentRotation.x;
    this.rotation.y = yaw - parentRotation.y;
    this.dirty = true;

  }
}