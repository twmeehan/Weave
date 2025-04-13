export class Vec3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static zeros() {
    return new Vec3();
  }
  // Returns a new Vec3 with the same components.
  clone() {
    return new Vec3(this.x, this.y, this.z);
  }

  // Returns a new Vec3 that is the sum of this and v.
  add(v) {
    return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  // Returns a new Vec3 that is the difference of this and v.
  subtract(v) {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  // If v is a Vec3, returns a new Vec3 that is the component-wise multiplication.
  // Otherwise, multiplies each component by the scalar v.
  multiply(v) {
    if (v instanceof Vec3) {
      return new Vec3(this.x * v.x, this.y * v.y, this.z * v.z);
    }
    return new Vec3(this.x * v, this.y * v, this.z * v);
  }

  // Returns the length (magnitude) of the vector.
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  // Returns a new Vec3 that is the normalized (unit length) version of this vector.
  normalize() {
    const len = this.length();
    // Avoid division by zero.
    return len > 0 ? this.multiply(1 / len) : this.clone();
  }

  // Returns the dot product of this vector and vector v.
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  // Returns a new Vec3 that is the cross product of this vector and v.
  cross(v) {
    const x = this.y * v.z - this.z * v.y;
    const y = this.z * v.x - this.x * v.z;
    const z = this.x * v.y - this.y * v.x;
    return new Vec3(x, y, z);
  }

  // Converts this vector into a standard JavaScript array.
  toArray() {
    return [this.x, this.y, this.z];
  }

  // Returns a formatted string for debugging.
  toString() {
    return `[${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)}]`;
  }

  negate() {
    return this.multiply(-1);

  }
}
