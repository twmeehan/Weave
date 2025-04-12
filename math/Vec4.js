export class Vec4 {

    constructor(x = 0, y = 0, z = 0, w = 1) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    }
  
    // Clone the vector
    clone() {
      return new Vec4(this.x, this.y, this.z, this.w);
    }
  
    // Add another Vec4
    add(v) {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
      this.w += v.w;
      return this;
    }
  
    // Subtract another Vec4
    subtract(v) {
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
      this.w -= v.w;
      return this;
    }
  
    // Multiply by scalar or Vec4 (component-wise)
    multiply(v) {
      if (v instanceof Vec4) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        this.w *= v.w;
      } else {
        this.x *= v;
        this.y *= v;
        this.z *= v;
        this.w *= v;
      }
      return this;
    }
  
    // Get magnitude (length)
    length() {
      return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2 + this.w ** 2);
    }
  
    // Normalize vector
    normalize() {
      const len = this.length();
      if (len > 0) {
        this.multiply(1 / len);
      }
      return this;
    }
  
    // Dot product
    dot(v) {
      return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    }
  
    // Convert to array (for WebGL)
    toArray() {
      return [this.x, this.y, this.z, this.w];
    }
  
    toString() {
      return `[${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)}, ${this.w.toFixed(2)}]`;
    }
  }