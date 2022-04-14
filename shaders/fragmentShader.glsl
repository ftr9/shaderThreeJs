precision mediump float;

uniform sampler2D uTextures;
//uniform vec3 uColors;
varying vec2 Vuv;

void main(){
  vec4 textureColor = vec4(texture2D(uTextures,Vuv))
  gl_FragColor = textureColor;
}