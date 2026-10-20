import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

import {OrbitControls} from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 20);
camera.lookAt(0, 0, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.castShadow = true;
scene.add(directionalLight);

const materials = {
    floor: new THREE.MeshStandardMaterial({color: 0x886a46}),
    wall: new THREE.MeshStandardMaterial({color: 0x000077})
};

const planeGeo = new THREE.BoxGeometry(20, 0.25, 20);

const floor = new THREE.Mesh(planeGeo, materials.floor);
floor.receiveShadow = true;
scene.add(floor);

for (let i = 0; i < 3; i++) {
    const wall = new THREE.Mesh(planeGeo, materials.wall);
    wall.position.y = 10.125;
    if (i % 2 == 0){
        wall.rotation.z = Math.PI * 0.5;
        wall.position.x = i == 0 ? 9.875 : -9.875
    } else {
        wall.rotation.x = Math.PI * 0.5;
        wall.position.z = -9.875;
    }
    wall.receiveShadow = true;
    scene.add(wall);
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    
    controls.update();

    renderer.render(scene, camera);
}

animate();