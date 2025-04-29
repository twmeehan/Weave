import { Mesh } from "../core/Mesh";
import { Material } from "../core/Material";
import { GameObject } from "../core/GameObject";
import { GraphicsContext as WEAVE} from "../GraphicsContext";
import { Vec3 } from "../math/Vec3";
/**
 * A simple OBJ and MTL loader for Weave-3D
 */
export class Loader {
  /**
   * Load and parse a .mtl file, returning a map of material name → Material
   * @param {string} url - path to the .mtl file
   * @returns {Promise<Object<string, Material>>}
   */
  static async loadMTL(url) {
    const response = await fetch(url);
    const text = await response.text();
    const lines = text.split('\n');
    const materials = {};
    let current = null;

    for (let raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const parts = line.split(/\s+/);
      switch (parts[0]) {
        case 'newmtl':
          current = parts[1];
          materials[current] = new Material();
          break;
        case 'Kd':
          if (current) {
            materials[current].diffuse = new Vec3(parseFloat(parts[1]),parseFloat(parts[2]),parseFloat(parts[3]));
          }
          break;
        case 'Ks':
            if (current) {
              materials[current].specular = new Vec3(parseFloat(parts[1]),parseFloat(parts[2]),parseFloat(parts[3]));
            }
            break;
        case 'Ns':
            if (current) {
                materials[current].shininess = parseFloat(parts[1])/10;
            }
            break;
        case 'map_Kd':
          if (current) {
            const gl = WEAVE.gl;
            const image = new Image();
            image.src = parts[1];
            const texture = gl.createTexture();
            image.onload = () => {
                gl.bindTexture(gl.TEXTURE_2D, texture); // Bind the texture
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                materials[current].map = texture;
              };
          }
          break;
      }
    }

    return materials;
  }

  /**
   * Load and parse a .obj file, returning a Mesh (with UV support)
   * @param {string} url - path to the .obj file
   * @returns {Promise<Mesh[]>}
   */
  static async loadOBJ(url) {
    const response = await fetch(url);
    const text = await response.text();
    let objPos = [], objNorm = [], objUV = [];
    let finalPos = [], finalNorm = [], finalUV = [];
    const lines = text.split('\n');

    let name = null;
    let meshes = [];
    let mat = null;


    for (let raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const parts = line.split(/\s+/);
      switch (parts[0]) {
        case 'o':
          if (finalPos.length > 0) {
            let mesh = new Mesh(finalPos, finalNorm, finalUV, null);
            mesh.name = name;
            meshes.push(mesh);
            if (mat)
              mesh.matName = mat;
            
          }
          finalPos = [], finalNorm = [], finalUV = [];
          mat = null;
          name = parts[1];
          break;
        case 'usemtl':
          mat = parts[1];
          break;
        case 'v':
          objPos.push(parts.slice(1).map(Number));
          break;
        case 'vn':
          objNorm.push(parts.slice(1).map(Number));
          break;
        case 'vt':
          objUV.push(parts.slice(1).map(Number));
          break;
        case 'f': {
          const face = parts.slice(1).map(p => p.split('/').map(i => i ? parseInt(i, 10) - 1 : undefined));
          for (let i = 1; i < face.length - 1; ++i) {
            [0, i, i + 1].forEach(j => {
              const [vi, uvi, ni] = face[j];
              finalPos.push(...objPos[vi]);
              if (ni !== undefined) finalNorm.push(...objNorm[ni]);
              if (uvi !== undefined) finalUV.push(...objUV[uvi]);
            });
          }
          break;
        }
      }
    }

    let mesh = new Mesh(finalPos, finalNorm, finalUV, null);
    mesh.name = name;
    if (mat)
      mesh.matName = mat;
    meshes.push(mesh);
            
    return meshes;
  }

  /**
   * Load an OBJ with optional MTL and return a GameObject
   * @param {string} objUrl - path to the OBJ
   * @param {string|null} mtlUrl - path to the MTL (optional)
   * @returns {Promise<GameObject>}
   */
  static async loadObject(objUrl, mtlUrl = null) {
    const gl = WEAVE.gl;
    let matLib = {};
    if (mtlUrl) {
      matLib = await Loader.loadMTL(mtlUrl);
    }

    const meshes = await Loader.loadOBJ(objUrl);

    let parent = null;
    if (meshes.length > 1) {
      parent = new GameObject();
      parent.name = objUrl.split('/').pop().replace(/\.\w+$/, '');

      meshes.forEach((mesh, i) => {
        const matName = mesh.matName;
        if (matName && matLib[matName]) {
          mesh.material = matLib[matName];
        }

        const child = new GameObject();
        child.name = mesh.name || `submesh_${i}`;
        child.setMesh(mesh);
        parent.add(child);
      });
    } else {
        const matName = meshes[0].matName;

        if (matName && matLib[matName]) {
          meshes[0].material = matLib[matName];
        }

        

        parent = new GameObject();
        parent.name = meshes[0].name || "Game Object";
        parent.mesh = meshes[0];
    }

    return parent;
  }
}
