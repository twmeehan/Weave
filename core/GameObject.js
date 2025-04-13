import { Transform } from './Transform.js';
import { Vec3 } from '../math/Vec3.js';

export class GameObject {
    constructor(position, rotation, scale) {
      this.transform = new Transform(position, rotation, scale);

      this.name = "Game Object";
      this.children = [];
      this.parent = null;
      this.mesh = null;
      this.visible = true;

      this.updateWorldMatrix();
    }
  
    add(child) {
      child.parent = this;
      this.children.push(child);
      this.updateWorldMatrix();
    }

    setMesh(mesh) {
      this.mesh = mesh;
    }
  
    traverse(callback) {
      callback(this);
      for (const child of this.children) {
        child.traverse(callback);
      }
    }

    // when this object is moved update its underlying Object Space To World Space matrix
    // this should be called whenever transform is updated
    updateWorldMatrix(updateObjectToParentMatrix = true) {
      let parentMatrix = null;
      if (this.parent != null) {
          parentMatrix = this.parent.transform.objectToWorldMatrix;
      }
      if (updateObjectToParentMatrix) {
        this.transform.updateObjectToParentMatrix();
      }
    
      if (parentMatrix) {
        this.transform.objectToWorldMatrix = parentMatrix.clone()
          .multiply(this.transform.objectToParentMatrix);
      } else {
        this.transform.objectToWorldMatrix = this.transform.objectToParentMatrix.clone();
      }

      for (const child of this.children) {
        child.updateWorldMatrix(false);
      }


    }

    getWorldMatrix() {
      return this.transform.objectToWorldMatrix;
    }

    getGlobalPosition() {
      return this.transform.objectToWorldMatrix.multiply(new Vec3(0, 0, 0));
    }

    getGlobalRotation() {
      return this.parent != null ? this.parent.getGlobalRotation().add(this.transform.rotation) : this.transform.rotation;
    }

    getGlobalScale() {
      return this.parent  != null ? this.parent.getGlobalScale().add(this.transform.scale) : this.transform.scale;
    }

    toString() {
      return this.name;
    }
  }