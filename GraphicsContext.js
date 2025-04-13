export class GraphicsContext {
    static gl = null;
    static scene = null;
  
    static setGL(context, scene) {
      this.gl = context;
      this.scene = scene;
    }
  
    static getGL() {
      if (!this.gl) throw new Error("GL context not initialized.");
      return this.gl;
    }
  }