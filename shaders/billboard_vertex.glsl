#version 300 es

in vec3 aPosition;
in vec3 aNormal;
in vec2 aUV;

uniform mat4 uModelViewProjection;
uniform mat4 uModel;
uniform mat4 uNormalMatrix;
uniform mat4 uViewMatrix;
uniform vec3 uCameraPosition;

out vec3 vNormal;
out vec3 vPosition;
out vec2 vUV;

void main() {
    // Get the billboard center position in world space
    vec4 worldCenter = uModel * vec4(0.0, 0.0, 0.0, 1.0);
    
    // Calculate the direction from camera to billboard center
    vec3 toCamera = normalize(uCameraPosition - worldCenter.xyz);
    
    // Create a rotation matrix to face the camera
    // We'll use the camera's up vector and right vector to orient the billboard
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 right = normalize(cross(toCamera, up));
    up = normalize(cross(right, toCamera));
    
    // Create the billboard transformation matrix
    mat3 billboardMatrix = mat3(right, up, toCamera);
    
    // Transform the vertex position to face the camera
    vec3 billboardVertex = billboardMatrix * aPosition;
    
    // Apply the model transformation to the billboard center
    vec4 finalPosition = uModel * vec4(billboardVertex, 1.0);
    
    // Pass through to fragment shader
    vPosition = finalPosition.xyz;
    vNormal = normalize(billboardMatrix * aNormal);
    vUV = aUV;
    
    // Apply view-projection transformation
    gl_Position = uModelViewProjection * vec4(billboardVertex, 1.0);
} 