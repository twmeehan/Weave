attribute vec3 aPosition;
uniform mat4 uModelViewProjection;

void main() {
  gl_Position = uModelViewProjection * vec4(aPosition, 1.0);
}