/*
 * Most classes in this library cannot directly access weave-3d.js
 * without creating circular dependancies. Therefore this class is
 * used to get a static reference to important objects. This can be
 * imported as WEAVE to make it easier
 */
export class GraphicsContext {
    static gl = null;
    static scene = null;
    static billboardProgram = null;
    static program = null;
  
    static setGL(context, scene, billboardProgram, program) {
      this.gl = context;
      this.scene = scene;
      this.billboardProgram = billboardProgram;
      this.program = program;
    }
  
    static getGL() {
      if (!this.gl) throw new Error("GL context not initialized.");
      return this.gl;
    }
  }