import { GameObject } from "../core/GameObject.js";
import { BillboardMesh } from "../core/BillboardMesh.js";

export class Billboard extends GameObject {
  
  constructor(position, size = 1.0) {
    super(position);
    this.name = "Billboard";
    
    this.mesh = new BillboardMesh(size);
    this.setMesh(this.mesh);
  }
  
  setTexture(texture) {
    this.mesh.material.map = texture;
  }
  
  setSize(size) {
    this.mesh.size = size;
  }
  
  getMaterial() {
    return this.mesh.material;
  }
}
