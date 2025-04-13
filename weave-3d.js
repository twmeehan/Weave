import { Box } from './objects/Box.js';
import { Camera } from './core/Camera.js';
import { GameObject } from './core/GameObject.js';
import { Mesh } from './core/Mesh.js';
import { Scene } from './core/Scene.js';
import { Sphere } from './objects/Sphere.js';
import { GraphicsContext } from './GraphicsContext.js';


/*
 * Main class of this library. This class will be imported into various projects
 * and most other objects can be obtained by using WEAVE._____. 
 */
export const WEAVE = { 
    GameObject, Box, Mesh, Camera, Scene, Sphere,
    gl: null,
    canvas: null,
    program: null,
    scene: null,
    renderer: null,

    // Creates a shader from source text
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
    
    // Links two shaders together into one program
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

    // Call this at the start of the project to init WebGL
    init: function(canvasSelector = "canvas") {

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
        this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
    
        const vertexShaderSrc = `
            attribute vec3 aPosition;
            uniform mat4 uModelViewProjection;

            void main() {
                gl_Position = uModelViewProjection * vec4(aPosition, 1.0);
            }
        `;

        const fragmentShaderSrc = `
            precision mediump float;
            uniform vec4 uColor;

            void main() {
                gl_FragColor = uColor;
            }
`       ;

        this.program = this.createProgram(vertexShaderSrc, fragmentShaderSrc);
        this.gl.useProgram(this.program);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        console.log("init complete.");
    },

    // Renders every object in the scene by traversing scene hierarchy 
    render() {

        const gl = this.gl;
    
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // projectionMatrix * viewMatrix of the active camera
        const viewProj = this.camera.projectionMatrix.multiply(this.camera.viewMatrix);

        this.scene.traverse(obj => {
            if (!obj.visible || !obj.mesh) return;
    
            let mvp = viewProj.multiply(obj.getWorldMatrix());
            const uMVP = gl.getUniformLocation(this.program, "uModelViewProjection");
            gl.uniformMatrix4fv(uMVP, true, mvp.elements);

            obj.mesh.draw();
        });

    },

    // Call this to begin the program
    start() {
        if (this.scene == null) {
            throw new Error("Tried to start rendering without a Scene");
        }
        this.scene.traverse(obj => {
            obj.start();
        });
        this.loop();

    },

    // This is the loop that runs every frame
    loop() {

        this.scene.traverse(obj => {
            obj.update();
            if (obj.dirty) {
                obj.updateWorldMatrix();
                obj.dirty = false;
            }
        });
        this.render();
        requestAnimationFrame(() => this.loop());

    },

    setActiveScene(scene) {
        this.scene = scene;
        GraphicsContext.scene = scene;
    },
    setActiveCamera(camera) {
        this.camera = camera;
    }
};

export { Vec3 } from './math/Vec3.js';
export { Vec4 } from './math/Vec4.js';
export { Mat4 } from './math/Mat4.js';
