import { GameObject } from "../core/GameObject";
import { Mesh } from "../core/Mesh";
import { GraphicsContext as WEAVE} from "../GraphicsContext.js";

export class Box extends GameObject {
    
    constructor() {
        const positions = [
            // Front face
            -1, -1,  1,
             1, -1,  1,
             1,  1,  1,
            -1,  1,  1,
            // Back face
            -1, -1, -1,
             1, -1, -1,
             1,  1, -1,
            -1,  1, -1,
          ];
          
          const indices = [
            // Front
            0, 1, 2, 2, 3, 0,
            // Back
            4, 5, 6, 6, 7, 4,
            // Left
            4, 0, 3, 3, 7, 4,
            // Right
            1, 5, 6, 6, 2, 1,
            // Top
            3, 2, 6, 6, 7, 3,
            // Bottom
            4, 5, 1, 1, 0, 4,
          ];

          const normals = [
            // Front
            0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
            // Back
            0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,
            // Left
            -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
            // Right
            1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
            // Top
            0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
            // Bottom
            0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,
          ];
          
        const mesh = new Mesh(WEAVE.gl, positions, normals, indices);
        super();
        this.name = "Box";
        super.setMesh(mesh);

    }
}
