import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Detyra 3: Dora robotike e modifikuar
//  - gishtat kane madhesi te ndryshme (gjatesi dhe gjeresi)
//  - gishtat levizin (perkulen ne dy nyje) me tastiere
//  - gishti i madh eshte zhvendosur ne anen e majte te shuplakes

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(8, 6, 12);
camera.lookAt(0, 3, 0);

const armMaterial    = new THREE.MeshStandardMaterial({ color: 0x3399ff });
const jointMaterial  = new THREE.MeshStandardMaterial({ color: 0x555555 });
const handMaterial   = new THREE.MeshStandardMaterial({ color: 0xffaa55 });
const fingerMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc88 });
const selectedMaterial = new THREE.MeshStandardMaterial({ color: 0xff6644 });

// ---------- Krahu (si ne ushtrimin e klases) ----------
const base = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32), jointMaterial);
scene.add(base);

const shoulder = new THREE.Group();
shoulder.position.y = 0.5;
base.add(shoulder);
shoulder.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), jointMaterial));

const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3, 0.7), armMaterial);
upperArm.position.y = 1.5;
shoulder.add(upperArm);

const elbow = new THREE.Group();
elbow.position.y = 3;
shoulder.add(elbow);
elbow.add(new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 32), jointMaterial));

const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.5, 0.6), armMaterial);
forearm.position.y = 1.25;
elbow.add(forearm);

const wrist = new THREE.Group();
wrist.position.y = 2.5;
elbow.add(wrist);
wrist.add(new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), jointMaterial));

// Shuplaka: gjeresia 1.8 (x nga -0.9 deri 0.9), lartesia 1.5 (y nga -0.75 deri 0.75)
const palm = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.5, 0.4), handMaterial);
palm.position.y = 0.9;
wrist.add(palm);

// ---------- Gishtat ----------
// Cdo gisht ka dy segmente (falanga) dhe dy nyje:
//   knuckle (nyja ne shuplake) -> segmenti 1 -> middleJoint -> segmenti 2
// Kur rrotullojme knuckle, levizin te dy segmentet; middleJoint perkul vetem majen.

const fingers = [];

function createFinger(name, width, length1, length2) {
    const knuckle = new THREE.Group();

    knuckle.add(new THREE.Mesh(new THREE.SphereGeometry(width * 0.6, 16, 16), jointMaterial));

    const segment1 = new THREE.Mesh(new THREE.BoxGeometry(width, length1, width), fingerMaterial);
    segment1.position.y = length1 / 2;
    knuckle.add(segment1);

    const middleJoint = new THREE.Group();
    middleJoint.position.y = length1;
    knuckle.add(middleJoint);

    middleJoint.add(new THREE.Mesh(new THREE.SphereGeometry(width * 0.55, 16, 16), jointMaterial));

    const segment2 = new THREE.Mesh(new THREE.BoxGeometry(width * 0.9, length2, width * 0.9), fingerMaterial);
    segment2.position.y = length2 / 2;
    middleJoint.add(segment2);

    const finger = {
        name,
        knuckle,
        middleJoint,
        meshes: [segment1, segment2],
        bend: 0,        // kendi aktual (radian)
        targetBend: 0   // kendi ku duam te arrijme (levizje e bute)
    };
    fingers.push(finger);
    return finger;
}

// Gishti i madh - ne anen e MAJTE te shuplakes, i pjerret nga jashte
const thumbBase = new THREE.Group();
thumbBase.position.set(-0.9, -0.15, 0);
thumbBase.rotation.z = THREE.MathUtils.degToRad(50); // pozitiv = drejtohet majtas-lart
palm.add(thumbBase);

const thumb = createFinger('gishti i madh', 0.32, 0.5, 0.42);
thumbBase.add(thumb.knuckle);

