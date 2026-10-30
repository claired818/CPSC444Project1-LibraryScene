import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

import {OrbitControls} from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 35, 35);
camera.lookAt(0, 25, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xeeeedd, 200);
spotLight.position.set(0, 5, 21);
spotLight.target.position.set(0, 10, -2.5);
scene.add(spotLight);
// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);

const materials = {
    floor: new THREE.MeshPhongMaterial({color: 0x604c39, shininess: 400}),
    wall: new THREE.MeshLambertMaterial({color: 0x003300}),
    shelf: new THREE.MeshPhongMaterial({color: 0x937f6b, shininess: 200}),
    shelfBacking: new THREE.MeshLambertMaterial({color: 0x402a16}),
    outerBook: [
        new THREE.MeshStandardMaterial({color: 0x8c1b62, metalness: 0.5}),
        new THREE.MeshStandardMaterial({color: 0x8a8e91, metalness: 0.5}),
        new THREE.MeshStandardMaterial({color: 0x114B5F, metalness: 0.5}),
        new THREE.MeshStandardMaterial({color: 0xedb458, metalness: 0.5}),
        new THREE.MeshStandardMaterial({color: 0x3e6f52, metalness: 0.5})
    ],
    innerBook: new THREE.MeshLambertMaterial({color: 0xffe7ad}),
    deskChair: new THREE.MeshPhongMaterial({color: 0xefcda8, shininess: 300}),
    candle: new THREE.MeshStandardMaterial({color: 0xefddcc, roughness: 0.5, metalness: 0}),
    wand: new THREE.MeshPhongMaterial({color: 0x573412, shininess: 400}),
    potionBottle: new THREE.MeshPhysicalMaterial({color: 0x88ddff, opacity: 0.65, roughness: 0.5, metalness: 0.5, clearcoat: 0.5, transmission: 0.5}),
    potion: new THREE.MeshPhysicalMaterial({color: 0x33ff55, roughness: 0.4, metalness: 0.5, ior: 3, reflectivity: 1, iridescence: 1})
};

materials.potionBottle.transparent = true;

const shapes = {
    outerBook: new THREE.Shape()
        .moveTo(0, 0)
        .lineTo(0, -1)
        .absarc(0.25, -1, 0.25, Math.PI, 0)
        .lineTo(0.5, 0)
        .lineTo(0.49, 0)
        .lineTo(0.49, -1)
        .absarc(0.25, -1, 0.25, 0, Math.PI, true)
        .lineTo(0.01, 0)
        .lineTo(0, 0)
    ,
    innerBook: new THREE.Shape()
        .moveTo(0.2, 0)
        .lineTo(0.2, -0.99)
        .absarc(0.25, -1, 0.05, Math.PI, 0)
        .lineTo(0.3, 0)
        .lineTo(0.2, 0)
    ,
    openBookOuter: new THREE.Shape()
        .moveTo(0, 0)
        .lineTo(4, 0)
        .lineTo(4, 0.1)
        .lineTo(0, 0.1)
        .lineTo(0, 0)
    ,
    openBookInner: new THREE.Shape()
        .moveTo(0, 0)
        .lineTo(3.5, 0)
        .absarc(2.625, -0.5, 0.875, Math.PI * 0.15, Math.PI * 0.85)
        .absarc(0.875, -0.5, 0.875, Math.PI * 0.15, Math.PI * 0.85)
        .lineTo(0,0)
    ,
    potionBottleTop: new THREE.Shape()
        .absarc(0, 0, 0.25, 0, Math.PI * 2)
};

