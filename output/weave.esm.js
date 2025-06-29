/*
 * Represents a 3 element vector
 */
class Vec3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static zeros() {
    return new Vec3();
  }

  clone() {
    return new Vec3(this.x, this.y, this.z);
  }

  add(v) {
    return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  subtract(v) {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  multiply(v) {
    if (v instanceof Vec3) {
      return new Vec3(this.x * v.x, this.y * v.y, this.z * v.z);
    }
    return new Vec3(this.x * v, this.y * v, this.z * v);
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  
  lengthSq() {
    return this.x*this.x 
         + this.y*this.y 
         + this.z*this.z;
  }

  normalize() {
    const len = this.length();
    return len > 0 ? this.multiply(1 / len) : this.clone();
  }

  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v) {
    const x = this.y * v.z - this.z * v.y;
    const y = this.z * v.x - this.x * v.z;
    const z = this.x * v.y - this.y * v.x;
    return new Vec3(x, y, z);
  }

  toArray() {
    return [this.x, this.y, this.z];
  }

  toString() {
    return `[${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)}]`;
  }

  negate() {
    return this.multiply(-1);

  }
}

/*
 * Represents a 4 element vector
 */
class Vec4 {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  clone() {
    return new Vec4(this.x, this.y, this.z, this.w);
  }

  add(v) {
    return new Vec4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
  }

  subtract(v) {
    return new Vec4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
  }

  multiply(v) {
    if (v instanceof Vec4) {
      return new Vec4(this.x * v.x, this.y * v.y, this.z * v.z, this.w * v.w);
    }
    return new Vec4(this.x * v, this.y * v, this.z * v, this.w * v);
  }

  length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2 + this.w ** 2);
  }
  lengthSq() {
    return this.x*this.x 
         + this.y*this.y 
         + this.z*this.z
         + this.w*this.w;
  }

  normalize() {
    const len = this.length();
    return len > 0 ? this.multiply(1 / len) : this.clone();
  }

  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }

  toArray() {
    return [this.x, this.y, this.z, this.w];
  }

  toString() {
    return `[${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)}, ${this.w.toFixed(2)}]`;
  }

  negate() {
    return this.multiply(-1);
  }
}

/*
 * Represents a 4x4 matrix in row-vector order
 */
class Mat4 {
  constructor(...args) {
    if (args.length === 1 && (Array.isArray(args[0]) || args[0] instanceof Float32Array)) {
      this.elements = new Float32Array(args[0]);
    } else {

      this.elements = new Float32Array([
        args[0] !== undefined ? args[0] : 1, args[1] !== undefined ? args[1] : 0, args[2] !== undefined ? args[2] : 0, args[3] !== undefined ? args[3] : 0,
        args[4] !== undefined ? args[4] : 0, args[5] !== undefined ? args[5] : 1, args[6] !== undefined ? args[6] : 0, args[7] !== undefined ? args[7] : 0,
        args[8] !== undefined ? args[8] : 0, args[9] !== undefined ? args[9] : 0, args[10] !== undefined ? args[10] : 1, args[11] !== undefined ? args[11] : 0,
        args[12] !== undefined ? args[12] : 0, args[13] !== undefined ? args[13] : 0, args[14] !== undefined ? args[14] : 0, args[15] !== undefined ? args[15] : 1
      ]);
    }
  }

  static fromArray(arr) {
    return new Mat4(arr);
  }

  static identity() {
    return new Mat4([
      1, 0, 0, 0,  
      0, 1, 0, 0,  
      0, 0, 1, 0,  
      0, 0, 0, 1   
    ]);
  }

  static zeros() {
    return new Mat4(new Array(16).fill(0));
  }

  clone() {
    return Mat4.fromArray(this.elements);
  }

  // Multiply this matrix by a scalar, vector, or matrix
  multiply(m) {
    // Vec4 
    if (m instanceof Vec4) {
      const e = this.elements;
      return new Vec4(
        e[0] * m.x + e[1] * m.y + e[2] * m.z + e[3] * m.w,
        e[4] * m.x + e[5] * m.y + e[6] * m.z + e[7] * m.w,
        e[8] * m.x + e[9] * m.y + e[10] * m.z + e[11] * m.w,
        e[12] * m.x + e[13] * m.y + e[14] * m.z + e[15] * m.w
      );

    // Vec3
    } else if (m instanceof Vec3) {
      const e = this.elements;
      // Same as Vec4 but uses w = 1
      const x = e[0] * m.x + e[1] * m.y + e[2] * m.z + e[3];
      const y = e[4] * m.x + e[5] * m.y + e[6] * m.z + e[7];
      const z = e[8] * m.x + e[9] * m.y + e[10] * m.z + e[11];
      e[12] * m.x + e[13] * m.y + e[14] * m.z + e[15];
        
      return new Vec3(x, y, z);

    // Mat4
    } else if (m instanceof Mat4) {

      const a = this.elements;
      const b = m.elements;
      const result = new Float32Array(16);

      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          let sum = 0;
          for (let k = 0; k < 4; k++) {
            sum += a[i*4 + k] * b[k*4 + j];
          }
          result[i*4 + j] = sum;
        }
      }

      return new Mat4(result);

