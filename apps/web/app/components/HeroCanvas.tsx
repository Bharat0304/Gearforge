"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene
    const scene = new THREE.Scene();
    const W = mount.clientWidth, H = mount.clientHeight;
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Detect theme
    const isDark = () => document.documentElement.getAttribute("data-theme") === "dark";

    // Wireframe icosahedron (main shape)
    const icoGeo = new THREE.IcosahedronGeometry(1.4, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0xff6235, wireframe: true, transparent: true, opacity: 0.5,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);

    // Inner solid icosahedron
    const innerGeo = new THREE.IcosahedronGeometry(1.0, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xff6235, wireframe: true, transparent: true, opacity: 0.2,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    scene.add(inner);

    // Outer ring
    const ringGeo = new THREE.TorusGeometry(2.2, 0.006, 6, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.3 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    scene.add(ring);

    // Orbiting dots (Points)
    const dotCount = 60;
    const dotPositions = new Float32Array(dotCount * 3);
    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / dotCount);
      const theta = Math.sqrt(dotCount * Math.PI) * phi;
      dotPositions[i * 3] = 2.8 * Math.cos(theta) * Math.sin(phi);
      dotPositions[i * 3 + 1] = 2.8 * Math.sin(theta) * Math.sin(phi);
      dotPositions[i * 3 + 2] = 2.8 * Math.cos(phi);
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
    const dotMat = new THREE.PointsMaterial({ color: 0xffaa00, size: 0.04, transparent: true, opacity: 0.6 });
    const dots = new THREE.Points(dotGeo, dotMat);
    scene.add(dots);

    // Connecting lines (edges of outer sphere)
    const lineGeo = new THREE.IcosahedronGeometry(2.8, 0);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xff6235, wireframe: true, transparent: true, opacity: 0.06 });
    const lines = new THREE.Mesh(lineGeo, lineMat);
    scene.add(lines);

    // Mouse tracking
    let mouseX = 0, mouseY = 0;
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    // Resize
    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Theme observer
    const themeObs = new MutationObserver(() => {
      const dark = isDark();
      icoMat.color.set(dark ? 0xff6235 : 0xe84c1b);
      icoMat.opacity = dark ? 0.5 : 0.35;
      innerMat.color.set(dark ? 0xff6235 : 0xe84c1b);
      dotMat.color.set(dark ? 0xffaa00 : 0xf07d00);
      ringMat.color.set(dark ? 0xffaa00 : 0xf07d00);
    });
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    let frame = 0;
    const animate = () => {
      frame++;
      const t = frame * 0.005;

      ico.rotation.y = t * 0.3 + mouseX * 0.3;
      ico.rotation.x = Math.sin(t * 0.2) * 0.2 + mouseY * 0.2;
      inner.rotation.y = -t * 0.5 + mouseX * 0.2;
      inner.rotation.z = t * 0.2;
      ring.rotation.z = t * 0.1;
      ring.rotation.y = mouseX * 0.15;
      dots.rotation.y = t * 0.08 + mouseX * 0.1;
      dots.rotation.x = Math.sin(t * 0.1) * 0.1 + mouseY * 0.05;
      lines.rotation.y = t * 0.04;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    const rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      themeObs.disconnect();
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} style={{
      position: "absolute", inset: 0,
      width: "100%", height: "100%",
      pointerEvents: "none",
    }} />
  );
}
