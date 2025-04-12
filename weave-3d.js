import { Box } from './core/Box.js';
import { Camera } from './core/Camera.js';
import { GameObject } from './core/GameObject.js';
import { Mesh } from './core/Mesh.js';
import { Scene } from './core/Scene.js';
import { GraphicsContext } from './GraphicsContext.js';

export const WEAVE = { 
    GameObject, Box, Mesh, Camera, Scene,
    gl: null,
    canvas: null,
    program: null,
    scene: null,
    renderer: null,
    uniforms: {},


    createShader : function(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
          console.error("Shader compile error:", this.gl.getShaderInfoLog(shader));
          this.gl.deleteShader(shader);
          return null;
        }
        return shader;
    },
      
    createProgram : function(vertSrc, fragSrc) {
        const vert = this.createShader(this.gl.VERTEX_SHADER, vertSrc);
        const frag = this.createShader(this.gl.FRAGMENT_SHADER, fragSrc);
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vert);
        this.gl.attachShader(program, frag);
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
          console.error("Program link error:", this.gl.getProgramInfoLog(program));
          return null;
        }
        return program;
    }, 
    init: async function(canvasSelector = "canvas") {

        this.canvas = document.querySelector(canvasSelector);
        this.gl = this.canvas.getContext("webgl2");
        // objects within this library will use this to avoid circular dependancies
        GraphicsContext.gl = this.gl;
        if (!this.gl) {
          console.error("WebGL not supported");
          return;
        }
    
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clearColor(0.1, 1, 0.1, 1.0);
    
        const vertexShaderSrc = `
            attribute vec3 aPosition;
            uniform mat4 uModelViewProjection;

            void main() {
                gl_Position = uModelViewProjection * vec4(aPosition, 1.0);
            }
        `;

        const fragmentShaderSrc = `
            precision mediump float;

            void main() {
                gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // Solid white
            }
`       ;

        this.program = this.createProgram(vertexShaderSrc, fragmentShaderSrc);
        this.gl.useProgram(this.program);
    

        this.uniforms.uModelViewProjection = this.gl.getUniformLocation(this.program, "uModelViewProjection");
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        console.log("init complete.");
    },

    render: function() {

        const gl = this.gl;
    
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
        const viewProj = this.camera.projectionMatrix.multiply(this.camera.viewMatrix);
    
        this.scene.traverse(obj => {
            if (!obj.visible || !obj.mesh) return;
    
            const mvp = viewProj.multiply(obj.getWorldMatrix());
    
            const uMVP = gl.getUniformLocation(this.program, "uModelViewProjection");
            gl.uniformMatrix4fv(uMVP, false, mvp.elements);
    
            obj.mesh.draw();
        });
    },

    setActiveScene(scene) {
        this.scene = scene;
    },
    setActiveCamera(camera) {
        this.camera = camera;
    }
};

export { Vec3 } from './math/Vec3.js';
export { Vec4 } from './math/Vec4.js';
export { Mat4 } from './math/Mat4.js';
