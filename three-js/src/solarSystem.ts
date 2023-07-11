import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface SphereInput {
  scale: number;
  color?: number;
  emissive?: number;
  textureImage?: THREE.Texture;
  normalImage?: THREE.Texture;
  isBasicMaterial?: boolean;
}

const createSphere = (input: SphereInput = { scale: 1 }) => {
  const { scale, color, emissive, textureImage, normalImage, isBasicMaterial } =
    input;
  const sphereGeometry = new THREE.SphereGeometry(1, 50, 50);
  const materialOptions = {
    ...(emissive && { emissive }),
    ...(color && { color }),
    ...(textureImage && { map: textureImage }),
    ...(normalImage && { normal: normalImage }),
  };
  const material = isBasicMaterial
    ? new THREE.MeshBasicMaterial(materialOptions)
    : new THREE.MeshPhongMaterial(materialOptions);

  const mesh = new THREE.Mesh(sphereGeometry, material);
  mesh.scale.set(scale, scale, scale);
  return mesh;
};

const inialize = () => {
  const canvas = document.querySelector<HTMLCanvasElement>("#base-canvas");
  const renderer = new THREE.WebGL1Renderer({
    antialias: true,
    canvas: canvas!,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  const scene = new THREE.Scene();
  return { canvas, renderer, scene };
};

const setupCamera = (fov: number, near: number, far: number) => {
  return new THREE.PerspectiveCamera(
    fov,
    window.innerWidth / window.innerHeight,
    near,
    far
  );
};

export const render = () => {
  const { renderer, scene } = inialize();
  renderer.shadowMap.enabled = true;
  const camera = setupCamera(40, 0.1, 1000);
  const controls = new OrbitControls(camera, renderer.domElement);

  camera.position.set(0, 20, 50);
  // camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);
  scene.background = new THREE.Color(0x000000);

  const light = new THREE.PointLight(0xffffff);
  light.castShadow = true;
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.03);
  scene.add(ambientLight);

  const solarSystem = new THREE.Object3D();
  scene.add(solarSystem);

  const sunTexture = new THREE.TextureLoader().load(
    "../public/images/1200px-Map_of_the_full_sun.jpg"
  );
  const earthTexture = new THREE.TextureLoader().load(
    "../public/images/earth.jpg"
  );
  const normalTexture = new THREE.TextureLoader().load(
    "../public/images/normal.jpeg"
  );
  const moonTexture = new THREE.TextureLoader().load(
    "../public/images/moon.jpg"
  );

  // const sunGrid = new THREE.GridHelper(15, 15);
  // solarSystem.add(sunGrid);
  const sun = createSphere({
    scale: 5,
    textureImage: sunTexture,
    normalImage: normalTexture,
    isBasicMaterial: true,
  });
  solarSystem.add(sun);

  // const earthGrid = new THREE.GridHelper(10, 10);
  const earthOrbit = new THREE.Object3D();
  // earthOrbit.add(earthGrid);
  earthOrbit.position.x = 10;
  solarSystem.add(earthOrbit);
  const earth = createSphere({
    scale: 1,
    textureImage: earthTexture,
    normalImage: normalTexture,
  });
  earth.castShadow = true;
  earthOrbit.add(earth);

  // const moonGrid = new THREE.GridHelper(5, 5);
  const moonOrbit = new THREE.Object3D();
  // moonOrbit.add(moonGrid);
  moonOrbit.position.x = 2;
  earthOrbit.add(moonOrbit);
  const moon = createSphere({
    scale: 0.25,
    textureImage: moonTexture,
    normalImage: normalTexture,
  });
  moon.receiveShadow = true;
  moonOrbit.add(moon);

  const animate = () => {
    // camera.aspect = canvas!.clientWidth / canvas!.clientHeight;
    earth.rotation.y += 0.03;
    earthOrbit.rotation.y += 0.05;
    moon.rotation.y += 0.05;
    moonOrbit.rotation.y += 0.05;
    sun.rotation.y += 0.005;
    solarSystem.rotation.y += 0.01;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();
};
