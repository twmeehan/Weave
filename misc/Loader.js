import { Mesh } from "../core/Mesh";
import { Material } from "../core/Material";
import { GameObject } from "../core/GameObject";
import { GraphicsContext as WEAVE} from "../GraphicsContext";
import { Vec3 } from "../math/Vec3";
import { BillboardMesh } from "../core/BillboardMesh";
import { Billboard } from "../objects/Billboard";
/**
 * A simple OBJ and MTL loader for Weave-3D
 */
export class Loader {
  /**
   * Load a texture from a URL and return a WebGL texture object
   * @param {string} url - path to the texture image
   * @returns {Promise<WebGLTexture>}
   */
  static async loadTexture(url) {
    const gl = WEAVE.gl;
    
    return new Promise((resolve, reject) => {
      const texture = gl.createTexture();
      const image = new Image();
      
      image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        
        gl.texImage2D(
          gl.TEXTURE_2D, 0,
          gl.RGBA, gl.RGBA,
          gl.UNSIGNED_BYTE, image
        );
        gl.generateMipmap(gl.TEXTURE_2D);
        
        resolve(texture);
      };
      
      image.onerror = () => {
        reject(new Error(`Failed to load texture: ${url}`));
      };
      
      image.src = url;
    });
  }

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
    const baseURL = new URL(url, window.location.href);
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
            const gl    = WEAVE.gl;
            const image = new Image();
            image.src = new URL(parts.slice(1).join(' '), baseURL).href;

            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(
              gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
              gl.RGBA, gl.UNSIGNED_BYTE,
              new Uint8Array([255, 255, 255, 255])
            );
            materials[current].map = texture;

            image.onload = () => {
              gl.bindTexture(gl.TEXTURE_2D, texture);

              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,     gl.CLAMP_TO_EDGE);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,     gl.CLAMP_TO_EDGE);
              gl.texImage2D(
                gl.TEXTURE_2D, 0,
                gl.RGBA, gl.RGBA,
                gl.UNSIGNED_BYTE, image
              );
              gl.generateMipmap(gl.TEXTURE_2D);
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
        // flush on new object as you already do
        if (finalPos.length) {
          const m = new Mesh(finalPos, finalNorm, finalUV, null);
          m.name    = name;
          m.matName = mat;
          meshes.push(m);
          finalPos = []; finalNorm = []; finalUV = [];
        }
        name = parts[1];
        mat  = null;
        break;

      case 'usemtl':
        // **flush on material change**
        if (finalPos.length) {
          const m = new Mesh(finalPos, finalNorm, finalUV, null);
          m.name    = name;
          m.matName = mat;
          meshes.push(m);
          finalPos = []; finalNorm = []; finalUV = [];
        }
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
        let matName = mesh.matName;
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

  static async loadParticleSystem(objUrl, texture, size) {

    const response = await fetch(objUrl);
    const text = await response.text();
    const lines = text.split('\n');

    let positions = []


    for (let raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const parts = line.split(/\s+/);
      if (parts[0] == 'v') {
        positions.push(...parts.slice(1).map(Number));
        positions.push(...parts.slice(1).map(Number));
        positions.push(...parts.slice(1).map(Number));

      }
    }

    let obj = new Billboard(0.01);
    let mesh = new BillboardMesh(positions,size);
    obj.setMesh(mesh);
    obj.mesh.material = new Material(new Vec3(1,0,0),new Vec3(0,1,0),new Vec3(0,0,1),10);
    obj.setTexture(await this.loadTexture(texture));
    return obj;
  }

  static async loadMeshes(objUrl, mtlUrl = null) {
    let matLib = {};
    if (mtlUrl) {
      matLib = await Loader.loadMTL(mtlUrl);
    }

    const meshes = await Loader.loadOBJ(objUrl);

    meshes.forEach((mesh, i) => {
      let matName = mesh.matName;
      if (matName && matLib[matName]) {
        mesh.material = matLib[matName];

      }

    });

    return meshes;
  }
}
