import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const canvas = document.querySelector<HTMLCanvasElement>("#base-canvas");
const renderer = new THREE.WebGL1Renderer({
  antialias: true,
  canvas: canvas!,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
const fov = 40;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(
  fov,
  window.innerWidth / window.innerHeight,
  near,
  far
);
camera.position.z = 10;

const testingTexture = new THREE.TextureLoader().load(
  "../public/images/testing.jpg"
);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-1, 2, 5);
scene.add(light);

const lightHelper = new THREE.DirectionalLightHelper(light);
scene.add(lightHelper);

// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);

const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);

const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry, material);
cube.position.x = -2;
scene.add(cube);

export const animate = () => {
  requestAnimationFrame(animate);
  // camera.aspect = canvas!.clientWidth / canvas!.clientHeight;
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;
  controls.update();
  renderer.render(scene, camera);
};
