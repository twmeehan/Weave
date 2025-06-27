import { Box } from "./objects/Box.js";
import { Camera } from "./core/Camera.js";
import { GameObject } from "./core/GameObject.js";
import { Mesh } from "./core/Mesh.js";
import { Scene } from "./core/Scene.js";
import { Sphere } from "./objects/Sphere.js";
import { Billboard } from "./objects/Billboard.js";
import { BillboardMesh } from "./core/BillboardMesh.js";
import { GraphicsContext } from "./GraphicsContext.js";
import { AmbientLight } from "./lights/AmbientLight.js";
import { DirectionalLight } from "./lights/DirectionalLight.js";
import { Material } from "./core/Material.js";
import { Vec3 } from "./math/Vec3.js";
import { CameraController } from "./misc/CameraController.js";
import { Loader } from "./misc/Loader.js";

/*
 * Main class of this library. This class will be imported into various projects
 * and most other objects can be obtained by using WEAVE._____.
 */
export const WEAVE = {
  GameObject,
  Box,
  Mesh,
  Camera,
  Scene,
  Sphere,
  Billboard,
  BillboardMesh,
  AmbientLight,
  DirectionalLight,
  Material,
  CameraController,
  Loader,
  gl: null,
  canvas: null,
  program: null,
  billboardProgram: null,
  scene: null,
  renderer: null,
  debugWindow: null,
  lights: null,

  toggleDebugWindow() {
    if (this.debugWindow && !this.debugWindow.closed) {
      this.debugWindow.close();
      this.debugWindow = null;
      return;
    }

    this.debugWindow = window.open(
      "",
      "WeaveDebug",
      "width=300,height=400,left=1200,top=0,resizable=yes,scrollbars=yes"
    );
    if (this.debugWindow == null) {
      console.log("Unable to create pop-up window");
      return;
    }

    this.debugWindow.document.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "d") {
        this.debugWindow.close();
        this.debugWindow = null;
      }
    });

    this.debugWindow.document.write(`
            <html>
    <head>
        <title>WEAVE Debug</title>
        <style>
            

        body {
            background-color: white;
            color: #000;
            font-family: monospace;
            font-size: 12px;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            height: 100vh;
        }

        #hierarchy {
            max-height: 360px;
            overflow-y: auto;
            flex: 1;
            border-bottom: 1px solid #ccc;
            padding: 4px 10px;
        }

        .node {
            display: flex;
            align-items: center;
            margin: 0;
            padding: 0;
            gap: 5px;
            border-bottom: 1px solid #eee;
            padding-left: 20px;

        }

        #status-dock {
            padding: 8px 10px;
            background-color: #eee;
            border-top: 1px solid #ccc;
            display: flex;
            gap: 20px;
            justify-content: flex-start;
        }
        </style>
    </head>
        <body>
            <script> document.addEventListener("keydown", e => {
                if (e.key === "d") {
                    this.close();
                }
            });</script>
            <div id="hierarchy">
                
            </div>
            <div id="status-dock">
                <div id="fps">FPS: --</div>
                <div id="ptr">PTR: --</div>
                        </div>
        </body>
</html>
        `);
    window.addEventListener("beforeunload", () => {
      if (this.debugWindow && !this.debugWindow.closed) {
        this.debugWindow.close();
      }
    });
  },

  // Creates a shader from source text
  createShader: function (type, source) {
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
  createProgram: function (vertSrc, fragSrc) {
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
  init: function (canvasSelector = "canvas") {
    this.canvas = document.querySelector(canvasSelector);
    this.gl = this.canvas.getContext("webgl2");

    const dpr = window.devicePixelRatio || 1;

    this.frames = 0;
    this.timeOfLastFPS = performance.now();

    // objects within this library will use this to avoid circular dependancies
    GraphicsContext.gl = this.gl;

    if (!this.gl) {
      console.error("WebGL not supported");
      return;
    }

    const cssWidth = window.innerWidth;
    const cssHeight = window.innerHeight;
    this.canvas.style.width = cssWidth + "px";
    this.canvas.style.height = cssHeight + "px";

    this.canvas.width = cssWidth * dpr;
    this.canvas.height = cssHeight * dpr;

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.clearColor(0.1, 0.1, 0.1, 1.0);

    const vertexShaderSrc = `#version 300 es
      in vec3 aPosition;
      in vec3 aNormal;
      in vec2 aUV;

      uniform mat4 uModelViewProjection;
      uniform mat4 uModel;
      uniform mat4 uNormalMatrix;

      out vec3 vNormal;
      out vec3 vPosition;
      out vec2 vUV;

      void main() {
          vec4 worldPos = uModel * vec4(aPosition, 1.0);
          vPosition = worldPos.xyz;
          vNormal = mat3(uNormalMatrix) * aNormal;
          vUV = aUV;
          gl_Position = uModelViewProjection * vec4(aPosition, 1.0);
      }
        `;

    const fragmentShaderSrc = `#version 300 es
      precision mediump float;

      #define MAX_LIGHTS 8

        struct Light {
          int   type;
          vec3  color;
          float intensity;
          vec3  direction;
        };
        struct Material {
          vec3 diffuse;
          vec3 specular;
          float shininess;
          bool hasTexture;
        };

        uniform int uNumLights;
        uniform Light uLights[MAX_LIGHTS];
        uniform Material uMaterial;
        uniform sampler2D uTexture;
        uniform vec3 uViewPos;

        in vec3 vNormal;
        in vec3 vPosition;
        in vec2 vUV;
        out vec4 fragColor;

        void main() {
          vec3 baseColor = uMaterial.hasTexture ? texture(uTexture, vUV).rgb : uMaterial.diffuse;
          vec3 N = normalize(vNormal);
          vec3 V = normalize(uViewPos - vPosition);
          vec3 result = vec3(0);
          for (int i = 0; i < uNumLights; ++i) {
            Light light = uLights[i];
            vec3 L = light.type == 1 ? normalize(-light.direction) : vec3(0);
            float diff = light.type == 1 ? max(dot(N, L), 0.0) : 0.0;
            vec3 diffuse = diff * light.color * baseColor;
            vec3 specular = vec3(0);
            if (light.type == 1 && uMaterial.shininess > 0.0) {
              vec3 H = normalize(L + V);
              float s = pow(max(dot(N, H), 0.0), uMaterial.shininess);
              specular = s * light.color * uMaterial.specular;
            }
            if (light.type == 0) result += baseColor * light.color * light.intensity;
            else result += (diffuse + specular) * light.intensity;
          }
          fragColor = vec4(result, 1.0);
      }
    `;

    // Billboard vertex shader
    const billboardVertexShaderSrc = `#version 300 es
      precision mediump float;

      in vec3 aPosition;
      in vec3 aNormal;
      in vec2 aUV;
      in float aIndex;

      uniform mat4 uModelViewProjection;
      uniform mat4 uModel;
      uniform mat4 uNormalMatrix;
      uniform mat4 uViewMatrix;

      out vec3 vNormal;
      out vec3 vPosition;
      out vec2 vUV;

      void main() {
          vec4 worldPos = uModel * vec4(aPosition, 1.0);
          vPosition = worldPos.xyz;
          vNormal = mat3(uNormalMatrix) * aNormal;
          vUV = aUV;

          vec4 pos = uModelViewProjection * vec4(aPosition, 1.0);

          if (aIndex == 0.0) {
              pos.xyz += vec3(-0.5, -0.5, 0.0);
          } else if (aIndex == 1.0) {
              pos.xyz += vec3(0.5, -0.5, 0.0);
          } else if (aIndex == 2.0) {
              pos.xyz += vec3(0.0, 1.25, 0.0);
          }

          gl_Position = pos;
      }
    `;

    // Billboard fragment shader
    const billboardFragmentShaderSrc = `#version 300 es
      precision mediump float;

      #define MAX_LIGHTS 8

      struct Light {
        int   type;
        vec3  color;
        float intensity;
        vec3  direction;
      };

      struct Material {
        vec3 diffuse;
        vec3 specular;
        float shininess;
        bool hasTexture;
      };

      uniform int uNumLights;
      uniform Light uLights[MAX_LIGHTS];
      uniform Material uMaterial;
      uniform sampler2D uTexture;
      uniform vec3 uViewPos;

      in vec3 vNormal;
      in vec3 vPosition;
      in vec2 vUV;
      out vec4 fragColor;

      void main() {
        vec4 texColor = texture(uTexture, vUV);
        vec3 baseColor = uMaterial.hasTexture ? texColor.rgb : uMaterial.diffuse;
        float alpha = uMaterial.hasTexture ? texColor.a : 1.0;
        
        fragColor = vec4(baseColor, alpha);
      }
    `;

    this.program = this.createProgram(vertexShaderSrc, fragmentShaderSrc);
    this.billboardProgram = this.createProgram(billboardVertexShaderSrc, billboardFragmentShaderSrc);
    GraphicsContext.program = this.program;
    GraphicsContext.billboardProgram = this.billboardProgram;
    this.gl.useProgram(this.program);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    console.log("init complete.");

    this.lights = [];
  },

  // Renders every object in the scene by traversing scene hierarchy
  render() {
    const gl = this.gl;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // projectionMatrix * viewMatrix of the active camera
    const viewProj = this.camera.projectionMatrix.multiply(
      this.camera.viewMatrix
    );
    this.lights.forEach((light, i) => {
      light.draw(i);
    });
    
    this.scene.traverse((obj) => {
      if (!obj.visible || !obj.mesh || !obj.mesh.material) return;

      // Check if this is a billboard object
      const isBillboard = obj.mesh instanceof BillboardMesh;
      const program = isBillboard ? this.billboardProgram : this.program;
      
      gl.useProgram(program);
      
      let modelMat = obj.getWorldMatrix();
      const uModel = gl.getUniformLocation(program, "uModel");
      gl.uniformMatrix4fv(uModel, true, modelMat.elements);
      
      let normalMatrix = modelMat.clone().inverse();
      const uNormalModel = gl.getUniformLocation(program, "uNormalMatrix");
      gl.uniformMatrix4fv(uNormalModel, false, normalMatrix.elements);
      
      let mvp = viewProj.multiply(obj.getWorldMatrix());
      const uMVP = gl.getUniformLocation(program, "uModelViewProjection");
      gl.uniformMatrix4fv(uMVP, true, mvp.elements);

      // Set view position for both programs
      const uViewPos = gl.getUniformLocation(program, "uViewPos");
      gl.uniform3fv(uViewPos, this.camera.getGlobalPosition().toArray());

      // Set lighting uniforms
      const numLights = gl.getUniformLocation(program, "uNumLights");
      gl.uniform1i(numLights, this.lights.length);

      obj.draw();
    });
    
    // Switch back to main program
    gl.useProgram(this.program);
  },

  // Call this to begin the program
  start() {
    
    if (this.scene == null) {
      throw new Error("Tried to start rendering without a Scene");
    }
    this.scene.traverse((obj) => {
      obj.start();
    });
    this.loop();

    this.lastTime  = performance.now();
    const interval = 1000 / 60; // 60 Hz

    setInterval(() => {
      const now = performance.now();
      const dt  = (now - this.lastTime) / 1000;
      this.lastTime  = now;
      if (this.debugWindow && !this.debugWindow.closed) {
        const ptrEl = this.debugWindow.document.getElementById("ptr");
        if (ptrEl) ptrEl.textContent = `PTR: ${1/dt}Hz`;
      }
      this.scene.traverse((obj) => {
        if (obj.stopped == false) {
          obj.update(dt);
        } else {
          console.log("stopped");
        }
        if (obj.dirty) {
          if (obj == this.camera) {
            const uViewPos = this.gl.getUniformLocation(
              this.program,
              "uViewPos"
            );
            this.gl.uniform3fv(
              uViewPos,
              this.camera.getGlobalPosition().toArray()
            );
          }
          obj.updateWorldMatrix();
          obj.dirty = false;
        }
      });
    }, interval);
  },
  updateHierarchy() {
    if (!this.debugWindow || this.debugWindow.closed) return;

    const container = this.debugWindow.document.getElementById("hierarchy");
    if (!container) return;
    let html = "";
    let objs = [];

    this.scene.traverse((obj) => {
      html += `<div class="node" style="padding-left:${obj.depth * 20}px">
                        <input type="checkbox" class="visibility-toggle" ${
                          obj.visible ? "checked" : ""
                        }>
                        ${obj.name}
                     </div>`;
      objs.push(obj);
    });

    container.innerHTML = html;

    const checkboxes = container.querySelectorAll("input.visibility-toggle");
    checkboxes.forEach((checkbox, i) => {
      const obj = objs[i];
      checkbox.addEventListener("change", () => {
        obj.visible = checkbox.checked;
      });
    });
  },

  // This is the loop that runs every frame
  loop() {
    const now = performance.now();
    this.frames = this.frames + 1;
    if (now - this.timeOfLastFPS > 1000) {
      this.timeOfLastFPS = now;
      let fps = this.frames;
      this.frames = 0;
      // Update the debug window if open
      if (this.debugWindow && !this.debugWindow.closed) {
        const fpsEl = this.debugWindow.document.getElementById("fps");
        if (fpsEl) fpsEl.textContent = `FPS: ${fps}`;
        this.updateHierarchy();
      }
    }

    this.render();

    requestAnimationFrame(() => this.loop());
  },

  setActiveScene(scene) {
    this.scene = scene;
    GraphicsContext.scene = scene;
  },
  setActiveCamera(camera) {
    this.camera = camera;
  },
};

export { Vec3 } from "./math/Vec3.js";
export { Vec4 } from "./math/Vec4.js";
export { Mat4 } from "./math/Mat4.js";
