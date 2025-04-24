import { Light, LightType } from "../core/Light";

export class DirectionalLight extends Light {

    constructor(direction, color, intensity) {
        super(LightType.DIRECTIONAL, color,intensity);
        this.direction = direction;
    }
}