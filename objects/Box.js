import { GameObject } from "../core/GameObject";
import { Mesh } from "../core/Mesh";
import { GraphicsContext as WEAVE} from "../GraphicsContext.js";

export class Box extends GameObject {
    
    constructor() {
        
      const positions = [
        // Front face (0,0,1)
        -1, -1,  1,
         1, -1,  1,
         1,  1,  1,
         1,  1,  1,
        -1,  1,  1,
        -1, -1,  1,

        // Back face (0,0,-1)
        1, -1, -1,
        -1, -1, -1,
        -1,  1, -1,
        -1,  1, -1,
        1,  1, -1,
        1, -1, -1,

        // Left face (-1,0,0)
        -1, -1, -1,
        -1, -1,  1,
        -1,  1,  1,
        -1,  1,  1,
        -1,  1, -1,
        -1, -1, -1,

        // Right face (1,0,0)
        1, -1,  1,
        1, -1, -1,
        1,  1, -1,
        1,  1, -1,
        1,  1,  1,
        1, -1,  1,

        // Top face (0,1,0)
        -1,  1,  1,
         1,  1,  1,
         1,  1, -1,
         1,  1, -1,
        -1,  1, -1,
        -1,  1,  1,

        // Bottom face (0,-1,0)
        -1, -1, -1,
         1, -1, -1,
         1, -1,  1,
         1, -1,  1,
        -1, -1,  1,
        -1, -1, -1,
      ];

      const normals = [
        // Front
        0, 0, 1,  0, 0, 1,  0, 0, 1,
        0, 0, 1,  0, 0, 1,  0, 0, 1,
        // Back
        0, 0, -1,  0, 0, -1,  0, 0, -1,
        0, 0, -1,  0, 0, -1,  0, 0, -1,
        // Left
        -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
        -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
        // Right
        1, 0, 0,  1, 0, 0,  1, 0, 0,
        1, 0, 0,  1, 0, 0,  1, 0, 0,
        // Top
        0, 1, 0,  0, 1, 0,  0, 1, 0,
        0, 1, 0,  0, 1, 0,  0, 1, 0,
        // Bottom
        0, -1, 0,  0, -1, 0,  0, -1, 0,
        0, -1, 0,  0, -1, 0,  0, -1, 0,
      ];
          
      const mesh = new Mesh(WEAVE.gl, positions, normals);
      super();
      this.name = "Box";
      super.setMesh(mesh);

    }
}
