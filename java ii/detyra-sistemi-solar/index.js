import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Detyra 2: Sistemi solar i modifikuar - shtohet planeti Mars dhe sateliti i tij Phobos.
// Ideja (graf i skenes): cdo orbite eshte nje Object3D bosh ne qender te prindit.
// Kur rrotullojme orbiten, rrotullohet edhe gjithcka qe eshte brenda saj.

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 4, 7);

const pointLight = new THREE.PointLight(0xffffff, 1);
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(pointLight, ambientLight);

// Dielli
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, wireframe: true });
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sunMesh);

// ---------- Toka dhe Hena ----------
const earthOrbit = new THREE.Object3D();
scene.add(earthOrbit);

const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x000066, wireframe: true });
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
earthMesh.position.x = 2;
earthOrbit.add(earthMesh);

const moonGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moonMesh.position.x = 0.7;
earthMesh.add(moonMesh); // hena rrotullohet bashke me token

// ---------- Marsi dhe Phobos (e re) ----------
// Orbita e Marsit: Object3D ne qender te Diellit
const marsOrbit = new THREE.Object3D();
scene.add(marsOrbit);

// Marsi: me larg se Toka, pak me i vogel, ngjyre e kuqe
const marsGeometry = new THREE.SphereGeometry(0.35, 32, 32);
const marsMaterial = new THREE.MeshStandardMaterial({ color: 0xc1440e, wireframe: true });
const marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
marsMesh.position.x = 3.5;
marsOrbit.add(marsMesh);

// Orbita e Phobos: Object3D ne qender te Marsit
// (e ndajme nga rrotullimi i Marsit rreth vetes, qe Phobos te kete shpejtesine e vet)
const phobosOrbit = new THREE.Object3D();
marsMesh.add(phobosOrbit);

// Phobos: satelit i vogel, shume afer Marsit, pak i shtypur (forme jo e rregullt)
const phobosGeometry = new THREE.SphereGeometry(0.07, 16, 16);
const phobosMaterial = new THREE.MeshStandardMaterial({ color: 0x9e8b77 });
const phobosMesh = new THREE.Mesh(phobosGeometry, phobosMaterial);
phobosMesh.scale.set(1.3, 0.9, 1);
phobosMesh.position.x = 0.55;
phobosOrbit.add(phobosMesh);

// Vijat e orbitave (ndihmese vizuale)
function createOrbitLine(radius, color) {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius);
    const points = curve.getPoints(128).map(p => new THREE.Vector3(p.x, 0, p.y));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return new THREE.LineLoop(geometry, new THREE.LineBasicMaterial({ color }));
}
scene.add(createOrbitLine(2, 0x3355aa));
scene.add(createOrbitLine(3.5, 0xaa5533));

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById('scene').appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    sunMesh.rotation.y += 0.01;

    earthOrbit.rotation.y += 0.01;   // Toka rreth Diellit
    earthMesh.rotation.y += 0.02;    // Toka rreth vetes (dhe Hena me te)

    marsOrbit.rotation.y += 0.0053;  // Marsi rreth Diellit - me ngadale se Toka (~1.88 vite)
    marsMesh.rotation.y += 0.019;    // Marsi rreth vetes
    phobosOrbit.rotation.y += 0.06;  // Phobos rreth Marsit - shume shpejt

    renderer.render(scene, camera);
}
animate();