const geometries = {
    wall: new THREE.BoxGeometry(20, 0.25, 30),
    floor: new THREE.BoxGeometry(30, 0.25, 30),
    shelf: new THREE.BoxGeometry(2, 1, 2),
    shelfBacking: new THREE.PlaneGeometry(29, 19),
    outerBook: [
        new THREE.ExtrudeGeometry(shapes.outerBook, {depth: 2}),
        new THREE.ExtrudeGeometry(shapes.outerBook, {depth: 2.25}),
        new THREE.ExtrudeGeometry(shapes.outerBook, {depth: 2.5}),
        new THREE.ExtrudeGeometry(shapes.outerBook, {depth: 2.75}),
        new THREE.ExtrudeGeometry(shapes.outerBook, {depth: 3}),
    ],
    innerBook: [
        new THREE.ExtrudeGeometry(shapes.innerBook, {depth: 1.9}),
        new THREE.ExtrudeGeometry(shapes.innerBook, {depth: 2.15}),
        new THREE.ExtrudeGeometry(shapes.innerBook, {depth: 2.4}),
        new THREE.ExtrudeGeometry(shapes.innerBook, {depth: 2.65}),
        new THREE.ExtrudeGeometry(shapes.innerBook, {depth: 2.9})
    ],
    openBookOuter: new THREE.ExtrudeGeometry(shapes.openBookOuter, {depth: 3}),
    openBookInner: new THREE.ExtrudeGeometry(shapes.openBookInner, {depth: 2.5}),
    deskTop: new THREE.BoxGeometry(12, 0.75, 6),
    post: new THREE.BoxGeometry(1.25, 6.5, 1.25),
    chairSeat: new THREE.BoxGeometry(4.5, 0.75, 4.5),
    candleBottom: new THREE.CylinderGeometry(0.2, 0.2, 1.5),
    candleTop: new THREE.CylinderGeometry(0.15, 0.2, 0.1),
    wand: new THREE.ConeGeometry(0.125, 3),
    potionBottleBottom: new THREE.SphereGeometry(0.75),
    potionBottleNeck: new THREE.CylinderGeometry(0.25, 0.25, 0.7),
    potionBottleTop: new THREE.ExtrudeGeometry(shapes.potionBottleTop, {depth: 0.05}),
    potion: new THREE.SphereGeometry(0.5)
};

//create the floor of the room
const floor = new THREE.Mesh(geometries.floor, materials.floor);
floor.receiveShadow = true;
scene.add(floor);

//create the wall of the room
for (let i = 0; i < 3; i++) {
    const wall = new THREE.Mesh(geometries.wall, materials.wall);
    wall.position.y = 10.125;
    if (i % 2 == 0){
        wall.rotation.z = Math.PI * 0.5;
        wall.position.x = i == 0 ? 14.875 : -14.875
    } else {
        wall.rotation.x = Math.PI * 0.5;
        wall.rotation.y = Math.PI * 0.5;
        wall.position.z = -14.875;
    }
    wall.receiveShadow = true;
    scene.add(wall);
}

//Bookshelves
//create the shelf posts
for (let i = 0; i < 4; i++) {
    const shelfPost = new THREE.Mesh(geometries.shelf, materials.shelf);
    shelfPost.scale.y = 20;
    shelfPost.position.set(i % 2 == 0 ? 13.75 : -13.75, 10, i < 2 ? 13.95 : -13.75);

    shelfPost.castShadow = true;
    shelfPost.receiveShadow = true;

    scene.add(shelfPost);
}

//create tops and bottoms of shelves
for (let i = 0; i < 6; i++) {
    const shelfOuters = new THREE.Mesh(geometries.shelf, materials.shelf);
    shelfOuters.scale.y = 27;
    shelfOuters.scale.z = 0.25;
    shelfOuters.rotation.x = Math.PI * 0.5;
    shelfOuters.rotation.z = i > 3 ? Math.PI * 0.5 : 0;
    if (i < 4) {
        shelfOuters.position.set(i % 2 == 0 ? 13.75 : -13.75, i < 2 ? 1 : 19.75, 0);
    } else {
        shelfOuters.position.set(0, i % 2 == 0 ? 1 : 19.75, -13.75);
    }

    shelfOuters.castShadow = true;
    shelfOuters.receiveShadow = true;

    scene.add(shelfOuters);
}