    // Scalar  
    } else {
      // TODO: handle errors
      const result = new Float32Array(16);
      for (let i = 0; i < 16; i++) {
        result[i] = this.elements[i] * m;
      }
      return new Mat4(result);
    }
  }

  // Return the underlying array.
  toArray() {
    return this.elements;
  }

  toString() {
    const e = this.elements;
    return (
      `[ ${e[0].toFixed(2)}  ${e[1].toFixed(2)}  ${e[2].toFixed(2)}  ${e[3].toFixed(2)} ]\n` +
      `[ ${e[4].toFixed(2)}  ${e[5].toFixed(2)}  ${e[6].toFixed(2)}  ${e[7].toFixed(2)} ]\n` +
      `[ ${e[8].toFixed(2)}  ${e[9].toFixed(2)}  ${e[10].toFixed(2)}  ${e[11].toFixed(2)} ]\n` +
      `[ ${e[12].toFixed(2)}  ${e[13].toFixed(2)}  ${e[14].toFixed(2)}  ${e[15].toFixed(2)} ]`
    );
  }

  // TODO: make these more efficient:


  // translate this matrix by Vec3 v
  translate(v) {
    // [1, 0, 0, tx]
    // [0, 1, 0, ty]
    // [0, 0, 1, tz]
    // [0, 0, 0, 1 ]
    const t = Mat4.identity();
    t.elements[3] = v.x;
    t.elements[7] = v.y;
    t.elements[11] = v.z;
    return this.multiply(t);
  }

  // scale this matrix by Vec3 v
  scale(v) {
    // [sx, 0,  0,  0]
    // [0,  sy, 0,  0]
    // [0,  0,  sz, 0]
    // [0,  0,  0,  1]
    const s = Mat4.identity();
    s.elements[0] = v.x;
    s.elements[5] = v.y;
    s.elements[10] = v.z;
    return this.multiply(s);
  }

  // rotate this matrix by Vec3 v
  rotate(v) {
    const { x, y, z } = v; // x = pitch, y = yaw, z = roll
  
    const cx = Math.cos(x), sx = Math.sin(x);
    const cy = Math.cos(y), sy = Math.sin(y);
    const cz = Math.cos(z), sz = Math.sin(z);
  
    const m00 = cy * cz + sy * sx * sz;
    const m01 = -cy * sz + sy * sx * cz;
    const m02 = sy * cx;
  
    const m10 = cx * sz;
    const m11 = cx * cz;
    const m12 = -sx;
  
    const m20 = -sy * cz + cy * sx * sz;
    const m21 = sy * sz + cy * sx * cz;
    const m22 = cy * cx;
  
    return this.multiply(new Mat4(
        m00, m01, m02, 0,
        m10, m11, m12, 0,
        m20, m21, m22, 0,
        0,    0,   0,  1
      ));  }

  transpose() {
    const e = this.elements;
    const t = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        t[i * 4 + j] = e[j * 4 + i];
      }
    }
    return new Mat4(t);
  }

  negate() {
    return this.multiply(-1);
  }

  inverse() {
    const m = this.elements;
    const inv = new Float32Array(16);
  
    inv[0]  = m[5]  * m[10] * m[15] -
              m[5]  * m[11] * m[14] -
              m[9]  * m[6]  * m[15] +
              m[9]  * m[7]  * m[14] +
              m[13] * m[6]  * m[11] -
              m[13] * m[7]  * m[10];
  
    inv[1]  = -m[1]  * m[10] * m[15] +
              m[1]  * m[11] * m[14] +
              m[9]  * m[2]  * m[15] -
              m[9]  * m[3]  * m[14] -
              m[13] * m[2]  * m[11] +
              m[13] * m[3]  * m[10];
  
    inv[2]  = m[1]  * m[6] * m[15] -
              m[1]  * m[7] * m[14] -
              m[5]  * m[2] * m[15] +
              m[5]  * m[3] * m[14] +
              m[13] * m[2] * m[7] -
              m[13] * m[3] * m[6];
  
    inv[3]  = -m[1]  * m[6] * m[11] +
              m[1]  * m[7] * m[10] +
              m[5]  * m[2] * m[11] -
              m[5]  * m[3] * m[10] -
              m[9]  * m[2] * m[7] +
              m[9]  * m[3] * m[6];
  
    inv[4]  = -m[4]  * m[10] * m[15] +
              m[4]  * m[11] * m[14] +
              m[8]  * m[6]  * m[15] -
              m[8]  * m[7]  * m[14] -
              m[12] * m[6]  * m[11] +
              m[12] * m[7]  * m[10];
  
    inv[5]  = m[0]  * m[10] * m[15] -
              m[0]  * m[11] * m[14] -
              m[8]  * m[2]  * m[15] +
              m[8]  * m[3]  * m[14] +
              m[12] * m[2]  * m[11] -
              m[12] * m[3]  * m[10];
  
    inv[6]  = -m[0]  * m[6] * m[15] +
              m[0]  * m[7] * m[14] +
              m[4]  * m[2] * m[15] -
              m[4]  * m[3] * m[14] -
              m[12] * m[2] * m[7] +
              m[12] * m[3] * m[6];
  
    inv[7]  = m[0]  * m[6] * m[11] -
              m[0]  * m[7] * m[10] -
              m[4]  * m[2] * m[11] +
              m[4]  * m[3] * m[10] +
              m[8]  * m[2] * m[7] -
              m[8]  * m[3] * m[6];
  
    inv[8]  = m[4]  * m[9] * m[15] -
              m[4]  * m[11] * m[13] -
              m[8]  * m[5] * m[15] +
              m[8]  * m[7] * m[13] +
              m[12] * m[5] * m[11] -
              m[12] * m[7] * m[9];
  
    inv[9]  = -m[0]  * m[9] * m[15] +
              m[0]  * m[11] * m[13] +
              m[8]  * m[1] * m[15] -
              m[8]  * m[3] * m[13] -
              m[12] * m[1] * m[11] +
              m[12] * m[3] * m[9];
  
    inv[10] = m[0]  * m[5] * m[15] -
              m[0]  * m[7] * m[13] -
              m[4]  * m[1] * m[15] +
              m[4]  * m[3] * m[13] +
              m[12] * m[1] * m[7] -
              m[12] * m[3] * m[5];
  
    inv[11] = -m[0]  * m[5] * m[11] +
              m[0]  * m[7] * m[9] +
              m[4]  * m[1] * m[11] -
              m[4]  * m[3] * m[9] -
              m[8]  * m[1] * m[7] +
              m[8]  * m[3] * m[5];
  
    inv[12] = -m[4]  * m[9] * m[14] +
              m[4]  * m[10] * m[13] +
              m[8]  * m[5] * m[14] -
              m[8]  * m[6] * m[13] -
              m[12] * m[5] * m[10] +
              m[12] * m[6] * m[9];
  
    inv[13] = m[0]  * m[9] * m[14] -
              m[0]  * m[10] * m[13] -
              m[8]  * m[1] * m[14] +
              m[8]  * m[2] * m[13] +
              m[12] * m[1] * m[10] -
              m[12] * m[2] * m[9];
  
    inv[14] = -m[0]  * m[5] * m[14] +
              m[0]  * m[6] * m[13] +
              m[4]  * m[1] * m[14] -
              m[4]  * m[2] * m[13] -
              m[12] * m[1] * m[6] +
              m[12] * m[2] * m[5];
  
    inv[15] = m[0]  * m[5] * m[10] -
              m[0]  * m[6] * m[9] -
              m[4]  * m[1] * m[10] +
              m[4]  * m[2] * m[9] +
              m[8]  * m[1] * m[6] -
              m[8]  * m[2] * m[5];
  
    let det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
  
    if (det === 0) {
      console.error("Matrix inversion error: determinant is 0");
      return Mat4.identity();
    }
  
    det = 1.0 / det;
    for (let i = 0; i < 16; i++) {
      inv[i] = inv[i] * det;
    }
  
    return new Mat4(inv);
  }


  
}

