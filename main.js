import * as THREE from 'three'
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls'
import { GUI } from 'dat.gui'
////scene
const scene = new THREE.Scene();

const gui = new GUI();

const textureLoader = new THREE.TextureLoader();
const loadedTexture = textureLoader.load('./images/spain.png');

////object
const flag = new THREE.Group();
const boxGeomtery = new THREE.PlaneBufferGeometry(3, 3, 32, 32);
const count = boxGeomtery.attributes.position.count;
const randomZ = new Float32Array(count);

for (let i = 0; i < count; i++) {
  randomZ[i] = Math.sin(i);
}

boxGeomtery.setAttribute('aZvalue', new THREE.BufferAttribute(randomZ, 1));

const boxMaterial = new THREE.ShaderMaterial({
  vertexShader: `
  uniform float uTime;

  attribute float aZvalue;

  varying vec2 Vuv;

  void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    modelPosition.z += sin(modelPosition.x * 6.0 + uTime) * 0.1;
    modelPosition.z += sin(modelPosition.y * 6.0  + uTime ) * 0.1;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;
    Vuv = uv;
  }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    varying vec2 Vuv;

    void main(){
      gl_FragColor = texture2D(uTexture,Vuv);
    }
  `,
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: loadedTexture },
  },
  side: THREE.DoubleSide
})
const mesh = new THREE.Mesh(boxGeomtery, boxMaterial);
mesh.scale.y = 0.6;
flag.add(mesh);
/*const cylinderGeometry = new THREE.CylinderBufferGeometry(0.1, 0.1, 4, 32, 32);
const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinderMesh.position.x = -1.45;
cylinderMesh.position.y = -1;
flag.add(cylinderMesh);*/
scene.add(flag);

gui.add(boxMaterial, 'wireframe');

////camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
camera.position.z = 5;
////renderer
const renderer = new THREE.WebGLRenderer();
document.body.append(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

////orbit control
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const clock = new THREE.Clock();
////animation loop
function animate() {
  const deltaTime = clock.getElapsedTime();
  requestAnimationFrame(animate);
  boxMaterial.uniforms.uTime.value = deltaTime;
  renderer.render(scene, camera);
}
animate();