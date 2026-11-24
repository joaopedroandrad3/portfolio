import { useEffect, useRef } from 'react';

/**
 * Escultura 3D interativa em Canvas — Relíquia de Obsidiana & Núcleo Violeta.
 * Inspirada no cubo cristalino iluminado da Ref 3 e no vidro fumê da Ref 5.
 * Substitui a foto pessoal até o João Pedro adicionar seu retrato em src/config/profile.js.
 * O visitante pode arrastar com o mouse para rotacionar em 3D!
 */
export default function ObsidianRelicCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId = null;

    const rot = { x: 0.48, y: 0.6, vx: 0.0035, vy: 0.0065 };
    const drag = { active: false, lastX: 0, lastY: 0 };

    // Vértices do cubo externo translúcido (vidro fumê)
    const outerCube = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ];

    const cubeFaces = [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [0, 1, 5, 4],
      [2, 3, 7, 6],
      [0, 3, 7, 4],
      [1, 2, 6, 5],
    ];

    const cubeEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    // Octaedro interno luminoso (núcleo violeta)
    const innerCore = [
      [0, -0.58, 0],
      [0.58, 0, 0],
      [0, 0, 0.58],
      [-0.58, 0, 0],
      [0, 0, -0.58],
      [0, 0.58, 0],
    ];

    const coreEdges = [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [5, 1], [5, 2], [5, 3], [5, 4],
      [1, 2], [2, 3], [3, 4], [4, 1],
    ];

    // Anel orbital de pontos estelares
    const ringPoints = Array.from({ length: 72 }, (_, i) => {
      const a = (i / 72) * Math.PI * 2;
      return [Math.cos(a) * 1.72, Math.sin(a) * 0.42, Math.sin(a) * 1.72];
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onDown = (e) => {
      drag.active = true;
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
    };
    const onMove = (e) => {
      if (!drag.active) return;
      const dx = e.clientX - drag.lastX;
      const dy = e.clientY - drag.lastY;
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      rot.vy = dx * 0.008;
      rot.vx = dy * 0.008;
      rot.y += dx * 0.01;
      rot.x += dy * 0.01;
    };
    const onUp = () => {
      drag.active = false;
    };

    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    const project = ([x, y, z], w, h, scale) => {
      const cosX = Math.cos(rot.x);
      const sinX = Math.sin(rot.x);
      const cosY = Math.cos(rot.y);
      const sinY = Math.sin(rot.y);

      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const perspective = 4.2 / (4.2 - z2);
      return {
        x: w / 2 + x1 * scale * perspective,
        y: h / 2 + y2 * scale * perspective,
        z: z2,
      };
    };

    let t = 0;

    const draw = () => {
      t += 0.015;
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      const scale = Math.min(w, h) * 0.23;

      if (!drag.active) {
        rot.y += rot.vy;
        rot.x += rot.vx;
        // Amortecimento elegante de volta à rotação orbital contínua
        rot.vy += (0.0062 - rot.vy) * 0.04;
        rot.vx += (0.0024 - rot.vx) * 0.04;
      }

      ctx.clearRect(0, 0, w, h);

      // Fundo profundo + aura violeta central
      const aura = ctx.createRadialGradient(
        w * 0.5,
        h * 0.5,
        8,
        w * 0.5,
        h * 0.5,
        scale * 2.15
      );
      const pulse = 0.85 + Math.sin(t * 1.4) * 0.15;
      aura.addColorStop(0, `rgba(168, 85, 247, ${0.42 * pulse})`);
      aura.addColorStop(0.35, `rgba(124, 58, 237, ${0.18 * pulse})`);
      aura.addColorStop(0.75, 'rgba(15, 10, 28, 0.06)');
      aura.addColorStop(1, 'rgba(4, 4, 7, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, w, h);

      // Anel orbital fino com satélite luminoso
      const projRing = ringPoints.map((p) => project(p, w, h, scale));
      ctx.beginPath();
      projRing.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.strokeStyle = 'rgba(216, 180, 254, 0.22)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Satélite em órbita
      const satIndex = Math.floor((t * 14) % projRing.length);
      const sat = projRing[satIndex];
      ctx.beginPath();
      ctx.arc(sat.x, sat.y, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#C084FC';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Segundo anel perpendicular estático editorial
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2, scale * 1.55, scale * 0.52, -0.45, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Projeção das faces do cubo de vidro fumê (ordenadas por profundidade)
      const projOuter = outerCube.map((p) => project(p, w, h, scale));
      const sortedFaces = cubeFaces
        .map((face) => {
          const avgZ = face.reduce((sum, idx) => sum + projOuter[idx].z, 0) / 4;
          return { face, avgZ };
        })
        .sort((a, b) => a.avgZ - b.avgZ);

      for (const { face, avgZ } of sortedFaces) {
        ctx.beginPath();
        face.forEach((idx, i) => {
          const p = projOuter[idx];
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        const frontFactor = Math.max(0, (avgZ + 1.4) / 2.8);
        ctx.fillStyle = `rgba(139, 92, 246, ${0.06 + frontFactor * 0.13})`;
        ctx.fill();
      }

      // Núcleo interno cristalino brilhante
      const coreGlow = ctx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, scale * 0.72);
      coreGlow.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
      coreGlow.addColorStop(0.28, 'rgba(216, 180, 254, 0.72)');
      coreGlow.addColorStop(0.65, 'rgba(139, 92, 246, 0.28)');
      coreGlow.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, scale * 0.72, 0, Math.PI * 2);
      ctx.fill();

      const projInner = innerCore.map((p) => project(p, w, h, scale * (0.95 + Math.sin(t * 2) * 0.04)));
      ctx.strokeStyle = 'rgba(245, 243, 255, 0.72)';
      ctx.lineWidth = 1.1;
      for (const [a, b] of coreEdges) {
        ctx.beginPath();
        ctx.moveTo(projInner[a].x, projInner[a].y);
        ctx.lineTo(projInner[b].x, projInner[b].y);
        ctx.stroke();
      }

      // Arestas refrativas do cubo externo
      for (const [a, b] of cubeEdges) {
        const pa = projOuter[a];
        const pb = projOuter[b];
        const depthAlpha = Math.min(0.92, Math.max(0.22, (pa.z + pb.z + 2.8) / 4.2));
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = `rgba(216, 180, 254, ${depthAlpha})`;
        ctx.lineWidth = depthAlpha > 0.55 ? 1.5 : 0.9;
        ctx.stroke();
      }

      // Vértices especulares
      for (const p of projOuter) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.z > 0 ? 2.4 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = p.z > 0 ? '#FFFFFF' : 'rgba(192, 132, 252, 0.55)';
        ctx.fill();
      }

      // Retículas astronômicas discretas nos cantos
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = 1;
      const m = 18;
      const len = 12;
      [
        [m, m, 1, 1],
        [w - m, m, -1, 1],
        [m, h - m, 1, -1],
        [w - m, h - m, -1, -1],
      ].forEach(([cx, cy, sx, sy]) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy + sy * len);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx + sx * len, cy);
        ctx.stroke();
      });

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full cursor-grab active:cursor-grabbing"
      aria-label="Interactive 3D Obsidian Orbital Crystal"
    />
  );
}
