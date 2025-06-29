import { GameObject } from "../core/GameObject.js";
import { BillboardMesh } from "../core/BillboardMesh.js";

export class Billboard extends GameObject {
  
  constructor(size = 1.0) {
    super();
    this.name = "Billboard";
    const positions = [
      // Triangle 1
       0, 0, 0,  // bottom-left
       0, 0, 0,  // bottom-right
       0, 0, 0,  // top-right

    ];
    this.mesh = new BillboardMesh(positions,size);
    this.setMesh(this.mesh);
  }

  
  setTexture(texture) {
    this.mesh.material.map = texture;
  }
  
  setSize(size) {
    this.mesh.size = size;
  }
  
  getSize() {
    return this.mesh.size;
  }
  
  getMaterial() {
    return this.mesh.material;
  }
}
