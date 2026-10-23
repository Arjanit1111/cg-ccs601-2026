import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Detyra 1: Shtepia e ndertuar vetem me CylinderGeometry dhe ConeGeometry.
// Truku: nje cilinder me 4 segmente radiale eshte nje "kuti" (prizem katror),
// dhe nje kon me 4 segmente radiale eshte nje piramide (cati).

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // qielli

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(6, 5, 8);

// Materialet
const wallMaterial    = new THREE.MeshStandardMaterial({ color: 0xf5deb3 });
const roofMaterial    = new THREE.MeshStandardMaterial({ color: 0xb22222 });
const doorMaterial    = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
const windowMaterial  = new THREE.MeshStandardMaterial({ color: 0xadd8e6 });
const frameMaterial   = new THREE.MeshStandardMaterial({ color: 0xffffff });
const chimneyMaterial = new THREE.MeshStandardMaterial({ color: 0x777777 });
const grassMaterial   = new THREE.MeshStandardMaterial({ color: 0x4caf50 });
const trunkMaterial   = new THREE.MeshStandardMaterial({ color: 0x6b3e1f });
const leafMaterial    = new THREE.MeshStandardMaterial({ color: 0x1b7a2b });

// Toka (bari) - nje cilinder shume i holle
const ground = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 0.1, 64), grassMaterial);
ground.position.y = -0.05;
scene.add(ground);

// Grupi i shtepise
const house = new THREE.Group();
scene.add(house);

// Muret: cilinder me 4 segmente, rrotulluar 45 grade qe faqet te shikojne perpara
const walls = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 2.5, 4), wallMaterial);
walls.rotation.y = Math.PI / 4;
walls.position.y = 1.25;
house.add(walls);

// Catia: kon me 4 segmente (piramide), pak me e gjere se muret
const roof = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1.8, 4), roofMaterial);
roof.rotation.y = Math.PI / 4;
roof.position.y = 2.5 + 0.9;
house.add(roof);

// Oxhaku: cilinder mbi cati
const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1, 16), chimneyMaterial);
chimney.position.set(0.8, 3.7, -0.4);
house.add(chimney);

// Dera: disk (cilinder i holle) i zgjatur vertikalisht
const door = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.08, 32), doorMaterial);
door.rotation.x = Math.PI / 2;   // disku shikon perpara (aksi z)
door.scale.z = 1.7;              // zgjatet lart-poshte
door.position.set(0, 0.77, 1.43);
house.add(door);

// Doreza e deres: cilinder i vogel
const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16), frameMaterial);
knob.rotation.x = Math.PI / 2;
knob.position.set(0.25, 0.75, 1.5);
house.add(knob);

// Dritaret: disqe te rrumbullakta me korniza
function createWindow(x, y, z, rotationY) {
    const win = new THREE.Group();

    const frame = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.06, 32), frameMaterial);
    frame.rotation.x = Math.PI / 2;
    win.add(frame);

    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.08, 32), windowMaterial);
    glass.rotation.x = Math.PI / 2;
    win.add(glass);

    win.position.set(x, y, z);
    win.rotation.y = rotationY;
    return win;
}

house.add(createWindow(-0.85, 1.6, 1.43, 0));            // perpara majtas
house.add(createWindow( 0.85, 1.6, 1.43, 0));            // perpara djathtas
house.add(createWindow(-1.43, 1.4, 0, Math.PI / 2));     // ana e majte
house.add(createWindow( 0, 1.4, -1.43, Math.PI));        // prapa

// Kulla e rrumbullaket ne cep: cilinder + kon si cati
const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 3.4, 32), wallMaterial);
tower.position.set(2.0, 1.7, 0.9);
house.add(tower);

const towerRoof = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.4, 32), roofMaterial);
towerRoof.position.set(2.0, 3.4 + 0.7, 0.9);
house.add(towerRoof);

house.add(createWindow(2.0, 2.5, 1.6, 0));

// Shkallet para deres: dy disqe
const step1 = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.1, 32), chimneyMaterial);
step1.position.set(0, 0.05, 1.9);
house.add(step1);

// Pemet: trungu = cilinder, gjethet = tre kone njera mbi tjetren
function createTree(x, z, size = 1) {
    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 1, 16), trunkMaterial);
    trunk.position.y = 0.5;
    tree.add(trunk);

    for (let i = 0; i < 3; i++) {
        const leaves = new THREE.Mesh(
            new THREE.ConeGeometry(0.9 - i * 0.2, 1.1, 16),
            leafMaterial
        );
        leaves.position.y = 1.2 + i * 0.6;
        tree.add(leaves);
    }

    tree.position.set(x, 0, z);
    tree.scale.setScalar(size);
    return tree;
}

scene.add(createTree(-3.8, 1.5, 1.1));
scene.add(createTree(-3.2, -2.8, 0.9));
scene.add(createTree(4.2, -2.2, 1.2));
scene.add(createTree(-5.5, -0.5, 0.8));

// Dritat
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 2);
sunLight.position.set(5, 10, 7);
scene.add(sunLight);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('scene').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.5, 0);
controls.enableDamping = true;
controls.update();

window.addEventListener('resize', () => {
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
