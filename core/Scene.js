import { GameObject } from "./GameObject";
import { GraphicsContext } from "../GraphicsContext";

export class Scene extends GameObject {
    
    constructor() {
        super();
        this.name = "root";
        GraphicsContext.scene = this;

    }
}
