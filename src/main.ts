import * as THREE from "three";

// --- renderer ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- scene & camera ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1020);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 10, 12);
camera.lookAt(0, 0, 0);

// --- particles ---
const COUNT = 6000;
const BOX_SIZE = 12;
const HALF = BOX_SIZE / 2;

const positions = new Float32Array(COUNT * 3);
const velocities = new Float32Array(COUNT * 3);

for (let i = 0; i < COUNT; i++) {
    const ix = 3 * i;
    positions[ix + 0] = THREE.MathUtils.randFloatSpread(BOX_SIZE);
    positions[ix + 1] = THREE.MathUtils.randFloatSpread(BOX_SIZE);
    positions[ix + 2] = THREE.MathUtils.randFloatSpread(BOX_SIZE);

    velocities[ix + 0] = THREE.MathUtils.randFloatSpread(0.05);
    velocities[ix + 1] = THREE.MathUtils.randFloatSpread(0.05);
    velocities[ix + 2] = THREE.MathUtils.randFloatSpread(0.05);
}

const geom = new THREE.BufferGeometry();
geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const mat = new THREE.PointsMaterial({
    size: 0.06,
    sizeAttenuation: true,
    color: 0xa7b3ff,
    transparent: true,
    opacity: 0.95,
});

const points = new THREE.Points(geom, mat);
scene.add(points);

// optional: box outline
const box = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE)),
    new THREE.LineBasicMaterial({ color: 0x2b3566, transparent: true, opacity: 0.5 })
);
scene.add(box);

// --- Brownian dynamics ---
const accel = 0.06;
const drag = 0.98;
const clock = new THREE.Clock();

function step() {
    const dt = Math.min(clock.getDelta(), 0.033);
    const a = accel * dt;

    for (let i = 0; i < COUNT; i++) {
        const ix = 3 * i;

        velocities[ix + 0] += THREE.MathUtils.randFloatSpread(2 * a);
        velocities[ix + 1] += THREE.MathUtils.randFloatSpread(2 * a);
        velocities[ix + 2] += THREE.MathUtils.randFloatSpread(2 * a);

        velocities[ix + 0] *= drag;
        velocities[ix + 1] *= drag;
        velocities[ix + 2] *= drag;

        positions[ix + 0] += velocities[ix + 0];
        positions[ix + 1] += velocities[ix + 1];
        positions[ix + 2] += velocities[ix + 2];

        if (positions[ix + 0] > HALF) { positions[ix + 0] = HALF; velocities[ix + 0] *= -1; }
        if (positions[ix + 0] < -HALF) { positions[ix + 0] = -HALF; velocities[ix + 0] *= -1; }
        if (positions[ix + 1] > HALF) { positions[ix + 1] = HALF; velocities[ix + 1] *= -1; }
        if (positions[ix + 1] < -HALF) { positions[ix + 1] = -HALF; velocities[ix + 1] *= -1; }
        if (positions[ix + 2] > HALF) { positions[ix + 2] = HALF; velocities[ix + 2] *= -1; }
        if (positions[ix + 2] < -HALF) { positions[ix + 2] = -HALF; velocities[ix + 2] *= -1; }
    }

    geom.attributes.position.needsUpdate = true;
}

// --- loop ---
function animate() {
    requestAnimationFrame(animate);
    step();
    renderer.render(scene, camera);
}
animate();

// --- resize ---
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});