export class Vec4 {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  // Returns a new Vec4 with the same components.
  clone() {
    return new Vec4(this.x, this.y, this.z, this.w);
  }

  // Returns a new Vec4 that is the sum of this and v.
  add(v) {
    return new Vec4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
  }

  // Returns a new Vec4 that is the difference of this and v.
  subtract(v) {
    return new Vec4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
  }

  // If v is a Vec4, returns a new Vec4 with component-wise multiplication.
  // Otherwise, multiplies each component by the scalar v.
  multiply(v) {
    if (v instanceof Vec4) {
      return new Vec4(this.x * v.x, this.y * v.y, this.z * v.z, this.w * v.w);
    }
    return new Vec4(this.x * v, this.y * v, this.z * v, this.w * v);
  }

  // Returns the length (magnitude) of the vector.
  length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2 + this.w ** 2);
  }

  // Returns a new Vec4 that is a normalized version of this vector.
  normalize() {
    const len = this.length();
    return len > 0 ? this.multiply(1 / len) : this.clone();
  }

  // Returns the dot product of this vector and another Vec4 v.
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }

  // Converts the vector to a standard JavaScript array.
  toArray() {
    return [this.x, this.y, this.z, this.w];
  }

  // Returns a formatted string representation of this vector.
  toString() {
    return `[${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)}, ${this.w.toFixed(2)}]`;
  }
  negate() {
    return this.multiply(-1);
  }
}
