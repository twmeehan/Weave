export class GraphicsContext {
    static gl = null;
  
    static setGL(context) {
      this.gl = context;
    }
  
    static getGL() {
      if (!this.gl) throw new Error("GL context not initialized.");
      return this.gl;
    }
  }