/*
 * Most classes in this library cannot directly access weave-3d.js
 * without creating circular dependancies. Therefore this class is
 * used to get a static reference to important objects. This can be
 * imported as WEAVE to make it easier
 */
class GraphicsContext {
    static gl = null;
    static scene = null;
    static billboardProgram = null;
    static program = null;
  
    static setGL(context, scene, billboardProgram, program) {
      this.gl = context;
      this.scene = scene;
      this.billboardProgram = billboardProgram;
      this.program = program;
    }
  
    static getGL() {
      if (!this.gl) throw new Error("GL context not initialized.");
      return this.gl;
    }
  }

/*
 * GameObject is a data structure that represents any object in the engine.
 * All GameObjects are part of a scene hierarchy that is defined by the 
 * parent-child attributes. It is through this hierarchy that update calls
 * are distributed. In addition, GameObjects may have an attached Mesh which
 * will automatically be rendered.
 * 
 * For custom behavior, GameObjects have update() and start() functions which
 * can be modified.
 */
class GameObject {

    constructor(position, rotation, scale) {

      this.position = position ? position : new Vec3();
      this.rotation = rotation ? rotation : new Vec3();
      this.scale = scale ? scale : new Vec3(1, 1, 1);
      this.lastTransformHash = this.computeTransformHash();
      this.stopped = false;

      // this is used to calculate objectToWorldMatrix
      this.objectToParentMatrix = new Mat4();

      // this is used by the rendering pipeline
      this.objectToWorldMatrix = new Mat4();  
      
      // this is used by the rendering pipeline to ensure the normals are facing the right direction
      this.normalMatrix = new Mat4();

      this.name = "Game Object";
      
      // Set parent to the root by default
      this.parent = null;
      this.children = [];
      
      this.depth = 0;
      if (GraphicsContext.scene) {
        GraphicsContext.scene.add(this);
      }

      this.visible = true;

    }
  
    // Add a child to this GameObject
    add(child) {
      if (child.parent && child.parent !== this) {
        const index = child.parent.children.indexOf(child);
        if (index !== -1) {
            child.parent.children.splice(index, 1);
        }
      }
      child.parent = this;
      if (!this.children.includes(child)) {
        this.children.push(child);
      }
      child.depth = this.depth + 1;
      this.updateWorldMatrix();
    }

    setMesh(mesh) {
      this.mesh = mesh;
    }
  
    // Calls a function for all child objects
    traverse(callback) {
      callback(this);
      for (const child of this.children) {
        child.traverse(callback);
      }
    }

    // When this object is moved update its underlying Object Space To World Space matrix.
    // This should be called whenever transform is updated.
    updateWorldMatrix(updateObjectToParentMatrix = true) {
      let parentMatrix = null;
      if (this.parent != null) {
          parentMatrix = this.parent.objectToWorldMatrix;
      }
      if (updateObjectToParentMatrix) {
        this.updateObjectToParentMatrix();
      }
    
      if (parentMatrix) {
        this.objectToWorldMatrix = parentMatrix.clone()
          .multiply(this.objectToParentMatrix);
      } else {
        this.objectToWorldMatrix = this.objectToParentMatrix.clone();
      }

      this.normalMatrix = this.objectToWorldMatrix
        .clone()
        .inverse()
        .transpose();

      for (const child of this.children) {
        child.updateWorldMatrix(false);
        child.dirty = false;
      }


    }

    getWorldMatrix() {
      return this.objectToWorldMatrix;
    }

    // Global position/rotation/scale account for the transform values of parent objects
    getGlobalPosition() {
      return this.objectToWorldMatrix.multiply(new Vec3(0, 0, 0));
    }

    getGlobalRotation() {
      return this.parent != null ? this.parent.getGlobalRotation().add(this.rotation) : this.rotation;
    }

    getGlobalScale() {
      return this.parent  != null ? this.parent.getGlobalScale().add(this.scale) : this.scale;
    }

    toString() {
      return this.name;
    }

    updateObjectToParentMatrix() {
      const t = Mat4.identity()
        .translate(this.position)
        .rotate(this.rotation)
        .scale(this.scale);
      
      this.objectToParentMatrix = t;
    }

    update(dt) {

    }

    start() {

    }

    draw() {
      this.mesh.draw();
    }

    isDirty() {
      const currentHash = this.computeTransformHash();
      const dirty = currentHash !== this.lastTransformHash;
      this.lastTransformHash = currentHash;
      return dirty;
    }

    computeTransformHash() {
      return `${this.position.x},${this.position.y},${this.position.z}|` +
            `${this.rotation.x},${this.rotation.y},${this.rotation.z}|` +
            `${this.scale.x},${this.scale.y},${this.scale.z}`;
    }
      

  }

class Material {
    
    constructor(diffuse = new Vec3(1,1,1), specular = new Vec3(1,1,1), shininess = 0) {
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
    }
}

class Mesh {

  constructor(positions, normals, uvs = [], indices = null) {
                
    const gl = GraphicsContext.gl;
    this.vertexCount = indices ? indices.length : positions.length / 3;
    this.useIndices = !!indices;
    this.material = new Material();
    
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    
    // Position buffer
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const program = GraphicsContext.program;
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

    // Normal buffer  
    this.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    const aNormal = gl.getAttribLocation(program, 'aNormal');
    gl.enableVertexAttribArray(aNormal);
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
    
    if (uvs.length > 0) {
      this.uvBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
      const aUV = gl.getAttribLocation(program, 'aUV');
      if (aUV !== -1) {
        gl.enableVertexAttribArray(aUV);
        gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 0, 0);
      }
    }

