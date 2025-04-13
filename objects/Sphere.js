import { GameObject } from "../core/GameObject";
import { Mesh } from "../core/Mesh";
import { GraphicsContext as WEAVE } from "../GraphicsContext.js";

function generateSphere(radius = 1, latBands = 16, longBands = 16) {
  const positions = [];
  const indices = [];

  for (let lat = 0; lat <= latBands; ++lat) {
    const theta = (lat * Math.PI) / latBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let lon = 0; lon <= longBands; ++lon) {
      const phi = (lon * 2 * Math.PI) / longBands;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const x = cosPhi * sinTheta;
      const y = cosTheta;
      const z = sinPhi * sinTheta;

      positions.push(radius * x, radius * y, radius * z);
    }
  }

  for (let lat = 0; lat < latBands; ++lat) {
    for (let lon = 0; lon < longBands; ++lon) {
      const first = lat * (longBands + 1) + lon;
      const second = first + longBands + 1;

      indices.push(first, second, first + 1);
      indices.push(second, second + 1, first + 1);
    }
  }

  return { positions, indices };
}

export class Sphere extends GameObject {
    
  constructor(radius = 1, latBands = 16, longBands = 16) {
    const { positions, indices } = generateSphere(radius, latBands, longBands);
    const mesh = new Mesh(WEAVE.gl, positions, indices);
    super();
    this.name = "Sphere";
    super.setMesh(mesh);
  }
}