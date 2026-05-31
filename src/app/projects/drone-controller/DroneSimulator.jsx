import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { THEMES } from "@/lib/simulator-themes";

// ── Constants ─────────────────────────────────────────────────────────────────

// ── Constants ─────────────────────────────────────────────────────────────────
const GRAVITY = 9.81;
const ARRIVAL_DIST = 0.2;
const ARRIVAL_HOLD_S = 1.0;
const PHYSICS_HZ = 500;
const CTRL_HZ = 50;
const STEPS_PER_CTRL = PHYSICS_HZ / CTRL_HZ;
const STEPS_PER_FRAME = 10;
const MAX_TILT = 0.38;

const CFG = { M: 0.088, KF: 0.566e-5, K_TRANS: [3.365e-2, 3.365e-2, 3.365e-2], TM: 0.0163 };

// Hover RPM: RPM at which thrust exactly cancels gravity (≈ 1866 for this drone)
const HOVER_RPM = Math.round(Math.sqrt((CFG.M * GRAVITY) / (4 * CFG.KF)) * (60 / (2 * Math.PI)));

// ── Math ──────────────────────────────────────────────────────────────────────
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, t) => a + (b - a) * t;
const wrap = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
const dist3 = (pos, tgt) => Math.sqrt((pos[0] - tgt.x) ** 2 + (pos[1] - tgt.y) ** 2 + (pos[2] - tgt.z) ** 2);

// ── Physics ───────────────────────────────────────────────────────────────────
function desiredRPMs(desVel, linVel, yr) {
  const hover = Math.sqrt((CFG.M * GRAVITY) / (4 * CFG.KF)) * (60 / (2 * Math.PI));
  const dz = clamp((desVel[2] - linVel[2]) * 1600, -800, 800);
  const dx = clamp((desVel[0] - linVel[0]) * 800, -400, 400);
  const dy = clamp((desVel[1] - linVel[1]) * 800, -400, 400);
  const dr = clamp(yr * 200, -200, 200);
  return [
    clamp(hover + dz - dx - dy - dr, 0, 12000), clamp(hover + dz + dx + dy - dr, 0, 12000),
    clamp(hover + dz + dx - dy + dr, 0, 12000), clamp(hover + dz - dx + dy + dr, 0, 12000),
  ];
}
function posControl(state, target) {
  const kp = 1.2, mv = 1.0;
  return {
    vel: [clamp((target.x - state.pos[0]) * kp, -mv, mv), clamp((target.y - state.pos[1]) * kp, -mv, mv), clamp((target.z - state.pos[2]) * kp, -mv, mv)],
    yr: clamp(wrap(target.yaw - state.euler[2]) * 1.5, -1.745, 1.745),
  };
}
function windForce(t, on) {
  if (!on) return [0, 0, 0];
  return [Math.sin(t * 0.7) * 0.02 + Math.sin(t * 2.3) * 0.008, Math.cos(t * 0.5) * 0.018 + Math.cos(t * 1.8) * 0.007, Math.sin(t * 1.1) * 0.01];
}
const mkState = () => ({ pos: [0, 0, 0], euler: [0, 0, 0], linVel: [0, 0, 0], rpm: [HOVER_RPM, HOVER_RPM, HOVER_RPM, HOVER_RPM] });

// ── Scene ─────────────────────────────────────────────────────────────────────
function buildScene(th) {
  const isLt = th === THEMES.light;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(th.sceneBg);
  scene.fog = new THREE.FogExp2(th.sceneBg, 0.018);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.02, 120);
  camera.up.set(0, 0, 1);

  // Lighting
  scene.add(new THREE.HemisphereLight(isLt ? 0xd0e8ff : 0x303030, isLt ? 0x88aa66 : 0x101010, isLt ? 1.6 : 1.1));
  const sun = new THREE.DirectionalLight(isLt ? 0xfff8f0 : 0xffffff, isLt ? 2.2 : 1.6);
  sun.position.set(8, 6, 12);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(isLt ? 0xaaddff : 0x404040, isLt ? 0.4 : 0.3);
  fill.position.set(-5, -3, 4);
  scene.add(fill);

  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshLambertMaterial({ color: th.sceneGround })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.z = -0.001;
  ground.receiveShadow = true;
  scene.add(ground);

  const grid = new THREE.GridHelper(20, 40, th.sceneGrid1, th.sceneGrid2);
  grid.rotation.x = Math.PI / 2;
  grid.position.z = 0.002;
  scene.add(grid);

  // Axis arrows + labels — start outside drone body (offset 0.14 m from centre)
  const AOFFSET = 0.14;
  const ALEN = 1.2;
  [[1, 0, 0, 0xff4444, "+X"], [0, 1, 0, 0x44dd66, "+Y"], [0, 0, 1, 0x4499ff, "+Z"]].forEach(([dx, dy, dz, col, lbl]) => {
    const origin = new THREE.Vector3(dx * AOFFSET, dy * AOFFSET, dz * AOFFSET);
    scene.add(new THREE.ArrowHelper(new THREE.Vector3(dx, dy, dz), origin, ALEN, col, 0.16, 0.09));
    const cv = document.createElement("canvas"); cv.width = 64; cv.height = 32;
    const cx = cv.getContext("2d");
    cx.font = "bold 22px monospace";
    cx.fillStyle = "#" + col.toString(16).padStart(6, "0");
    cx.textAlign = "center"; cx.textBaseline = "middle";
    cx.fillText(lbl, 32, 16);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthTest: false }));
    const tipDist = AOFFSET + ALEN + 0.22;
    sp.position.set(dx * tipDist, dy * tipDist, dz * tipDist);
    sp.scale.set(0.42, 0.20, 1);
    scene.add(sp);
  });

  // ── Drone ──
  const drone = new THREE.Group();

  // Central body — vivid orange, high gloss
  const bodyMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.058, 0.052, 0.032, 20),
    new THREE.MeshPhongMaterial({ color: 0xff6a00, emissive: 0xcc3a00, emissiveIntensity: 0.35, shininess: 120 })
  );
  bodyMesh.rotation.x = Math.PI / 2;
  drone.add(bodyMesh);

  // Top accent ring — bright yellow, rotated to wrap around the Z-up cylinder
  const accentRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.052, 0.005, 8, 24),
    new THREE.MeshPhongMaterial({ color: 0xffe500, emissive: 0xffaa00, emissiveIntensity: 0.5, shininess: 100 })
  );
  accentRing.rotation.x = Math.PI / 2; // torus default is XY-plane; rotate to XZ so it circles Z-axis
  accentRing.position.z = 0.010;
  drone.add(accentRing);

  // Camera/battery bump — dark contrast (sits below body on Z axis)
  const bump = new THREE.Mesh(
    new THREE.BoxGeometry(0.058, 0.016, 0.038), // reordered dims: X wide, Y thin, Z tall
    new THREE.MeshPhongMaterial({ color: 0x1a1a1a, shininess: 40 })
  );
  bump.position.z = -0.022;
  drone.add(bump);

  // Status LED dome — vivid green glow
  const ledDome = new THREE.Mesh(
    new THREE.SphereGeometry(0.013, 10, 10),
    new THREE.MeshPhongMaterial({ color: 0x00ffaa, emissive: 0x00ffaa, emissiveIntensity: 4 })
  );
  ledDome.position.z = 0.024;
  drone.add(ledDome);

  // Per-arm colours: front-right cyan, front-left magenta, rear-right yellow, rear-left lime
  const ARM_COLORS = [0x00e5ff, 0xff00e5, 0xffea00, 0x76ff03];
  // Propeller blade colours per motor (contrasting, saturated)
  const PROP_COLORS = [0x00b4d8, 0xe040fb, 0xffca28, 0x69f0ae];
  const propGroups = [];

  [[0.085, 0.085], [-0.085, 0.085], [0.085, -0.085], [-0.085, -0.085]].forEach(([mx, my], i) => {
    const col = ARM_COLORS[i];

    // Arm — coloured
    const arm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.007, 0.12, 8),
      new THREE.MeshPhongMaterial({ color: col, emissive: col, emissiveIntensity: 0.18, shininess: 60 })
    );
    arm.position.set(mx * 0.9, my * 0.9, 0);
    arm.lookAt(new THREE.Vector3(mx, my, 0));
    arm.rotateX(Math.PI / 2);
    drone.add(arm);

    // Motor housing — dark with coloured top cap
    const motorBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.020, 0.022, 0.020, 14),
      new THREE.MeshPhongMaterial({ color: 0x222222, shininess: 60 })
    );
    motorBody.position.set(mx, my, -0.002);
    motorBody.rotation.x = Math.PI / 2;
    drone.add(motorBody);

    const motorCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.020, 0.008, 14),
      new THREE.MeshPhongMaterial({ color: col, emissive: col, emissiveIntensity: 0.3, shininess: 100 })
    );
    motorCap.position.set(mx, my, 0.012);
    motorCap.rotation.x = Math.PI / 2;
    drone.add(motorCap);

    // Propeller group
    const pg = new THREE.Group();
    pg.position.set(mx, my, 0.020);
    for (let b = 0; b < 2; b++) {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.13, 0.016, 0.003),
        new THREE.MeshPhongMaterial({ color: PROP_COLORS[i], emissive: PROP_COLORS[i], emissiveIntensity: 0.12, transparent: true, opacity: 0.92, shininess: 80 })
      );
      blade.rotation.z = (b * Math.PI) / 2;
      pg.add(blade);
    }
    drone.add(pg);
    propGroups.push(pg);
  });
  scene.add(drone);

  // ── Target marker (pulsing ring + sphere, NO landing pad ring) ──
  const tgtGroup = new THREE.Group();
  const tgtRingOuter = new THREE.Mesh(
    new THREE.RingGeometry(0.12, 0.16, 32),
    new THREE.MeshBasicMaterial({ color: 0xff3344, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
  );
  tgtRingOuter.rotation.x = -Math.PI / 2;
  tgtGroup.add(tgtRingOuter);
  tgtGroup.add(new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 10, 10),
    new THREE.MeshPhongMaterial({ color: 0xff2233, emissive: 0xff1122, emissiveIntensity: 0.8, transparent: true, opacity: 0.85 })
  ));
  scene.add(tgtGroup);

  // ── Waypoint path markers (managed by syncWaypoints) ──
  const wpMarkers = [];
  const wpLines = [];

  // ── Flight trail ──
  const TRAIL_LEN = 800;
  const trailBuf = new Float32Array(TRAIL_LEN * 3);
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute("position", new THREE.BufferAttribute(trailBuf, 3));
  trailGeo.setDrawRange(0, 0);
  const trailLine = new THREE.Line(trailGeo,
    new THREE.LineBasicMaterial({ color: isLt ? 0x2563eb : 0x60a5fa, transparent: true, opacity: 0.6 })
  );
  scene.add(trailLine);

  // ── Travel path: segments drawn as the drone completes each leg ──
  // These are persistent colored segments added at runtime, stored here
  const travelPaths = [];

  return { scene, camera, drone, ledDome, propGroups, tgtGroup, tgtRingOuter, wpMarkers, wpLines, trailLine, travelPaths, TRAIL_LEN };
}

function syncWaypoints(sd, waypoints, activeIdx) {
  sd.wpMarkers.forEach(g => sd.scene.remove(g));
  sd.wpLines.forEach(l => sd.scene.remove(l));
  sd.wpMarkers.length = 0;
  sd.wpLines.length = 0;

  // Planned path lines (dashed, lighter style)
  for (let i = activeIdx; i < waypoints.length - 1; i++) {
    const a = waypoints[i], b = waypoints[i + 1];
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(a.x, a.y, a.z), new THREE.Vector3(b.x, b.y, b.z)]),
      new THREE.LineDashedMaterial({ color: 0x888888, dashSize: 0.14, gapSize: 0.08, transparent: true, opacity: 0.35 })
    );
    line.computeLineDistances();
    sd.scene.add(line);
    sd.wpLines.push(line);
  }

  // Rings for upcoming + done waypoints
  waypoints.forEach((wp, i) => {
    if (i === activeIdx) return;
    const done = i < activeIdx;
    const g = new THREE.Group();
    g.position.set(wp.x, wp.y, wp.z);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.06, 0.09, 16),
      new THREE.MeshBasicMaterial({ color: done ? 0x22c55e : 0x60a5fa, side: THREE.DoubleSide, transparent: true, opacity: done ? 0.5 : 0.6 })
    );
    ring.rotation.x = -Math.PI / 2;
    g.add(ring);
    // Vertical stem to ground
    const stem = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -wp.z)]),
      new THREE.LineBasicMaterial({ color: done ? 0x22c55e : 0x60a5fa, transparent: true, opacity: 0.18 })
    );
    g.add(stem);
    sd.scene.add(g);
    sd.wpMarkers.push(g);
  });
}

