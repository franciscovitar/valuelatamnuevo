export function initCoverAnimation() {
  const mount = document.getElementById('coverBrain');
  const scroller = document.getElementById('coverScroll');
  const cap = document.getElementById('coverCaption');
  if (!mount || !scroller || !cap) return () => {};

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileQuery = window.matchMedia('(max-width: 640px)');
  const tabletQuery = window.matchMedia('(max-width: 900px)');

  mount.innerHTML = '';

  const canvas = document.createElement('canvas');
  canvas.className = 'vl2-cover-canvas';
  mount.appendChild(canvas);

  const hud = document.createElement('div');
  hud.className = 'vl2-cover-hud';
  mount.appendChild(hud);

  const note = document.createElement('div');
  note.className = 'vl2-cover-note';
  note.textContent = mobileQuery.matches ? 'Deslizá para ver las unidades' : 'Scroll para desplegar el mapa de unidades';
  mount.appendChild(note);

  const ctx = canvas.getContext('2d', { alpha: true });
  const capS = cap.querySelector('.pb-step');
  const capT = cap.querySelector('.pb-txt');

  const stages = [
    { p: 0.08, n: '01', t: 'Financiamiento: banca, SGRs y mercado de capitales conectados en un mismo benchmark.', ids: ['fin'] },
    { p: 0.31, n: '02', t: 'Liquidez: gestión de caja de la empresa y capital de los socios.', ids: ['liq', 'socios'] },
    { p: 0.54, n: '03', t: 'Medios de pago: cobros, pagos, saldo remunerado y optimización fiscal.', ids: ['pay', 'tax'] },
    { p: 0.78, n: '04', t: 'Procesos con IA: agentes para ejecutar tareas, reportes y flujos administrativos.', ids: ['ai', 'ops'] },
  ];

  const nodes = [
    { id: 'hub', label: 'VALUE LATAM', x: 0.5, y: 0.5, r: 9.5, show: 0, c: [210, 183, 117] },
    { id: 'fin', label: 'Financiamiento', x: 0.5, y: 0.17, r: 6.6, show: 0.08, c: [143, 178, 214], labelY: -32 },
    { id: 'liq', label: 'Liquidez empresa', x: 0.78, y: 0.34, r: 6.6, show: 0.31, c: [143, 178, 214], labelX: 78, labelY: -4 },
    { id: 'socios', label: 'Capital socios', x: 0.74, y: 0.68, r: 5.3, show: 0.39, c: [210, 183, 117], labelX: 70, labelY: 24 },
    { id: 'pay', label: 'Medios de pago', x: 0.5, y: 0.82, r: 6.6, show: 0.54, c: [143, 178, 214], labelY: 36 },
    { id: 'tax', label: 'Optimización fiscal', x: 0.24, y: 0.68, r: 5.3, show: 0.5, c: [210, 183, 117], labelX: -80, labelY: 24 },
    { id: 'ai', label: 'Procesos con IA', x: 0.22, y: 0.34, r: 6.6, show: 0.78, c: [143, 178, 214], labelX: -78, labelY: -4 },
    { id: 'ops', label: 'Agentes IA', x: 0.35, y: 0.55, r: 5.3, show: 0.74, c: [210, 183, 117], labelX: -66, labelY: 2 },
  ];

  /*
    Mobile-only layout v3:
    - Desktop queda intacto.
    - Se vuelve a abrir el mapa para que las líneas sean más largas.
    - Los labels laterales quedan más separados del hub y de otros labels.
    - Agentes IA queda cerca de su nodo, pero sin pisar VALUE LATAM.
    - La línea sigue el scroll de forma directa en mobile, sin arrastre.
  */
  const mobilePositions = {
    hub: [0.5, 0.5],
    fin: [0.5, 0.245],
    liq: [0.815, 0.39],
    socios: [0.805, 0.665],
    pay: [0.5, 0.78],
    tax: [0.195, 0.665],
    ai: [0.34, 0.39],
    ops: [0.285, 0.555],
  };

  const mobileLabelOffsets = {
    fin: { x: 0, y: -36 },
    liq: { x: 108, y: -4 },
    socios: { x: 108, y: 30 },
    pay: { x: 0, y: 42 },
    tax: { x: -108, y: 30 },
    ai: { x: -110, y: -4 },
    ops: { x: -72, y: 2 },
  };

  const links = [
    ['hub', 'fin', 0.08],
    ['hub', 'liq', 0.31],
    ['liq', 'socios', 0.39],
    ['hub', 'pay', 0.54],
    ['pay', 'tax', 0.5],
    ['hub', 'ai', 0.78],
    ['ai', 'ops', 0.74],
  ];

  const particles = Array.from({ length: tabletQuery.matches ? 42 : 78 }, () => ({
    a: Math.random() * Math.PI * 2,
    rad: Math.pow(Math.random(), 0.58),
    ph: Math.random() * 8,
    z: 0.35 + Math.random() * 0.95,
    show: Math.random() * 0.38,
  }));

  let dpr = 1;
  let w = 0;
  let h = 0;
  let t = 0;
  let progress = 0;
  let targetProgress = 0;
  let rafId = 0;
  let active = true;
  let lastFrame = 0;
  let currentCaption = -2;
  let captionOpacity = 1;
  let parallaxX = 0;
  let parallaxY = 0;
  let targetParallaxX = 0;
  let targetParallaxY = 0;
  let observer = null;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const smooth = (a, b, value) => {
    const x = clamp((value - a) / (b - a), 0, 1);
    return x * x * (3 - 2 * x);
  };
  const linear = (a, b, value) => clamp((value - a) / (b - a), 0, 1);
  const appear = (value) => smooth(0, 1, clamp(value, 0, 1));
  const nodeById = (id) => nodes.find((node) => node.id === id);

  function resize() {
    const isMobile = mobileQuery.matches;
    dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 2 : 1);
    w = mount.clientWidth || window.innerWidth;
    h = mount.clientHeight || window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    note.textContent = mobileQuery.matches ? 'Deslizá para ver las unidades' : 'Scroll para desplegar el mapa de unidades';
  }

  function onScroll() {
    const rect = scroller.getBoundingClientRect();
    const total = scroller.offsetHeight - window.innerHeight;
    targetProgress = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
  }

  function onPointerMove(event) {
    if (mobileQuery.matches || reduceMotion) return;
    const x = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
    const y = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
    targetParallaxX = clamp(x, -0.5, 0.5) * 26;
    targetParallaxY = clamp(y, -0.5, 0.5) * 18;
  }

  function stageWeight(index) {
    const start = stages[index].p;
    const next = stages[index + 1] ? stages[index + 1].p : 1.06;
    const fadeIn = smooth(start - 0.13, start + 0.16, progress);
    const fadeOut = index < stages.length - 1 ? 1 - smooth(next - 0.16, next + 0.13, progress) : 1;
    return clamp(fadeIn * fadeOut, 0, 1);
  }

  function getActiveStage() {
    let best = -1;
    let bestWeight = 0.1;
    stages.forEach((stage, index) => {
      const weight = stageWeight(index);
      if (progress >= stage.p - 0.08 && weight > bestWeight) {
        best = index;
        bestWeight = weight;
      }
    });
    return best;
  }

  function nodePower(id) {
    if (id === 'hub') return 1;
    return stages.reduce((max, stage, index) => (
      stage.ids.includes(id) ? Math.max(max, stageWeight(index)) : max
    ), 0);
  }

  function point(node) {
    const isMobile = mobileQuery.matches;
    const coords = isMobile && mobilePositions[node.id] ? mobilePositions[node.id] : [node.x, node.y];
    const scale = Math.min(w, h) * (isMobile ? 0.835 : 0.62);
    const centerY = h * (isMobile ? 0.515 : 0.5);
    return {
      x: w * 0.5 + ((coords[0] - 0.5) * scale) + parallaxX * (node.id === 'hub' ? 0.2 : 1),
      y: centerY + ((coords[1] - 0.5) * scale) + parallaxY * (node.id === 'hub' ? 0.2 : 1),
    };
  }

  function roundRect(x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function labelFont() {
    return mobileQuery.matches ? '700 9px IBM Plex Mono, monospace' : '600 11px IBM Plex Mono, monospace';
  }

  function labelPoint(node, p) {
    const isMobile = mobileQuery.matches;
    ctx.font = labelFont();
    const bw = ctx.measureText(node.label).width + (isMobile ? 14 : 24);
    const mobileOffset = isMobile ? mobileLabelOffsets[node.id] : null;
    const labelScale = isMobile ? 0.86 : 1;
    const defaultY = node.y < 0.5 ? -32 : 34;
    const rawX = mobileOffset ? mobileOffset.x : (node.labelX || 0);
    const rawY = mobileOffset ? mobileOffset.y : (node.labelY || defaultY);
    const lx = p.x + rawX * labelScale;
    const ly = p.y + rawY * (isMobile ? 0.9 : 1);
    const sidePad = isMobile ? 10 : 14;
    const bottomLimit = isMobile ? h - 150 : h - 104;

    return {
      x: clamp(lx, bw / 2 + sidePad, w - bw / 2 - sidePad),
      y: clamp(ly, 34, bottomLimit),
    };
  }

  function drawLabel(text, x, y, color, strength) {
    const on = appear(strength);
    if (on <= 0.02) return;

    ctx.save();
    ctx.font = labelFont();
    const tw = ctx.measureText(text).width;
    const bw = tw + (mobileQuery.matches ? 14 : 24);
    const bh = mobileQuery.matches ? 22 : 28;

    ctx.globalAlpha = on;
    ctx.fillStyle = 'rgba(4, 11, 20, .68)';
    roundRect(x - bw / 2, y - bh / 2, bw, bh, 14);
    ctx.fill();

    ctx.strokeStyle = `rgba(${color.join(',')}, ${0.18 + 0.46 * on})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = `rgba(${color.join(',')}, ${0.62 + 0.38 * on})`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y + 1);
    ctx.restore();
  }

  function quadraticPoint(sx, sy, mx, my, ex, ey, q) {
    const inv = 1 - q;
    return {
      x: inv * inv * sx + 2 * inv * q * mx + q * q * ex,
      y: inv * inv * sy + 2 * inv * q * my + q * q * ey,
    };
  }

  function drawPartialCurve(sx, sy, mx, my, ex, ey, amount) {
    const drawAmount = clamp(amount, 0, 1);
    if (drawAmount <= 0.002) return null;

    const steps = Math.max(3, Math.ceil(36 * drawAmount));
    let end = { x: sx, y: sy };

    ctx.beginPath();
    ctx.moveTo(sx, sy);
    for (let i = 1; i <= steps; i += 1) {
      const q = drawAmount * (i / steps);
      end = quadraticPoint(sx, sy, mx, my, ex, ey, q);
      ctx.lineTo(end.x, end.y);
    }
    ctx.stroke();
    return end;
  }

  function drawCurve(a, b, amount, color, strength) {
    const isMobile = mobileQuery.matches;
    const drawAmount = isMobile ? clamp(amount, 0, 1) : appear(amount);
    if (drawAmount <= 0.01) return;

    const power = isMobile ? clamp(strength, 0, 1) : appear(strength);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.max(1, Math.hypot(dx, dy));
    const startGap = isMobile ? 12 : 30;
    const endGap = isMobile ? 12 : 25;
    const sx = a.x + (dx / len) * startGap;
    const sy = a.y + (dy / len) * startGap;
    const ex = b.x - (dx / len) * endGap;
    const ey = b.y - (dy / len) * endGap;
    const bend = isMobile ? 0.05 : 0.14;
    const mx = (sx + ex) / 2 + (ey - sy) * bend;
    const my = (sy + ey) / 2 - (ex - sx) * bend;

    ctx.save();
    ctx.strokeStyle = `rgba(${color.join(',')}, ${0.15 + 0.38 * power})`;
    ctx.lineWidth = isMobile ? 0.9 + 0.45 * power : 1 + 0.65 * power;
    const head = drawPartialCurve(sx, sy, mx, my, ex, ey, drawAmount);

    if (!isMobile && head && power > 0.04) {
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = `rgba(${color.join(',')}, ${0.26 + 0.35 * power})`;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 1.8 + power, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawSpot(p, color, radius, intensity) {
    const on = appear(intensity);
    if (on <= 0.02) return;

    const r = Math.min(w, h) * radius;
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
    gradient.addColorStop(0, `rgba(${color.join(',')}, ${0.12 * on})`);
    gradient.addColorStop(0.35, `rgba(${color.join(',')}, ${0.045 * on})`);
    gradient.addColorStop(1, `rgba(${color.join(',')}, 0)`);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  function updateCaption() {
    const nextStage = getActiveStage();
    if (nextStage !== currentCaption) {
      currentCaption = nextStage;
      captionOpacity = 0;
      if (nextStage >= 0) {
        capS.textContent = stages[nextStage].n;
        capT.textContent = stages[nextStage].t;
      } else {
        capS.textContent = '';
        capT.textContent = '';
      }
    }

    captionOpacity += (1 - captionOpacity) * 0.11;
    if (currentCaption >= 0) {
      cap.style.opacity = String((0.64 + 0.36 * stageWeight(currentCaption)) * captionOpacity);
      cap.style.transform = `translateY(${8 * (1 - captionOpacity)}px)`;
      note.style.opacity = '0';
    } else {
      cap.style.opacity = '0';
      cap.style.transform = 'translateY(8px)';
      note.style.opacity = '1';
    }
  }

  function draw(timestamp = 0) {
    rafId = requestAnimationFrame(draw);
    if (!active && Math.abs(progress - targetProgress) < 0.002) return;

    const minFrame = tabletQuery.matches ? 28 : 20;
    if (timestamp - lastFrame < minFrame) return;
    lastFrame = timestamp;

    t += reduceMotion ? 0 : (tabletQuery.matches ? 0.008 : 0.012);

    if (mobileQuery.matches) {
      progress = targetProgress;
    } else {
      progress += (targetProgress - progress) * (reduceMotion ? 1 : 0.13);
    }

    parallaxX += (targetParallaxX - parallaxX) * 0.08;
    parallaxY += (targetParallaxY - parallaxY) * 0.08;
    updateCaption();

    ctx.clearRect(0, 0, w, h);

    const gradientCenterY = h * (mobileQuery.matches ? 0.515 : 0.5);
    const g = ctx.createRadialGradient(w * 0.5, gradientCenterY, 10, w * 0.5, gradientCenterY, Math.min(w, h) * 0.62);
    g.addColorStop(0, 'rgba(27,58,92,.28)');
    g.addColorStop(0.55, 'rgba(1,4,10,.22)');
    g.addColorStop(1, 'rgba(1,4,10,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalAlpha = mobileQuery.matches ? 0.045 : 0.07;
    ctx.strokeStyle = 'rgba(246,243,236,.32)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i += 1) {
      const radius = Math.min(w, h) * (mobileQuery.matches ? 0.155 + i * 0.082 : 0.16 + i * 0.085);
      ctx.beginPath();
      ctx.arc(w * 0.5 + parallaxX * 0.15, gradientCenterY + parallaxY * 0.15, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    const cx = w / 2 + parallaxX * 0.28;
    const cy = gradientCenterY + parallaxY * 0.28;
    const particleScale = Math.min(w, h) * (mobileQuery.matches ? 0.335 : 0.36);
    particles.forEach((particle) => {
      const visible = smooth(particle.show, particle.show + 0.42, progress);
      if (visible <= 0.01) return;
      const wobble = Math.sin(t + particle.ph) * 0.024;
      const x = cx + Math.cos(particle.a + t * 0.035 * particle.z) * particleScale * (particle.rad + wobble);
      const y = cy + Math.sin(particle.a - t * 0.026 * particle.z) * particleScale * (particle.rad + wobble);
      ctx.globalAlpha = visible * (0.18 + 0.28 * particle.z);
      ctx.fillStyle = 'rgba(143,178,214,.9)';
      ctx.beginPath();
      ctx.arc(x, y, mobileQuery.matches ? 0.8 : 1.1, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    const hub = nodeById('hub');
    const hubPoint = point(hub);
    drawSpot(hubPoint, hub.c, mobileQuery.matches ? 0.115 : 0.14, 0.78);

    const linkProgress = {};
    links.forEach(([from, to, start]) => {
      linkProgress[`${from}>${to}`] = mobileQuery.matches
        ? linear(start, start + 0.2, progress)
        : smooth(start, start + 0.16, progress);
    });

    stages.forEach((stage, index) => {
      const weight = stageWeight(index);
      if (weight <= 0.02) return;
      stage.ids.forEach((id) => {
        const item = nodeById(id);
        if (item) drawSpot(point(item), item.c, mobileQuery.matches ? 0.078 : 0.11, weight * 0.72);
      });
    });

    links.forEach(([from, to]) => {
      const fromNode = nodeById(from);
      const toNode = nodeById(to);
      const amount = linkProgress[`${from}>${to}`];
      const strength = Math.min(nodePower(from), nodePower(to));
      const color = strength > 0.1 ? [210, 183, 117] : [143, 178, 214];
      drawCurve(point(fromNode), point(toNode), amount, color, strength);
    });

    const finalMap = progress > 0.92;
    nodes.forEach((node) => {
      const reveal = smooth(node.show, node.show + 0.2, progress);
      if (reveal <= 0.01 && node.id !== 'hub') return;

      const power = appear(nodePower(node.id));
      const p = point(node);
      const pulse = reduceMotion ? 1 : 1 + Math.sin(t * 3.2 + node.x * 5) * 0.045 * power;
      const radius = node.r * (mobileQuery.matches ? 0.72 : 1) * pulse;

      ctx.save();
      ctx.globalAlpha = node.id === 'hub' ? 1 : reveal;
      ctx.fillStyle = `rgba(${node.c.join(',')}, ${0.035 + 0.075 * power})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius * (mobileQuery.matches ? 2.25 : 3.25), 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(${node.c.join(',')}, ${0.2 + 0.5 * power})`;
      ctx.lineWidth = 0.9 + 0.85 * power;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius * 1.65, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = `rgba(${node.c.join(',')}, ${0.46 + 0.5 * power})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (node.id !== 'hub') {
        const labelStrength = finalMap ? 1 : Math.max(power * 0.9, reveal * (mobileQuery.matches ? 0.45 : 0.62));
        const lp = labelPoint(node, p);
        drawLabel(node.label, lp.x, lp.y, node.c, labelStrength);
      }
    });
  }

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      active = entries[0] ? entries[0].isIntersecting : true;
    }, { rootMargin: '120px 0px 120px 0px' });
    observer.observe(mount);
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  resize();
  onScroll();
  draw();

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('pointermove', onPointerMove);
    if (observer) observer.disconnect();
    mount.innerHTML = '';
  };
}