// Kater gishtat e tjere ne krye te shuplakes, me madhesi te ndryshme
//               emri                gjeresia  seg1   seg2    x
const fingerSpecs = [
    ['treguesi',           0.27,    0.6,   0.45,  -0.6 ],
    ['gishti i mesit',     0.29,    0.72,  0.52,  -0.2 ],
    ['unazori',            0.26,    0.65,  0.48,   0.2 ],
    ['gishti i vogel',     0.21,    0.45,  0.35,   0.6 ]
];

for (const [name, width, l1, l2, x] of fingerSpecs) {
    const f = createFinger(name, width, l1, l2);
    f.knuckle.position.set(x, 0.75, 0);
    palm.add(f.knuckle);
}

// ---------- Drita, toka, renderer ----------
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0xcccccc })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.25;
scene.add(ground);
scene.add(new THREE.GridHelper(20, 20));

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 3, 0);
controls.enableDamping = true;
controls.update();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

shoulder.rotation.z = THREE.MathUtils.degToRad(-20);
elbow.rotation.z = THREE.MathUtils.degToRad(40);
wrist.rotation.z = THREE.MathUtils.degToRad(-20);

// ---------- Kontrolli me tastiere ----------
const rotationStep = THREE.MathUtils.degToRad(5);
const fingerStep = THREE.MathUtils.degToRad(15);
const maxBend = THREE.MathUtils.degToRad(90);

let selected = -1; // -1 = te gjithe gishtat
const selectedLabel = document.getElementById('selected');

function updateSelection() {
    fingers.forEach((f, i) => {
        const active = selected === -1 || selected === i;
        f.meshes.forEach(m => m.material = (active && selected !== -1) ? selectedMaterial : fingerMaterial);
    });
    selectedLabel.textContent = 'I zgjedhur: ' +
        (selected === -1 ? 'te gjithe gishtat' : fingers[selected].name);
}

function bendSelected(amount) {
    fingers.forEach((f, i) => {
        if (selected === -1 || selected === i) {
            f.targetBend = THREE.MathUtils.clamp(f.targetBend + amount, 0, maxBend);
        }
    });
}

window.addEventListener('keydown', function (event) {
    const key = event.key.toLowerCase();

    // krahu
    if (key === 'q') shoulder.rotation.z += rotationStep;
    if (key === 'a') shoulder.rotation.z -= rotationStep;
    if (key === 'w') elbow.rotation.z += rotationStep;
    if (key === 's') elbow.rotation.z -= rotationStep;
    if (key === 'e') wrist.rotation.z += rotationStep;
    if (key === 'd') wrist.rotation.z -= rotationStep;

    // zgjedhja e gishtit: 1 = gishti i madh ... 5 = gishti i vogel, 0 = te gjithe
    if (key >= '1' && key <= '5') { selected = Number(key) - 1; updateSelection(); }
    if (key === '0') { selected = -1; updateSelection(); }

    // levizja e gishtave
    if (key === 'r') bendSelected(fingerStep);
    if (key === 'f') bendSelected(-fingerStep);
    if (key === 'g') fingers.forEach(f => f.targetBend = maxBend);  // grusht
    if (key === 'h') fingers.forEach(f => f.targetBend = 0);        // dore e hapur
});

function animate() {
    requestAnimationFrame(animate);

    // Levizje e bute drejt kendit te deshiruar
    for (const f of fingers) {
        f.bend += (f.targetBend - f.bend) * 0.15;

        if (f === thumb) {
            // Gishti i madh perkulet perpara dhe drejt qendres se shuplakes
            f.knuckle.rotation.x = f.bend * 0.8;
            f.knuckle.rotation.z = -f.bend * 0.6;
            f.middleJoint.rotation.x = f.bend * 0.7;
        } else {
            f.knuckle.rotation.x = f.bend;          // nyja e pare
            f.middleJoint.rotation.x = f.bend * 0.9; // nyja e dyte
        }
    }

    controls.update();
    renderer.render(scene, camera);
}

updateSelection();
animate();
