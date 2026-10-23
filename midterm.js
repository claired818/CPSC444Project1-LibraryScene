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

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 100, 100);
scene.add(directionalLight);

const materials = {
    floor: new THREE.MeshStandardMaterial({color: 0x604c39}),
    wall: new THREE.MeshStandardMaterial({color: 0x003300}),
    shelf: new THREE.MeshStandardMaterial({color: 0x937f6b}),
    shelfBacking: new THREE.MeshStandardMaterial({color: 0x402a16}),
    outerBook: [
        new THREE.MeshStandardMaterial({color: 0x8c1b62}),
        new THREE.MeshStandardMaterial({color: 0x8a8e91}),
        new THREE.MeshStandardMaterial({color: 0x114B5F}),
        new THREE.MeshStandardMaterial({color: 0xedb458}),
        new THREE.MeshStandardMaterial({color: 0x3e6f52})
    ],
    innerBook: new THREE.MeshStandardMaterial({color: 0xffe7ad}),
    desk: new THREE.MeshStandardMaterial({color: 0xefcda8})
};

const outerBookShape = new THREE.Shape()
    .moveTo(0, 0)
    .lineTo(0, -1)
    .absarc(0.25, -1, 0.25, Math.PI, 0)
    .lineTo(0.5, 0)
    .lineTo(0.49, 0)
    .lineTo(0.49, -1)
    .absarc(0.25, -1, 0.25, 0, Math.PI, true)
    .lineTo(0.01, 0)
    .lineTo(0, 0);
const innerBookShape = new THREE.Shape()
    .moveTo(0.2, 0)
    .lineTo(0.2, -0.99)
    .absarc(0.25, -1, 0.05, Math.PI, 0)
    .lineTo(0.3, 0)
    .lineTo(0.2, 0);

const geometries = {
    board: new THREE.BoxGeometry(20, 0.25, 20),
    shelf: new THREE.BoxGeometry(2, 1, 2),
    shelfBacking: new THREE.PlaneGeometry(19, 19),
    outerBook: [
        new THREE.ExtrudeGeometry(outerBookShape, {depth: 2}),
        new THREE.ExtrudeGeometry(outerBookShape, {depth: 2.25}),
        new THREE.ExtrudeGeometry(outerBookShape, {depth: 2.5}),
        new THREE.ExtrudeGeometry(outerBookShape, {depth: 2.75}),
        new THREE.ExtrudeGeometry(outerBookShape, {depth: 3}),
    ],
    innerBook: [
        new THREE.ExtrudeGeometry(innerBookShape, {depth: 1.9}),
        new THREE.ExtrudeGeometry(innerBookShape, {depth: 2.15}),
        new THREE.ExtrudeGeometry(innerBookShape, {depth: 2.4}),
        new THREE.ExtrudeGeometry(innerBookShape, {depth: 2.65}),
        new THREE.ExtrudeGeometry(innerBookShape, {depth: 2.9})
    ],
    deskTop: new THREE.BoxGeometry(8, 0.5, 5),
    deskPost: new THREE.BoxGeometry(1, 4, 1)
};

//create the floor of the room
const floor = new THREE.Mesh(geometries.board, materials.floor);
floor.receiveShadow = true;
scene.add(floor);

//create the wall of the room
for (let i = 0; i < 3; i++) {
    const wall = new THREE.Mesh(geometries.board, materials.wall);
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
//create the shelf posts
for (let i = 0; i < 4; i++) {
    const shelfPost = new THREE.Mesh(geometries.shelf, materials.shelf);
    shelfPost.scale.y = 20;
    shelfPost.position.set(i % 2 == 0 ? 8.75 : -8.75, 10, i < 2 ? 8.95 : -8.75);
    scene.add(shelfPost);
}

//create tops and bottoms of shelves
for (let i = 0; i < 6; i++) {
    const shelfOuters = new THREE.Mesh(geometries.shelf, materials.shelf);
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
    const middleShelf = new THREE.Mesh(geometries.shelf, materials.shelf);
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
for (let i = 0; i < 3; i++) {
    const shelfBacking = new THREE.Mesh(geometries.shelfBacking, materials.shelfBacking);
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

//Books
//back shelves
let y = 1.45;
for (let j = 0; j < 4; j++){
    let x = -7.54;
    for (let i = 0; i < 22; i++) {
        let geoNum = Math.floor(Math.random() * geometries.outerBook.length);
        
        const outerBook = new THREE.Mesh(geometries.outerBook[geoNum], materials.outerBook[Math.floor(Math.random() * materials.outerBook.length)]);
        outerBook.position.set(x, y, -9.7);
        outerBook.rotation.x = -Math.PI * 0.5;
        scene.add(outerBook);
        
        const innerBook = new THREE.Mesh(geometries.innerBook[geoNum], materials.innerBook);
        innerBook.position.set(x, y, -9.7);
        innerBook.rotation.x = -Math.PI * 0.5;
        scene.add(innerBook);
        
        x += 0.7;
    }
    y += 4.66;
}

//left shelves
y = 1.45;
for (let j = 0; j < 4; j++){
    let z = 7.7;
    for (let i = 0; i < 22; i++) {
        let geoNum = Math.floor(Math.random() * geometries.outerBook.length);
        
        const outerBook = new THREE.Mesh(geometries.outerBook[geoNum], materials.outerBook[Math.floor(Math.random() * materials.outerBook.length)]);
        outerBook.position.set(-9.7, y, z);
        outerBook.rotation.z = Math.PI * 0.5;
        outerBook.rotation.x = -Math.PI * 0.5;
        scene.add(outerBook);
        
        const innerBook = new THREE.Mesh(geometries.innerBook[geoNum], materials.innerBook);
        innerBook.position.set(-9.7, y, z);
        innerBook.rotation.z = Math.PI * 0.5;
        innerBook.rotation.x = -Math.PI * 0.5;
        scene.add(innerBook);
        
        z -= 0.7;
    }
    y += 4.66;
}

//right shelves
y = 1.45;
for (let j = 0; j < 4; j++){
    let z = 7.2;
    for (let i = 0; i < 22; i++) {
        let geoNum = Math.floor(Math.random() * geometries.outerBook.length);
        
        const outerBook = new THREE.Mesh(geometries.outerBook[geoNum], materials.outerBook[Math.floor(Math.random() * materials.outerBook.length)]);
        outerBook.position.set(9.7, y, z);
        outerBook.rotation.z = -Math.PI * 0.5;
        outerBook.rotation.x = -Math.PI * 0.5;
        scene.add(outerBook);
        
        const innerBook = new THREE.Mesh(geometries.innerBook[geoNum], materials.innerBook);
        innerBook.position.set(9.7, y, z);
        innerBook.rotation.z = -Math.PI * 0.5;
        innerBook.rotation.x = -Math.PI * 0.5;
        scene.add(innerBook);
        
        z -= 0.7;
    }
    y += 4.66;
}

//Desk
const deskTop = new THREE.Mesh(geometries.deskTop, materials.desk);
deskTop.position.set(0, 4, 0);
scene.add(deskTop);

for (let i = 0; i < 4; i++) {
    const deskPost = new THREE.Mesh(geometries.deskPost, materials.desk);
    deskPost.position.set(i % 2 == 0 ? -3 : 3, 2, i >1 ? 1.5 : -1.5);
    scene.add(deskPost);
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