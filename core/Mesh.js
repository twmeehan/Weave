import { Material } from "./Material";

export class Mesh {

  constructor(gl, positions, normals, indices = null) {
                
    this.gl = gl;
    this.vertexCount = indices ? indices.length : positions.length / 3;
    this.useIndices = !!indices;
    this.material = new Material();
    
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    
    // Position buffer
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const program = gl.getParameter(gl.CURRENT_PROGRAM);
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

    const gl = this.gl;
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