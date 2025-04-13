import { Vec3 } from "../math/Vec3.js";
import { Mat4 } from "../math/Mat4.js";

/*
 * TODO: remove this class and move into GameObject
 */
export class Transform {
    constructor(position, rotation, scale) {
      this.position = position ? position : new Vec3();
      this.rotation = rotation ? rotation : new Vec3();
      this.scale = scale ? scale : new Vec3(1, 1, 1);

      // this is used to calculate objectToWorldMatrix
      this.objectToParentMatrix = new Mat4();

      // this is used by the rendering pipeline
      this.objectToWorldMatrix = new Mat4();

    }
  
    updateObjectToParentMatrix() {
      const t = Mat4.identity()
        .translate(this.position)
        .rotate(this.rotation)
        .scale(this.scale);
  
      this.objectToParentMatrix = t;
    }

  }