import { GameObject } from "../core/GameObject";
import { Mesh } from "../core/Mesh";
import { GraphicsContext as WEAVE } from "../GraphicsContext.js";
import { Vec3 } from "../math/Vec3.js";

function generateSphere(radius = 1, latBands = 16, longBands = 16) {
  const positions = [];
  const indices = [];

  for (let lat = 0; lat <= latBands; ++lat) {
    const theta = (lat * Math.PI) / latBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let lon = 0; lon < longBands; ++lon) {
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
      const current = lat * longBands + lon;
      const next = current + longBands;

      const nextLon = (lon + 1) % longBands;

      indices.push(current, next, lat * longBands + nextLon);
      indices.push(next, next + nextLon - lon, lat * longBands + nextLon);
    }
  }

  return { positions, indices };
}

function computeVertexNormals(positions, indices) {
  const normals = new Array(positions.length).fill(0);

  for (let i = 0; i < indices.length; i += 3) {
    const i0 = indices[i] * 3;
    const i1 = indices[i + 1] * 3;
    const i2 = indices[i + 2] * 3;

    const p0 = new Vec3(positions[i0], positions[i0 + 1], positions[i0 + 2]);
    const p1 = new Vec3(positions[i1], positions[i1 + 1], positions[i1 + 2]);
    const p2 = new Vec3(positions[i2], positions[i2 + 1], positions[i2 + 2]);

    const edge1 = p1.subtract(p0);
    const edge2 = p2.subtract(p0);
    const faceNormal = edge1.cross(edge2).normalize();

    for (const idx of [i0, i1, i2]) {
      normals[idx]     += faceNormal.x;
      normals[idx + 1] += faceNormal.y;
      normals[idx + 2] += faceNormal.z;
    }
  }

  for (let i = 0; i < normals.length; i += 3) {
    const n = new Vec3(normals[i], normals[i + 1], normals[i + 2]).normalize();
    normals[i]     = -n.x;
    normals[i + 1] = -n.y;
    normals[i + 2] = -n.z;
  }

  return normals;
}

export class Sphere extends GameObject {
  constructor(radius = 1, latBands = 16, longBands = 16) {
    const { positions, indices } = generateSphere(radius, latBands, longBands);
    const normals = computeVertexNormals(positions, indices);
    const mesh = new Mesh(WEAVE.gl, positions, normals, indices);
    super();
    this.name = "Sphere";
    super.setMesh(mesh);
  }
}
