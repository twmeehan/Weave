/*
 * Represents a 4 element vector
 */
export class Vec4 {
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
