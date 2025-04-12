export class Vec3 {

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  // Clone the vector
  clone() {
    return new Vec3(this.x, this.y, this.z);
  }

  // Add another Vec3
  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  // Subtract another Vec3
  subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  // Scale by scalar or multiply by another vec3
  multiply(v) {

    if (v instanceof Vec3) {

      this.x *= v.x;
      this.y *= v.y;
      this.z *= v.z;
      return this;
    }

    this.x *= v;
    this.y *= v;
    this.z *= v;
    return this;
  }

  // Get magnitude
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  // Normalize the vector
  normalize() {
    const len = this.length();
    if (len > 0) {
      this.multiply(1 / len);
    }
    return this;
  }

  // Dot product
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  // Cross product
  cross(v) {
    const x = this.y * v.z - this.z * v.y;
    const y = this.z * v.x - this.x * v.z;
    const z = this.x * v.y - this.y * v.x;
    return new Vec3(x, y, z);
  }

  // Convert to array (for WebGL)
  toArray() {
    return [this.x, this.y, this.z];
  }

  toString() {
    return `[${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)}]`;
  }

}