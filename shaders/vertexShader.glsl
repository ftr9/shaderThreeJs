uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;
attribute vec3 uv;

varying vec2 Vuv;

void main(){

    gl_Position = viewMatrix * projectionMatrix * modelMatrix * vec4(position,1.0);
    Vuv = uv;
}