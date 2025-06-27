#version 300 es
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
  
  // For billboards, we can use a simplified lighting model
  // since the normal is always facing the camera
  vec3 N = normalize(vNormal);
  vec3 V = normalize(uViewPos - vPosition);
  vec3 result = vec3(0);
  
  for (int i = 0; i < uNumLights; ++i) {
    Light light = uLights[i];
    
    if (light.type == 0) {
      // Ambient light
      result += baseColor * light.color * light.intensity;
    } else if (light.type == 1) {
      // Directional light
      vec3 L = normalize(-light.direction);
      float diff = max(dot(N, L), 0.0);
      vec3 diffuse = diff * light.color * baseColor;
      
      vec3 specular = vec3(0);
      if (uMaterial.shininess > 0.0) {
        vec3 H = normalize(L + V);
        float s = pow(max(dot(N, H), 0.0), uMaterial.shininess);
        specular = s * light.color * uMaterial.specular;
      }
      
      result += (diffuse + specular) * light.intensity;
    }
  }
  
  fragColor = vec4(result, 1.0);
} 