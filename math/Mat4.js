import { Vec3 } from './Vec3.js';
import { Vec4 } from './Vec4.js';

export class Mat4 {
  constructor(...args) {
    // If a single array-like argument is given, use it as the element array (assumed row-major).
    if (args.length === 1 && (Array.isArray(args[0]) || args[0] instanceof Float32Array)) {
      this.elements = new Float32Array(args[0]);
    } else {
      // Otherwise, use the individual arguments (defaulting to the identity matrix).
      // Now arranged in row-major order:
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
      1, 0, 0, 0,  // row 0
      0, 1, 0, 0,  // row 1
      0, 0, 1, 0,  // row 2
      0, 0, 0, 1   // row 3
    ]);
  }

  static zeros() {
    return new Mat4(new Array(16).fill(0));
  }

  clone() {
    return Mat4.fromArray(this.elements);
  }

  // Multiply this matrix by another (immutable, returns a new Mat4)
  multiply(m) {
    if (m instanceof Vec4) {
      // For row-major ordering, treating Vec4 as a column vector:
      // result_i = sum_{j} this[i*4+j] * m_component_j.
      const e = this.elements;
      return new Vec4(
        e[0] * m.x + e[1] * m.y + e[2] * m.z + e[3] * m.w,
        e[4] * m.x + e[5] * m.y + e[6] * m.z + e[7] * m.w,
        e[8] * m.x + e[9] * m.y + e[10] * m.z + e[11] * m.w,
        e[12] * m.x + e[13] * m.y + e[14] * m.z + e[15] * m.w
      );
    } else if (m instanceof Vec3) {
        const e = this.elements;
        // Compute the four components, with an implicit w = 1 for the input.
        const x = e[0] * m.x + e[1] * m.y + e[2] * m.z + e[3];
        const y = e[4] * m.x + e[5] * m.y + e[6] * m.z + e[7];
        const z = e[8] * m.x + e[9] * m.y + e[10] * m.z + e[11];
        const w = e[12] * m.x + e[13] * m.y + e[14] * m.z + e[15];
        
        return new Vec3(x, y, z);
      } else if (m instanceof Mat4) {
      const a = this.elements;
      const b = m.elements;
      const result = new Float32Array(16);
      // Row-major multiplication:
      // result[i*4+j] = sum_{k=0}^{3} a[i*4+k] * b[k*4+j]
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
    } else {
      // Assume m is a scalar
      const result = new Float32Array(16);
      for (let i = 0; i < 16; i++) {
        result[i] = this.elements[i] * m;
      }
      return new Mat4(result);
    }
  }

  // Instead of modifying this, returns a new matrix with given elements (row-major)
  set(m00, m01, m02, m03,
      m10, m11, m12, m13,
      m20, m21, m22, m23,
      m30, m31, m32, m33) {
    return new Mat4([
      m00, m01, m02, m03,
      m10, m11, m12, m13,
      m20, m21, m22, m23,
      m30, m31, m32, m33
    ]);
  }

  // Return the underlying array.
  toArray() {
    return this.elements;
  }

  // Return a string representation in row-major order.
  toString() {
    const e = this.elements;
    return (
      `[ ${e[0].toFixed(2)}  ${e[1].toFixed(2)}  ${e[2].toFixed(2)}  ${e[3].toFixed(2)} ]\n` +
      `[ ${e[4].toFixed(2)}  ${e[5].toFixed(2)}  ${e[6].toFixed(2)}  ${e[7].toFixed(2)} ]\n` +
      `[ ${e[8].toFixed(2)}  ${e[9].toFixed(2)}  ${e[10].toFixed(2)}  ${e[11].toFixed(2)} ]\n` +
      `[ ${e[12].toFixed(2)}  ${e[13].toFixed(2)}  ${e[14].toFixed(2)}  ${e[15].toFixed(2)} ]`
    );
  }

  // Create a row-major translation matrix and multiply it with this matrix.
  translate(v) {
    // Row-major translation matrix:
    // Row0: [1, 0, 0, tx]
    // Row1: [0, 1, 0, ty]
    // Row2: [0, 0, 1, tz]
    // Row3: [0, 0, 0, 1 ]
    const t = Mat4.identity();
    t.elements[3] = v.x;
    t.elements[7] = v.y;
    t.elements[11] = v.z;
    return this.multiply(t);
  }

  // Create a row-major scale matrix and multiply.
  scale(v) {
    // Row-major scale matrix:
    // Row0: [sx, 0,  0,  0]
    // Row1: [0,  sy, 0,  0]
    // Row2: [0,  0,  sz, 0]
    // Row3: [0,  0,  0,  1]
    const s = Mat4.identity();
    s.elements[0] = v.x;
    s.elements[5] = v.y;
    s.elements[10] = v.z;
    return this.multiply(s);
  }

rotate(r) {
    const { x, y, z } = r // x = pitch, y = yaw, z = roll
  
    const cx = Math.cos(x), sx = Math.sin(x);
    const cy = Math.cos(y), sy = Math.sin(y);
    const cz = Math.cos(z), sz = Math.sin(z);
  
    // Combined Y * X * Z rotation matrix (row-major)
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
      )); ;
  }

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