import { Vec3 } from '../math/Vec3.js';
import { Mat4 } from '../math/Mat4.js';

import { GraphicsContext as WEAVE} from '../GraphicsContext.js';

/*
 * GameObject is a data structure that represents any object in the engine.
 * All GameObjects are part of a scene hierarchy that is defined by the 
 * parent-child attributes. It is through this hierarchy that update calls
 * are distributed. In addition, GameObjects may have an attached Mesh which
 * will automatically be rendered.
 * 
 * For custom behavior, GameObjects have update() and start() functions which
 * can be modified.
 */
export class GameObject {

    constructor(position, rotation, scale) {

      this.position = position ? position : new Vec3();
      this.rotation = rotation ? rotation : new Vec3();
      this.scale = scale ? scale : new Vec3(1, 1, 1);
      this.lastTransformHash = this.computeTransformHash()
      this.stopped = false;

      // this is used to calculate objectToWorldMatrix
      this.objectToParentMatrix = new Mat4();

      // this is used by the rendering pipeline
      this.objectToWorldMatrix = new Mat4();  
      
      // this is used by the rendering pipeline to ensure the normals are facing the right direction
      this.normalMatrix = new Mat4();

      this.name = "Game Object";
      
      // Set parent to the root by default
      this.parent = null;
      this.children = [];
      
      this.depth = 0;
      if (WEAVE.scene) {
        WEAVE.scene.add(this);
      }

      this.visible = true;

    }
  
    // Add a child to this GameObject
    add(child) {
      if (child.parent && child.parent !== this) {
        const index = child.parent.children.indexOf(child);
        if (index !== -1) {
            child.parent.children.splice(index, 1);
        }
      }
      child.parent = this;
      if (!this.children.includes(child)) {
        this.children.push(child);
      }
      child.depth = this.depth + 1;
      this.updateWorldMatrix();
    }

    setMesh(mesh) {
      this.mesh = mesh;
    }
  
    // Calls a function for all child objects
    traverse(callback) {
      callback(this);
      for (const child of this.children) {
        child.traverse(callback);
      }
    }

    // When this object is moved update its underlying Object Space To World Space matrix.
    // This should be called whenever transform is updated.
    updateWorldMatrix(updateObjectToParentMatrix = true) {
      let parentMatrix = null;
      if (this.parent != null) {
          parentMatrix = this.parent.objectToWorldMatrix;
      }
      if (updateObjectToParentMatrix) {
        this.updateObjectToParentMatrix();
      }
    
      if (parentMatrix) {
        this.objectToWorldMatrix = parentMatrix.clone()
          .multiply(this.objectToParentMatrix);
      } else {
        this.objectToWorldMatrix = this.objectToParentMatrix.clone();
      }

      this.normalMatrix = this.objectToWorldMatrix
        .clone()
        .inverse()
        .transpose();

      for (const child of this.children) {
        child.updateWorldMatrix(false);
        child.dirty = false;
      }


    }

    getWorldMatrix() {
      return this.objectToWorldMatrix;
    }

    // Global position/rotation/scale account for the transform values of parent objects
    getGlobalPosition() {
      return this.objectToWorldMatrix.multiply(new Vec3(0, 0, 0));
    }

    getGlobalRotation() {
      return this.parent != null ? this.parent.getGlobalRotation().add(this.rotation) : this.rotation;
    }

    getGlobalScale() {
      return this.parent  != null ? this.parent.getGlobalScale().add(this.scale) : this.scale;
    }

    toString() {
      return this.name;
    }

    updateObjectToParentMatrix() {
      const t = Mat4.identity()
        .translate(this.position)
        .rotate(this.rotation)
        .scale(this.scale);
      
      this.objectToParentMatrix = t;
    }

    update(dt) {

    }

    start() {

    }

    draw() {
      this.mesh.draw();
    }

    isDirty() {
      const currentHash = this.computeTransformHash();
      const dirty = currentHash !== this.lastTransformHash;
      this.lastTransformHash = currentHash;
      return dirty;
    }

    computeTransformHash() {
      return `${this.position.x},${this.position.y},${this.position.z}|` +
            `${this.rotation.x},${this.rotation.y},${this.rotation.z}|` +
            `${this.scale.x},${this.scale.y},${this.scale.z}`;
    }
      

  }