    // Index buffer (optional)
    if (this.useIndices) {
      this.indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    }
    
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    if (this.useIndices) gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }
  
  // Call this for every render frame
  draw() {

    const gl = GraphicsContext.gl;
    const program = gl.getParameter(gl.CURRENT_PROGRAM);

    gl.uniform3fv(
      gl.getUniformLocation(program, "uMaterial.diffuse"),
      this.material.diffuse.toArray()
    );
    gl.uniform3fv(
      gl.getUniformLocation(program, "uMaterial.specular"),
      this.material.specular.toArray()
    );
    gl.uniform1f(
      gl.getUniformLocation(program, "uMaterial.shininess"),
      this.material.shininess
    );

    const hasTexLoc = gl.getUniformLocation(program, "uMaterial.hasTexture");
    if (this.material.map) {
      // bind to texture unit 0
      gl.activeTexture(gl.TEXTURE0); // Select texture unit 0
      gl.bindTexture(gl.TEXTURE_2D, this.material.map);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,     gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,     gl.CLAMP_TO_EDGE);
      gl.generateMipmap(gl.TEXTURE_2D);
      // point the sampler at unit 0
      const texLoc = gl.getUniformLocation(program, "uTexture");
      gl.uniform1i(texLoc, 0);

      gl.uniform1i(hasTexLoc, 1);
    } else {
      gl.uniform1i(hasTexLoc, 0);
    }


    gl.bindVertexArray(this.vao);
    
    // Choose the right draw call based on whether we're using indices
    if (this.useIndices) {
      gl.drawElements(gl.TRIANGLES, this.vertexCount, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
    }
    
    // Clean up (optional)
    gl.bindVertexArray(null);
  }
}

class Box extends GameObject {
    
    constructor() {
        
      const positions = [
        // Front face (0,0,1)
        -1, -1,  1,
         1, -1,  1,
         1,  1,  1,
         1,  1,  1,
        -1,  1,  1,
        -1, -1,  1,

        // Back face (0,0,-1)
        1, -1, -1,
        -1, -1, -1,
        -1,  1, -1,
        -1,  1, -1,
        1,  1, -1,
        1, -1, -1,

        // Left face (-1,0,0)
        -1, -1, -1,
        -1, -1,  1,
        -1,  1,  1,
        -1,  1,  1,
        -1,  1, -1,
        -1, -1, -1,

        // Right face (1,0,0)
        1, -1,  1,
        1, -1, -1,
        1,  1, -1,
        1,  1, -1,
        1,  1,  1,
        1, -1,  1,

        // Top face (0,1,0)
        -1,  1,  1,
         1,  1,  1,
         1,  1, -1,
         1,  1, -1,
        -1,  1, -1,
        -1,  1,  1,

        // Bottom face (0,-1,0)
        -1, -1, -1,
         1, -1, -1,
         1, -1,  1,
         1, -1,  1,
        -1, -1,  1,
        -1, -1, -1,
      ];

      const normals = [
        // Front
        0, 0, 1,  0, 0, 1,  0, 0, 1,
        0, 0, 1,  0, 0, 1,  0, 0, 1,
        // Back
        0, 0, -1,  0, 0, -1,  0, 0, -1,
        0, 0, -1,  0, 0, -1,  0, 0, -1,
        // Left
        -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
        -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
        // Right
        1, 0, 0,  1, 0, 0,  1, 0, 0,
        1, 0, 0,  1, 0, 0,  1, 0, 0,
        // Top
        0, 1, 0,  0, 1, 0,  0, 1, 0,
        0, 1, 0,  0, 1, 0,  0, 1, 0,
        // Bottom
        0, -1, 0,  0, -1, 0,  0, -1, 0,
        0, -1, 0,  0, -1, 0,  0, -1, 0,
      ];

      const uvs = [
        // Front
        0, 0, 1, 0, 1, 1,
        1, 1, 0, 1, 0, 0,
        // Back (flipped horizontally)
        1, 0, 0, 0, 0, 1,
        0, 1, 1, 1, 1, 0,
        // Left
        1, 0, 0, 0, 0, 1,
        0, 1, 1, 1, 1, 0,
        // Right
        0, 0, 1, 0, 1, 1,
        1, 1, 0, 1, 0, 0,
        // Top
        0, 1, 0, 0, 1, 0,
        1, 0, 1, 1, 0, 1,
        // Bottom (flipped vertically)
        1, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 1,
      ];
  
          
      const mesh = new Mesh(positions, normals, uvs);
      super();
      this.name = "Box";
      super.setMesh(mesh);

    }
}

/*
 * Camera is a GameObject that contains the functions necessary to obtain
 * the view matrix and projection matrix. Multiple cameras can exist at a
 * time but only 1 can be active. The scene will be rendered from the
 * perspective of the active camera.
 */
class Camera extends GameObject {

  static ORTHOGRAPHIC = 0;
  static PERSPECTIVE = 1;
  
  constructor(
    cameraType = Camera.PERSPECTIVE, 
    position = new Vec3(5, 5, 5), 
    target = new Vec3(0, 0, 0), 
    fov = Math.PI / 4, 
    near = 0.1, 
    far = 100
  ) {

    super(position);
    // Can be orthographic or perspective
    this.cameraType = cameraType;
    this.name = "Camera";

    this.viewMatrix = null;
    this.projectionMatrix = null;

    this.lookAt(target);
    this.updateProjectionMatrix(fov, window.innerWidth / window.innerHeight, near, far);
  }
  
  // Same as all GameObjects but also updates the viewMatrix when called
  updateWorldMatrix(updateObjectToParentMatrix = true) {
    super.updateWorldMatrix(updateObjectToParentMatrix);
    this.updateViewMatrix();
  }

