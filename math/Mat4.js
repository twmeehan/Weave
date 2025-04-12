import { Vec3 } from './Vec3.js';
import { Vec4 } from './Vec4.js';

export class Mat4 {
    constructor(
        m00 = 1, m01 = 0, m02 = 0, m03 = 0,
        m10 = 0, m11 = 1, m12 = 0, m13 = 0,
        m20 = 0, m21 = 0, m22 = 1, m23 = 0,
        m30 = 0, m31 = 0, m32 = 0, m33 = 1
      ) {
        this.elements = new Float32Array([
          m00, m10, m20, m30,
          m01, m11, m21, m31,
          m02, m12, m22, m32,
          m03, m13, m23, m33
        ]);
    }
  
    static identity() {
        const m = new Mat4();
        const e = m.elements;
        e[0] = 1; e[4] = 0; e[8]  = 0; e[12] = 0;
        e[1] = 0; e[5] = 1; e[9]  = 0; e[13] = 0;
        e[2] = 0; e[6] = 0; e[10] = 1; e[14] = 0;
        e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
        return m;
    }

    static zeros() {
        const m = new Mat4();
        const e = m.elements;
        e[0] = 0; e[4] = 0; e[8]  = 0; e[12] = 0;
        e[1] = 0; e[5] = 0; e[9]  = 0; e[13] = 0;
        e[2] = 0; e[6] = 0; e[10] = 0; e[14] = 0;
        e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 0;
        return m;
    }

    clone() {
        const m = new Mat4();
        m.elements.set(this.elements);
        return m;
    }
  
    // Multiply this matrix by another Mat4 Vec3 or 
    multiply(m) {
        if (m instanceof Vec4) {
            const e = this.elements;
            const x = m.x, y = m.y, z = m.z, w = m.w;
        
            return new Vec4(
              e[0] * x + e[4] * y + e[8]  * z + e[12] * w,
              e[1] * x + e[5] * y + e[9]  * z + e[13] * w,
              e[2] * x + e[6] * y + e[10] * z + e[14] * w,
              e[3] * x + e[7] * y + e[11] * z + e[15] * w
            );
        }else if (m instanceof Vec3) {
            const e = this.elements;
            const x = m.x, y = m.y, z = m.z;

            // Treat Vec3 as a column vector (x, y, z, 1)
            return new Vec3(
                e[0] * x + e[4] * y + e[8]  * z + e[12],
                e[1] * x + e[5] * y + e[9]  * z + e[13],
                e[2] * x + e[6] * y + e[10] * z + e[14]
            );
        } else if (m instanceof Mat4) {
            const a = this.elements;
            const b = m.elements;
            const result = new Float32Array(16);
  
            for (let row = 0; row < 4; ++row) {
                for (let col = 0; col < 4; ++col) {
                    result[col * 4 + row] =
                        a[0 * 4 + row] * b[col * 4 + 0] +
                        a[1 * 4 + row] * b[col * 4 + 1] +
                        a[2 * 4 + row] * b[col * 4 + 2] +
                        a[3 * 4 + row] * b[col * 4 + 3];
                }
            }
  
            this.elements = result;
            return this;
        } else {
            for (let row = 0; row < 4; ++row) {
                for (let col = 0; col < 4; ++col) {
                    this.elements[col * 4 + row] *= m;
                }
            }
  
            return this;
        }
    }
    // Set matrix elements directly
    set(
      m00, m01, m02, m03,
      m10, m11, m12, m13,
      m20, m21, m22, m23,
      m30, m31, m32, m33
    ) {
      const e = this.elements;
      e[0] = m00; e[4] = m01; e[8] = m02;  e[12] = m03;
      e[1] = m10; e[5] = m11; e[9] = m12;  e[13] = m13;
      e[2] = m20; e[6] = m21; e[10] = m22; e[14] = m23;
      e[3] = m30; e[7] = m31; e[11] = m32; e[15] = m33;
      return this;
    }
  
    // Export for WebGL
    toArray() {
      return this.elements;
    }

    toString() {
        const e = this.elements;
        return (
          `[ ${e[0].toFixed(2)}  ${e[4].toFixed(2)}  ${e[8].toFixed(2)}  ${e[12].toFixed(2)} ]\n` +
          `[ ${e[1].toFixed(2)}  ${e[5].toFixed(2)}  ${e[9].toFixed(2)}  ${e[13].toFixed(2)} ]\n` +
          `[ ${e[2].toFixed(2)}  ${e[6].toFixed(2)}  ${e[10].toFixed(2)} ${e[14].toFixed(2)} ]\n` +
          `[ ${e[3].toFixed(2)}  ${e[7].toFixed(2)}  ${e[11].toFixed(2)} ${e[15].toFixed(2)} ]`
        );
      }

    translate(v) {
        const t = Mat4.identity();
        t.elements[12] = v.x;
        t.elements[13] = v.y;
        t.elements[14] = v.z;
        return this.multiply(t);
    }
      
    scale(v) {
        const s = Mat4.identity();
        s.elements[0] = v.x;
        s.elements[5] = v.y;
        s.elements[10] = v.z;
        return this.multiply(s);
    }
      
    rotate(v) {
        const rx = Mat4.identity();
        const ry = Mat4.identity();
        const rz = Mat4.identity();
      
        const cx = Math.cos(v.x), sx = Math.sin(v.x);
        const cy = Math.cos(v.y), sy = Math.sin(v.y);
        const cz = Math.cos(v.z), sz = Math.sin(v.z);
      
        // Rotation about X-axis in column-major order:
        rx.elements[5] = cx;       // row 1, col 1
        rx.elements[6] = sx;       // row 2, col 1 (should be positive)
        rx.elements[9] = -sx;      // row 1, col 2 (should be negative)
        rx.elements[10] = cx;      // row 2, col 2
      
        // Rotation about Y-axis:
        ry.elements[0] = cy;       // row 0, col 0
        ry.elements[2] = -sy;      // row 2, col 0 (should be negative)
        ry.elements[8] = sy;       // row 0, col 2 (should be positive)
        ry.elements[10] = cy;      // row 2, col 2
      
        // Rotation about Z-axis:
        rz.elements[0] = cz;       // row 0, col 0
        rz.elements[1] = sz;       // row 1, col 0 (should be positive)
        rz.elements[4] = -sz;      // row 0, col 1 (should be negative)
        rz.elements[5] = cz;       // row 1, col 1
      
        // Combine them in your desired order (check which order produces the desired Euler angles)
        return this.multiply(rz).multiply(ry).multiply(rx);
      }

  }