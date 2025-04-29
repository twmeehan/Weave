import { Light, LightType } from "../core/Light";

export class AmbientLight extends Light {

    constructor(color, intensity) {
        super(LightType.AmbientLight, color, intensity);
        this.name = "Ambient Light";
    }
}