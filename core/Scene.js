import { GameObject } from "./GameObject";
import { GraphicsContext } from "../GraphicsContext";

/*
 * Scene is the root node that all other objects are children of
 */
export class Scene extends GameObject {
    
    constructor() {
        super();
        this.name = "root";
        GraphicsContext.scene = this;

    }
}
