'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useRouter } from 'next/navigation';
import { 
  Compass, 
  Sparkles, 
  RotateCcw, 
  Play, 
  Pause, 
  ArrowUpRight, 
  Zap,
  Globe,
  TrendingUp,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2
} from 'lucide-react';

interface SubCareer {
  id: string;
  name: string;
  salary: string;
  growth: string;
  description: string;
  skills: string[];
  color: number;
  distance: number;
  speed: number;
}

interface CareerNode {
  id: string;
  name: string;
  domain: string;
  color: number;
  colorHex: string;
  size: number;
  radius: number;
  orbitSpeed: number;
  salary: string;
  growth: string;
  demand: 'Critical' | 'High' | 'Medium-High' | 'Medium';
  description: string;
  skills: string[];
  institutions: string[];
  subCareers: SubCareer[];
}

const GALAXY_DOMAINS: CareerNode[] = [
  {
    id: 'technology',
    name: 'Technology & AI',
    domain: 'Technology',
    color: 0x6366f1, // Indigo
    colorHex: '#6366f1',
    size: 1.3,
    radius: 9,
    orbitSpeed: 0.25,
    salary: '₹14L - ₹55L / yr',
    growth: '+98% by 2030',
    demand: 'Critical',
    description: 'The frontier of cognitive computing, autonomous software, and high-performance quantum architectures.',
    skills: ['TypeScript / Next.js', 'PyTorch & Transformers', 'Cloud Orchestration (AWS/K8s)', 'Distributed Systems', 'System Design'],
    institutions: ['IIT Bombay', 'IISc Bangalore', 'NITK Surathkal', 'MIT', 'Stanford'],
    subCareers: [
      { id: 'ai_architect', name: 'AI & Neural Systems Architect', salary: '₹22L - ₹65L', growth: '+105%', description: 'Designs and trains large-scale foundation models and cognitive multi-agent systems.', skills: ['PyTorch', 'LLMs', 'CUDA', 'Vector DBs'], color: 0x818cf8, distance: 2.2, speed: 1.2 },
      { id: 'quantum_eng', name: 'Quantum Software Engineer', salary: '₹20L - ₹50L', growth: '+92%', description: 'Programs quantum gates and hybrid classical-quantum algorithms.', skills: ['Qiskit', 'Linear Algebra', 'Quantum Cryptography'], color: 0x38bdf8, distance: 3.0, speed: 0.9 },
      { id: 'cyber_sentinel', name: 'Zero-Trust Cyber Defense Lead', salary: '₹16L - ₹42L', growth: '+88%', description: 'Guards critical infrastructure against quantum-era cryptanalytic threats.', skills: ['Penetration Testing', 'Cryptography', 'SIEM'], color: 0xc084fc, distance: 3.8, speed: 0.7 }
    ]
  },
  {
    id: 'law',
    name: 'Law & Governance',
    domain: 'Law',
    color: 0xf59e0b, // Amber
    colorHex: '#f59e0b',
    size: 1.1,
    radius: 14,
    orbitSpeed: 0.18,
    salary: '₹10L - ₹42L / yr',
    growth: '+91% by 2030',
    demand: 'High',
    description: 'Shaping international digital treaties, intellectual property litigation, and global regulatory frameworks.',
    skills: ['AI Ethics & IP Law', 'Cross-Border Arbitration', 'Contract Engineering', 'Regulatory Compliance', 'Legal Analytics'],
    institutions: ['NLSIU Bangalore', 'NALSAR Hyderabad', 'Harvard Law', 'Oxford Faculty of Law'],
    subCareers: [
      { id: 'ai_ethics_lawyer', name: 'AI Ethics & Algorithmic Counsel', salary: '₹18L - ₹48L', growth: '+96%', description: 'Navigates algorithmic copyright, training data rights, and ethical compliance.', skills: ['IP Law', 'AI Regulations', 'Risk Auditing'], color: 0xfcd34d, distance: 2.1, speed: 1.1 },
      { id: 'ip_arbitrator', name: 'Global Tech Arbitrator', salary: '₹15L - ₹38L', growth: '+85%', description: 'Mediates high-stakes proprietary technology disputes out-of-court.', skills: ['Dispute Resolution', 'Patent Law', 'Corporate Governance'], color: 0xfbbf24, distance: 2.9, speed: 0.8 }
    ]
  },
  {
    id: 'science',
    name: 'Bio-Science & Quantum',
    domain: 'Science',
    color: 0x10b981, // Emerald
    colorHex: '#10b981',
    size: 1.25,
    radius: 19,
    orbitSpeed: 0.14,
    salary: '₹11L - ₹48L / yr',
    growth: '+95% by 2030',
    demand: 'Critical',
    description: 'Transforming health and planetary ecosystems through genomics, computational biology, and green energy synthesis.',
    skills: ['Genomic Sequencing (CRISPR)', 'Molecular Modeling', 'Biostatistics (R/Python)', 'Bioinformatics Pipelines', 'Clinical Research'],
    institutions: ['IISc Bangalore', 'AIIMS New Delhi', 'MAHE Manipal', 'Johns Hopkins', 'ETH Zurich'],
    subCareers: [
      { id: 'computational_biologist', name: 'Bioinformatics & Genomicist', salary: '₹16L - ₹45L', growth: '+100%', description: 'Decodes DNA sequence anomalies using neural networks to design personalized mRNA therapies.', skills: ['Python', 'Bioconductor', 'CRISPR Tools'], color: 0x34d399, distance: 2.3, speed: 1.0 },
      { id: 'climate_scientist', name: 'Climate Predictive Modeler', salary: '₹12L - ₹34L', growth: '+88%', description: 'Leverages geospatial satellite data to simulate carbon capture and macro-climate dynamics.', skills: ['GIS Analytics', 'Climate Simulations', 'Data Analytics'], color: 0x6ee7b7, distance: 3.1, speed: 0.75 }
    ]
  },
  {
    id: 'commerce',
    name: 'FinTech & Venture',
    domain: 'Commerce',
    color: 0x06b6d4, // Cyan
    colorHex: '#06b6d4',
    size: 1.15,
    radius: 24,
    orbitSpeed: 0.10,
    salary: '₹9L - ₹38L / yr',
    growth: '+89% by 2030',
    demand: 'Medium-High',
    description: 'Orchestrating algorithmic markets, decentralized liquidity, and venture capital scaling strategies.',
    skills: ['Algorithmic Trading', 'Financial Engineering', 'Venture Deal Structuring', 'Blockchain Protocols', 'Macro-Economics'],
    institutions: ['IIM Bangalore', 'IIM Ahmedabad', 'St. Josephs College of Commerce', 'London School of Economics'],
    subCareers: [
      { id: 'quant_trader', name: 'Algorithmic Quant Strategist', salary: '₹25L - ₹70L', growth: '+94%', description: 'Constructs mathematical stochastic models for automated high-frequency liquidity arbitrage.', skills: ['C++', 'Stochastic Calculus', 'Python Quants'], color: 0x67e8f9, distance: 2.2, speed: 0.95 },
      { id: 'venture_consultant', name: 'Deep-Tech Venture Strategist', salary: '₹14L - ₹36L', growth: '+82%', description: 'Evaluates early-stage frontier technologies for venture fund syndication.', skills: ['Due Diligence', 'Valuation Models', 'Market Research'], color: 0xa5f3fc, distance: 3.0, speed: 0.7 }
    ]
  },
  {
    id: 'arts',
    name: 'Spatial Design & Media',
    domain: 'Arts',
    color: 0xec4899, // Pink
    colorHex: '#ec4899',
    size: 1.05,
    radius: 29,
    orbitSpeed: 0.07,
    salary: '₹8L - ₹32L / yr',
    growth: '+87% by 2030',
    demand: 'Medium',
    description: 'Crafting spatial human-computer interaction, cinematic generative media, and immersive digital worlds.',
    skills: ['Spatial 3D & VR Design', 'Unreal Engine / Unity', 'Human-Centered UI/UX', 'Generative Media Direction', 'Creative Coding'],
    institutions: ['National Institute of Design (NID)', 'Srishti Institute', 'NYU Tisch', 'RCA London'],
    subCareers: [
      { id: 'spatial_designer', name: 'Spatial Computing UX Architect', salary: '₹14L - ₹35L', growth: '+90%', description: 'Designs gesture and eye-tracked spatial interfaces for extended reality (XR) headsets.', skills: ['Figma 3D', 'Unity', 'Interaction Design'], color: 0xf472b6, distance: 2.2, speed: 0.85 },
      { id: 'creative_ai_director', name: 'Generative Media Director', salary: '₹12L - ₹30L', growth: '+86%', description: 'Leads AI-assisted cinematic pipelines and interactive digital storytelling.', skills: ['Midjourney/ComfyUI', 'After Effects', 'Storyboarding'], color: 0xfbcfe8, distance: 3.0, speed: 0.65 }
    ]
  }
];