  updateProjectionMatrix(fov, aspect, near, far) {

    // TODO: ORTHOGRAPHIC
    if (this.cameraType === Camera.ORTHOGRAPHIC) {
      const top = Math.tan(fov / 2) * near;
      const bottom = -top;
      const right = top * aspect;
      const left = -right;
        
      const m = new Mat4(
            2 / (right - left), 0, 0, -(right + left) / (right - left),
            0, 2 / (top - bottom), 0, -(top + bottom) / (top - bottom),
            0, 0, -2 / (far - near), -(far + near) / (far - near),
            0, 0, 0, 1
      );
        this.projectionMatrix = m;
    } else {
      
      // Calculates the appropriate perspective matrix
      const f = 1.0 / Math.tan(fov / 2);
      const m = new Mat4(
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) / (near - far), (2 * far * near) / (near - far),
            0, 0, -1, 0
      );
      this.projectionMatrix = m;
    }
  }

  // Call this whenever the camera is moved to set this.viewMatrix
  updateViewMatrix() {
  
    // Extract euler from getGlobalRotation()
    // Must use global rotation and position since camera may be the child of another GameObject
    const { x, y, z } = this.getGlobalRotation();
  
    const cx = Math.cos(x), sx = Math.sin(x);
    // y must be negative idk why
    const cy = Math.cos(-y), sy = Math.sin(-y);
    const cz = Math.cos(z), sz = Math.sin(z);
  
    const r00 = cy * cz + sy * sx * sz;
    const r01 = -cy * sz + sy * sx * cz;
    const r02 = sy * cx;
  
    const r10 = cx * sz;
    const r11 = cx * cz;
    const r12 = -sx;
  
    const r20 = -sy * cz + cy * sx * sz;
    const r21 = sy * sz + cy * sx * cz;
    const r22 = cy * cx;
  
    const t00 = r00, t01 = r10, t02 = r20;
    const t10 = r01, t11 = r11, t12 = r21;
    const t20 = r02, t21 = r12, t22 = r22;
  
    const pos = this.getGlobalPosition();
    const px = pos.x, py = pos.y, pz = pos.z;
  
    const tx = -(t00 * px + t01 * py + t02 * pz);
    const ty = -(t10 * px + t11 * py + t12 * pz);
    const tz = -(t20 * px + t21 * py + t22 * pz);
  
    this.viewMatrix = new Mat4(
        t00, t01, t02, tx,
        t10, t11, t12, ty,
        t20, t21, t22, tz,
        0,   0,   0,   1
      );
  }


  // Moves the camera to be facing a target location
  lookAt(target) {
    
    this.updateWorldMatrix();
    const forward = target.subtract(this.getGlobalPosition()).normalize();
    const yaw = Math.atan2(forward.x, -forward.z);
    const pitch = Math.asin(forward.y);
    const parentRotation = this.parent ? this.parent.getGlobalRotation() : Vec3.zeros();
    this.rotation.x = pitch - parentRotation.x;
    this.rotation.y = yaw - parentRotation.y;

  }
}

/*
 * Scene is the root node that all other objects are children of
 */
class Scene extends GameObject {
    
    constructor() {
        super();
        this.name = "root";
        GraphicsContext.scene = this;

    }
}

function generateSphere(radius = 1, latBands = 16, longBands = 16) {
  const positions = [];
  const indices = [];

  // build vertices & UVs
  for (let lat = 0; lat <= latBands; ++lat) {
    const theta = (lat * Math.PI) / latBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let lon = 0; lon < longBands; ++lon) {
      const phi = (lon * 2 * Math.PI) / longBands;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      // positions
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

class Sphere extends GameObject {
  constructor(radius = 1, latBands = 16, longBands = 16) {
    const { positions, indices } = generateSphere(radius, latBands, longBands);
    const normals = computeVertexNormals(positions, indices);
    const mesh = new Mesh(positions, normals, indices);
    super();
    this.name = "Sphere";
    super.setMesh(mesh);
  }
}

class BillboardMesh {

  constructor(positions, size = 1.0) {
    const gl = GraphicsContext.gl;
    this.size = size;
    this.material = new Material();
        
    const baseNormals = [ 0, 0, 1 ]; // per vertex
    const baseUVs = [
      0, 0,    // bottom-left
      1, 0,    // bottom-right
      0.5, 1   // top
    ];

    const normals = [];
    const uvs = [];

    const triangleCount = positions.length / 9; // 9 floats per triangle (3 vertices)

    for (let i = 0; i < triangleCount; i++) {
      // Push normal per vertex (3x)
      normals.push(...baseNormals, ...baseNormals, ...baseNormals);
      
      // Push uvs (matches vertex order)
      uvs.push(...baseUVs);
    }

    this.vertexCount = positions.length / 3;

    const indices = [];
    for (let i = 0; i < this.vertexCount; i++) {
      indices.push(i % 3);
    }
    
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    
    // Position buffer
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const program = GraphicsContext.billboardProgram;
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices), gl.STATIC_DRAW);
    const aIndex = gl.getAttribLocation(program, 'aIndex');
    gl.enableVertexAttribArray(aIndex);
    gl.vertexAttribPointer(aIndex, 1, gl.FLOAT, false, 0, 0);
    // Normal buffer  
    this.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    const aNormal = gl.getAttribLocation(program, 'aNormal');
    gl.enableVertexAttribArray(aNormal);
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
    
    // UV buffer
    this.uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
    const aUV = gl.getAttribLocation(program, 'aUV');
    if (aUV !== -1) {
      gl.enableVertexAttribArray(aUV);
      gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 0, 0);
    }
    
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
  
  // Call this for every render frame
  draw() {
    const gl = GraphicsContext.gl;
    const program = gl.getParameter(gl.CURRENT_PROGRAM); 

    // Set size uniform
    const uSize = gl.getUniformLocation(program, "uSize");
    gl.uniform1f(uSize, this.size);

    // Set material properties
    gl.uniform3fv(
      gl.getUniformLocation(program, "uMaterial.diffuse"),
      this.material.diffuse.toArray()
    );
    gl.uniform3fv(
      gl.getUniformLocation(program, "uMaterial.specular"),
      this.material.specular.toArray()
    );
    gl.uniform1f(
      gl.getUniformLocation(program, "uMaterial.shininess"),
      this.material.shininess
    );

    const hasTexLoc = gl.getUniformLocation(program, "uMaterial.hasTexture");
    if (this.material.map) {
      // bind to texture unit 0
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.material.map);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.generateMipmap(gl.TEXTURE_2D);
      
      // point the sampler at unit 0
      const texLoc = gl.getUniformLocation(program, "uTexture");
      gl.uniform1i(texLoc, 0);
      gl.uniform1i(hasTexLoc, 1);
    } else {
      gl.uniform1i(hasTexLoc, 0);
    }

    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
    gl.bindVertexArray(null);
  }
}

class Billboard extends GameObject {
  
  constructor(size = 1.0) {
    super();
    this.name = "Billboard";
    const positions = [
      // Triangle 1
       0, 0, 0,  // bottom-left
       0, 0, 0,  // bottom-right
       0, 0, 0,  // top-right

    ];
    this.mesh = new BillboardMesh(positions,size);
    this.setMesh(this.mesh);
  }

  
  setTexture(texture) {
    this.mesh.material.map = texture;
  }
  
  setSize(size) {
    this.mesh.size = size;
  }
  
  getSize() {
    return this.mesh.size;
  }
  
  getMaterial() {
    return this.mesh.material;
  }
}

const LightType = {
  AMBIENT:     0,
  DIRECTIONAL: 1,
};

class Light extends GameObject{

    constructor(lightType, color, intensity) {
        super(new Vec3(), new Vec3(), new Vec3());
        this.type = lightType;
        this.color = color;
        this.intensity = intensity;
    }

