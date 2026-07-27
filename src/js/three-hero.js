/**
 * Three.js 3D WebGL Scene Generator for Madrasa Hero Section
 */
const ThreeHeroScene = (function() {
  let scene, camera, renderer;
  let mainGroup, starMesh1, starMesh2, ringMesh1, ringMesh2, particleSystem;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let mouseX = 0;
  let mouseY = 0;
  let isInitialized = false;

  function init(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof THREE === 'undefined') return;

    const width = canvas.clientWidth || canvas.parentElement.clientWidth || 500;
    const height = canvas.clientHeight || 450;

    // 1. Scene setup
    scene = new THREE.Scene();

    // 2. Camera setup
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;

    // 3. Renderer setup
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Main Group Container
    mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 5. Build 3D Geometric Emblem (8-Pointed Islamic Geometric Star + Rings)
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xE6C594,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x332200,
      emissiveIntensity: 0.2
    });

    const emeraldMaterial = new THREE.MeshStandardMaterial({
      color: 0x1B4D3C,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0x051F14,
      emissiveIntensity: 0.3
    });

    // Star Box 1
    const boxGeo = new THREE.BoxGeometry(5.2, 5.2, 1.2);
    starMesh1 = new THREE.Mesh(boxGeo, goldMaterial);
    starMesh1.castShadow = true;
    starMesh1.receiveShadow = true;
    mainGroup.add(starMesh1);

    // Star Box 2 (Rotated 45 degrees to form Octagram)
    starMesh2 = new THREE.Mesh(boxGeo, emeraldMaterial);
    starMesh2.rotation.z = Math.PI / 4;
    starMesh2.scale.set(0.98, 0.98, 0.98);
    starMesh2.castShadow = true;
    starMesh2.receiveShadow = true;
    mainGroup.add(starMesh2);

    // Central Sphere Core
    const coreGeo = new THREE.IcosahedronGeometry(2.2, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xF59E0B,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: true
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // Outer 3D Orbital Rings
    const ringGeo1 = new THREE.TorusGeometry(5.8, 0.12, 16, 100);
    ringMesh1 = new THREE.Mesh(ringGeo1, goldMaterial);
    ringMesh1.rotation.x = Math.PI / 3;
    mainGroup.add(ringMesh1);

    const ringGeo2 = new THREE.TorusGeometry(6.6, 0.08, 16, 100);
    ringMesh2 = new THREE.Mesh(ringGeo2, emeraldMaterial);
    ringMesh2.rotation.y = Math.PI / 4;
    mainGroup.add(ringMesh2);

    // 6. 3D Floating Particle Cloud
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 35;
      positions[i + 1] = (Math.random() - 0.5) * 35;
      positions[i + 2] = (Math.random() - 0.5) * 35;

      // Colors: Gold, Emerald, Cream
      if (Math.random() > 0.5) {
        colors[i] = 0.9;     // R
        colors[i + 1] = 0.77; // G
        colors[i + 2] = 0.58; // B
      } else {
        colors[i] = 0.1;     // R
        colors[i + 1] = 0.8;  // G
        colors[i + 2] = 0.5;  // B
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    particleSystem = new THREE.Points(geometry, particleMaterial);
    scene.add(particleSystem);

    // 7. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const goldPointLight = new THREE.PointLight(0xF59E0B, 2.5, 50);
    goldPointLight.position.set(10, 10, 12);
    scene.add(goldPointLight);

    const emeraldPointLight = new THREE.PointLight(0x10B981, 2.0, 50);
    emeraldPointLight.position.set(-10, -10, 10);
    scene.add(emeraldPointLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 12, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // 8. Event Listeners
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', () => onResize(canvasId));
    window.addEventListener('scroll', onScroll);

    isInitialized = true;
    animate();
  }

  function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  function onScroll() {
    const scrollY = window.scrollY;
    if (mainGroup) {
      mainGroup.rotation.y = scrollY * 0.002;
      mainGroup.rotation.x = scrollY * 0.001;
    }
  }

  function onResize(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !renderer || !camera) return;

    const width = canvas.parentElement.clientWidth || 500;
    const height = canvas.parentElement.clientHeight || 450;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    if (!isInitialized) return;
    requestAnimationFrame(animate);

    // Smooth rotation of 3D objects
    if (mainGroup) {
      mainGroup.rotation.y += 0.005;
      mainGroup.rotation.x += 0.003;

      // Mouse Parallax Lerp
      targetRotationY = mouseX * 0.5;
      targetRotationX = mouseY * 0.5;

      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.05;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.05;
    }

    if (ringMesh1) ringMesh1.rotation.z -= 0.008;
    if (ringMesh2) ringMesh2.rotation.z += 0.01;

    if (particleSystem) {
      particleSystem.rotation.y += 0.001;
    }

    renderer.render(scene, camera);
  }

  return { init };
})();
