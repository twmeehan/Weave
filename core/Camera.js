import { Mat4 } from '../math/Mat4.js';
import { Vec3 } from '../math/Vec3.js';
import { GameObject } from './GameObject.js';

export class Camera extends GameObject{
    static ORTHOGRAPHIC = 0;
    static PERSPECTIVE = 1;
    constructor(cameraType = Camera.PERSPECTIVE, position = new Vec3(5, 5, 5), target = new Vec3(0, 0, 0), fov = Math.PI / 4, near = 0.1, far = 100) {

        super(position);
        this.cameraType = cameraType;
        this.lookAt(target);
        this.updateProjectionMatrix(fov, window.innerWidth / window.innerHeight, near, far);
    }

    updateWorldMatrix(updateObjectToParentMatrix = true) {
        super.updateWorldMatrix(updateObjectToParentMatrix);
        this.updateViewMatrix();
    }

    updateProjectionMatrix(fov, aspect, near, far) {
        if (this.cameraType = Camera.ORTHOGRAPHIC) {
            const top = Math.tan(fov / 2) * near;
            const bottom = -top;
            const right = top * aspect;
            const left = -right;

            const lr = 1 / (left - right);
            const bt = 1 / (bottom - top);
            const nf = 1 / (near - far);

            const m = new Mat4();
            m.elements = [
                -2 * lr,     0,         0,              0,
                 0,        -2 * bt,     0,              0,
                 0,         0,        2 * nf,           0,
                (left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1
            ];
            this.projection = m;
        } else {
            const f = 1.0 / Math.tan(fov / 2);
            const rangeInv = 1.0 / (near - far);

            const m = new Mat4();
            m.elements = [
                f / aspect, 0, 0, 0,
                0, f, 0, 0,
                0, 0, (near + far) * rangeInv, -1,
                0, 0, near * far * rangeInv * 2, 0
            ];
            this.projectionMatrix = m;
        }
    }

    updateViewMatrix() {
        const { position, rotation } = this.transform;
      
        // Create forward vector from yaw (y), pitch (x), roll (z)
        const cosPitch = Math.cos(rotation.x);
        const sinPitch = Math.sin(rotation.x);
        const cosYaw = Math.cos(rotation.y);
        const sinYaw = Math.sin(rotation.y);
      
        const forward = new Vec3(
          sinYaw * cosPitch,
          sinPitch,
          -cosYaw * cosPitch
        ).normalize();
      
        // Right vector (camera's local X axis)
        const right = new Vec3(
          Math.cos(rotation.y),
          0,
          Math.sin(rotation.y)
        ).normalize();
      
        // Up vector (default up rotated around forward by roll)
        const defaultUp = new Vec3(0, 1, 0);
        const roll = rotation.z;
        const up = this.rotateVectorAroundAxis(defaultUp, forward, roll);
      
        // Build a view matrix manually from basis vectors and position
        const fx = forward.x, fy = forward.y, fz = forward.z;
        const rx = right.x, ry = right.y, rz = right.z;
        const ux = up.x,    uy = up.y,    uz = up.z;
        const px = position.x, py = position.y, pz = position.z;
      
        const m = new Mat4();
        m.elements = [
           rx,  ux,  fx, 0,
           ry,  uy,  fy, 0,
           rz,  uz,  fz, 0,
          -right.dot(position), -up.dot(position), -forward.dot(position), 1
        ];
      
        this.viewMatrix = m;
      }
  
    rotateVectorAroundAxis(v, axis, angle) {
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
  
        const term1 = v.multiply(cosA);
        const term2 = axis.cross(v).multiply(sinA);
        const term3 = axis.multiply(axis.dot(v) * (1 - cosA));
    
        return term1.add(term2).add(term3);
    }

    lookAt(target) {
        const forward = target.subtract(this.transform.position).normalize();

        // Get yaw and pitch from the direction vector
        const yaw = Math.atan2(forward.x, -forward.z); // Y rotation (around up)
        const pitch = Math.asin(forward.y);            // X rotation (up/down)

        this.transform.rotation.y = yaw;
        this.transform.rotation.x = pitch;

        this.updateViewMatrix();
    }
}