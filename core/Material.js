import { Vec3 } from "../math/Vec3"

export class Material {
    
    constructor(diffuse = new Vec3(1,0,1), specular = new Vec3(1,1,1), shininess = 0) {
        this.diffuse = diffuse
        this.specular = specular
        this.shininess = shininess
    }
}