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

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(0, 100, 100);
// scene.add(directionalLight);

const materials = {
    floor: new THREE.MeshStandardMaterial({color: 0x604c39}),
    wall: new THREE.MeshStandardMaterial({color: 0x000077}),
    bookshelf: new THREE.MeshStandardMaterial({color: 0x937f6b}),
    bookshelfBacking: new THREE.MeshStandardMaterial({color: 0x402a16})
};

const planeGeo = new THREE.BoxGeometry(20, 0.25, 20);

//create the floor of the room
const floor = new THREE.Mesh(planeGeo, materials.floor);
floor.receiveShadow = true;
scene.add(floor);

//create the wall of the room
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

//Bookshelves
const shelfGeo = new THREE.BoxGeometry(2, 1, 2);

//create the shelf posts
for (let i = 0; i < 4; i++) {
    const shelfPost = new THREE.Mesh(shelfGeo, materials.bookshelf);
    shelfPost.scale.y = 20;
    shelfPost.position.set(i % 2 == 0 ? 8.75 : -8.75, 10, i < 2 ? 8.95 : -8.75);
    scene.add(shelfPost);
}

//create tops and bottoms of shelves
for (let i = 0; i < 6; i++) {
    const shelfOuters = new THREE.Mesh(shelfGeo, materials.bookshelf);
    shelfOuters.scale.y = 17;
    shelfOuters.scale.z = 0.25;
    shelfOuters.rotation.x = Math.PI * 0.5;
    shelfOuters.rotation.z = i > 3 ? Math.PI * 0.5 : 0;
    if (i < 4) {
        shelfOuters.position.set(i % 2 == 0 ? 8.75 : -8.75, i < 2 ? 1 : 19.75, 0);
    } else {
        shelfOuters.position.set(0, i % 2 == 0 ? 1 : 19.75, -8.75);
    }
    scene.add(shelfOuters);
}

//create the middle shelves
for (let i = 0; i < 9; i++) {
    const middleShelf = new THREE.Mesh(shelfGeo, materials.bookshelf);
    middleShelf.scale.y = 17;
    middleShelf.scale.z = 0.25;
    middleShelf.scale.x = 0.75;
    middleShelf.rotation.x = Math.PI * 0.5;
    if (i < 3) {
        middleShelf.position.set(8.95, (4.7 * (i + 1)) + 1, 0);
    } else if (i < 6) {
        middleShelf.position.set(-8.95, (4.7 * ((i - 3) + 1)) + 1, 0);
    } else {
        middleShelf.rotation.z = Math.PI * 0.5;
        middleShelf.position.set(0, (4.7 * ((i - 6) + 1)) + 1, -8.95);
    }
    scene.add(middleShelf);
}

//create the shelf backings
const shelfBackingGeo = new THREE.PlaneGeometry(19, 19);
for (let i = 0; i < 3; i++) {
    const shelfBacking = new THREE.Mesh(shelfBackingGeo, materials.bookshelfBacking);
    switch (i) {
        case 0:
            shelfBacking.rotation.y = Math.PI * 0.5;
            shelfBacking.position.set(-9.74, 10.4, 0);
            break;
        case 1:
            shelfBacking.rotation.y = -Math.PI * 0.5;
            shelfBacking.position.set(9.74, 10.4, 0);
            break;
        case 2:
            shelfBacking.position.set(0, 10.4, -9.74);
    }
    scene.add(shelfBacking);
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