import { Mat4 } from '../math/Mat4.js';
import { Vec3 } from '../math/Vec3.js';
import { GameObject } from './GameObject.js';

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
    this.cameraType = cameraType;
    this.viewMatrix = null;
    this.projectionMatrix = null;
    // Store the look-at target in case you want to update the view later.
    this.lookAtTarget = target.clone();
    this.lookAt(target);
    this.updateProjectionMatrix(fov, window.innerWidth / window.innerHeight, near, far);
  }
  
  updateWorldMatrix(updateObjectToParentMatrix = true) {
    super.updateWorldMatrix(updateObjectToParentMatrix);
    this.updateViewMatrix();
  }

  updateProjectionMatrix(fov, aspect, near, far) {
    if (this.cameraType === Camera.ORTHOGRAPHIC) {
        // For orthographic projection (row-major):
        const top = Math.tan(fov / 2) * near;
        const bottom = -top;
        const right = top * aspect;
        const left = -right;
        // Standard orthographic matrix in row-major order:
        // Row0: [2/(right-left), 0, 0, -(right+left)/(right-left)]
        // Row1: [0, 2/(top-bottom), 0, -(top+bottom)/(top-bottom)]
        // Row2: [0, 0, -2/(far-near), -(far+near)/(far-near)]
        // Row3: [0, 0, 0, 1]
        const m = new Mat4(
            2 / (right - left), 0, 0, -(right + left) / (right - left),
            0, 2 / (top - bottom), 0, -(top + bottom) / (top - bottom),
            0, 0, -2 / (far - near), -(far + near) / (far - near),
            0, 0, 0, 1
        );
        this.projectionMatrix = m;
    } else {
        // Perspective projection in row-major order.
        // The typical OpenGL perspective projection (column-major) is:
        // [ f/aspect,  0,              0,                         0,
        //   0,         f,              0,                         0,
        //   0,         0,  (far+near)/(near-far), (2*far*near)/(near-far),
        //   0,         0,             -1,                         0 ]
        // Transposing to row-major gives:
        // Row0: [ f/aspect, 0, 0, 0 ]
        // Row1: [ 0, f, 0, 0 ]
        // Row2: [ 0, 0, (far+near)/(near-far), -1 ]
        // Row3: [ 0, 0, (2*far*near)/(near-far),  0 ]
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

updateViewMatrix() {
    // Step 1: Get rotation matrix from Euler angles (YXZ order assumed)
    const { x, y, z } = this.getGlobalRotation();
  
    const cx = Math.cos(x), sx = Math.sin(x);
    const cy = Math.cos(-y), sy = Math.sin(-y);
    const cz = Math.cos(z), sz = Math.sin(z);
  
    // Build rotation matrix directly (row-major)
    const r00 = cy * cz + sy * sx * sz;
    const r01 = -cy * sz + sy * sx * cz;
    const r02 = sy * cx;
  
    const r10 = cx * sz;
    const r11 = cx * cz;
    const r12 = -sx;
  
    const r20 = -sy * cz + cy * sx * sz;
    const r21 = sy * sz + cy * sx * cz;
    const r22 = cy * cx;
  
    // Step 2: Transpose rotation for inverse (R^T)
    const t00 = r00, t01 = r10, t02 = r20;
    const t10 = r01, t11 = r11, t12 = r21;
    const t20 = r02, t21 = r12, t22 = r22;
  
    // Step 3: Inverse translation = -R^T * position
    const pos = this.getGlobalPosition();
    const px = pos.x, py = pos.y, pz = pos.z;
  
    const tx = -(t00 * px + t01 * py + t02 * pz);
    const ty = -(t10 * px + t11 * py + t12 * pz);
    const tz = -(t20 * px + t21 * py + t22 * pz);
  
    // Step 4: Build final view matrix
    this.viewMatrix = new Mat4(
        t00, t01, t02, tx,
        t10, t11, t12, ty,
        t20, t21, t22, tz,
        0,   0,   0,   1
      );
  }

  lookAt(target) {
    
    // Get yaw and pitch from target - eye
    const forward = target.subtract(this.getGlobalPosition()).normalize();
    // Here, assume that yaw is rotation about Y and pitch about X.
    const yaw = Math.atan2(forward.x, -forward.z);
    const pitch = Math.asin(forward.y);
    const parentRotation = this.parent ? this.parent.getGlobalRotation() : Vec3.zeros();
    this.transform.rotation.x = pitch - parentRotation.x;
    this.transform.rotation.y = yaw - parentRotation.y;
    this.updateViewMatrix();

  }
}