// Draw a completed travel segment (called when drone departs a waypoint)
function addTravelSegment(sd, fromWP, toWP) {
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(fromWP.x, fromWP.y, fromWP.z),
      new THREE.Vector3(toWP.x, toWP.y, toWP.z),
    ]),
    new THREE.LineBasicMaterial({ color: 0x4ade80, transparent: true, opacity: 0.7, linewidth: 2 })
  );
  sd.scene.add(line);
  sd.travelPaths.push(line);
}

export default function DroneSimulator({ fullscreen = false }) {
  const [isMobile, setIsMobile] = useState(false);
  const [themeMode, setThemeMode] = useState("dark");
  const baseTh = THEMES[themeMode] || THEMES.dark;
  const th = isMobile ? THEMES.dark : baseTh;
  const isLt = isMobile ? false : (themeMode === "light");

  // Sync theme with global document class
  useEffect(() => {
    const sync = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setThemeMode(isDark ? "dark" : "light");
    };
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const animRef = useRef(0);
  const stateRef = useRef(mkState());
  const queueRef = useRef({ waypoints: [{ x: 0, y: 0, z: 0, yaw: 0, label: "Home" }], idx: 0 });
  const windRef = useRef(false);
  const simRef = useRef({
    running: false, t: 0, step: 0,
    trailWriteIdx: 0, trailCount: 0,
    atWP: false, holdSteps: 0,
    desVel: [0, 0, 0],
    smoothRoll: 0, smoothPitch: 0,
    cameraTheta: Math.PI / 4, cameraPhi: Math.PI / 3.2, cameraR: 7,
    dragging: false, lastMouse: { x: 0, y: 0 },
  });

  const [running, setRunning] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const [dronePos, setDronePos] = useState([0, 0, 0]);
  const [mobileActiveTab, setMobileActiveTab] = useState("controls");
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [cameraPreset, setCameraPreset] = useState("3D");
>>>>>>>>> Temporary merge branch 2

  useEffect(() => {
    if (!isMobile) {
      setIsInteracting(false);
    }
  }, [isMobile]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [droneRPM, setDroneRPM] = useState([5000, 5000, 5000, 5000]);
  const [waypoints, setWaypoints] = useState(queueRef.current.waypoints);
  const [activeIdx, setActiveIdx] = useState(0);
  const [arrived, setArrived] = useState(null);
  const [wind, setWind] = useState(false);
  const [autoAdv, setAutoAdv] = useState(true);
  const autoAdvRef = useRef(true);
  const [form, setForm] = useState({ x: "0", y: "0", z: "1", yaw: "0", label: "" });
  const [formErr, setFormErr] = useState("");
  const [editingIdx, setEditingIdx] = useState(null);
  const [flyMode, setFlyMode] = useState("queue");
  const [showCSV, setShowCSV] = useState(false);
  const [csvText, setCsvText] = useState("x,y,z,yaw,label\n0,0,0,0,Home\n2,0,1.5,0,Alpha\n2,2,2,1.57,Beta\n-1,1,1.5,-1.57,Gamma");

  const resizeRef = useRef(null);
  const lastPinchDist = useRef(null);

  // ── Renderer init (once) ──────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    const resize = () => {
      const el = canvasRef.current; if (!el) return;
      const sd = sceneRef.current; if (!sd) return;
      renderer.setSize(el.clientWidth, el.clientHeight);
      sd.camera.aspect = el.clientWidth / el.clientHeight;
      sd.camera.updateProjectionMatrix();
    };
    resizeRef.current = resize;
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
      renderer.dispose();
      canvasRef.current?.removeChild(renderer.domElement);
    };
  }, []); // eslint-disable-line

  // ── Scene rebuild on theme change (fixes light mode black screen) ─────────
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer || !canvasRef.current) return;
    // Tear down old scene objects
    const oldSd = sceneRef.current;
    if (oldSd) {
      oldSd.scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
    }
    // Build fresh scene for this theme
    const sd = buildScene(th);
    sceneRef.current = sd;
    syncWaypoints(sd, queueRef.current.waypoints, queueRef.current.idx);
    // Re-draw travel paths that existed before theme switch
    // (they were removed with the old scene, nothing to restore — accept this as a reset)
    const el = canvasRef.current;
    if (el) {
      renderer.setSize(el.clientWidth, el.clientHeight);
      sd.camera.aspect = el.clientWidth / el.clientHeight;
      sd.camera.updateProjectionMatrix();
    }
  }, [themeMode, isMobile]); // eslint-disable-line

  // ── Main loop ─────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const sim = simRef.current;
    const sd = sceneRef.current;
    const rend = rendererRef.current;
    if (!sd || !rend) { animRef.current = requestAnimationFrame(tick); return; }
    const DT = 1 / PHYSICS_HZ;

    if (sim.running) {
      for (let s = 0; s < STEPS_PER_FRAME; s++) {
        sim.t += DT; sim.step++;
        const st = stateRef.current;
        const q = queueRef.current;
        const tgt = q.waypoints[q.idx] ?? q.waypoints[0];

        if (sim.step % STEPS_PER_CTRL === 0) {
          const { vel, yr } = posControl(st, tgt);
          sim.desVel = vel;
          const des = desiredRPMs(vel, st.linVel, yr);
          st.rpm = des.map((d, i) => st.rpm[i] + ((d - st.rpm[i]) / CFG.TM) * DT);
        }

        const latX = clamp((sim.desVel[0] - st.linVel[0]) * 14, -9, 9);
        const latY = clamp((sim.desVel[1] - st.linVel[1]) * 14, -9, 9);
        const thrust = st.rpm.reduce((s2, r) => { const w = r * 2 * Math.PI / 60; return s2 + CFG.KF * w * w; }, 0);
        const drag = st.linVel.map((v, i) => -CFG.K_TRANS[i] * v);
        const wf = windForce(sim.t, windRef.current);
        const acc = [latX + (drag[0] + wf[0]) / CFG.M, latY + (drag[1] + wf[1]) / CFG.M, (thrust + drag[2] + wf[2]) / CFG.M - GRAVITY];

        st.linVel = st.linVel.map((v, i) => clamp(v + acc[i] * DT, -6, 6));
        st.pos = [st.pos[0] + st.linVel[0] * DT, st.pos[1] + st.linVel[1] * DT, Math.max(0, st.pos[2] + st.linVel[2] * DT)];
        st.euler[2] += clamp(wrap(tgt.yaw - st.euler[2]) * 1.5, -1.745, 1.745) * DT;

        // Trail
        const ti = sim.trailWriteIdx % sd.TRAIL_LEN;
        const pa = sd.trailLine.geometry.attributes.position;
        pa.array[ti * 3] = st.pos[0]; pa.array[ti * 3 + 1] = st.pos[1]; pa.array[ti * 3 + 2] = st.pos[2];
        pa.needsUpdate = true;
        sim.trailWriteIdx++;
        if (sim.trailCount < sd.TRAIL_LEN) sim.trailCount++;
        sd.trailLine.geometry.setDrawRange(0, sim.trailCount);

        // Arrival
        if (dist3(st.pos, tgt) < ARRIVAL_DIST) {
          if (!sim.atWP) { sim.atWP = true; sim.holdSteps = 0; setArrived(tgt.label ?? `WP${q.idx + 1}`); }
          if (++sim.holdSteps >= ARRIVAL_HOLD_S * PHYSICS_HZ && autoAdvRef.current && q.idx < q.waypoints.length - 1) {
            const fromWP = q.waypoints[q.idx];
            q.idx++;
            const toWP = q.waypoints[q.idx];
            sim.atWP = false; sim.holdSteps = 0;
            // Draw travel segment
            addTravelSegment(sd, fromWP, toWP);
            setActiveIdx(q.idx); setArrived(null);
            syncWaypoints(sd, q.waypoints, q.idx);
            break;
          }
        } else if (sim.atWP) { sim.atWP = false; sim.holdSteps = 0; }
      }
    }

    // Visual update
    const st = stateRef.current;
    sim.smoothRoll = lerp(sim.smoothRoll, clamp(-st.linVel[1] / 3, -MAX_TILT, MAX_TILT), 0.12);
    sim.smoothPitch = lerp(sim.smoothPitch, clamp(st.linVel[0] / 3, -MAX_TILT, MAX_TILT), 0.12);

    sd.drone.position.set(st.pos[0], st.pos[1], st.pos[2]);
    sd.drone.rotation.order = "ZYX";
    sd.drone.rotation.z = st.euler[2];
    sd.drone.rotation.y = sim.smoothPitch;
    sd.drone.rotation.x = sim.smoothRoll;

    const avgRPM = st.rpm.reduce((a, b) => a + b, 0) / 4;
    const propDelta = (avgRPM / 60) * 2 * Math.PI * (STEPS_PER_FRAME / PHYSICS_HZ);
    sd.propGroups.forEach((pg, i) => { pg.rotation.z += (i % 2 === 0 ? 1 : -1) * propDelta; });

    const ledMat = sd.ledDome.material;
    if (sim.running) { ledMat.color.setHex(0x00ff88); ledMat.emissive.setHex(0x00ff88); ledMat.emissiveIntensity = 2.5 + Math.sin(sim.t * 8) * 0.5; }
    else { ledMat.color.setHex(0xffaa00); ledMat.emissive.setHex(0xffaa00); ledMat.emissiveIntensity = 1.0; }

    const act = queueRef.current.waypoints[queueRef.current.idx] ?? queueRef.current.waypoints[0];
    sd.tgtGroup.position.set(act.x, act.y, act.z);
    sd.tgtRingOuter.scale.setScalar(0.85 + Math.sin(sim.t * 3.5) * 0.15);

    sd.camera.position.set(
      sim.cameraR * Math.sin(sim.cameraPhi) * Math.cos(sim.cameraTheta),
      sim.cameraR * Math.sin(sim.cameraPhi) * Math.sin(sim.cameraTheta),
      sim.cameraR * Math.cos(sim.cameraPhi)
    );
    sd.camera.lookAt(0, 0, 0.5);
    rend.render(sd.scene, sd.camera);

    if (sim.step % (STEPS_PER_FRAME * 6) === 0) {
      setDronePos([...st.pos]);
      setDroneRPM([...st.rpm]);
      setSimTime(sim.t);
    }
    animRef.current = requestAnimationFrame(tick);
  }, []); // eslint-disable-line

  useEffect(() => { animRef.current = requestAnimationFrame(tick); return () => cancelAnimationFrame(animRef.current); }, [tick]);

  // ── Touch support (passive:false required to call preventDefault on iPad) ──
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const touchStart = (e) => {
      if (e.touches.length === 1) {
        simRef.current.dragging = true;
        simRef.current.lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        lastPinchDist.current = null;
      } else if (e.touches.length === 2) {
        simRef.current.dragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastPinchDist.current = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const touchMove = (e) => {
      e.preventDefault(); // stop page scroll while orbiting / pinching
      const sim = simRef.current;
      if (e.touches.length === 1 && sim.dragging) {
        sim.cameraTheta -= (e.touches[0].clientX - sim.lastMouse.x) * 0.007;
        sim.cameraPhi = clamp(sim.cameraPhi + (e.touches[0].clientY - sim.lastMouse.y) * 0.007, 0.06, Math.PI / 2 - 0.02);
        sim.lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        setCameraPreset(null);
      } else if (e.touches.length === 2 && lastPinchDist.current !== null) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        sim.cameraR = clamp(sim.cameraR + (lastPinchDist.current - dist) * 0.05, 1.5, 22);
        lastPinchDist.current = dist;
      }
    };

    const touchEnd = () => {
      simRef.current.dragging = false;
      lastPinchDist.current = null;
    };

    el.addEventListener('touchstart', touchStart, { passive: true });
    el.addEventListener('touchmove', touchMove, { passive: false });
    el.addEventListener('touchend', touchEnd);
    return () => {
      el.removeEventListener('touchstart', touchStart);
      el.removeEventListener('touchmove', touchMove);
      el.removeEventListener('touchend', touchEnd);
    };
  }, []); // eslint-disable-line

  // ── Queue helpers ──────────────────────────────────────────────────────────
  const applyQueue = (newWPs, newIdx, opts = {}) => {
    const idx = Math.max(0, Math.min(newIdx, newWPs.length - 1));
    queueRef.current.waypoints = newWPs;
    queueRef.current.idx = idx;
    if (opts.resetArrival) { simRef.current.atWP = false; simRef.current.holdSteps = 0; setArrived(null); }
    if (opts.clearTravel && sceneRef.current) {
      sceneRef.current.travelPaths.forEach(l => sceneRef.current.scene.remove(l));
      sceneRef.current.travelPaths.length = 0;
    }
    if (sceneRef.current) syncWaypoints(sceneRef.current, newWPs, idx);
    setWaypoints([...newWPs]);
    setActiveIdx(idx);
    if (opts.autoStart && !simRef.current.running) { simRef.current.running = true; setRunning(true); }
  };

  const parseForm = (f) => {
    const x = parseFloat(f.x), y = parseFloat(f.y), z = parseFloat(f.z), yaw = parseFloat(f.yaw);
    if ([x, y, z, yaw].some(isNaN)) return "All fields must be valid numbers";
    if (z < 0 || z > 8) return "Z (altitude) must be 0–8 m";
    if (Math.abs(x) > 10 || Math.abs(y) > 10) return "X and Y must be within ±10 m";
    if (Math.abs(yaw) > Math.PI) return "Yaw must be within ±π rad";
    return { x, y, z, yaw };
  };

  // ── Controls ───────────────────────────────────────────────────────────────
  const start = () => { simRef.current.running = true; setRunning(true); };
  const pause = () => { simRef.current.running = false; setRunning(false); };
  const reset = () => {
    const sim = simRef.current;
    Object.assign(sim, { running: false, t: 0, step: 0, trailWriteIdx: 0, trailCount: 0, atWP: false, holdSteps: 0, desVel: [0, 0, 0], smoothRoll: 0, smoothPitch: 0 });
    stateRef.current = mkState();
    setRunning(false); setDronePos([0, 0, 0]); setDroneRPM([5000, 5000, 5000, 5000]); setSimTime(0);
    applyQueue(queueRef.current.waypoints, 0, { resetArrival: true, clearTravel: true });
    const sd = sceneRef.current;
    if (sd) {
      sd.drone.position.set(0, 0, 0); sd.drone.rotation.set(0, 0, 0);
      const pa = sd.trailLine.geometry.attributes.position;
      pa.array.fill(0); pa.needsUpdate = true;
      sd.trailLine.geometry.setDrawRange(0, 0);
    }
  };

  const toggleWind = () => { windRef.current = !windRef.current; setWind(windRef.current); };
  const toggleAutoAdv = () => { const n = !autoAdv; autoAdvRef.current = n; setAutoAdv(n); };
  const flyTo = (idx) => applyQueue(queueRef.current.waypoints, idx, { resetArrival: true, autoStart: true });

  const handleFly = () => {
    const r = parseForm(form); if (typeof r === "string") { setFormErr(r); return; }
    setFormErr("");
    applyQueue([{ ...r, label: form.label.trim() || "Fly-to" }], 0, { resetArrival: true, autoStart: true, clearTravel: true });
  };

  const handleAddOrUpdate = () => {
    const r = parseForm(form); if (typeof r === "string") { setFormErr(r); return; }
    setFormErr("");
    const q = queueRef.current;
    const label = form.label.trim() || (editingIdx !== null ? `WP${editingIdx + 1}` : `WP${q.waypoints.length + 1}`);
    if (editingIdx !== null) {
      const newWPs = q.waypoints.map((wp, i) => i === editingIdx ? { ...r, label } : wp);
      applyQueue(newWPs, q.idx, { resetArrival: editingIdx === q.idx });
      setEditingIdx(null);
    } else {
      applyQueue([...q.waypoints, { ...r, label }], q.idx, {});
    }
  };

  const startEditing = (i) => {
    const wp = queueRef.current.waypoints[i];
    setForm({ x: String(wp.x), y: String(wp.y), z: String(wp.z), yaw: String(wp.yaw), label: wp.label ?? "" });
    setFormErr(""); setEditingIdx(i); setFlyMode("queue");
  };

  const removeWaypoint = (i) => {
    const q = queueRef.current;
    if (q.waypoints.length === 1) return;
    const newWPs = q.waypoints.filter((_, idx) => idx !== i);
    let newIdx = q.idx;
    if (i < q.idx) newIdx--;
    else if (i === q.idx) newIdx = Math.min(newIdx, newWPs.length - 1);
    applyQueue(newWPs, Math.max(0, newIdx), { resetArrival: true });
  };

  const moveWaypoint = (i, dir) => {
    const q = queueRef.current;
    const j = i + dir;
    if (j < 0 || j >= q.waypoints.length) return;
    const newWPs = [...q.waypoints];[newWPs[i], newWPs[j]] = [newWPs[j], newWPs[i]];
    let newIdx = q.idx;
    if (q.idx === i) newIdx = j; else if (q.idx === j) newIdx = i;
    applyQueue(newWPs, newIdx, {});
  };

  const handleLoadCSV = () => {
    try {
      const parsed = csvText.trim().split("\n").slice(1)
        .map(l => l.split(",")).filter(r => r.length >= 4)
        .map(r => ({ x: parseFloat(r[0]), y: parseFloat(r[1]), z: parseFloat(r[2]), yaw: parseFloat(r[3]), label: r[4]?.trim() || undefined }))
        .filter(t => !isNaN(t.x) && !isNaN(t.y) && !isNaN(t.z) && !isNaN(t.yaw) && t.z >= 0);
      if (parsed.length) { applyQueue(parsed, 0, { resetArrival: true, clearTravel: true }); setShowCSV(false); }
    } catch { }
  };

  // Camera
  const onMouseDown = (e) => { simRef.current.dragging = true; simRef.current.lastMouse = { x: e.clientX, y: e.clientY }; };
  const onMouseMove = (e) => {
    if (!simRef.current.dragging) return;
    const sim = simRef.current;
    sim.cameraTheta -= (e.clientX - sim.lastMouse.x) * 0.007;
    sim.cameraPhi = clamp(sim.cameraPhi + (e.clientY - sim.lastMouse.y) * 0.007, 0.06, Math.PI / 2 - 0.02);
    sim.lastMouse = { x: e.clientX, y: e.clientY };
    setCameraPreset(null);
  };
  const stopDrag = () => { simRef.current.dragging = false; };
  const onWheel = (e) => { simRef.current.cameraR = clamp(simRef.current.cameraR + e.deltaY * 0.007, 1.5, 22); };

  const camPresets = {
    "3D": [Math.PI / 4, Math.PI / 3.2, 7],
    "Top": [Math.PI / 4, 0.08, 9],
    "Front": [0, Math.PI / 2 - 0.02, 7],
    "Side": [Math.PI / 2, Math.PI / 2 - 0.02, 7],
  };

  // Derived
  const currentWP = waypoints[activeIdx];
  const distToWP = currentWP ? dist3(dronePos, currentWP) : 0;
  const rpmColors = ["#f87171", "#4ade80", "#60a5fa", "#fbbf24"];

  // ── Style helpers ─────────────────────────────────────────────────────────
  const btn = (active, color) => ({
    background: active ? color + "22" : "transparent",
    border: `1px solid ${active ? color : th.btnBorder}`,
    borderRadius: 5, color: active ? color : th.btnText,
    fontSize: 11, padding: "5px 10px", cursor: "pointer", fontWeight: active ? 600 : 400,
  });

  const inputSt = {
    background: th.inputBg, border: `1px solid ${th.inputBorder}`,
    borderRadius: 5, color: th.inputText, fontSize: 11, padding: "5px 8px",
    outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit",
  };

  const SL = ({ children }) => (
    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: th.slAccent, textTransform: "uppercase", borderBottom: `1px solid ${th.slAccent}33`, paddingBottom: 5, marginBottom: 4 }}>
      {children}
    </div>
  );

  const Gauge = ({ label, value, min, max, unit, color }) => {
    const pct = clamp((value - min) / (max - min), 0, 1);
    return (
      <div style={{ marginBottom: 7 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: th.textSecondary, marginBottom: 3 }}>
          <span>{label}</span>
          <span style={{ color: th.textPrimary, fontVariantNumeric: "tabular-nums" }}>{value.toFixed(2)}<span style={{ color: th.textMuted, marginLeft: 2 }}>{unit}</span></span>
        </div>
        <div style={{ height: 3, background: th.gaugeTrack, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${pct * 100}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.1s" }} />
        </div>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: isMobile ? (fullscreen ? "100vh" : "600px") : (fullscreen ? "100vh" : "800px"), background: th.shellBg, fontFamily: "ui-monospace,'Cascadia Code',monospace", color: th.textPrimary, overflow: "hidden", userSelect: "none" }}>

      {/* Topbar */}
      <div style={{ height: 44, display: "flex", alignItems: "center", padding: "0 16px", gap: 12, background: th.topbarBg, borderBottom: `1px solid ${th.topbarBorder}`, flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: running ? th.statusOn : th.statusOff, boxShadow: `0 0 6px ${running ? th.statusOn : th.statusOff}` }} />
        <span style={{ fontSize: 13, fontWeight: 600 }}>Drone Simulator</span>
        <span style={{ fontSize: 10, color: th.textMuted, background: th.wellBg, border: `1px solid ${th.wellBorder}`, borderRadius: 4, padding: "1px 6px" }}>v6</span>
        {arrived && <span style={{ fontSize: 11, padding: "2px 8px", background: th.arrivedBg, border: `1px solid ${th.arrivedBorder}`, borderRadius: 5, color: th.arrivedText }}>✓ {arrived}</span>}
        <div style={{ flex: 1 }} />
        <span style={{ color: th.textMuted, fontSize: 11 }}>T = {simTime.toFixed(1)} s</span>
        {!isMobile && (
          <button onClick={() => setThemeMode(m => m === "dark" ? "light" : "dark")} style={{ ...btn(false, th.accentBlue), padding: "4px 10px" }}>
            {isLt ? "☀ Light" : "◑ Dark"}
          </button>
        )}
>>>>>>>>> Temporary merge branch 2
        {!fullscreen && !isMobile && (
          <button
            onClick={() => window.open('/projects/drone-controller/simulation', '_blank', 'noopener,noreferrer')}
            style={{ ...btn(false, th.accentGreen), padding: "4px 10px", fontWeight: 600 }}
            title="Open in fullscreen new tab"
          >
            ⛶ Fullscreen
          </button>
        )}
<<<<<<<<< Temporary merge branch 1
        {!isMobile && <span style={{ color:th.textMuted, fontSize:10 }}>Drag / Touch · Pinch zoom</span>}
=========
        {!isMobile && <span style={{ color: th.textMuted, fontSize: 10 }}>Drag / Touch · Pinch zoom</span>}
>>>>>>>>> Temporary merge branch 2
      </div>

      {isMobile ? (
        /* ── MOBILE VIEWPORT: PREMIUM FULL SCREEN OVERLAYS ── */
<<<<<<<<< Temporary merge branch 1
        <div style={{ flex:1, position:"relative", overflow:"hidden" }}>
          
          {/* Immersive 3D Viewport canvas as the full-screen backdrop */}
          <div ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", cursor:"grab", touchAction:"none", zIndex:0 }}
            onMouseDown={onMouseDown} onMouseMove={onMouseMove}
            onMouseUp={stopDrag} onMouseLeave={stopDrag} onWheel={onWheel}
            onContextMenu={e => e.preventDefault()} />

          {/* Camera presets (Floating Top Left) */}
          <div style={{ position:"absolute", top:12, left:12, display:"flex", gap:5, zIndex:10 }}>
            {Object.entries(camPresets).map(([label,[theta,phi,r]]) => (
              <button key={label} style={{ background:th.viewBtnBg, border:`1px solid ${th.viewBtnBorder}`, borderRadius:6, color:th.viewBtnText, fontSize:9, fontWeight:600, padding:"4px 8px", cursor:"pointer", backdropFilter:"blur(8px)" }}
                onClick={e => { e.stopPropagation(); Object.assign(simRef.current, { cameraTheta:theta, cameraPhi:phi, cameraR:r }); }}>
                {label}
=========
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>

          {/* Immersive 3D Viewport canvas as the full-screen backdrop */}
          <div ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", cursor: "grab", touchAction: "none", zIndex: 0 }}
            onMouseDown={onMouseDown} onMouseMove={onMouseMove}
            onMouseUp={stopDrag} onMouseLeave={stopDrag} onWheel={onWheel}
            onContextMenu={e => e.preventDefault()} />

          {/* Touch-to-Orbit Overlay */}
          {!isInteracting && (
            <div
              onClick={() => setIsInteracting(true)}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 15,
                background: "rgba(10, 10, 10, 0.45)",
                backdropFilter: "blur(3px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                cursor: "pointer",
                textAlign: "center",
                padding: 20,
                transition: "all 0.3s ease"
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "swipe-horizontal 2.5s infinite ease-in-out" }}>
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.15" />
                  <path d="M18 13c0-3.5-2.5-6-4.5-6S9 9.5 9 13M6 11c0-1.5 1.5-2.5 3-2.5s3.5 2 3.5 4M15 15v4" stroke="currentColor" />
                  <path d="M12 15V9" stroke="currentColor" />
                </svg>
                <style>{`
                  @keyframes swipe-horizontal {
                    0%, 100% { transform: translateX(-8px) rotate(-6deg); }
                    50% { transform: translateX(8px) rotate(6deg); }
                  }
                `}</style>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.5, textShadow: "0 2px 4px rgba(0,0,0,0.5)", color: "#ffffff" }}>
                Tap to Orbit 3D Space
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", marginTop: 4, letterSpacing: 0.2 }}>
                Enables 3D rotation & locks page scrolling
              </div>
            </div>
          )}

          {/* Floating Lock Camera Button */}
          {isInteracting && (
            <button
              onClick={() => setIsInteracting(false)}
              style={{
                position: "absolute",
                top: 50,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 25,
                background: "rgba(10, 10, 10, 0.85)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: 20,
                color: "#ffffff",
                fontSize: 10,
                fontWeight: 700,
                padding: "6px 14px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                outline: "none"
              }}
            >
              <span style={{ fontSize: 9 }}>🔒</span> Lock Camera
            </button>
          )}

          {/* Camera presets (Floating Top Left) */}
          <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 5, zIndex: 10 }}>
            {Object.entries(camPresets).map(([label, [theta, phi, r]]) => {
              const isSelected = cameraPreset === label;
              return (
                <button
                  key={label}
                  onClick={e => {
                    e.stopPropagation();
                    Object.assign(simRef.current, { cameraTheta: theta, cameraPhi: phi, cameraR: r });
                    setCameraPreset(label);
                  }}
                  style={{
                    background: isSelected ? "rgba(96, 165, 250, 0.25)" : "rgba(10, 10, 10, 0.70)",
                    border: `1px solid ${isSelected ? "#60a5fa" : "rgba(255, 255, 255, 0.12)"}`,
                    borderRadius: 6,
                    color: isSelected ? "#60a5fa" : "#a3a3a3",
                    fontSize: 9,
                    fontWeight: 700,
                    padding: "5px 9px",
                    cursor: "pointer",
                    backdropFilter: "blur(8px)",
                    boxShadow: isSelected ? "0 0 8px rgba(96, 165, 250, 0.4)" : "none",
                    transition: "all 0.2s ease-in-out"
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Distance Badge (Floating Top Right) */}
          <div style={{
            position: "absolute", top: 12, right: 12, background: th.hudBg, border: `1px solid ${distToWP < ARRIVAL_DIST ? th.arrivedBorder : th.hudBorder}`, borderRadius: 8, padding: "6px 10px", backdropFilter: "blur(8px)", zIndex: 10,
            opacity: isDrawerExpanded ? 0 : 1,
            pointerEvents: isDrawerExpanded ? "none" : "auto",
            transition: "all 0.3s ease-in-out"
          }}>
            <div style={{ fontSize: 8, color: th.textMuted, textTransform: "uppercase", letterSpacing: 0.3 }}>
              {currentWP?.label ?? "Target"}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: distToWP < ARRIVAL_DIST ? th.arrivedText : th.accentAmber }}>
              {distToWP.toFixed(2)} m
            </div>
          </div>

          {/* Position HUD (Floating Bottom Left, sits above expanded drawer) */}
          <div style={{
            position: "absolute", bottom: isDrawerExpanded ? 405 : 85, left: 12, background: th.hudBg, border: `1px solid ${th.hudBorder}`, borderRadius: 8, padding: "6px 10px", backdropFilter: "blur(8px)", fontSize: 10, zIndex: 10,
            opacity: isDrawerExpanded ? 0 : 1,
            pointerEvents: isDrawerExpanded ? "none" : "auto",
            transition: "all 0.3s ease-in-out"
          }}>
            <div style={{ fontSize: 8, color: th.textMuted, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 4, fontWeight: 600 }}>Position</div>
            {["X", "Y", "Z"].map((ax, i) => (
              <div key={ax} style={{ display: "flex", gap: 8, fontSize: 10, lineHeight: 1.2 }}>
                <span style={{ color: ["#f87171", "#4ade80", "#60a5fa"][i], width: 8 }}>{ax}</span>
                <span style={{ fontVariantNumeric: "tabular-nums", color: th.textPrimary }}>{dronePos[i].toFixed(2)}m</span>
              </div>
            ))}
          </div>

          {/* Speed/Velocity HUD (Floating Bottom Right, sits above expanded drawer) */}
          <div style={{
            position: "absolute", bottom: isDrawerExpanded ? 405 : 85, right: 12, background: th.hudBg, border: `1px solid ${th.hudBorder}`, borderRadius: 8, padding: "6px 10px", backdropFilter: "blur(8px)", fontSize: 10, zIndex: 10,
            opacity: isDrawerExpanded ? 0 : 1,
            pointerEvents: isDrawerExpanded ? "none" : "auto",
            transition: "all 0.3s ease-in-out"
          }}>
            <div style={{ fontSize: 8, color: th.textMuted, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 4, fontWeight: 600 }}>Speed</div>
            {[
              { ax: "Vx", val: stateRef.current.linVel[0], col: "#f87171" },
              { ax: "Vy", val: stateRef.current.linVel[1], col: "#4ade80" },
              { ax: "Vz", val: stateRef.current.linVel[2], col: "#60a5fa" }
            ].map((v) => (
              <div key={v.ax} style={{ display: "flex", gap: 8, fontSize: 10, lineHeight: 1.2 }}>
                <span style={{ color: v.col, width: 14 }}>{v.ax}</span>
                <span style={{ fontVariantNumeric: "tabular-nums", color: th.textPrimary }}>{v.val.toFixed(2)}m/s</span>
              </div>
            ))}
          </div>

          {/* Floating Glassmorphic Bottom Sheet Drawer */}
          <div style={{
            position: "absolute", bottom: 12, left: 12, right: 12, zIndex: 20,
            background: th.hudBg, border: `1px solid ${th.hudBorder}`, backdropFilter: "blur(20px)",
            borderRadius: 16, padding: "10px 12px 12px 12px", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
            display: "flex", flexDirection: "column", gap: 10,
            transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)", maxHeight: isDrawerExpanded ? "390px" : "68px", overflow: "hidden"
          }}>

            {/* Drag handle pill */}
            <div
              onClick={() => setIsDrawerExpanded(!isDrawerExpanded)}
              style={{
                width: 36, height: 4, borderRadius: 2,
                background: "rgba(255, 255, 255, 0.2)",
                margin: "0 auto 4px auto", cursor: "pointer"
              }}
            />

            {/* Header / Quick Actions (Always visible when collapsed or expanded) */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 36, flexShrink: 0 }}>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={start}
                  style={{
                    background: running ? th.accentGreen : "rgba(74, 222, 128, 0.12)",
                    border: `1px solid ${th.accentGreen}`,
                    borderRadius: 6,
                    color: running ? "#ffffff" : "#4ade80",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "5px 11px",
                    cursor: "pointer",
                    boxShadow: running ? `0 0 10px ${th.accentGreen}66` : "none",
                    transition: "all 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                    gap: 3
                  }}
                >
                  ▶ Start
                </button>
                <button
                  onClick={pause}
                  style={{
                    background: (!running && simTime > 0) ? th.accentAmber : "rgba(251, 191, 36, 0.12)",
                    border: `1px solid ${th.accentAmber}`,
                    borderRadius: 6,
                    color: (!running && simTime > 0) ? "#ffffff" : "#fbbf24",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "5px 11px",
                    cursor: "pointer",
                    boxShadow: (!running && simTime > 0) ? `0 0 10px ${th.accentAmber}66` : "none",
                    transition: "all 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                    gap: 3
                  }}
                >
                  ⏸ Pause
                </button>
                <button
                  onClick={reset}
                  style={{
                    background: "rgba(248, 113, 113, 0.15)",
                    border: `1px solid ${th.accentRed}`,
                    borderRadius: 6,
                    color: "#f87171",
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "5px 11px",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                    gap: 3
                  }}
                >
                  ↺ Reset
                </button>
              </div>

              {/* Toggle expand button */}
              <button
                onClick={() => setIsDrawerExpanded(!isDrawerExpanded)}
                style={{
                  background: "rgba(96, 165, 250, 0.12)",
                  border: "1px solid rgba(96, 165, 250, 0.35)",
                  borderRadius: 8,
                  color: "#60a5fa",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "5px 12px",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                }}
              >
                {isDrawerExpanded ? "▼ Close Panel" : "▲ Fly Config"}
              </button>
            </div>

            {/* Expanded Content Section */}
            {isDrawerExpanded && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", gap: 10 }}>
                <div style={{ height: 1, background: "rgba(255, 255, 255, 0.08)", width: "100%", flexShrink: 0 }} />

                {/* Scrollable body content */}
                <div style={{ flex: 1, overflowY: "auto", paddingRight: 2, display: "flex", flexDirection: "column", gap: 12 }}>
                  {mobileActiveTab === "controls" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <SL>Coordinates Form</SL>

                      {/* Form inputs */}
                      <section style={{ background: th.wellBg, border: `1px solid ${th.wellBorder}`, borderRadius: 8, padding: "10px", display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ fontSize: 9, fontWeight: 600, color: editingIdx !== null ? th.accentAmber : th.accentBlue }}>
                          {editingIdx !== null ? `Editing: ${waypoints[editingIdx]?.label ?? `WP${editingIdx + 1}`}` : "Set Coordinates"}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                          {[["X (±10)", "x"], ["Y (±10)", "y"], ["Z (0–8)", "z"], ["Yaw (±π)", "yaw"]].map(([label, field]) => (
                            <div key={field}>
                              <div style={{ fontSize: 8, color: th.textMuted, marginBottom: 1 }}>{label}</div>
                              <input style={inputSt} type="number" step="0.1" value={form[field]}
                                onChange={e => { setForm(f => ({ ...f, [field]: e.target.value })); setFormErr(""); }} />
                            </div>
                          ))}
                        </div>

                        <div>
                          <div style={{ fontSize: 8, color: th.textMuted, marginBottom: 1 }}>Name (optional)</div>
                          <input style={inputSt} type="text" placeholder="e.g. Alpha" value={form.label}
                            onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                            onKeyDown={e => e.key === "Enter" && (flyMode === "fly" ? handleFly() : handleAddOrUpdate())} />
                        </div>

                        {formErr && <div style={{ fontSize: 9, color: th.errorText, background: th.errorBg, border: `1px solid ${th.errorBorder}`, borderRadius: 4, padding: "4px 7px" }}>{formErr}</div>}

                        {editingIdx !== null ? (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={handleAddOrUpdate} style={{ flex: 1, background: th.editBtnBg, border: `1px solid ${th.editBtnBorder}`, borderRadius: 5, color: th.accentAmber, fontSize: 10, padding: "6px 0", cursor: "pointer", fontWeight: 600 }}>
                              Update WP{editingIdx + 1}
                            </button>
                            <button onClick={() => { setEditingIdx(null); setFormErr(""); }} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${th.wellBorder}`, borderRadius: 5, color: th.textSecondary, fontSize: 10, padding: "6px 10px", cursor: "pointer" }}>✕</button>
                          </div>
                        ) : (
                          <>
                            <div style={{ display: "flex", gap: 5 }}>
                              {["fly", "queue"].map(m => (
                                <button key={m} onClick={() => setFlyMode(m)} style={{
                                  flex: 1, fontSize: 10, padding: "5px 0", cursor: "pointer", borderRadius: 5, fontWeight: flyMode === m ? 600 : 400,
                                  background: flyMode === m ? (m === "fly" ? th.accentBlue + "22" : th.accentGreen + "22") : "transparent",
                                  border: `1px solid ${flyMode === m ? (m === "fly" ? th.accentBlue : th.accentGreen) : th.btnBorder}`,
                                  color: flyMode === m ? (m === "fly" ? th.accentBlue : th.accentGreen) : th.btnText,
                                }}>{m === "fly" ? "✈ Fly Now" : "+ Queue"}</button>
                              ))}
                            </div>
                            <button onClick={() => flyMode === "fly" ? handleFly() : handleAddOrUpdate()} style={{ background: flyMode === "fly" ? th.accentBlue : th.accentGreen, border: "none", borderRadius: 5, color: "#fff", fontSize: 11, padding: "7px 0", cursor: "pointer", fontWeight: 700 }}>
                              {flyMode === "fly" ? "✈  Fly to Target" : "+  Add to Queue"}
                            </button>
                          </>
                        )}
                      </section>

                      <button
                        onClick={toggleWind}
                        style={{
                          background: wind ? th.accentBlue : "rgba(96, 165, 250, 0.08)",
                          border: `1px solid ${th.accentBlue}`,
                          borderRadius: 6,
                          color: wind ? "#ffffff" : "#60a5fa",
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "8px",
                          cursor: "pointer",
                          boxShadow: wind ? `0 0 10px ${th.accentBlue}66` : "none",
                          transition: "all 0.2s ease-in-out",
                          width: "100%"
                        }}
                      >
                        {wind ? "⚡ Wind Active" : "○ Wind Inactive"}
                      </button>
                    </div>
                  )}

                  {mobileActiveTab === "queue" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <SL>Flight Queue</SL>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                          <span style={{ fontSize: 8, color: th.textMuted }}>Auto</span>
                          <div onClick={toggleAutoAdv} style={{ width: 24, height: 13, borderRadius: 6, background: autoAdv ? th.toggleOnBg : th.toggleOffBg, border: `1px solid ${autoAdv ? th.toggleOnBorder : th.toggleOffBorder}`, cursor: "pointer", position: "relative" }}>
                            <div style={{ position: "absolute", top: 1, left: autoAdv ? 12 : 2, width: 9, height: 9, borderRadius: "50%", background: autoAdv ? th.toggleKnobOn : th.toggleKnobOff, transition: "left 0.15s" }} />
                          </div>
                        </div>
                      </div>

                      {/* Waypoints list */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 3, maxHeight: "130px", overflowY: "auto", paddingRight: 2 }}>
                        {waypoints.map((wp, i) => {
                          const isActive = i === activeIdx, isDone = i < activeIdx;
                          return (
                            <div key={i} style={{
                              display: "flex", alignItems: "center", gap: 5, padding: "4px 6px", borderRadius: 5, cursor: "pointer",
                              background: isActive ? th.wpActiveBg : isDone ? th.wpDoneBg : th.wpIdleBg,
                              border: `1px solid ${isActive ? th.wpActiveBorder : isDone ? th.wpDoneBorder : th.wpIdleBorder}`,
                            }} onClick={() => flyTo(i)}>
                              <div style={{ width: 5, height: 5, borderRadius: "50%", flexShrink: 0, background: isActive ? th.wpDotActive : isDone ? th.wpDotDone : th.wpDot }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 10, color: isActive ? th.wpActiveText : isDone ? th.wpDoneText : th.wpIdleText, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {isDone && "✓ "}{wp.label}
                                </div>
                                <div style={{ fontSize: 8, color: th.textMuted }}>({wp.x.toFixed(1)}, {wp.y.toFixed(1)}, {wp.z.toFixed(1)})</div>
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                <button onClick={e => { e.stopPropagation(); moveWaypoint(i, -1); }} disabled={i === 0}
                                  style={{ background: "none", border: "none", color: i === 0 ? th.textDim : th.textSecondary, fontSize: 8, cursor: i === 0 ? "default" : "pointer", padding: "0 1px", lineHeight: 1 }}>▲</button>
                                <button onClick={e => { e.stopPropagation(); moveWaypoint(i, 1); }} disabled={i === waypoints.length - 1}
                                  style={{ background: "none", border: "none", color: i === waypoints.length - 1 ? th.textDim : th.textSecondary, fontSize: 8, cursor: i === waypoints.length - 1 ? "default" : "pointer", padding: "0 1px", lineHeight: 1 }}>▼</button>
                              </div>
                              <button onClick={e => { e.stopPropagation(); startEditing(i); }}
                                style={{ background: "none", border: "none", color: th.textMuted, fontSize: 11, cursor: "pointer", padding: "0 2px" }}>✎</button>
                              <button onClick={e => { e.stopPropagation(); removeWaypoint(i); }}
                                style={{ background: "none", border: "none", color: th.textMuted, fontSize: 12, cursor: "pointer", padding: "0 2px", lineHeight: 1 }}>✕</button>
                            </div>
                          );
                        })}
                      </div>

                      <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                        <button
                          onClick={() => setShowCSV(true)}
                          style={{
                            background: "rgba(167, 139, 250, 0.18)",
                            border: "1px solid #a78bfa",
                            borderRadius: 6,
                            color: "#a78bfa",
                            flex: 1,
                            padding: "7px",
                            fontSize: 10,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s ease-in-out"
                          }}
                        >
                          📂 Load CSV
                        </button>
                        <button
                          onClick={() => applyQueue([{ x: 0, y: 0, z: 0, yaw: 0, label: "Home" }], 0, { resetArrival: true, clearTravel: true })}
                          style={{
                            background: "rgba(248, 113, 113, 0.18)",
                            border: `1px solid ${th.accentRed}`,
                            borderRadius: 6,
                            color: "#f87171",
                            flex: 1,
                            padding: "7px",
                            fontSize: 10,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s ease-in-out"
                          }}
                        >
                          ✕ Clear All
                        </button>
                      </div>
                    </div>
                  )}

                  {mobileActiveTab === "telemetry" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

                      {/* Unified Coordinates & Velocity grid */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, background: "rgba(0, 0, 0, 0.15)", padding: 8, borderRadius: 8, border: `1px solid ${th.wellBorder}` }}>
                        <div>
                          <SL>Coordinates</SL>
                          {["X", "Y", "Z"].map((ax, i) => (
                            <div key={ax} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 2 }}>
                              <span style={{ color: ["#f87171", "#4ade80", "#60a5fa"][i], fontWeight: 700 }}>{ax}</span>
                              <span style={{ fontVariantNumeric: "tabular-nums", color: th.textPrimary }}>{dronePos[i].toFixed(2)}m</span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <SL>Velocities</SL>
                          {[
                            { ax: "Vx", val: stateRef.current.linVel[0], col: "#f87171" },
                            { ax: "Vy", val: stateRef.current.linVel[1], col: "#4ade80" },
                            { ax: "Vz", val: stateRef.current.linVel[2], col: "#60a5fa" }
                          ].map((v) => (
                            <div key={v.ax} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 2 }}>
                              <span style={{ color: v.col, fontWeight: 700 }}>{v.ax}</span>
                              <span style={{ fontVariantNumeric: "tabular-nums", color: th.textPrimary }}>{v.val.toFixed(2)}m/s</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0, 0, 0, 0.15)", padding: "6px 8px", borderRadius: 8, border: `1px solid ${th.wellBorder}` }}>
                        <span style={{ fontSize: 9, color: th.textMuted, textTransform: "uppercase", fontWeight: 700 }}>Next Leg Dist</span>
                        <span style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: th.accentAmber }}>
                          {distToWP.toFixed(2)} m
                        </span>
                      </div>

                      <div style={{ height: 1, background: "rgba(255, 255, 255, 0.08)", margin: "2px 0" }} />

                      <SL>Motor Telemetry</SL>

                      {/* Motor RPM Gauges */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {droneRPM.map((r, i) => <Gauge key={i} label={`M${i + 1}`} value={r} min={0} max={12000} unit="" color={rpmColors[i]} />)}
                      </div>

                      <div style={{ padding: "5px 8px", background: "rgba(0, 0, 0, 0.2)", border: `1px solid ${th.wellBorder}`, borderRadius: 5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ color: th.textMuted, fontSize: 9, textTransform: "uppercase" }}>Average RPM</div>
                        <div style={{ color: th.accentAmber, fontSize: 13, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                          {(droneRPM.reduce((a, b) => a + b, 0) / 4).toFixed(0)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tab Switcher inside Expanded Sheet */}
                <div style={{ height: 36, display: "flex", background: th.wellBg, border: `1px solid ${th.wellBorder}`, borderRadius: 10, flexShrink: 0, overflow: "hidden" }}>
                  {[
                    { id: "controls", label: "⚙ Form" },
                    { id: "queue", label: "📋 Queue" },
                    { id: "telemetry", label: "📊 Motors" }
                  ].map(t => (
                    <button key={t.id} onClick={() => setMobileActiveTab(t.id)} style={{
                      flex: 1, background: "transparent", border: "none", color: mobileActiveTab === t.id ? th.accentBlue : th.textMuted,
                      fontSize: 10, fontWeight: mobileActiveTab === t.id ? 700 : 400, cursor: "pointer",
                      borderBottom: mobileActiveTab === t.id ? `2px solid ${th.accentBlue}` : "none",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── DESKTOP LAYOUT ── */
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* Left panel */}
          <div style={{ width: 244, background: th.panelBg, borderRight: `1px solid ${th.panelBorder}`, padding: 14, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, flexShrink: 0 }}>
            <section style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <SL>Simulation</SL>
              <div style={{ display: "flex", gap: 5 }}>
                <button style={btn(running, th.accentGreen)} onClick={start}>▶ Start</button>
                <button style={{ ...btn(!running && simTime > 0, th.accentAmber), padding: "4px 10px", fontWeight: 600 }} onClick={pause}>⏸ Pause</button>
                <button style={btn(false, th.accentRed)} onClick={reset}>↺ Reset</button>
              </div>
              <button style={{ ...btn(wind, th.accentBlue), marginTop: 2 }} onClick={toggleWind}>
                {wind ? "⚡ Wind On" : "○ Wind Off"}
>>>>>>>>> Temporary merge branch 2
              </button>
            </section>

<<<<<<<<< Temporary merge branch 1
          {/* Distance Badge (Floating Top Right) */}
          <div style={{ position:"absolute", top:12, right:12, background:th.hudBg, border:`1px solid ${distToWP<ARRIVAL_DIST?th.arrivedBorder:th.hudBorder}`, borderRadius:8, padding:"6px 10px", backdropFilter:"blur(8px)", transition:"border-color 0.3s", zIndex:10 }}>
            <div style={{ fontSize:8, color:th.textMuted, textTransform:"uppercase", letterSpacing:0.3 }}>
              {currentWP?.label ?? "Target"}
            </div>
            <div style={{ fontSize:13, fontWeight:700, fontVariantNumeric:"tabular-nums", color:distToWP<ARRIVAL_DIST?th.arrivedText:th.accentAmber }}>
              {distToWP.toFixed(2)} m
            </div>
          </div>

          {/* Position HUD (Floating Bottom Left, sits above expanded drawer) */}
          <div style={{ position:"absolute", bottom: isDrawerExpanded ? 405 : 85, left:12, background:th.hudBg, border:`1px solid ${th.hudBorder}`, borderRadius:8, padding:"6px 10px", backdropFilter:"blur(8px)", fontSize:10, transition:"bottom 0.3s ease-in-out", zIndex:10 }}>
            <div style={{ fontSize:8, color:th.textMuted, textTransform:"uppercase", letterSpacing:0.3, marginBottom:4, fontWeight:600 }}>Position</div>
            {["X","Y","Z"].map((ax,i) => (
              <div key={ax} style={{ display:"flex", gap:8, fontSize:10, lineHeight:1.2 }}>
                <span style={{ color:["#f87171","#4ade80","#60a5fa"][i], width:8 }}>{ax}</span>
                <span style={{ fontVariantNumeric:"tabular-nums", color:th.textPrimary }}>{dronePos[i].toFixed(2)}m</span>
=========
            {/* Fly-to / add form */}
            <section style={{ background: th.wellBg, border: `1px solid ${th.accentBlue}44`, borderRadius: 8, padding: "11px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: editingIdx !== null ? th.accentAmber : th.accentBlue, letterSpacing: 0.3 }}>
                {editingIdx !== null ? `✎ Editing: ${waypoints[editingIdx]?.label ?? `WP${editingIdx + 1}`}` : "Fly to Coordinates"}
>>>>>>>>> Temporary merge branch 2
              </div>

<<<<<<<<< Temporary merge branch 1
          {/* Speed/Velocity HUD (Floating Bottom Right, sits above expanded drawer) */}
          <div style={{ position:"absolute", bottom: isDrawerExpanded ? 405 : 85, right:12, background:th.hudBg, border:`1px solid ${th.hudBorder}`, borderRadius:8, padding:"6px 10px", backdropFilter:"blur(8px)", fontSize:10, transition:"bottom 0.3s ease-in-out", zIndex:10 }}>
            <div style={{ fontSize:8, color:th.textMuted, textTransform:"uppercase", letterSpacing:0.3, marginBottom:4, fontWeight:600 }}>Speed</div>
            {[
              { ax: "Vx", val: stateRef.current.linVel[0], col: "#f87171" },
              { ax: "Vy", val: stateRef.current.linVel[1], col: "#4ade80" },
              { ax: "Vz", val: stateRef.current.linVel[2], col: "#60a5fa" }
            ].map((v) => (
              <div key={v.ax} style={{ display:"flex", gap:8, fontSize:10, lineHeight:1.2 }}>
                <span style={{ color: v.col, width:14 }}>{v.ax}</span>
                <span style={{ fontVariantNumeric:"tabular-nums", color:th.textPrimary }}>{v.val.toFixed(2)}m/s</span>
              </div>
            ))}
          </div>

          {/* Floating Glassmorphic Bottom Sheet Drawer */}
          <div style={{ 
            position:"absolute", bottom:12, left:12, right:12, zIndex:20,
            background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255, 255, 255, 0.08)", backdropFilter: "blur(20px)",
            borderRadius: 16, padding: 12, boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            display: "flex", flexDirection: "column", gap: 10,
            transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)", maxHeight: isDrawerExpanded ? "380px" : "60px", overflow: "hidden"
          }}>
            
            {/* Header / Quick Actions (Always visible when collapsed or expanded) */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 36, flexShrink: 0 }}>
              <div style={{ display: "flex", gap: 6 }}>
                <button style={{ ...btn(running, th.accentGreen), padding: "4px 10px", fontSize: 10, fontWeight: 700 }} onClick={start}>▶ Start</button>
                <button style={{ ...btn(!running&&simTime>0, th.accentAmber), padding: "4px 10px", fontSize: 10, fontWeight: 700 }} onClick={pause}>⏸ Pause</button>
                <button style={{ ...btn(false, th.accentRed), padding: "4px 10px", fontSize: 10 }} onClick={reset}>↺ Reset</button>
              </div>

              {/* Toggle expand button */}
              <button 
                onClick={() => setIsDrawerExpanded(!isDrawerExpanded)} 
                style={{ 
                  background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 8, 
                  color: th.textPrimary, fontSize: 11, padding: "5px 12px", cursor: "pointer", transition: "background 0.2s"
                }}
              >
                {isDrawerExpanded ? "▼ Close Panel" : "▲ Fly Config"}
              </button>
            </div>

            {/* Expanded Content Section */}
            {isDrawerExpanded && (
              <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", gap:10 }}>
                <div style={{ height:1, background: "rgba(255, 255, 255, 0.08)", width: "100%", flexShrink:0 }} />
                
                {/* Scrollable body content */}
                <div style={{ flex:1, overflowY:"auto", paddingRight:2, display:"flex", flexDirection:"column", gap:12 }}>
                  {mobileActiveTab === "controls" && (
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      <SL>Coordinates Form</SL>
                      
                      {/* Form inputs */}
                      <section style={{ background: "rgba(0, 0, 0, 0.2)", border:`1px solid ${th.accentBlue}33`, borderRadius:8, padding:"10px", display:"flex", flexDirection:"column", gap:8 }}>
                        <div style={{ fontSize:9, fontWeight:600, color:editingIdx!==null?th.accentAmber:th.accentBlue }}>
                          {editingIdx!==null ? `Editing: ${waypoints[editingIdx]?.label??`WP${editingIdx+1}`}` : "Set Coordinates"}
                        </div>

                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                          {[["X (±10)","x"],["Y (±10)","y"],["Z (0–8)","z"],["Yaw (±π)","yaw"]].map(([label,field]) => (
                            <div key={field}>
                              <div style={{ fontSize:8, color:th.textMuted, marginBottom:1 }}>{label}</div>
                              <input style={inputSt} type="number" step="0.1" value={form[field]}
                                onChange={e => { setForm(f=>({...f,[field]:e.target.value})); setFormErr(""); }} />
                            </div>
                          ))}
                        </div>

                        <div>
                          <div style={{ fontSize:8, color:th.textMuted, marginBottom:1 }}>Name (optional)</div>
                          <input style={inputSt} type="text" placeholder="e.g. Alpha" value={form.label}
                            onChange={e => setForm(f=>({...f,label:e.target.value}))}
                            onKeyDown={e => e.key==="Enter" && (flyMode==="fly" ? handleFly() : handleAddOrUpdate())} />
                        </div>

                        {formErr && <div style={{ fontSize:9, color:th.errorText, background:th.errorBg, border:`1px solid ${th.errorBorder}`, borderRadius:4, padding:"4px 7px" }}>{formErr}</div>}

                        {editingIdx !== null ? (
                          <div style={{ display:"flex", gap:6 }}>
                            <button onClick={handleAddOrUpdate} style={{ flex:1, background:th.editBtnBg, border:`1px solid ${th.editBtnBorder}`, borderRadius:5, color:th.accentAmber, fontSize:10, padding:"6px 0", cursor:"pointer", fontWeight:600 }}>
                              Update WP{editingIdx+1}
                            </button>
                            <button onClick={() => { setEditingIdx(null); setFormErr(""); }} style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${th.wellBorder}`, borderRadius:5, color:th.textSecondary, fontSize:10, padding:"6px 10px", cursor:"pointer" }}>✕</button>
                          </div>
                        ) : (
                          <>
                            <div style={{ display:"flex", gap:5 }}>
                              {["fly","queue"].map(m => (
                                <button key={m} onClick={() => setFlyMode(m)} style={{
                                  flex:1, fontSize:10, padding:"5px 0", cursor:"pointer", borderRadius:5, fontWeight:flyMode===m?600:400,
                                  background: flyMode===m ? (m==="fly" ? th.accentBlue+"22" : th.accentGreen+"22") : "transparent",
                                  border: `1px solid ${flyMode===m ? (m==="fly" ? th.accentBlue : th.accentGreen) : th.btnBorder}`,
                                  color: flyMode===m ? (m==="fly" ? th.accentBlue : th.accentGreen) : th.btnText,
                                }}>{m==="fly" ? "✈ Fly Now" : "+ Queue"}</button>
                              ))}
                            </div>
                            <button onClick={() => flyMode==="fly" ? handleFly() : handleAddOrUpdate()} style={{ background: flyMode==="fly" ? th.accentBlue : th.accentGreen, border:"none", borderRadius:5, color:"#fff", fontSize:11, padding:"7px 0", cursor:"pointer", fontWeight:700 }}>
                              {flyMode==="fly" ? "✈  Fly to Target" : "+  Add to Queue"}
                            </button>
                          </>
                        )}
                      </section>
                      
                      <button style={{ ...btn(wind, th.accentBlue), padding:"8px", fontSize:10 }} onClick={toggleWind}>
                        {wind ? "⚡ Wind Active" : "○ Wind Inactive"}
                      </button>
                    </div>
                  )}

                  {mobileActiveTab === "queue" && (
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <SL>Flight Queue</SL>
                        <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:4 }}>
                          <span style={{ fontSize:8, color:th.textMuted }}>Auto</span>
                          <div onClick={toggleAutoAdv} style={{ width:24, height:13, borderRadius:6, background:autoAdv?th.toggleOnBg:th.toggleOffBg, border:`1px solid ${autoAdv?th.toggleOnBorder:th.toggleOffBorder}`, cursor:"pointer", position:"relative" }}>
                            <div style={{ position:"absolute", top:1, left:autoAdv?12:2, width:9, height:9, borderRadius:"50%", background:autoAdv?th.toggleKnobOn:th.toggleKnobOff, transition:"left 0.15s" }} />
                          </div>
                        </div>
                      </div>

                      {/* Waypoints list */}
                      <div style={{ display:"flex", flexDirection:"column", gap:3, maxHeight:"130px", overflowY:"auto", paddingRight:2 }}>
                        {waypoints.map((wp,i) => {
                          const isActive = i===activeIdx, isDone = i<activeIdx;
                          return (
                            <div key={i} style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 6px", borderRadius:5, cursor:"pointer",
                              background: isActive?th.wpActiveBg : isDone?th.wpDoneBg : th.wpIdleBg,
                              border: `1px solid ${isActive?th.wpActiveBorder : isDone?th.wpDoneBorder : th.wpIdleBorder}`,
                            }} onClick={() => flyTo(i)}>
                              <div style={{ width:5, height:5, borderRadius:"50%", flexShrink:0, background:isActive?th.wpDotActive:isDone?th.wpDotDone:th.wpDot }} />
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ fontSize:10, color:isActive?th.wpActiveText:isDone?th.wpDoneText:th.wpIdleText, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                                  {isDone && "✓ "}{wp.label}
                                </div>
                                <div style={{ fontSize:8, color:th.textMuted }}>({wp.x.toFixed(1)}, {wp.y.toFixed(1)}, {wp.z.toFixed(1)})</div>
                              </div>
                              <div style={{ display:"flex", flexDirection:"column", gap:1 }}>
                                <button onClick={e => { e.stopPropagation(); moveWaypoint(i,-1); }} disabled={i===0}
                                  style={{ background:"none", border:"none", color:i===0?th.textDim:th.textSecondary, fontSize:8, cursor:i===0?"default":"pointer", padding:"0 1px", lineHeight:1 }}>▲</button>
                                <button onClick={e => { e.stopPropagation(); moveWaypoint(i,1); }} disabled={i===waypoints.length-1}
                                  style={{ background:"none", border:"none", color:i===waypoints.length-1?th.textDim:th.textSecondary, fontSize:8, cursor:i===waypoints.length-1?"default":"pointer", padding:"0 1px", lineHeight:1 }}>▼</button>
                              </div>
                              <button onClick={e => { e.stopPropagation(); startEditing(i); }}
                                style={{ background:"none", border:"none", color:th.textMuted, fontSize:11, cursor:"pointer", padding:"0 2px" }}>✎</button>
                              <button onClick={e => { e.stopPropagation(); removeWaypoint(i); }}
                                style={{ background:"none", border:"none", color:th.textMuted, fontSize:12, cursor:"pointer", padding:"0 2px", lineHeight:1 }}>✕</button>
                            </div>
                          );
                        })}
                      </div>

                      <div style={{ display:"flex", gap:6, marginTop:2 }}>
                        <button style={{ ...btn(false,"#a78bfa"), flex:1, padding:"6px", fontSize:10 }} onClick={() => setShowCSV(true)}>📂 Load CSV</button>
                        <button style={{ ...btn(false,th.accentRed), flex:1, padding:"6px", fontSize:10 }} onClick={() => applyQueue([{x:0,y:0,z:0,yaw:0,label:"Home"}], 0, { resetArrival:true, clearTravel:true })}>✕ Clear All</button>
                      </div>
                    </div>
                  )}

                  {mobileActiveTab === "telemetry" && (
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      <SL>Motor Telemetry</SL>
                      
                      {/* Motor RPM Gauges */}
                      <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                        {droneRPM.map((r,i) => <Gauge key={i} label={`M${i+1}`} value={r} min={0} max={12000} unit="" color={rpmColors[i]} />)}
                      </div>
                      
                      <div style={{ padding:"5px 8px", background: "rgba(0, 0, 0, 0.2)", border:`1px solid ${th.wellBorder}`, borderRadius:5, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div style={{ color:th.textMuted, fontSize:9, textTransform:"uppercase" }}>Average RPM</div>
                        <div style={{ color:th.accentAmber, fontSize:13, fontWeight:700, fontVariantNumeric:"tabular-nums" }}>
                          {(droneRPM.reduce((a,b)=>a+b,0)/4).toFixed(0)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tab Switcher inside Expanded Sheet */}
                <div style={{ height:36, display:"flex", background: "rgba(0, 0, 0, 0.2)", borderRadius: 10, flexShrink:0, overflow:"hidden" }}>
                  {[
                    { id: "controls", label: "⚙ Form" },
                    { id: "queue", label: "📋 Queue" },
                    { id: "telemetry", label: "📊 Motors" }
                  ].map(t => (
                    <button key={t.id} onClick={() => setMobileActiveTab(t.id)} style={{
                      flex: 1, background: "transparent", border: "none", color: mobileActiveTab===t.id ? th.accentBlue : th.textMuted,
                      fontSize: 10, fontWeight: mobileActiveTab===t.id ? 700 : 400, cursor: "pointer",
                      borderBottom: mobileActiveTab===t.id ? `2px solid ${th.accentBlue}` : "none",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── DESKTOP LAYOUT ── */
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

          {/* Left panel */}
          <div style={{ width:244, background:th.panelBg, borderRight:`1px solid ${th.panelBorder}`, padding:14, overflowY:"auto", display:"flex", flexDirection:"column", gap:14, flexShrink:0 }}>
            <section style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <SL>Simulation</SL>
              <div style={{ display:"flex", gap:5 }}>
                <button style={btn(running, th.accentGreen)} onClick={start}>▶ Start</button>
                <button style={{...btn(!running&&simTime>0, th.accentAmber), padding:"4px 10px", fontWeight:600 }} onClick={pause}>⏸ Pause</button>
                <button style={btn(false, th.accentRed)} onClick={reset}>↺ Reset</button>
              </div>
              <button style={{ ...btn(wind, th.accentBlue), marginTop:2 }} onClick={toggleWind}>
                {wind ? "⚡ Wind On" : "○ Wind Off"}
              </button>
            </section>

            {/* Fly-to / add form */}
            <section style={{ background: th.wellBg, border:`1px solid ${th.accentBlue}44`, borderRadius:8, padding:"11px 12px", display:"flex", flexDirection:"column", gap:8 }}>
              <div style={{ fontSize:10, fontWeight:600, color:editingIdx!==null?th.accentAmber:th.accentBlue, letterSpacing:0.3 }}>
                {editingIdx!==null ? `✎ Editing: ${waypoints[editingIdx]?.label??`WP${editingIdx+1}`}` : "Fly to Coordinates"}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {[["X (±10)","x"],["Y (±10)","y"],["Z (0–8)","z"],["Yaw (±π)","yaw"]].map(([label,field]) => (
                  <div key={field}>
                    <div style={{ fontSize:9, color:th.textMuted, marginBottom:2 }}>{label}</div>
                    <input style={inputSt} type="number" step="0.1" value={form[field]}
                      onChange={e => { setForm(f=>({...f,[field]:e.target.value})); setFormErr(""); }} />
=========
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[["X (±10)", "x"], ["Y (±10)", "y"], ["Z (0–8)", "z"], ["Yaw (±π)", "yaw"]].map(([label, field]) => (
                  <div key={field}>
                    <div style={{ fontSize: 9, color: th.textMuted, marginBottom: 2 }}>{label}</div>
                    <input style={inputSt} type="number" step="0.1" value={form[field]}
                      onChange={e => { setForm(f => ({ ...f, [field]: e.target.value })); setFormErr(""); }} />
>>>>>>>>> Temporary merge branch 2
                  </div>
                ))}
              </div>

              <div>
<<<<<<<<< Temporary merge branch 1
                <div style={{ fontSize:9, color:th.textMuted, marginBottom:2 }}>Name (optional)</div>
                <input style={inputSt} type="text" placeholder="e.g. Alpha" value={form.label}
                  onChange={e => setForm(f=>({...f,label:e.target.value}))}
                  onKeyDown={e => e.key==="Enter" && (flyMode==="fly" ? handleFly() : handleAddOrUpdate())} />
              </div>

              {formErr && <div style={{ fontSize:10, color:th.errorText, background:th.errorBg, border:`1px solid ${th.errorBorder}`, borderRadius:4, padding:"4px 7px" }}>{formErr}</div>}

              {editingIdx !== null ? (
                <div style={{ display:"flex", gap:6 }}>
                  <button onClick={handleAddOrUpdate} style={{ flex:1, background:th.editBtnBg, border:`1px solid ${th.editBtnBorder}`, borderRadius:5, color:th.accentAmber, fontSize:11, padding:"7px 0", cursor:"pointer", fontWeight:600 }}>
                    ✎ Update WP{editingIdx+1}
                  </button>
                  <button onClick={() => { setEditingIdx(null); setFormErr(""); }} style={{ background:th.wellBg, border:`1px solid ${th.wellBorder}`, borderRadius:5, color:th.textSecondary, fontSize:11, padding:"7px 10px", cursor:"pointer" }}>✕</button>
                </div>
              ) : (
                <>
                  <div style={{ display:"flex", gap:5 }}>
                    {["fly","queue"].map(m => (
                      <button key={m} onClick={() => setFlyMode(m)} style={{
                        flex:1, fontSize:11, padding:"5px 0", cursor:"pointer", borderRadius:5, fontWeight:flyMode===m?600:400,
                        background: flyMode===m ? (m==="fly" ? th.accentBlue+"22" : th.accentGreen+"22") : "transparent",
                        border: `1px solid ${flyMode===m ? (m==="fly" ? th.accentBlue : th.accentGreen) : th.btnBorder}`,
                        color: flyMode===m ? (m==="fly" ? th.accentBlue : th.accentGreen) : th.btnText,
                      }}>{m==="fly" ? "✈ Fly Now" : "+ Queue"}</button>
                    ))}
                  </div>
                  <button onClick={() => flyMode==="fly" ? handleFly() : handleAddOrUpdate()} style={{ background: flyMode==="fly" ? th.accentBlue : th.accentGreen, border:"none", borderRadius:5, color:"#fff", fontSize:12, padding:"8px 0", cursor:"pointer", fontWeight:700 }}>
                    {flyMode==="fly" ? "✈  Fly to Target" : "+  Add to Queue"}
=========
                <div style={{ fontSize: 9, color: th.textMuted, marginBottom: 2 }}>Name (optional)</div>
                <input style={inputSt} type="text" placeholder="e.g. Alpha" value={form.label}
                  onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && (flyMode === "fly" ? handleFly() : handleAddOrUpdate())} />
              </div>

            {formErr && <div style={{ fontSize: 10, color: th.errorText, background: th.errorBg, border: `1px solid ${th.errorBorder}`, borderRadius: 4, padding: "4px 7px" }}>{formErr}</div>}

              {editingIdx !== null ? (
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={handleAddOrUpdate} style={{ flex: 1, background: th.editBtnBg, border: `1px solid ${th.editBtnBorder}`, borderRadius: 5, color: th.accentAmber, fontSize: 11, padding: "7px 0", cursor: "pointer", fontWeight: 600 }}>
                    ✎ Update WP{editingIdx + 1}
                  </button>
                  <button onClick={() => { setEditingIdx(null); setFormErr(""); }} style={{ background: th.wellBg, border: `1px solid ${th.wellBorder}`, borderRadius: 5, color: th.textSecondary, fontSize: 11, padding: "7px 10px", cursor: "pointer" }}>✕</button>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", gap: 5 }}>
                    {["fly", "queue"].map(m => (
                      <button key={m} onClick={() => setFlyMode(m)} style={{
                        flex: 1, fontSize: 11, padding: "5px 0", cursor: "pointer", borderRadius: 5, fontWeight: flyMode === m ? 600 : 400,
                        background: flyMode === m ? (m === "fly" ? th.accentBlue + "22" : th.accentGreen + "22") : "transparent",
                        border: `1px solid ${flyMode === m ? (m === "fly" ? th.accentBlue : th.accentGreen) : th.btnBorder}`,
                        color: flyMode === m ? (m === "fly" ? th.accentBlue : th.accentGreen) : th.btnText,
                      }}>{m === "fly" ? "✈ Fly Now" : "+ Queue"}</button>
                    ))}
                  </div>
                  <button onClick={() => flyMode === "fly" ? handleFly() : handleAddOrUpdate()} style={{ background: flyMode === "fly" ? th.accentBlue : th.accentGreen, border: "none", borderRadius: 5, color: "#fff", fontSize: 12, padding: "8px 0", cursor: "pointer", fontWeight: 700 }}>
                    {flyMode === "fly" ? "✈  Fly to Target" : "+  Add to Queue"}
>>>>>>>>> Temporary merge branch 2
                  </button>
                </>
              )}
            </section>

            {/* Velocity gauges */}
<<<<<<<<< Temporary merge branch 1
            <section style={{ display:"flex", flexDirection:"column", gap:2 }}>
=========
            <section style={{ display: "flex", flexDirection: "column", gap: 2 }}>
>>>>>>>>> Temporary merge branch 2
              <SL>Velocity</SL>
              <Gauge label="Vx" value={stateRef.current.linVel[0]} min={-6} max={6} unit="m/s" color="#f87171" />
              <Gauge label="Vy" value={stateRef.current.linVel[1]} min={-6} max={6} unit="m/s" color="#4ade80" />
              <Gauge label="Vz" value={stateRef.current.linVel[2]} min={-6} max={6} unit="m/s" color="#60a5fa" />
            </section>
          </div>

          {/* 3D Viewport */}
<<<<<<<<< Temporary merge branch 1
          <div ref={canvasRef} style={{ flex:1, position:"relative", minWidth:0, cursor:"grab", touchAction:"none" }}
=========
          <div ref={canvasRef} style={{ flex: 1, position: "relative", minWidth: 0, cursor: "grab", touchAction: "none" }}
>>>>>>>>> Temporary merge branch 2
            onMouseDown={onMouseDown} onMouseMove={onMouseMove}
            onMouseUp={stopDrag} onMouseLeave={stopDrag} onWheel={onWheel}
            onContextMenu={e => e.preventDefault()}>

            {/* Camera presets */}
<<<<<<<<< Temporary merge branch 1
            <div style={{ position:"absolute", top:10, left:10, display:"flex", gap:4 }}>
              {Object.entries(camPresets).map(([label,[theta,phi,r]]) => (
                <button key={label} style={{ background:th.viewBtnBg, border:`1px solid ${th.viewBtnBorder}`, borderRadius:5, color:th.viewBtnText, fontSize:11, padding:"3px 9px", cursor:"pointer", backdropFilter:"blur(4px)" }}
                  onClick={e => { e.stopPropagation(); Object.assign(simRef.current, { cameraTheta:theta, cameraPhi:phi, cameraR:r }); }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Position HUD */}
            <div style={{ position:"absolute", bottom:12, left:12, background:th.hudBg, border:`1px solid ${th.hudBorder}`, borderRadius:7, padding:"7px 12px", backdropFilter:"blur(6px)" }}>
=========
            <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 4 }}>
              {Object.entries(camPresets).map(([label, [theta, phi, r]]) => {
                const isSelected = cameraPreset === label;
                return (
                  <button
                    key={label}
                    onClick={e => {
                      e.stopPropagation();
                      Object.assign(simRef.current, { cameraTheta: theta, cameraPhi: phi, cameraR: r });
                      setCameraPreset(label);
                    }}
                    style={{
                      background: isSelected ? (isLt ? "rgba(37, 99, 235, 0.15)" : "rgba(96, 165, 250, 0.20)") : th.viewBtnBg,
                      border: `1px solid ${isSelected ? (isLt ? "#2563eb" : "#60a5fa") : th.viewBtnBorder}`,
                      borderRadius: 5,
                      color: isSelected ? (isLt ? "#2563eb" : "#60a5fa") : th.viewBtnText,
                      fontSize: 11,
                      padding: "3px 9px",
                      cursor: "pointer",
                      backdropFilter: "blur(4px)",
                      fontWeight: isSelected ? 600 : 400,
                      boxShadow: isSelected ? `0 0 6px ${isLt ? "rgba(37, 99, 235, 0.3)" : "rgba(96, 165, 250, 0.3)"}` : "none",
                      transition: "all 0.15s ease-in-out"
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Position HUD */}
            <div style={{ position: "absolute", bottom: 12, left: 12, background: th.hudBg, border: `1px solid ${th.hudBorder}`, borderRadius: 7, padding: "7px 12px", backdropFilter: "blur(6px)" }}>
>>>>>>>>> Temporary merge branch 2
              {["X", "Y", "Z"].map((ax, i) => (
                <div key={ax} style={{ display: "flex", gap: 12, fontSize: 11 }}>
                  <span style={{ color: ["#f87171", "#4ade80", "#60a5fa"][i], width: 12 }}>{ax}</span>
                  <span style={{ fontVariantNumeric: "tabular-nums", color: th.textPrimary }}>{dronePos[i].toFixed(3)} m</span>
                </div>
              ))}
            </div>

            {/* Distance badge */}
<<<<<<<<< Temporary merge branch 1
            <div style={{ position:"absolute", top:10, right:10, background:th.hudBg, border:`1px solid ${distToWP<ARRIVAL_DIST?th.arrivedBorder:th.hudBorder}`, borderRadius:7, padding:"7px 12px", backdropFilter:"blur(6px)", transition:"border-color 0.3s" }}>
              <div style={{ fontSize:9, color:th.textMuted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:2 }}>
                Dist · {currentWP?.label ?? "Target"}
              </div>
              <div style={{ fontSize:15, fontWeight:700, fontVariantNumeric:"tabular-nums", color:distToWP<ARRIVAL_DIST?th.arrivedText:th.accentAmber }}>
=========
            <div style={{ position: "absolute", top: 10, right: 10, background: th.hudBg, border: `1px solid ${distToWP < ARRIVAL_DIST ? th.arrivedBorder : th.hudBorder}`, borderRadius: 7, padding: "7px 12px", backdropFilter: "blur(6px)", transition: "border-color 0.3s" }}>
              <div style={{ fontSize: 9, color: th.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>
                Dist · {currentWP?.label ?? "Target"}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: distToWP < ARRIVAL_DIST ? th.arrivedText : th.accentAmber }}>
>>>>>>>>> Temporary merge branch 2
                {distToWP.toFixed(3)} m
              </div>
            </div>
          </div>

          {/* Right panel */}
<<<<<<<<< Temporary merge branch 1
          <div style={{ width:232, background:th.panelBg, borderLeft:`1px solid ${th.panelBorder}`, padding:14, overflowY:"auto", display:"flex", flexDirection:"column", gap:14, flexShrink:0 }}>
            <section style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ display:"flex", alignItems:"center", justifycontent:"space-between" }}>
                <SL>Queue</SL>
                <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:4 }}>
                  <span style={{ fontSize:9, color:th.textMuted, textTransform:"uppercase" }}>Auto</span>
                  <div onClick={toggleAutoAdv} style={{ width:28, height:15, borderRadius:8, background:autoAdv?th.toggleOnBg:th.toggleOffBg, border:`1px solid ${autoAdv?th.toggleOnBorder:th.toggleOffBorder}`, cursor:"pointer", position:"relative" }}>
                    <div style={{ position:"absolute", top:2, left:autoAdv?13:2, width:9, height:9, borderRadius:"50%", background:autoAdv?th.toggleKnobOn:th.toggleKnobOff, transition:"left 0.15s" }} />
=========
          <div style={{ width: 232, background: th.panelBg, borderLeft: `1px solid ${th.panelBorder}`, padding: 14, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, flexShrink: 0 }}>
            <section style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", justifycontent: "space-between" }}>
                <SL>Queue</SL>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                  <span style={{ fontSize: 9, color: th.textMuted, textTransform: "uppercase" }}>Auto</span>
                  <div onClick={toggleAutoAdv} style={{ width: 28, height: 15, borderRadius: 8, background: autoAdv ? th.toggleOnBg : th.toggleOffBg, border: `1px solid ${autoAdv ? th.toggleOnBorder : th.toggleOffBorder}`, cursor: "pointer", position: "relative" }}>
                    <div style={{ position: "absolute", top: 2, left: autoAdv ? 13 : 2, width: 9, height: 9, borderRadius: "50%", background: autoAdv ? th.toggleKnobOn : th.toggleKnobOff, transition: "left 0.15s" }} />
>>>>>>>>> Temporary merge branch 2
                  </div>
                </div>
              </div>

<<<<<<<<< Temporary merge branch 1
              <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                {waypoints.map((wp,i) => {
                  const isActive = i===activeIdx, isDone = i<activeIdx;
                  return (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 7px", borderRadius:5, cursor:"pointer",
                      background: isActive?th.wpActiveBg : isDone?th.wpDoneBg : th.wpIdleBg,
                      border: `1px solid ${isActive?th.wpActiveBorder : isDone?th.wpDoneBorder : th.wpIdleBorder}`,
                    }} onClick={() => flyTo(i)}>
                      <div style={{ width:6, height:6, borderRadius:"50%", flexShrink:0, background:isActive?th.wpDotActive:isDone?th.wpDotDone:th.wpDot }} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:11, color:isActive?th.wpActiveText:isDone?th.wpDoneText:th.wpIdleText, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {isDone && "✓ "}{wp.label}
                        </div>
                        <div style={{ fontSize:9, color:th.textMuted }}>({wp.x.toFixed(1)}, {wp.y.toFixed(1)}, {wp.z.toFixed(1)})</div>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:1 }}>
                        <button onClick={e => { e.stopPropagation(); moveWaypoint(i,-1); }} disabled={i===0}
                          style={{ background:"none", border:"none", color:i===0?th.textDim:th.textSecondary, fontSize:8, cursor:i===0?"default":"pointer", padding:"0 1px", lineHeight:1.2 }}>▲</button>
                        <button onClick={e => { e.stopPropagation(); moveWaypoint(i,1); }} disabled={i===waypoints.length-1}
                          style={{ background:"none", border:"none", color:i===waypoints.length-1?th.textDim:th.textSecondary, fontSize:8, cursor:i===waypoints.length-1?"default":"pointer", padding:"0 1px", lineHeight:1.2 }}>▼</button>
                      </div>
                      <button onClick={e => { e.stopPropagation(); startEditing(i); }}
                        style={{ background:"none", border:"none", color:th.textMuted, fontSize:13, cursor:"pointer", padding:"0 2px" }}>✎</button>
                      <button onClick={e => { e.stopPropagation(); removeWaypoint(i); }}
                        style={{ background:"none", border:"none", color:th.textMuted, fontSize:14, cursor:"pointer", padding:"0 2px", lineHeight:1 }}>✕</button>
=========
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {waypoints.map((wp, i) => {
                  const isActive = i === activeIdx, isDone = i < activeIdx;
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 5, padding: "5px 7px", borderRadius: 5, cursor: "pointer",
                      background: isActive ? th.wpActiveBg : isDone ? th.wpDoneBg : th.wpIdleBg,
                      border: `1px solid ${isActive ? th.wpActiveBorder : isDone ? th.wpDoneBorder : th.wpIdleBorder}`,
                    }} onClick={() => flyTo(i)}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: isActive ? th.wpDotActive : isDone ? th.wpDotDone : th.wpDot }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, color: isActive ? th.wpActiveText : isDone ? th.wpDoneText : th.wpIdleText, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {isDone && "✓ "}{wp.label}
                        </div>
                        <div style={{ fontSize: 9, color: th.textMuted }}>({wp.x.toFixed(1)}, {wp.y.toFixed(1)}, {wp.z.toFixed(1)})</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <button onClick={e => { e.stopPropagation(); moveWaypoint(i, -1); }} disabled={i === 0}
                          style={{ background: "none", border: "none", color: i === 0 ? th.textDim : th.textSecondary, fontSize: 8, cursor: i === 0 ? "default" : "pointer", padding: "0 1px", lineHeight: 1.2 }}>▲</button>
                        <button onClick={e => { e.stopPropagation(); moveWaypoint(i, 1); }} disabled={i === waypoints.length - 1}
                          style={{ background: "none", border: "none", color: i === waypoints.length - 1 ? th.textDim : th.textSecondary, fontSize: 8, cursor: i === waypoints.length - 1 ? "default" : "pointer", padding: "0 1px", lineHeight: 1.2 }}>▼</button>
                      </div>
                      <button onClick={e => { e.stopPropagation(); startEditing(i); }}
                        style={{ background: "none", border: "none", color: th.textMuted, fontSize: 13, cursor: "pointer", padding: "0 2px" }}>✎</button>
                      <button onClick={e => { e.stopPropagation(); removeWaypoint(i); }}
                        style={{ background: "none", border: "none", color: th.textMuted, fontSize: 14, cursor: "pointer", padding: "0 2px", lineHeight: 1 }}>✕</button>
>>>>>>>>> Temporary merge branch 2
                    </div>
                  );
                })}
              </div>

<<<<<<<<< Temporary merge branch 1
              <div style={{ display:"flex", gap:6, marginTop:2 }}>
                <button style={{ ...btn(false,"#a78bfa"), fontSize:10 }} onClick={() => setShowCSV(true)}>📂 CSV</button>
                <button style={{ ...btn(false,th.accentRed), fontSize:10 }} onClick={() => applyQueue([{x:0,y:0,z:0,yaw:0,label:"Home"}], 0, { resetArrival:true, clearTravel:true })}>✕ Clear</button>
=========
              <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                <button style={{ ...btn(false, "#a78bfa"), fontSize: 10 }} onClick={() => setShowCSV(true)}>📂 CSV</button>
                <button style={{ ...btn(false, th.accentRed), fontSize: 10 }} onClick={() => applyQueue([{ x: 0, y: 0, z: 0, yaw: 0, label: "Home" }], 0, { resetArrival: true, clearTravel: true })}>✕ Clear</button>
>>>>>>>>> Temporary merge branch 2
              </div>
            </section>

            {/* Motor RPM */}
<<<<<<<<< Temporary merge branch 1
            <section style={{ display:"flex", flexDirection:"column", gap:4 }}>
              <SL>Motor RPM</SL>
              {droneRPM.map((r,i) => <Gauge key={i} label={`M${i+1}`} value={r} min={0} max={12000} unit="" color={rpmColors[i]} />)}
              <div style={{ padding:"5px 8px", background:th.wellBg, border:`1px solid ${th.wellBorder}`, borderRadius:5 }}>
                <div style={{ color:th.textMuted, fontSize:9, textTransform:"uppercase", letterSpacing:0.5 }}>Avg RPM</div>
                <div style={{ color:th.accentAmber, fontSize:14, fontWeight:700, fontVariantNumeric:"tabular-nums" }}>
                  {(droneRPM.reduce((a,b)=>a+b,0)/4).toFixed(0)}
=========
            <section style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <SL>Motor RPM</SL>
              {droneRPM.map((r, i) => <Gauge key={i} label={`M${i + 1}`} value={r} min={0} max={12000} unit="" color={rpmColors[i]} />)}
              <div style={{ padding: "5px 8px", background: th.wellBg, border: `1px solid ${th.wellBorder}`, borderRadius: 5 }}>
                <div style={{ color: th.textMuted, fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5 }}>Avg RPM</div>
                <div style={{ color: th.accentAmber, fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  {(droneRPM.reduce((a, b) => a + b, 0) / 4).toFixed(0)}
>>>>>>>>> Temporary merge branch 2
                </div>
              </div>
            </section>
          </div>

        </div>
      )}

        {/* CSV Modal */}
        {showCSV && (
          <div style={{ position: "fixed", inset: 0, background: th.modalOverlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setShowCSV(false)}>
            <div style={{ background: th.modalBg, border: `1px solid ${th.modalBorder}`, borderRadius: 12, padding: 24, width: 420, maxWidth: "92vw" }} onClick={e => e.stopPropagation()}>
              <div style={{ color: th.modalTitle, fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Load CSV</div>
              <div style={{ color: th.modalSub, fontSize: 11, marginBottom: 10 }}>Columns: x, y, z, yaw, label (optional) · z ≥ 0</div>
              <textarea value={csvText} onChange={e => setCsvText(e.target.value)}
                style={{ width: "100%", height: 150, background: th.modalAreaBg, border: `1px solid ${th.modalBorder}`, borderRadius: 6, color: th.modalAreaText, fontSize: 11, fontFamily: "monospace", padding: 10, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
              <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" }}>
                <button style={btn(false, th.textSecondary)} onClick={() => setShowCSV(false)}>Cancel</button>
                <button style={{ ...btn(false, th.accentGreen), background: th.accentGreen, color: "#fff", border: "none" }} onClick={handleLoadCSV}>Load</button>
              </div>
            </div>
          </div>
        )}

      </div>
      );
}