import { GraphicsContext as WEAVE} from '../GraphicsContext.js';
import { GameObject } from './GameObject.js';
import { Vec3 } from '../math/Vec3.js';

export const LightType = {
  AMBIENT:     0,
  DIRECTIONAL: 1,
};

export class Light extends GameObject{

    constructor(lightType, color, intensity) {
        super(new Vec3(), new Vec3(), new Vec3());
        this.type = lightType;
        this.color = color;
        this.intensity = intensity;
    }

    draw(i) {
        const gl = WEAVE.gl;
        const program = gl.getParameter(gl.CURRENT_PROGRAM);
        const prefix = `uLights[${i}]`;

        gl.uniform1i(
            gl.getUniformLocation(program, `${prefix}.type`),
            this.type
          );
        gl.uniform3fv(
            gl.getUniformLocation(program, `${prefix}.color`),
            this.color.toArray()
          );
        gl.uniform1f(
            gl.getUniformLocation(program, `${prefix}.intensity`),
            this.intensity
          );

        if (this.type == LightType.DIRECTIONAL) {
            gl.uniform3fv(
                gl.getUniformLocation(program, `${prefix}.direction`),
                this.direction.toArray()
              );
        }

    }
}