import { Material } from "./Material.js";
import { GraphicsContext as WEAVE } from "../GraphicsContext.js";

export class BillboardMesh {

  constructor(positions, size = 1.0) {
    const gl = WEAVE.gl;
    this.size = size;
    this.material = new Material();
        
    const baseNormals = [ 0, 0, 1 ]; // per vertex
    const baseUVs = [
      0, 0,    // bottom-left
      1, 0,    // bottom-right
      0.5, 1   // top
    ];

    const normals = [];
    const uvs = [];

    const triangleCount = positions.length / 9; // 9 floats per triangle (3 vertices)

    for (let i = 0; i < triangleCount; i++) {
      // Push normal per vertex (3x)
      normals.push(...baseNormals, ...baseNormals, ...baseNormals);
      
      // Push uvs (matches vertex order)
      uvs.push(...baseUVs);
    }

    this.vertexCount = positions.length / 3;

    const indices = [];
    for (let i = 0; i < this.vertexCount; i++) {
      indices.push(i % 3);
    }
    
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    
    // Position buffer
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const program = WEAVE.billboardProgram;
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices), gl.STATIC_DRAW);
    const aIndex = gl.getAttribLocation(program, 'aIndex');
    gl.enableVertexAttribArray(aIndex);
    gl.vertexAttribPointer(aIndex, 1, gl.FLOAT, false, 0, 0);
    // Normal buffer  
    this.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    const aNormal = gl.getAttribLocation(program, 'aNormal');
    gl.enableVertexAttribArray(aNormal);
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
    
    // UV buffer
    this.uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
    const aUV = gl.getAttribLocation(program, 'aUV');
    if (aUV !== -1) {
      gl.enableVertexAttribArray(aUV);
      gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 0, 0);
    }
    
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
  
  // Call this for every render frame
  draw() {
    const gl = WEAVE.gl;
    const program = gl.getParameter(gl.CURRENT_PROGRAM); 

    // Set size uniform
    const uSize = gl.getUniformLocation(program, "uSize");
    gl.uniform1f(uSize, this.size);

    // Set material properties
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
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.material.map);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.generateMipmap(gl.TEXTURE_2D);
      
      // point the sampler at unit 0
      const texLoc = gl.getUniformLocation(program, "uTexture");
      gl.uniform1i(texLoc, 0);
      gl.uniform1i(hasTexLoc, 1);
    } else {
      gl.uniform1i(hasTexLoc, 0);
    }

    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
    gl.bindVertexArray(null);
  }
}
