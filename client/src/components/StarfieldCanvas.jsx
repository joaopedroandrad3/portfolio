import { useEffect, useRef } from 'react';

/**
 * Motor de fundo astronômico interativo em Canvas HiDPI.
 * - Múltiplas camadas de estrelas com paralaxe suave no scroll
 * - Gravidade sutil e filamentos de constelação próximos ao cursor
 * - Estrela cadente esporádica discreta
 * - Responde em tempo real aos controles táteis do painel de Telemetria
 */
export default function StarfieldCanvas({
  speed = 1,
  glowIntensity = 1,
  showConstellations = true,
}) {
  const canvasRef = useRef(null);
  const settingsRef = useRef({ speed, glowIntensity, showConstellations });

  useEffect(() => {
    settingsRef.current = { speed, glowIntensity, showConstellations };
    document.documentElement.style.setProperty('--violet-intensity', String(glowIntensity));
  }, [speed, glowIntensity, showConstellations]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId = null;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const pointer = { x: -9999, y: -9999, active: false };
    let scrollY = window.scrollY;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const starCount = Math.min(165, Math.max(85, Math.floor((width * height) / 11500)));
    const stars = Array.from({ length: starCount }, (_, i) => {
      const depth = 0.25 + Math.random() * 0.95;
      const isViolet = i % 5 === 0;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.14 * depth,
        vy: (Math.random() - 0.5) * 0.14 * depth - 0.04 * depth,
        r: (0.45 + Math.random() * 1.35) * depth,
        depth,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.008 + Math.random() * 0.018,
        isViolet,
      };
    });

    const shootingStars = [];
    let lastMeteorAt = performance.now();

    const onMouseMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onMouseLeave = () => {
      pointer.active = false;
    };
    const onScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('scroll', onScroll, { passive: true });

    const render = (now) => {
      const { speed: spd, glowIntensity: glow, showConstellations: linesOn } =
        settingsRef.current;

      ctx.clearRect(0, 0, width, height);

      // Nebulosa atmosférica sutil em preto/violeta (disciplinada e profunda)
      const neb1 = ctx.createRadialGradient(
        width * 0.78,
        height * 0.28 - (scrollY * 0.04) % 240,
        20,
        width * 0.78,
        height * 0.28,
        Math.max(width, height) * 0.58
      );
      neb1.addColorStop(0, `rgba(124, 58, 237, ${0.13 * glow})`);
      neb1.addColorStop(0.42, `rgba(76, 29, 149, ${0.055 * glow})`);
      neb1.addColorStop(1, 'rgba(4, 4, 7, 0)');
      ctx.fillStyle = neb1;
      ctx.fillRect(0, 0, width, height);

      const neb2 = ctx.createRadialGradient(
        width * 0.16,
        height * 0.82,
        10,
        width * 0.16,
        height * 0.82,
        Math.max(width, height) * 0.45
      );
      neb2.addColorStop(0, `rgba(168, 85, 247, ${0.08 * glow})`);
      neb2.addColorStop(0.5, `rgba(59, 7, 100, ${0.03 * glow})`);
      neb2.addColorStop(1, 'rgba(4, 4, 7, 0)');
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, width, height);

      // Atualiza e desenha estrelas
      const nearbyPointer = [];

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += s.vx * spd;
        s.y += s.vy * spd;
        s.phase += s.twinkleSpeed * Math.max(0.5, spd);

        if (s.x < -10) s.x = width + 10;
        if (s.x > width + 10) s.x = -10;
        if (s.y < -10) s.y = height + 10;
        if (s.y > height + 10) s.y = -10;

        const drawY = ((s.y - scrollY * 0.06 * s.depth) % height + height) % height;
        let drawX = s.x;

        // Atração gravitacional delicada próxima ao cursor
        if (pointer.active) {
          const dx = pointer.x - drawX;
          const dy = pointer.y - drawY;
          const dist = Math.hypot(dx, dy);
          if (dist < 175) {
            const pull = (1 - dist / 175) * 10 * s.depth;
            drawX += (dx / (dist || 1)) * pull;
            nearbyPointer.push({ x: drawX, y: drawY, dist, isViolet: s.isViolet });
          }
        }

        const twinkle = 0.42 + 0.58 * Math.sin(s.phase);
        const alpha = Math.min(1, (0.28 + s.depth * 0.6) * twinkle);

        ctx.beginPath();
        ctx.arc(drawX, drawY, s.r, 0, Math.PI * 2);
        if (s.isViolet) {
          ctx.fillStyle = `rgba(216, 180, 254, ${alpha * Math.min(1.2, 0.55 + glow * 0.55)})`;
          if (s.r > 1.05 && glow > 0.3) {
            ctx.shadowBlur = 10 * glow;
            ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
          }
        } else {
          ctx.fillStyle = `rgba(246, 246, 250, ${alpha})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Filamentos de constelação próximos ao ponteiro
      if (linesOn && pointer.active && nearbyPointer.length > 1) {
        for (let i = 0; i < nearbyPointer.length; i++) {
          const a = nearbyPointer[i];
          const cursorAlpha = (1 - a.dist / 175) * 0.24 * Math.max(0.4, glow);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.strokeStyle = `rgba(192, 132, 252, ${cursorAlpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();

          for (let j = i + 1; j < nearbyPointer.length; j++) {
            const b = nearbyPointer[j];
            const pairDist = Math.hypot(a.x - b.x, a.y - b.y);
            if (pairDist < 105) {
              const pairAlpha = (1 - pairDist / 105) * 0.22 * Math.max(0.4, glow);
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${pairAlpha})`;
              ctx.lineWidth = 0.55;
              ctx.stroke();
            }
          }
        }
      }

      // Estrela cadente esporádica a cada ~7-11s
      if (now - lastMeteorAt > 8500 && shootingStars.length === 0 && spd > 0.15) {
        lastMeteorAt = now;
        shootingStars.push({
          x: width * (0.25 + Math.random() * 0.65),
          y: height * (0.05 + Math.random() * 0.35),
          vx: -(6 + Math.random() * 4),
          vy: 2.5 + Math.random() * 2,
          life: 1,
        });
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const m = shootingStars[i];
        m.x += m.vx * Math.max(0.6, spd);
        m.y += m.vy * Math.max(0.6, spd);
        m.life -= 0.022;

        if (m.life <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = m.x - m.vx * 14;
        const tailY = m.y - m.vy * 14;
        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${m.life * 0.9})`);
        grad.addColorStop(0.35, `rgba(192, 132, 252, ${m.life * 0.55 * glow})`);
        grad.addColorStop(1, 'rgba(139, 92, 246, 0)');

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
