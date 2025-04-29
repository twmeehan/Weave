import { Material } from "./Material";
import { GraphicsContext as WEAVE } from "../GraphicsContext";

export class Mesh {

  constructor(positions, normals, uvs = [], indices = null) {
                
    const gl = WEAVE.gl;
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

    const gl = WEAVE.gl;
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