//create the middle shelves
for (let i = 0; i < 9; i++) {
    const middleShelf = new THREE.Mesh(geometries.shelf, materials.shelf);
    middleShelf.scale.y = 27;
    middleShelf.scale.z = 0.25;
    middleShelf.scale.x = 0.75;
    middleShelf.rotation.x = Math.PI * 0.5;
    if (i < 3) {
        middleShelf.position.set(13.95, (4.7 * (i + 1)) + 1, 0);
    } else if (i < 6) {
        middleShelf.position.set(-13.95, (4.7 * ((i - 3) + 1)) + 1, 0);
    } else {
        middleShelf.rotation.z = Math.PI * 0.5;
        middleShelf.position.set(0, (4.7 * ((i - 6) + 1)) + 1, -13.95);
    }

    middleShelf.castShadow = true;
    middleShelf.receiveShadow = true;

    scene.add(middleShelf);
}

//create the shelf backings
for (let i = 0; i < 3; i++) {
    const shelfBacking = new THREE.Mesh(geometries.shelfBacking, materials.shelfBacking);
    switch (i) {
        case 0:
            shelfBacking.rotation.y = Math.PI * 0.5;
            shelfBacking.position.set(-14.74, 10.4, 0);
            break;
        case 1:
            shelfBacking.rotation.y = -Math.PI * 0.5;
            shelfBacking.position.set(14.74, 10.4, 0);
            break;
        case 2:
            shelfBacking.position.set(0, 10.4, -14.74);
    }

    shelfBacking.receiveShadow = true;

    scene.add(shelfBacking);
}

//Books
//back shelves
let y = 1.45;
for (let j = 0; j < 4; j++){
    let x = -12.52;
    for (let i = 0; i < 36; i++) {
        let geoNum = Math.floor(Math.random() * geometries.outerBook.length);
        
        const outerBook = new THREE.Mesh(geometries.outerBook[geoNum], materials.outerBook[Math.floor(Math.random() * materials.outerBook.length)]);
        outerBook.position.set(x, y, -14.7);
        outerBook.rotation.x = -Math.PI * 0.5;

        outerBook.castShadow = true;
        outerBook.receiveShadow = true;

        scene.add(outerBook);
        
        const innerBook = new THREE.Mesh(geometries.innerBook[geoNum], materials.innerBook);
        innerBook.position.set(x, y, -14.7);
        innerBook.rotation.x = -Math.PI * 0.5;
        
        innerBook.castShadow = true;
        innerBook.receiveShadow = true;

        scene.add(innerBook);
        
        x += 0.7;
    }
    y += 4.66;
}

//left shelves
y = 1.45;
for (let j = 0; j < 4; j++){
    let z = 12.6;
    for (let i = 0; i < 36; i++) {
        let geoNum = Math.floor(Math.random() * geometries.outerBook.length);
        
        const outerBook = new THREE.Mesh(geometries.outerBook[geoNum], materials.outerBook[Math.floor(Math.random() * materials.outerBook.length)]);
        outerBook.position.set(-14.7, y, z);
        outerBook.rotation.z = Math.PI * 0.5;
        outerBook.rotation.x = -Math.PI * 0.5;

        outerBook.castShadow = true;
        outerBook.receiveShadow = true;

        scene.add(outerBook);
        
        const innerBook = new THREE.Mesh(geometries.innerBook[geoNum], materials.innerBook);
        innerBook.position.set(-14.7, y, z);
        innerBook.rotation.z = Math.PI * 0.5;
        innerBook.rotation.x = -Math.PI * 0.5;

        innerBook.castShadow = true;
        innerBook.receiveShadow = true;

        scene.add(innerBook);
        
        z -= 0.7;
    }
    y += 4.66;
}

