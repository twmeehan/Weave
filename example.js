import { Vec3, Vec4, Mat4 , WEAVE} from './output/weave.esm.js'; 

// Call init to initialize the engine
WEAVE.init();

////////////////////////////////////////////////////
// Scene
////////////////////////////////////////////////////

// The scene is the root of the object hierarchy
let scene = new WEAVE.Scene();
WEAVE.setActiveScene(scene);

////////////////////////////////////////////////////
// Camera
////////////////////////////////////////////////////

let camera = new WEAVE.Camera(WEAVE.Camera.PERSPECTIVE);
let controls = new WEAVE.CameraController(camera,canvas)
WEAVE.setActiveCamera(camera);
 
////////////////////////////////////////////////////
// Lights
////////////////////////////////////////////////////

let sunLight = new WEAVE.DirectionalLight(new Vec3(-1,-1.3,-0.8),new Vec3(1,1,1),0.8);
let ambientLight = new WEAVE.AmbientLight(new Vec3(1,1,1),0.3);
// To add a light to the scene, push it to the WEAVE.lights array (Max 8)
WEAVE.lights.push(sunLight);
WEAVE.lights.push(ambientLight);

////////////////////////////////////////////////////
// Objects
////////////////////////////////////////////////////

/*
// Load an OBJ file and create a GameObject with it
let mesh = (await WEAVE.Loader.loadOBJ('object.obj'))[0];
let obj = new WEAVE.GameObject();
obj.mesh = mesh;
*/

// let box = new WEAVE.Box(new Vec3(0,0,0),new Vec3(1,1,1));
// box.mesh.material = new WEAVE.Material(new Vec3(1,0,0),new Vec3(0,1,0),new Vec3(0,0,1),10);
// box.update = (dt) => {
//     box.rotation.y += dt;
//     box.dirty = true;
// }


// Create a billboard that will always face the camera
let billboard = new WEAVE.Billboard(new Vec3(10, 0, 0), 1.0);
billboard.mesh.material = new WEAVE.Material(new Vec3(1,0,0),new Vec3(0,1,0),new Vec3(0,0,1),10);
billboard.setTexture(await WEAVE.Loader.loadTexture('texture.png'));
scene.add(billboard);


// Call start to begin the program loop
WEAVE.start();

document.addEventListener("keydown", e => {
    if (e.key === "d") {
      WEAVE.toggleDebugWindow(WEAVE.scene);
    }
  });
