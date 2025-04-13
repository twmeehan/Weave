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
          
        const mesh = new Mesh(WEAVE.gl, positions, indices);
        super();
        this.name = "Box";
        super.setMesh(mesh);

    }
}