//right shelves
y = 1.45;
for (let j = 0; j < 4; j++){
    let z = 12.1;
    for (let i = 0; i < 36; i++) {
        let geoNum = Math.floor(Math.random() * geometries.outerBook.length);
        
        const outerBook = new THREE.Mesh(geometries.outerBook[geoNum], materials.outerBook[Math.floor(Math.random() * materials.outerBook.length)]);
        outerBook.position.set(14.7, y, z);
        outerBook.rotation.z = -Math.PI * 0.5;
        outerBook.rotation.x = -Math.PI * 0.5;

        outerBook.castShadow = true;
        outerBook.receiveShadow = true;

        scene.add(outerBook);
        
        const innerBook = new THREE.Mesh(geometries.innerBook[geoNum], materials.innerBook);
        innerBook.position.set(14.7, y, z);
        innerBook.rotation.z = -Math.PI * 0.5;
        innerBook.rotation.x = -Math.PI * 0.5;
        
        innerBook.castShadow = true;
        innerBook.receiveShadow = true;
        
        scene.add(innerBook);
        
        z -= 0.7;
    }
    y += 4.66;
}

//Desk
const deskTop = new THREE.Mesh(geometries.deskTop, materials.deskChair);
deskTop.position.set(0, 6.5, 0);

deskTop.castShadow = true;
deskTop.receiveShadow = true;

scene.add(deskTop);

for (let i = 0; i < 4; i++) {
    const deskPost = new THREE.Mesh(geometries.post, materials.deskChair);
    deskPost.position.set(i % 2 == 0 ? -4.6 : 4.6, 3.25, i > 1 ? 1.6 : -1.6);

    deskPost.castShadow = true;
    deskPost.receiveShadow = true;

    scene.add(deskPost);
}

//Chair
const chairSeat = new THREE.Mesh(geometries.chairSeat, materials.deskChair);
chairSeat.position.set(0, 4, -3);

chairSeat.castShadow = true;
chairSeat.receiveShadow = true;

scene.add(chairSeat);

for (let i = 0; i < 4; i++) {
    const chairPost = new THREE.Mesh(geometries.post, materials.deskChair);
    chairPost.scale.set(0.7, 0.6, 0.7);
    chairPost.position.set(i % 2 == 0 ? -1.81 : 1.81, 2, i > 1 ? -1.19 : -4.81);

    chairPost.castShadow = true;
    chairPost.receiveShadow = true;

    scene.add(chairPost);
}

for (let i = 0; i < 4; i++) {
    const chairBack = new THREE.Mesh(geometries.post, materials.deskChair);
    chairBack.scale.set(0.6, 0.69, 0.6);
    if (i < 2) {
        chairBack.position.set(i % 2 == 0 ? -1.87 : 1.87, 6.6, -4.87);
    } else {
        chairBack.rotation.z = Math.PI * 0.5;
        chairBack.position.set(0, i > 2 ? 6.5 : 8, -4.87);
    }

    chairBack.castShadow = true;
    chairBack.receiveShadow = true;

    scene.add(chairBack);
}

//Open Book
const openBookOuter = new THREE.Mesh(geometries.openBookOuter, materials.outerBook[Math.floor(Math.random() * materials.outerBook.length)]);
openBookOuter.position.set(-2, 6.9, -2.5);

openBookOuter.castShadow = true;
openBookOuter.receiveShadow = true;

scene.add(openBookOuter);

const openBookInner = new THREE.Mesh(geometries.openBookInner, materials.innerBook);
openBookInner.position.set(-1.75, 7.15, -2.25);

openBookInner.castShadow = true;
openBookInner.receiveShadow = true;

scene.add(openBookInner);

const openBookLight = new THREE.PointLight(0xaa33ff, 100, 4);
openBookLight.position.set(0, 9, -1);
scene.add(openBookLight);
// const bookLightHelper = new THREE.PointLightHelper(openBookLight);
// scene.add(bookLightHelper);

//Candles
let xMin = -11;
let xMax = 11;

let zMin = -11;
let zMax = 13.5;

let yMin = 14;
let yMax = 17.5;

let gapMin = 5;
let gapMax = 7;
let gapMid = (gapMax + gapMin) / 2;

let candles = [];
let z = Math.random() * ((zMin + gapMid) - zMin) + zMin;

