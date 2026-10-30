/**
 * EduVerse AI ERP - Dynamic 3D Animated Favicon Engine
 * 
 * Features:
 * - Real-time 3D gyroscopic orbital ring rotation directly inside browser tab
 * - Pulsing neural AI core & glowing specular highlight
 * - Zero external dependencies, pure HTML5 Canvas (32x32)
 * - Battery & CPU friendly: automatically pauses when tab is backgrounded
 * - Respects prefers-reduced-motion accessibility setting
 */

export function initDynamic3DFavicon() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Respect user's motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Find or create favicon link element
  let link = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    document.head.appendChild(link);
  }

  // Offscreen canvas for rendering 3D favicon
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let angle = 0;
  let animFrameId = null;
  let isVisible = !document.hidden;

  const render = () => {
    if (!isVisible) return;

    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const radius = 12;

    // 1. Ambient Glow
    const glowGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 15);
    glowGrad.addColorStop(0, 'rgba(34, 211, 238, 0.4)');
    glowGrad.addColorStop(0.6, 'rgba(99, 102, 241, 0.2)');
    glowGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 15, 0, Math.PI * 2);
    ctx.fill();

    // 2. 3D Glass Sphere Body
    const coreGrad = ctx.createRadialGradient(cx - 3, cy - 3, 1, cx, cy, radius);
    coreGrad.addColorStop(0, '#1e1b4b');
    coreGrad.addColorStop(0.5, '#0f172a');
    coreGrad.addColorStop(1, '#050814');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Sphere Rim
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 3. 3D Gyroscopic Orbital Ring
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // Elliptical ring with 3D tilt
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 4.5, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.85)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 2]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Orbiting Electron / Light Sparkle
    const particleX = Math.cos(angle * 2) * 14;
    const particleY = Math.sin(angle * 2) * 4.5;
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(particleX, particleY, 1.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // 4. Center Isometric 3D Mortarboard
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 5);
    ctx.lineTo(cx + 6, cy - 2);
    ctx.lineTo(cx, cy + 1);
    ctx.lineTo(cx - 6, cy - 2);
    ctx.closePath();
    ctx.fill();

    // 3D Shadow facet
    ctx.fillStyle = '#4338ca';
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy - 2);
    ctx.lineTo(cx, cy + 1);
    ctx.lineTo(cx, cy + 3);
    ctx.lineTo(cx - 6, cy);
    ctx.closePath();
    ctx.fill();

    // Center Quantum Node
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy - 2, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // 5. Specular Gloss Reflection (Top Crescent)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.arc(cx, cy - 4, 6, Math.PI * 1.1, Math.PI * 1.9);
    ctx.fill();

    // Update browser tab icon
    try {
      link.href = canvas.toDataURL('image/png');
    } catch {
      // Fallback in case of sandboxed canvas restrictions
    }

    angle += 0.045; // Smooth rotational increment
  };

  // Run at ~24 FPS (every 40ms) for high efficiency & smooth motion
  let intervalId = setInterval(render, 45);

  const handleVisibilityChange = () => {
    isVisible = !document.hidden;
    if (isVisible) {
      if (!intervalId) intervalId = setInterval(render, 45);
    } else {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    clearInterval(intervalId);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}