    draw(i) {
        const gl = GraphicsContext.gl;
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

class AmbientLight extends Light {

    constructor(color, intensity) {
        super(LightType.AmbientLight, color, intensity);
        this.name = "Ambient Light";
    }
}

class DirectionalLight extends Light {

    constructor(direction, color, intensity) {
        super(LightType.DIRECTIONAL, color,intensity);
        this.direction = direction;
        this.name = "Directional Light";

    }
}

// DO NOT ATTACH TO A CAMERA MOUNTED TO AN OBJECT
class CameraController {

    constructor(camera, domElement) {
  
      this.camera = camera;

      if (!(camera.parent instanceof Scene)) {
        throw Error("Cannot attach controls to a camera that is attached to another object");
      }
      this.domElement = domElement;
      // target is the point being rotated around
      this.target = new Vec3();
      this.EPS = 0.001;
  
      // spherical coords of camera
      this.radius = 1;
      this.theta = 0;
      this.phi = 0;
  
      // interaction state
      this.state = { rotating: false, panning: false, x: 0, y: 0 };
  
      // speeds
      this.rotateSpeed = 0.006;
      this.panSpeed = 0.17;
      this.zoomSpeed = 0.001;
  
      this.initCamera();
      this.initEventListeners();
    }
  
    // update camera's xyz based off spherical coords
    updateCamera() {
      const cosPhi = Math.cos(this.phi);
      const sinPhi = Math.sin(this.phi);

      this.camera.position = new Vec3(
        this.target.x + this.radius * sinPhi * Math.cos(this.theta),
        this.target.y + this.radius * cosPhi,
        this.target.z + this.radius * sinPhi * Math.sin(this.theta)
      );
      
      this.camera.lookAt(this.target);
      const uViewPos = GraphicsContext.gl.getUniformLocation(GraphicsContext.gl.getParameter(GraphicsContext.gl.CURRENT_PROGRAM), "uViewPos");
      GraphicsContext.gl.uniform3fv(uViewPos, this.camera.position.toArray());
      this.camera.updateWorldMatrix();
    }
  
    initCamera() {
      
      console.log(this.camera.getGlobalPosition());
      const offset = this.camera.position.subtract(this.target);
      this.radius = offset.length();
      this.theta = Math.atan2(offset.z, offset.x);
      this.phi = Math.acos(offset.y / this.radius);
  
      if (this.phi < this.EPS) this.phi = this.EPS;
      else if (this.phi > Math.PI - this.EPS) this.phi = Math.PI - this.EPS;
      this.updateCamera();
    }
  
    // uses event listeners to get input from the user
    initEventListeners() {
      this.domElement.addEventListener("mousedown", this.onMouseDown.bind(this));
      this.domElement.addEventListener("mousemove", this.onMouseMove.bind(this));
      this.domElement.addEventListener("mouseup", this.onMouseUp.bind(this));
      this.domElement.addEventListener("wheel", this.onMouseWheel.bind(this), {
        passive: false,
      });
      this.domElement.addEventListener("contextmenu", (e) => e.preventDefault());
      window.addEventListener("keydown", this.onKeyDown.bind(this));
      window.addEventListener("keyup", this.onKeyUp.bind(this));
    }
  
    onKeyDown(event) {
      if (event.key === "Shift") {
        this.shift = true;
      }
    }
  
    onKeyUp(event) {
      if (event.key === "Shift") {
        this.shift = false;
      }
    }
  
    onMouseDown(event) {
      event.preventDefault();
  
      this.state.rotating = !this.shift;
      this.state.panning = this.shift;
  
      this.state.x = event.clientX;
      this.state.y = event.clientY;

  
      const offset = this.camera.position.subtract(this.target);
      this.radius = offset.length();
      this.theta = Math.atan2(offset.z, offset.x);
      this.phi = Math.acos(offset.y / this.radius);
    }
  
    onMouseMove(event) {

      const dx = event.clientX - this.state.x;
      const dy = event.clientY - this.state.y;
  
  
      if (this.phi < this.EPS) this.phi = this.EPS;
      else if (this.phi > Math.PI - this.EPS) this.phi = Math.PI - this.EPS;

      if (this.state.panning) {
        const forwards = this.target
          .subtract(this.camera.position)
          .normalize();
        const right = forwards
          .cross(new Vec3(0, 1, 0))
          .normalize();
        const up = right.cross(forwards).normalize();
  
        // move camera by pan value
        const pan = new Vec3()
          .add(right.multiply((-dx * this.panSpeed * this.radius) / 200))
          .add(up.multiply((dy * this.panSpeed * this.radius) / 200));
        this.target=this.target.add(pan);
        this.camera.position=this.camera.position.add(pan);
        this.camera.lookAt(this.target);
        this.updateCamera();
  
      } else if (this.state.rotating) {
  
        // change spherical coords
        this.theta += dx * this.rotateSpeed;
        this.phi -= dy * this.rotateSpeed;
        if (this.phi < this.EPS) this.phi = this.EPS;
        else if (this.phi > Math.PI - this.EPS) this.phi = Math.PI - this.EPS;
        this.updateCamera();
  
      }
  
      // old x and y of mouse
      this.state.x = event.clientX;
      this.state.y = event.clientY;
  
    }
  
    onMouseUp(event) {
      this.state.rotating = this.state.panning = false;
    }
  
    // zoom
    onMouseWheel(event) {
      event.preventDefault();
      this.radius *= 1 + event.deltaY * this.zoomSpeed;
      // stop at 0.1
      if (this.radius < 0.1) this.radius = 0.1;
      this.updateCamera();
    }

  }

/**
 * A simple OBJ and MTL loader for Weave-3D
 */
class Loader {
  /**
   * Load a texture from a URL and return a WebGL texture object
   * @param {string} url - path to the texture image
   * @returns {Promise<WebGLTexture>}
   */
  static async loadTexture(url) {
    const gl = GraphicsContext.gl;
    
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
            const gl    = GraphicsContext.gl;
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

    let positions = [];


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

/*
 * Main class of this library. This class will be imported into various projects
 * and most other objects can be obtained by using WEAVE._____.
 */
const WEAVE = {
  GameObject,
  Box,
  Mesh,
  Camera,
  Scene,
  Sphere,
  Billboard,
  BillboardMesh,
  AmbientLight,
  DirectionalLight,
  Material,
  CameraController,
  Loader,
  gl: null,
  canvas: null,
  program: null,
  billboardProgram: null,
  scene: null,
  renderer: null,
  debugWindow: null,
  lights: null,

  toggleDebugWindow() {
    if (this.debugWindow && !this.debugWindow.closed) {
      this.debugWindow.close();
      this.debugWindow = null;
      return;
    }

    this.debugWindow = window.open(
      "",
      "WeaveDebug",
      "width=300,height=400,left=1200,top=0,resizable=yes,scrollbars=yes"
    );
    if (this.debugWindow == null) {
      console.log("Unable to create pop-up window");
      return;
    }

    this.debugWindow.document.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "d") {
        this.debugWindow.close();
        this.debugWindow = null;
      }
    });

    this.debugWindow.document.write(`
            <html>
    <head>
        <title>WEAVE Debug</title>
        <style>
            

        body {
            background-color: white;
            color: #000;
            font-family: monospace;
            font-size: 12px;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            height: 100vh;
        }

        #hierarchy {
            max-height: 360px;
            overflow-y: auto;
            flex: 1;
            border-bottom: 1px solid #ccc;
            padding: 4px 10px;
        }

        .node {
            display: flex;
            align-items: center;
            margin: 0;
            padding: 0;
            gap: 5px;
            border-bottom: 1px solid #eee;
            padding-left: 20px;

        }

        #status-dock {
            padding: 8px 10px;
            background-color: #eee;
            border-top: 1px solid #ccc;
            display: flex;
            gap: 20px;
            justify-content: flex-start;
        }
        </style>
    </head>
        <body>
            <script> document.addEventListener("keydown", e => {
                if (e.key === "d") {
                    this.close();
                }
            });</script>
            <div id="hierarchy">
                
            </div>
            <div id="status-dock">
                <div id="fps">FPS: --</div>
                <div id="ptr">PTR: --</div>
                        </div>
        </body>
</html>
        `);
    window.addEventListener("beforeunload", () => {
      if (this.debugWindow && !this.debugWindow.closed) {
        this.debugWindow.close();
      }
    });
  },

  // Creates a shader from source text
  createShader: function (type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    return shader;
  },

  // Links two shaders together into one program
  createProgram: function (vertSrc, fragSrc) {
    const vert = this.createShader(this.gl.VERTEX_SHADER, vertSrc);
    const frag = this.createShader(this.gl.FRAGMENT_SHADER, fragSrc);
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vert);
    this.gl.attachShader(program, frag);
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error("Program link error:", this.gl.getProgramInfoLog(program));
      return null;
    }
    return program;
  },

  // Call this at the start of the project to init WebGL
  init: function (canvasSelector = "canvas") {
    this.canvas = document.querySelector(canvasSelector);
    this.gl = this.canvas.getContext("webgl2");

    const dpr = window.devicePixelRatio || 1;

    this.frames = 0;
    this.timeOfLastFPS = performance.now();

    // objects within this library will use this to avoid circular dependancies
    GraphicsContext.gl = this.gl;

    if (!this.gl) {
      console.error("WebGL not supported");
      return;
    }

    const cssWidth = window.innerWidth;
    const cssHeight = window.innerHeight;
    this.canvas.style.width = cssWidth + "px";
    this.canvas.style.height = cssHeight + "px";

    this.canvas.width = cssWidth * dpr;
    this.canvas.height = cssHeight * dpr;

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.clearColor(0.1, 0.1, 0.1, 1.0);

    const vertexShaderSrc = `#version 300 es
      in vec3 aPosition;
      in vec3 aNormal;
      in vec2 aUV;

      uniform mat4 uModelViewProjection;
      uniform mat4 uModel;
      uniform mat4 uNormalMatrix;

      out vec3 vNormal;
      out vec3 vPosition;
      out vec2 vUV;

      void main() {
          vec4 worldPos = uModel * vec4(aPosition, 1.0);
          vPosition = worldPos.xyz;
          vNormal = mat3(uNormalMatrix) * aNormal;
          vUV = aUV;
          gl_Position = uModelViewProjection * vec4(aPosition, 1.0);
      }
        `;

    const fragmentShaderSrc = `#version 300 es
      precision mediump float;

      #define MAX_LIGHTS 8

        struct Light {
          int   type;
          vec3  color;
          float intensity;
          vec3  direction;
        };
        struct Material {
          vec3 diffuse;
          vec3 specular;
          float shininess;
          bool hasTexture;
        };

        uniform int uNumLights;
        uniform Light uLights[MAX_LIGHTS];
        uniform Material uMaterial;
        uniform sampler2D uTexture;
        uniform vec3 uViewPos;

        in vec3 vNormal;
        in vec3 vPosition;
        in vec2 vUV;
        out vec4 fragColor;

        void main() {
          vec3 baseColor = uMaterial.hasTexture ? texture(uTexture, vUV).rgb : uMaterial.diffuse;
          vec3 N = normalize(vNormal);
          vec3 V = normalize(uViewPos - vPosition);
          vec3 result = vec3(0);
          for (int i = 0; i < uNumLights; ++i) {
            Light light = uLights[i];
            vec3 L = light.type == 1 ? normalize(-light.direction) : vec3(0);
            float diff = light.type == 1 ? max(dot(N, L), 0.0) : 0.0;
            vec3 diffuse = diff * light.color * baseColor;
            vec3 specular = vec3(0);
            if (light.type == 1 && uMaterial.shininess > 0.0) {
              vec3 H = normalize(L + V);
              float s = pow(max(dot(N, H), 0.0), uMaterial.shininess);
              specular = s * light.color * uMaterial.specular;
            }
            if (light.type == 0) result += baseColor * light.color * light.intensity;
            else result += (diffuse + specular) * light.intensity;
          }
          fragColor = vec4(result, 1.0);
      }
    `;

    // Billboard vertex shader
    const billboardVertexShaderSrc = `#version 300 es
      precision mediump float;

      in vec3 aPosition;
      in vec3 aNormal;
      in vec2 aUV;
      in float aIndex;

      uniform mat4 uModelViewProjection;
      uniform mat4 uModel;
      uniform mat4 uNormalMatrix;
      uniform mat4 uViewMatrix;
      uniform float uSize;

      out vec3 vNormal;
      out vec3 vPosition;
      out vec2 vUV;

      void main() {
          vec4 worldPos = uModel * vec4(aPosition, 1.0);
          vPosition = worldPos.xyz;
          vNormal = mat3(uNormalMatrix) * aNormal;
          vUV = aUV;

          vec4 pos = uModelViewProjection * vec4(aPosition, 1.0);

          if (aIndex == 0.0) {
              pos.xyz += vec3(-0.5 * uSize, -0.5 * uSize, 0.0);
          } else if (aIndex == 1.0) {
              pos.xyz += vec3(0.5 * uSize, -0.5 * uSize, 0.0);
          } else if (aIndex == 2.0) {
              pos.xyz += vec3(0.0, 1.25 * uSize, 0.0);
          }

          gl_Position = pos;
      }
    `;

    // Billboard fragment shader
    const billboardFragmentShaderSrc = `#version 300 es
      precision mediump float;

      #define MAX_LIGHTS 8

      struct Light {
        int   type;
        vec3  color;
        float intensity;
        vec3  direction;
      };

      struct Material {
        vec3 diffuse;
        vec3 specular;
        float shininess;
        bool hasTexture;
      };

      uniform int uNumLights;
      uniform Light uLights[MAX_LIGHTS];
      uniform Material uMaterial;
      uniform sampler2D uTexture;
      uniform vec3 uViewPos;

      in vec3 vNormal;
      in vec3 vPosition;
      in vec2 vUV;
      out vec4 fragColor;

      void main() {
        vec4 texColor = texture(uTexture, vUV);
        vec3 baseColor = uMaterial.hasTexture ? texColor.rgb : uMaterial.diffuse;
        float alpha = uMaterial.hasTexture ? texColor.a : 1.0;
        
        fragColor = vec4(baseColor, alpha);
      }
    `;

    this.program = this.createProgram(vertexShaderSrc, fragmentShaderSrc);
    this.billboardProgram = this.createProgram(billboardVertexShaderSrc, billboardFragmentShaderSrc);
    GraphicsContext.program = this.program;
    GraphicsContext.billboardProgram = this.billboardProgram;
    this.gl.useProgram(this.program);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    console.log("init complete.");

    this.lights = [];
  },

  // Renders every object in the scene by traversing scene hierarchy
  render() {
    const gl = this.gl;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // projectionMatrix * viewMatrix of the active camera
    const viewProj = this.camera.projectionMatrix.multiply(
      this.camera.viewMatrix
    );
    this.lights.forEach((light, i) => {
      light.draw(i);
    });
    
    this.scene.traverse((obj) => {
      if (!obj.visible || !obj.mesh || !obj.mesh.material) return;

      // Check if this is a billboard object
      const isBillboard = obj.mesh instanceof BillboardMesh;
      const program = isBillboard ? this.billboardProgram : this.program;
      
      gl.useProgram(program);
      
      let modelMat = obj.getWorldMatrix();
      const uModel = gl.getUniformLocation(program, "uModel");
      gl.uniformMatrix4fv(uModel, true, modelMat.elements);
      
      let normalMatrix = modelMat.clone().inverse();
      const uNormalModel = gl.getUniformLocation(program, "uNormalMatrix");
      gl.uniformMatrix4fv(uNormalModel, false, normalMatrix.elements);
      
      let mvp = viewProj.multiply(obj.getWorldMatrix());
      const uMVP = gl.getUniformLocation(program, "uModelViewProjection");
      gl.uniformMatrix4fv(uMVP, true, mvp.elements);

      // Set view position for both programs
      const uViewPos = gl.getUniformLocation(program, "uViewPos");
      gl.uniform3fv(uViewPos, this.camera.getGlobalPosition().toArray());

      // Set lighting uniforms
      const numLights = gl.getUniformLocation(program, "uNumLights");
      gl.uniform1i(numLights, this.lights.length);

      obj.draw();
    });
    
    // Switch back to main program
    gl.useProgram(this.program);
  },

  // Call this to begin the program
  start() {
    
    if (this.scene == null) {
      throw new Error("Tried to start rendering without a Scene");
    }
    this.scene.traverse((obj) => {
      obj.start();
    });
    this.loop();

    this.lastTime  = performance.now();
    const interval = 1000 / 60; // 60 Hz

    setInterval(() => {
      const now = performance.now();
      const dt  = (now - this.lastTime) / 1000;
      this.lastTime  = now;
      if (this.debugWindow && !this.debugWindow.closed) {
        const ptrEl = this.debugWindow.document.getElementById("ptr");
        if (ptrEl) ptrEl.textContent = `PTR: ${1/dt}Hz`;
      }
      this.scene.traverse((obj) => {
        if (obj.stopped == false) {
          obj.update(dt);
        } else {
          console.log("stopped");
        }
        if (obj.isDirty()) {
          if (obj == this.camera) {
            const uViewPos = this.gl.getUniformLocation(
              this.program,
              "uViewPos"
            );
            this.gl.uniform3fv(
              uViewPos,
              this.camera.getGlobalPosition().toArray()
            );
          }
          obj.updateWorldMatrix();
        }
      });
    }, interval);
  },
  updateHierarchy() {
    if (!this.debugWindow || this.debugWindow.closed) return;

    const container = this.debugWindow.document.getElementById("hierarchy");
    if (!container) return;
    let html = "";
    let objs = [];

    this.scene.traverse((obj) => {
      html += `<div class="node" style="padding-left:${obj.depth * 20}px">
                        <input type="checkbox" class="visibility-toggle" ${
                          obj.visible ? "checked" : ""
                        }>
                        ${obj.name}
                     </div>`;
      objs.push(obj);
    });

    container.innerHTML = html;

    const checkboxes = container.querySelectorAll("input.visibility-toggle");
    checkboxes.forEach((checkbox, i) => {
      const obj = objs[i];
      checkbox.addEventListener("change", () => {
        obj.visible = checkbox.checked;
      });
    });
  },

  // This is the loop that runs every frame
  loop() {
    const now = performance.now();
    this.frames = this.frames + 1;
    if (now - this.timeOfLastFPS > 1000) {
      this.timeOfLastFPS = now;
      let fps = this.frames;
      this.frames = 0;
      // Update the debug window if open
      if (this.debugWindow && !this.debugWindow.closed) {
        const fpsEl = this.debugWindow.document.getElementById("fps");
        if (fpsEl) fpsEl.textContent = `FPS: ${fps}`;
        this.updateHierarchy();
      }
    }

    this.render();

    requestAnimationFrame(() => this.loop());
  },

  setActiveScene(scene) {
    this.scene = scene;
    GraphicsContext.scene = scene;
  },
  setActiveCamera(camera) {
    this.camera = camera;
  },
};

export { Mat4, Vec3, Vec4, WEAVE };
//# sourceMappingURL=weave.esm.js.map