export default function ThreeGalaxy() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [selectedNode, setSelectedNode] = useState<{
    title: string;
    domain: string;
    salary: string;
    growth: string;
    demand: string;
    description: string;
    skills: string[];
    institutions?: string[];
    isSubCareer?: boolean;
    colorHex: string;
  } | null>(null);

  const [hoveredNode, setHoveredNode] = useState<{ name: string; domain: string; colorHex: string } | null>(null);
  const [activeDomainFilter, setActiveDomainFilter] = useState<string>('all');
  const [isOrbiting, setIsOrbiting] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);

  // References for controls & tweening
  const controlsRef = useRef<OrbitControls | null>(null);
  const targetCamPosRef = useRef<THREE.Vector3 | null>(null);
  const targetLookAtRef = useRef<THREE.Vector3 | null>(null);
  const planetMeshesRef = useRef<{ [key: string]: THREE.Mesh }>({});
  const isOrbitingRef = useRef(true);
  const speedMultiplierRef = useRef(1);
  const autoRotateRef = useRef(true);

  // Synchronize ref states
  useEffect(() => {
    isOrbitingRef.current = isOrbiting;
  }, [isOrbiting]);

  useEffect(() => {
    speedMultiplierRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Focus Camera smoothly onto a specific planet
  const focusOnDomain = useCallback((domainId: string | null) => {
    setActiveDomainFilter(domainId || 'all');
    if (!domainId || domainId === 'all') {
      targetLookAtRef.current = new THREE.Vector3(0, 0, 0);
      targetCamPosRef.current = new THREE.Vector3(0, 26, 42);
      setSelectedNode(null);
      setAutoRotate(true);
      return;
    }

    const domain = GALAXY_DOMAINS.find(d => d.id === domainId || d.domain.toLowerCase() === domainId.toLowerCase());
    if (domain && planetMeshesRef.current[domain.id]) {
      const mesh = planetMeshesRef.current[domain.id];
      const worldPos = new THREE.Vector3();
      mesh.getWorldPosition(worldPos);

      targetLookAtRef.current = worldPos.clone();
      const offset = new THREE.Vector3(0, 6, 12);
      targetCamPosRef.current = worldPos.clone().add(offset);
      setAutoRotate(false);

      setSelectedNode({
        title: domain.name,
        domain: domain.domain,
        salary: domain.salary,
        growth: domain.growth,
        demand: domain.demand,
        description: domain.description,
        skills: domain.skills,
        institutions: domain.institutions,
        isSubCareer: false,
        colorHex: domain.colorHex
      });
    }
  }, []);

  const resetView = useCallback(() => {
    focusOnDomain('all');
  }, [focusOnDomain]);

  const adjustZoom = (delta: number) => {
    if (!controlsRef.current) return;
    const camera = controlsRef.current.object as THREE.PerspectiveCamera;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    camera.position.addScaledVector(dir, delta * 3);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth || 1000;
    const height = container.clientHeight || 680;

    // 1. SCENE
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020010, 0.012);

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 300);
    camera.position.set(0, 24, 40);

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    // Clear any previous child
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. ORBIT CONTROLS (Industry Gold Standard - Touchpad & Touch Supported natively)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = autoRotateRef.current;
    controls.autoRotateSpeed = 1.0;
    controls.minDistance = 5;
    controls.maxDistance = 80;
    controls.maxPolarAngle = Math.PI / 2.02; // Keep camera above galactic equator
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 5. LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const centralLight = new THREE.PointLight(0xa855f7, 5, 100);
    centralLight.position.set(0, 0, 0);
    scene.add(centralLight);

    const secondaryLight = new THREE.DirectionalLight(0x6366f1, 2.0);
    secondaryLight.position.set(25, 40, 25);
    scene.add(secondaryLight);

    // 6. GALACTIC CORE (Glowing Central Student DNA Star)
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Glowing core sphere
    const coreGeo = new THREE.SphereGeometry(2.0, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Pulsing wireframe corona
    const coronaGeo = new THREE.IcosahedronGeometry(2.7, 2);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    coreGroup.add(coronaMesh);

    // Core Aura
    const auraGeo = new THREE.SphereGeometry(3.6, 32, 32);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide
    });
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    coreGroup.add(auraMesh);

    // 7. SPIRAL GALAXY STARFIELD (3,000 Particles in 2 Rotating Logarithmic Spiral Arms)
    const starCount = 3000;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colorA = new THREE.Color(0x818cf8); // Indigo
    const colorB = new THREE.Color(0xf472b6); // Pink
    const colorC = new THREE.Color(0x38bdf8); // Cyan
    const colorWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < starCount; i++) {
      // 2 spiral arms
      const armIndex = i % 2;
      const angle = (i / starCount) * Math.PI * 8 + (armIndex * Math.PI);
      const radius = 3.5 + Math.pow(Math.random(), 1.5) * 45;
      const spreadX = (Math.random() - 0.5) * 4.5;
      const spreadY = (Math.random() - 0.5) * 3.5;
      const spreadZ = (Math.random() - 0.5) * 4.5;

      starPositions[i * 3] = radius * Math.cos(angle) + spreadX;
      starPositions[i * 3 + 1] = spreadY;
      starPositions[i * 3 + 2] = radius * Math.sin(angle) + spreadZ;

      let chosenColor = colorWhite;
      const rand = Math.random();
      if (rand < 0.35) chosenColor = colorA;
      else if (rand < 0.65) chosenColor = colorB;
      else if (rand < 0.85) chosenColor = colorC;

      starColors[i * 3] = chosenColor.r;
      starColors[i * 3 + 1] = chosenColor.g;
      starColors[i * 3 + 2] = chosenColor.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 8. PLANETARY SYSTEMS & ORBITS
    const interactiveObjects: THREE.Object3D[] = [];
    const domainHolders: {
      data: CareerNode;
      orbitGroup: THREE.Group;
      planetMesh: THREE.Mesh;
      moons: { mesh: THREE.Mesh; data: SubCareer; angle: number; speed: number; distance: number }[];
      angleOffset: number;
    }[] = [];

    const totalDomains = GALAXY_DOMAINS.length;

    GALAXY_DOMAINS.forEach((domain, idx) => {
      // Distribute starting positions uniformly in a circle
      const angleOffset = (idx / totalDomains) * Math.PI * 2;

      // Glowing Orbit Curve
      const orbitCurve = new THREE.EllipseCurve(0, 0, domain.radius, domain.radius, 0, 2 * Math.PI, false, 0);
      const orbitPts = orbitCurve.getPoints(128);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(
        orbitPts.map(p => new THREE.Vector3(p.x, 0, p.y))
      );
      const orbitMat = new THREE.LineBasicMaterial({
        color: domain.color,
        transparent: true,
        opacity: 0.35
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      scene.add(orbitLine);

      // Orbit Group
      const orbitGroup = new THREE.Group();
      scene.add(orbitGroup);

      // Planet Mesh
      const planetGeo = new THREE.SphereGeometry(domain.size, 32, 32);
      const planetMat = new THREE.MeshStandardMaterial({
        color: domain.color,
        emissive: domain.color,
        emissiveIntensity: 0.6,
        roughness: 0.15,
        metalness: 0.85
      });
      const planetMesh = new THREE.Mesh(planetGeo, planetMat);
      planetMesh.position.set(domain.radius * Math.cos(angleOffset), 0, domain.radius * Math.sin(angleOffset));
      planetMesh.userData = {
        type: 'domain',
        data: domain,
        colorHex: domain.colorHex
      };
      orbitGroup.add(planetMesh);
      interactiveObjects.push(planetMesh);
      planetMeshesRef.current[domain.id] = planetMesh;

      // Planet Atmospheric Halo Ring
      const ringGeo = new THREE.RingGeometry(domain.size * 1.35, domain.size * 1.7, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: domain.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.2;
      planetMesh.add(ringMesh);

      // Sub-Career Moons
      const moonHolders: { mesh: THREE.Mesh; data: SubCareer; angle: number; speed: number; distance: number }[] = [];

      domain.subCareers.forEach((sub, sIdx) => {
        const moonGeo = new THREE.SphereGeometry(0.35, 16, 16);
        const moonMat = new THREE.MeshStandardMaterial({
          color: sub.color,
          emissive: sub.color,
          emissiveIntensity: 0.75,
          roughness: 0.2
        });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        const startMoonAngle = (sIdx / domain.subCareers.length) * Math.PI * 2;
        moonMesh.position.set(
          sub.distance * Math.cos(startMoonAngle),
          (sIdx % 2 === 0 ? 0.4 : -0.4),
          sub.distance * Math.sin(startMoonAngle)
        );
        moonMesh.userData = {
          type: 'subcareer',
          domain: domain.domain,
          data: sub,
          colorHex: '#' + sub.color.toString(16).padStart(6, '0'),
          parentDomain: domain
        };
        planetMesh.add(moonMesh);
        interactiveObjects.push(moonMesh);

        moonHolders.push({
          mesh: moonMesh,
          data: sub,
          angle: startMoonAngle,
          speed: sub.speed,
          distance: sub.distance
        });
      });

      domainHolders.push({
        data: domain,
        orbitGroup,
        planetMesh,
        moons: moonHolders,
        angleOffset
      });
    });

    // 9. CONSTELLATION ENERGY BEAMS (Connecting active domains)
    const beamMaterial = new THREE.LineBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    const beamGeometries: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 4; i++) {
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
      const line = new THREE.Line(geo, beamMaterial);
      scene.add(line);
      beamGeometries.push(geo);
    }

    // 10. RAYCASTER FOR TOUCH, CLICK & HOVER
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerStartX = 0;
    let pointerStartY = 0;

    const updatePointer = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerDown = (e: PointerEvent) => {
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
    };

    const handlePointerUp = (e: PointerEvent) => {
      const dx = Math.abs(e.clientX - pointerStartX);
      const dy = Math.abs(e.clientY - pointerStartY);

      // Clean tap/click without dragging
      if (dx < 7 && dy < 7) {
        updatePointer(e);
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(interactiveObjects, false);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          const u = hit.userData;

          const worldPos = new THREE.Vector3();
          hit.getWorldPosition(worldPos);
          targetLookAtRef.current = worldPos.clone();
          targetCamPosRef.current = worldPos.clone().add(new THREE.Vector3(0, 5, 10));
          setAutoRotate(false);

          if (u.type === 'domain') {
            const d = u.data as CareerNode;
            setSelectedNode({
              title: d.name,
              domain: d.domain,
              salary: d.salary,
              growth: d.growth,
              demand: d.demand,
              description: d.description,
              skills: d.skills,
              institutions: d.institutions,
              isSubCareer: false,
              colorHex: d.colorHex
            });
          } else if (u.type === 'subcareer') {
            const s = u.data as SubCareer;
            const parent = u.parentDomain as CareerNode;
            setSelectedNode({
              title: s.name,
              domain: u.domain,
              salary: s.salary,
              growth: s.growth,
              demand: 'Critical',
              description: s.description,
              skills: s.skills,
              institutions: parent?.institutions || ['Global Universities', 'Industry Certifications'],
              isSubCareer: true,
              colorHex: u.colorHex
            });
          }
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      updatePointer(e);
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const u = hit.userData;
        if (u.type === 'domain') {
          setHoveredNode({ name: u.data.name, domain: u.data.domain, colorHex: u.colorHex });
        } else if (u.type === 'subcareer') {
          setHoveredNode({ name: u.data.name, domain: `${u.domain} Moon`, colorHex: u.colorHex });
        }
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setHoveredNode(null);
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', handlePointerDown);
    dom.addEventListener('pointerup', handlePointerUp);
    dom.addEventListener('pointermove', handlePointerMove);

    // 11. 60FPS ANIMATION LOOP
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();

      // Pulsing Core
      coronaMesh.rotation.y += 0.015;
      coronaMesh.rotation.x += 0.008;

      // Galaxy Spiral Rotation
      starField.rotation.y += 0.0006 * speedMultiplierRef.current;

      // Orbit Planets & Moons
      if (isOrbitingRef.current) {
        domainHolders.forEach(holder => {
          // Orbit around galaxy center
          holder.orbitGroup.rotation.y += holder.data.orbitSpeed * 0.4 * delta * speedMultiplierRef.current;

          // Spin planet on own axis
          holder.planetMesh.rotation.y += 0.02;

          // Moons orbiting planet
          holder.moons.forEach(m => {
            m.angle += m.speed * delta * speedMultiplierRef.current;
            m.mesh.position.set(
              m.distance * Math.cos(m.angle),
              m.mesh.position.y,
              m.distance * Math.sin(m.angle)
            );
          });
        });

        // Update Constellation Lines
        if (domainHolders.length >= 4) {
          const p0 = new THREE.Vector3();
          const p1 = new THREE.Vector3();
          const p2 = new THREE.Vector3();
          const p3 = new THREE.Vector3();

          domainHolders[0].planetMesh.getWorldPosition(p0);
          domainHolders[1].planetMesh.getWorldPosition(p1);
          domainHolders[2].planetMesh.getWorldPosition(p2);
          domainHolders[3].planetMesh.getWorldPosition(p3);

          beamGeometries[0].setFromPoints([p0, p1]);
          beamGeometries[1].setFromPoints([p1, p2]);
          beamGeometries[2].setFromPoints([p2, p3]);
          beamGeometries[3].setFromPoints([p3, p0]);
        }
      }

      // Smooth camera interpolation on target focus
      if (targetCamPosRef.current && targetLookAtRef.current) {
        camera.position.lerp(targetCamPosRef.current, 0.05);
        controls.target.lerp(targetLookAtRef.current, 0.05);

        if (camera.position.distanceTo(targetCamPosRef.current) < 0.2) {
          targetCamPosRef.current = null;
          targetLookAtRef.current = null;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // ResizeObserver for perfect auto-fitting
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });

    resizeObserver.observe(container);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      dom.removeEventListener('pointerdown', handlePointerDown);
      dom.removeEventListener('pointerup', handlePointerUp);
      dom.removeEventListener('pointermove', handlePointerMove);
      controls.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[700px] rounded-3xl overflow-hidden glass-panel-neon border border-indigo-500/20 shadow-2xl select-none">
      {/* Dynamic Cosmic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#02000f] via-[#05011f] to-[#010008] pointer-events-none z-0" />

      {/* 3D WebGL Canvas Mount Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10" 
      />

      {/* TOP HEADER HUD: Title & Filter Pills */}
      <div className="absolute top-5 left-5 right-5 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left Badge */}
        <div className="flex items-center space-x-2.5 bg-[#0a0524]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-indigo-500/30 shadow-neon-purple pointer-events-auto">
          <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          <div>
            <span className="text-xs font-black tracking-wider uppercase text-white block">
              3D Career Galaxy Matrix
            </span>
            <span className="text-[10px] text-indigo-300 font-mono">
              Interactive Cosmic Engine • 5 Systems • 15+ Moons
            </span>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0a0524]/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-lg pointer-events-auto">
          <button
            onClick={() => focusOnDomain('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeDomainFilter === 'all'
                ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-neon-purple'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            All Galaxy
          </button>
          {GALAXY_DOMAINS.map(d => (
            <button
              key={d.id}
              onClick={() => focusOnDomain(d.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeDomainFilter === d.id
                  ? 'bg-indigo-600 text-white shadow-neon-purple'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.colorHex }} />
              {d.domain}
            </button>
          ))}
        </div>
      </div>

      {/* BOTTOM LEFT: Touchpad, Orbit & Zoom HUD Bar */}
      <div className="absolute bottom-5 left-5 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="flex flex-wrap items-center gap-2 bg-[#0a0524]/90 backdrop-blur-md p-2 rounded-2xl border border-indigo-500/20 shadow-lg pointer-events-auto">
          
          {/* Pause/Resume Orbiting */}
          <button
            onClick={() => setIsOrbiting(!isOrbiting)}
            className="p-2 bg-white/5 hover:bg-indigo-600/40 text-indigo-300 hover:text-white rounded-xl transition-all"
            title={isOrbiting ? 'Pause Planetary Orbits' : 'Resume Planetary Orbits'}
          >
            {isOrbiting ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Toggle Auto-Rotate */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              autoRotate ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
            title="Toggle Galaxy Camera Auto-Spin"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Auto-Spin</span>
          </button>
          
          {/* Reset Overview */}
          <button
            onClick={resetView}
            className="p-2 bg-white/5 hover:bg-indigo-600/40 text-indigo-300 hover:text-white rounded-xl transition-all"
            title="Reset to Full Galaxy Overview"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-white/10 mx-1" />

          {/* Quick Zoom In / Out Buttons for Touchpad */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => adjustZoom(1)}
              className="p-1.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white rounded-lg transition-all"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => adjustZoom(-1)}
              className="p-1.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white rounded-lg transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          <div className="h-4 w-px bg-white/10 mx-1" />

          {/* Speed Multiplier */}
          <div className="flex items-center gap-1 px-1 text-[11px] text-slate-300 font-medium">
            <span>Speed:</span>
            {[1, 2].map(speed => (
              <button
                key={speed}
                onClick={() => setSpeedMultiplier(speed)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  speedMultiplier === speed ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        <div className="bg-black/70 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/5 text-[11px] text-slate-400">
          💻 <span className="text-slate-200 font-medium">Touchpad/Mouse</span>: Drag to orbit 360° • Two-finger swipe or scroll to zoom • Click any planet or moon to inspect
        </div>
      </div>

      {/* HOVER TOOLTIP */}
      {hoveredNode && !selectedNode && (
        <div className="absolute top-20 right-6 z-20 bg-[#0a0524]/90 backdrop-blur-md border border-indigo-500/40 px-4 py-2.5 rounded-2xl text-xs font-semibold text-white shadow-neon-purple animate-in fade-in zoom-in-95 duration-150 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: hoveredNode.colorHex }} />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-mono">{hoveredNode.domain}</span>
            <span className="text-white font-bold">{hoveredNode.name}</span>
          </div>
        </div>
      )}

      {/* RIGHT TELEMETRY DOSSIER (Opens on Click/Tap) */}
      {selectedNode && (
        <div className="absolute bottom-5 right-5 z-30 w-80 md:w-96 bg-[#08041c]/95 border border-indigo-500/40 rounded-3xl p-5 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right-8 duration-300 space-y-4">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md border"
                style={{ 
                  backgroundColor: `${selectedNode.colorHex}20`, 
                  borderColor: `${selectedNode.colorHex}50` 
                }}
              >
                <Compass className="w-5 h-5" style={{ color: selectedNode.colorHex }} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 block">
                  {selectedNode.isSubCareer ? 'Celestial Specialization' : 'Planetary Domain'}
                </span>
                <h3 className="text-base font-black text-white leading-tight">
                  {selectedNode.title}
                </h3>
              </div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedNode.description}
          </p>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5 bg-black/40 p-3 rounded-2xl border border-white/5 text-center">
            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-mono">Salary Scope</span>
              <span className="text-xs font-bold text-white font-mono">{selectedNode.salary}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-mono">2030 Growth</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                {selectedNode.growth}
              </span>
            </div>
          </div>

          {/* Skill Stacks */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1 font-mono">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Core Skill Requisites:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedNode.skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-indigo-950/70 text-indigo-200 border border-indigo-500/30 px-2 py-0.5 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Institutions / Target Launchpads */}
          {selectedNode.institutions && (
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1 font-mono">
                <Globe className="w-3.5 h-3.5 text-cyan-400" /> Premier Launchpads:
              </span>
              <p className="text-xs text-slate-300 font-medium">
                {selectedNode.institutions.join(' • ')}
              </p>
            </div>
          )}

          {/* Direct CTA Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
            <button
              onClick={() => router.push(`/dashboard/colleges?domain=${selectedNode.domain}`)}
              className="py-2 bg-white/5 hover:bg-white/10 text-indigo-300 hover:text-white border border-indigo-500/30 font-bold rounded-xl text-[11px] transition-all flex items-center justify-center gap-1"
            >
              Match Colleges
              <ArrowUpRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => router.push(`/dashboard/roadmap`)}
              className="py-2 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold rounded-xl text-[11px] shadow-neon-purple transition-all flex items-center justify-center gap-1"
            >
              View Roadmap
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
