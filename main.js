import "./style.css";
import * as THREE from "three";
import bg from "./public/bg.jpg"
 
//canvas
const canvas = document.querySelector("#webgl");
 
//シーン
const scene = new THREE.Scene();

// 背景テクスチャ
const textureLoader = new THREE.TextureLoader();
// const bgTexture = textureLoader.load("./public/bg.jpg");
const bgTexture = textureLoader.load(bg);
scene.background = bgTexture;


//サイズ
const sizes = {
  width: innerWidth,
  height: innerHeight,
};
 
//カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
 
//レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
 
// オブジェクト
const boxGeometry = new THREE.OctahedronGeometry(5);
const boxMaterial = new THREE.MeshPhysicalMaterial({
  color: "orange",
  metalness: 0.86,
  roughness: 0.37,
  flatShading: false,
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0.5, -15);
box.rotation.set(1, 1, 0);

const torusGeometry = new THREE.TorusGeometry(8, 2, 16, 100);
const torusMaterial = new THREE.MeshNormalMaterial();
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 1, 10);

scene.add(box, torus);

// ライト

const directionalLight = new THREE.DirectionalLight("yellow", 4);
directionalLight.position.set(0.8, 2, 0);
scene.add(directionalLight);


// 線形補完で移動
function lerp(x, y, a) {
  return (1 - a) * x + a * y; 
};

function scalePercent(start, end) {
  return (scrollParcent - start) / (end - start);
}



// スクロールアニメーション
const animationScripts = [];

animationScripts.push({
  start: 0,
  end: 40,
  function() {
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    // box.position.z += 0.01;
    box.position.z = lerp(-15, 2, scalePercent(0, 40));
    torus.position.z = lerp(10, -20, scalePercent(0, 40));
  },
});

animationScripts.push({
  start: 40,
  end: 60,
  function() {
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    // box.position.z += 0.01;
    box.rotation.z = lerp(1, Math.PI, scalePercent(40, 60));
  },
});

animationScripts.push({
  start: 60,
  end: 80,
  function() {
    camera.lookAt(box.position);
    camera.position.x = lerp(0, -15, scalePercent(60, 80));
    camera.position.y = lerp(1, 15, scalePercent(60, 80));
    camera.position.z = lerp(10, 1, scalePercent(60, 80));
  },
});

animationScripts.push({
  start: 80,
  end: 101,
  function() {
    camera.lookAt(box.position);
    box.rotation.x += 0.02;
    box.rotation.y += 0.02;
  },
});

// アニメーション開始

function playScrollAnimation() {
  animationScripts.forEach((animation) => {
    if(scrollParcent >= animation.start && scrollParcent <= animation.end)
    animation.function();
  });
}


// ブラウザのスクロール率取得

let scrollParcent = 0;
document.body.onscroll = () => {
  // console.log("scroll");
  scrollParcent = 
  (document.documentElement.scrollTop / 
  (document.documentElement.scrollHeight - 
  document.documentElement.clientHeight)) *
  100
  console.log(scrollParcent);
};





//アニメーション
const tick = () => {
  window.requestAnimationFrame(tick);
  playScrollAnimation();
  renderer.render(scene, camera);
};
 
tick();
 
//ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
 
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
 
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});