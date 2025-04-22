import { Transform } from './Transform.js';
import { Vec3 } from '../math/Vec3.js';
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

      this.transform = new Transform(position, rotation, scale);
      this.name = "Game Object";
      
      // Set parent to the root by default
      this.parent = null;
      this.children = [];
      if (WEAVE.scene) {
        WEAVE.scene.add(this);
      }

      this.mesh = null;
      this.visible = true;

      // Automatically updates when we first start rendering
      this.dirty = true;

    }
  
    // Add a child to this GameObject
    add(child) {
      child.parent = this;
      this.children.push(child);
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
        child.dirty = false;
      }


    }

    getWorldMatrix() {
      return this.transform.objectToWorldMatrix;
    }

    // Global position/rotation/scale account for the transform values of parent objects
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

    update() {

    }

    start() {

    }

    fixedUpdate() {
      
    }
  }