while (z <= zMax - gapMax) {
    let x = Math.random() * ((xMin + gapMid) - xMin) + xMin;
    while (x <= Math.random() * (xMax - (xMax - gapMid)) + (xMax - gapMid)) {
        const currentZ = Math.random() * gapMax + z;
        const currentY = Math.random() * (yMax - yMin) + yMin;

        const candleBottom = new THREE.Mesh(geometries.candleBottom, materials.candle);
        candleBottom.position.set(x, currentY, currentZ);

        candleBottom.castShadow = true;
        candleBottom.receiveShadow = true;

        scene.add(candleBottom);

        const candleTop = new THREE.Mesh(geometries.candleTop, materials.candle);
        candleTop.position.set(x, currentY + 0.8, currentZ);

        candleTop.castShadow = true;
        candleTop.receiveShadow = true;

        scene.add(candleTop);

        const wick = new THREE.PointLight(0xff8800, 10, 2.5);
        wick.position.set(x, currentY + 1.25, currentZ);
        scene.add(wick);
        const wickHelper = new THREE.PointLightHelper(wick, 0.1);
        scene.add(wickHelper);
        
        candles.push({
            bottom: candleBottom,
            top: candleTop,
            wick: wick,
            phase: Math.asin((currentY - 15.75) / 1.75)
        });

        x += Math.random() * (gapMax - gapMin) + gapMin;
    }
    z += 2.1;
}

//Wand
const wand = new THREE.Mesh(geometries.wand, materials.wand);
wand.position.set(-2.5, 7, -1);
wand.rotation.x = Math.PI * 0.5;

wand.castShadow = true;
wand.receiveShadow = true;

scene.add(wand);

const wandLight = new THREE.PointLight(0x2233aa);
wandLight.position.set(-2.5, 7, 0.5);
scene.add(wandLight);
// const wandlighthelper = new THREE.PointLightHelper(wandLight);
// scene.add(wandlighthelper);

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

//Potion Bottle
const potionBottleBottom = new THREE.Mesh(geometries.potionBottleBottom, materials.potionBottle);
potionBottleBottom.position.set(-5, 7.4, 1.95);

potionBottleBottom.castShadow = true;
potionBottleBottom.receiveShadow = true;

scene.add(potionBottleBottom);

const potionBottleNeck = new THREE.Mesh(geometries.potionBottleNeck, materials.potionBottle);
potionBottleNeck.position.set(-5, 8.2, 1.95);

potionBottleNeck.castShadow = true;
potionBottleNeck.receiveShadow = true;

scene.add(potionBottleNeck);

const potionBottleTop = new THREE.Mesh(geometries.potionBottleTop, materials.potionBottle);
potionBottleTop.position.set(-5, 8.6, 1.95);
potionBottleTop.rotation.x = -Math.PI * 0.5;

potionBottleTop.castShadow = true;
potionBottleTop.receiveShadow = true;

scene.add(potionBottleTop);

const potion = new THREE.Mesh(geometries.potion, materials.potion);
potion.position.set(-5, 7.4, 1.95);
scene.add(potion);

const clock = new THREE.Clock();

const speedMax = 2;
const speedMin = 0.5;

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getDelta();
    candles.forEach((candle) => {
        let speed = Math.random() * (speedMax - speedMin) + speedMin;
        candle.phase += time * speed;
        candle.bottom.position.y = Math.sin(candle.phase) * 1.75 + 15.75;
        candle.top.position.y = candle.bottom.position.y + 0.8;
        candle.wick.position.y = candle.bottom.position.y + 1.25;
    });

    openBookOuter.position.y = Math.sin(Date.now() * 0.0025) * 1.05 + 7.95;
    openBookInner.position.y = openBookOuter.position.y + 0.25;
    openBookLight.position.y = openBookOuter.position.y + 2.9;

    wandLight.intensity = Math.sin(Date.now() * 0.0025) * 10 + 15;

    controls.update();

    renderer.render(scene, camera);
}

animate();