import { useEffect, useRef, useState, useCallback } from 'react';
import './ObservableUniverse.css';

// ── Zoom levels ───────────────────────────────────────────
const LEVELS = [
  {
    id: 'solar',
    label: 'The Solar System',
    scaleText: '1 unit = 1 light-hour',
    range: '~11 light-hours across',
    description: 'Our cosmic neighbourhood. The Sun, eight planets, and a vast cloud of comets — everything that feels like "home."',
    objects: [
      { label: 'Sun',     x: 0.5,   y: 0.5,  r: 18, color: '#ffe090', glow: 'rgba(255,200,80,0.35)', type: 'star'   },
      { label: 'Mercury', x: 0.565, y: 0.5,  r: 2,  color: '#aaa090', glow: null,                   type: 'planet' },
      { label: 'Venus',   x: 0.595, y: 0.5,  r: 3,  color: '#e0c080', glow: null,                   type: 'planet' },
      { label: 'Earth',   x: 0.635, y: 0.5,  r: 3,  color: '#5090d0', glow: null,                   type: 'planet' },
      { label: 'Mars',    x: 0.675, y: 0.5,  r: 2,  color: '#c06040', glow: null,                   type: 'planet' },
      { label: 'Jupiter', x: 0.75,  y: 0.5,  r: 7,  color: '#c09060', glow: null,                   type: 'planet' },
      { label: 'Saturn',  x: 0.83,  y: 0.5,  r: 6,  color: '#d0b870', glow: null,                   type: 'planet', ring: true },
    ],
  },
  {
    id: 'nearby',
    label: 'Nearby Stars',
    scaleText: '1 unit = 10 light-years',
    range: '~50 light-years across',
    description: 'Our stellar neighbourhood. Dozens of star systems within walking distance on cosmic scales — some with their own planets.',
    objects: [
      { label: 'Sun',              x: 0.5,  y: 0.5,  r: 6,  color: '#ffe090', glow: 'rgba(255,200,80,0.25)', type: 'star' },
      { label: 'α Centauri',       x: 0.56, y: 0.46, r: 5,  color: '#ffddaa', glow: 'rgba(255,200,100,0.2)', type: 'star' },
      { label: 'Barnard\'s Star',  x: 0.44, y: 0.42, r: 3,  color: '#ff8060', glow: 'rgba(255,100,60,0.15)', type: 'star' },
      { label: 'Sirius',           x: 0.62, y: 0.58, r: 6,  color: '#c0d8ff', glow: 'rgba(180,210,255,0.2)', type: 'star' },
      { label: 'Epsilon Eridani',  x: 0.38, y: 0.6,  r: 4,  color: '#ffcc80', glow: 'rgba(255,180,80,0.15)', type: 'star' },
      { label: 'Tau Ceti',         x: 0.68, y: 0.38, r: 4,  color: '#ffe0a0', glow: 'rgba(255,200,120,0.15)', type: 'star' },
      { label: 'Vega',             x: 0.3,  y: 0.35, r: 5,  color: '#d0e8ff', glow: 'rgba(200,220,255,0.18)', type: 'star' },
      { label: 'Proxima Cen.',     x: 0.55, y: 0.44, r: 2,  color: '#ff6050', glow: null,                    type: 'star' },
    ],
  },
  {
    id: 'milkyway',
    label: 'The Milky Way',
    scaleText: '1 unit = 10,000 light-years',
    range: '~100,000 light-years across',
    description: 'Our galaxy — a barred spiral containing 200–400 billion stars. We sit about 26,000 light-years from the galactic centre.',
    objects: [
      { label: 'Galactic Centre', x: 0.5,  y: 0.5,  r: 14, color: '#ffcc60', glow: 'rgba(86, 189, 201, 0.45)', type: 'core'   },
      { label: 'Sun (us)',        x: 0.72, y: 0.52, r: 4,  color: '#ffe090', glow: 'rgba(255,220,100,0.3)', type: 'sun'    },
      { label: 'Sagittarius A*',  x: 0.5,  y: 0.5,  r: 3,  color: '#ffffff', glow: 'rgba(80, 58, 114, 0.71)', type: 'bh'     },
      { label: 'Orion Arm',       x: 0.72, y: 0.52, r: 0,  color: null,      glow: null,                   type: 'label'  },
    ],
    isMilkyWay: true,
  },
  {
    id: 'localgroup',
    label: 'The Local Group',
    scaleText: '1 unit = 500,000 light-years',
    range: '~10 million light-years across',
    description: 'About 80 galaxies gravitationally bound together. The Milky Way and Andromeda are the two heavyweights — on a collision course in ~4.5 billion years.',
    objects: [
      { label: 'Milky Way',          x: 0.5,   y: 0.55, r: 12, color: '#c0d0ff', glow: 'rgba(180,200,255,0.25)', type: 'galaxy', tilt: 15  },
      { label: 'Andromeda (M31)',     x: 0.3,   y: 0.38, r: 15, color: '#ffd090', glow: 'rgba(255,200,100,0.3)',  type: 'galaxy', tilt: -25, hubble: true },
      { label: 'Triangulum (M33)',    x: 0.38,  y: 0.32, r: 7,  color: '#a0c0ff', glow: 'rgba(150,180,255,0.2)', type: 'galaxy', tilt: 10  },
      { label: 'LMC',                x: 0.62,  y: 0.68, r: 6,  color: '#d0b0ff', glow: 'rgba(200,160,255,0.2)', type: 'galaxy', tilt: 0   },
      { label: 'SMC',                x: 0.68,  y: 0.72, r: 4,  color: '#c0a0ff', glow: 'rgba(180,140,255,0.15)', type: 'galaxy', tilt: 0   },
    ],
  },
  {
    id: 'cosmicweb',
    label: 'The Cosmic Web',
    scaleText: '1 unit = 100 million light-years',
    range: '~1 billion light-years across',
    description: 'The large-scale structure of the universe — filaments of dark matter and galaxies surrounding vast, nearly-empty voids. Everything is connected.',
    objects: [],
    isCosmicWeb: true,
  },
];

// ── Seeded pseudo-random (stable across renders) ──────────
function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ── Draw functions ────────────────────────────────────────
function drawSolarLevel(ctx, W, H, level, t) {
  // Orbit rings
  const sun = level.objects[0];
  const planets = level.objects.slice(1);
  planets.forEach((p) => {
    const dx = (p.x - sun.x) * W;
    const dist = Math.abs(dx);
    ctx.beginPath();
    ctx.arc(sun.x * W, sun.y * H, dist, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Objects
  level.objects.forEach((obj) => {
    const cx = obj.x * W, cy = obj.y * H;

    if (obj.glow) {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, obj.r * 3.5);
      g.addColorStop(0, obj.glow);
      g.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, obj.r * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }

    if (obj.ring) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, obj.r * 2, obj.r * 0.5, -0.4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(210,180,100,0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, obj.r, 0, Math.PI * 2);
    ctx.fillStyle = obj.color;
    ctx.fill();

    ctx.font = "10px 'IBM Plex Mono', monospace";
    ctx.fillStyle = 'rgba(200,190,170,0.75)';
    ctx.textAlign = 'center';
    ctx.fillText(obj.label, cx, cy + obj.r + 14);
  });
}

function drawStarField(ctx, W, H, rand, count = 120, alpha = 0.6) {
  for (let i = 0; i < count; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const r = rand() * 1.2 + 0.3;
    const a = (rand() * 0.5 + 0.2) * alpha;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fill();
  }
}

function drawNearbyLevel(ctx, W, H, level) {
  const rand = seededRand(42);
  drawStarField(ctx, W, H, rand, 80, 0.5);

  level.objects.forEach((obj) => {
    const cx = obj.x * W, cy = obj.y * H;

    if (obj.glow) {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, obj.r * 4);
      g.addColorStop(0, obj.glow);
      g.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, obj.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, obj.r, 0, Math.PI * 2);
    ctx.fillStyle = obj.color;
    ctx.fill();

    ctx.font = "10px 'IBM Plex Mono', monospace";
    ctx.fillStyle = 'rgba(200,190,170,0.7)';
    ctx.textAlign = 'center';
    ctx.fillText(obj.label, cx, cy + obj.r + 14);
  });
}

function drawMilkyWayLevel(ctx, W, H, level, t) {
  const cx = W / 2, cy = H / 2;
  const rand = seededRand(7);

  // Disk glow
  const diskGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.38);
  diskGrad.addColorStop(0,   'rgba(255,220,120,0.5)');
  diskGrad.addColorStop(0.15,'rgba(255,200,80,0.3)');
  diskGrad.addColorStop(0.4, 'rgba(180,160,220,0.12)');
  diskGrad.addColorStop(0.7, 'rgba(120,100,180,0.05)');
  diskGrad.addColorStop(1,   'transparent');
  ctx.save();
  ctx.scale(1, 0.42);
  ctx.beginPath();
  ctx.arc(cx, cy / 0.42, W * 0.38, 0, Math.PI * 2);
  ctx.fillStyle = diskGrad;
  ctx.fill();
  ctx.restore();

  // Spiral arms
  const arms = 4;
  for (let arm = 0; arm < arms; arm++) {
    const offset = (arm / arms) * Math.PI * 2;
    for (let i = 0; i < 300; i++) {
      const frac = i / 300;
      const angle = frac * Math.PI * 3.5 + offset;
      const radius = frac * W * 0.35;
      const spread = (rand() - 0.5) * W * 0.06 * frac;
      const x = cx + Math.cos(angle) * radius * 1.0 + spread;
      const y = cy + Math.sin(angle) * radius * 0.42 + spread * 0.4;
      const alpha = (1 - frac) * 0.35 * (rand() * 0.6 + 0.4);
      const r = rand() * 1.5 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,180,255,${alpha})`;
      ctx.fill();
    }
  }

  // Center bulge
  const bulge = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
  bulge.addColorStop(0, 'rgba(255,230,150,0.9)');
  bulge.addColorStop(0.5,'rgba(255,180,80,0.5)');
  bulge.addColorStop(1,  'transparent');
  ctx.beginPath();
  ctx.arc(cx, cy, 40, 0, Math.PI * 2);
  ctx.fillStyle = bulge;
  ctx.fill();

  // Objects
  level.objects.filter(o => o.type !== 'label').forEach((obj) => {
    const ox = obj.x * W, oy = obj.y * H;
    if (obj.glow) {
      const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, obj.r * 3);
      g.addColorStop(0, obj.glow);
      g.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(ox, oy, obj.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }
    if (obj.type === 'sun') {
      // Arrow pointing to sun
      ctx.beginPath();
      ctx.arc(ox, oy, obj.r, 0, Math.PI * 2);
      ctx.fillStyle = obj.color;
      ctx.fill();
      ctx.font = "10px 'IBM Plex Mono', monospace";
      ctx.fillStyle = 'rgba(255,230,100,0.9)';
      ctx.textAlign = 'left';
      ctx.fillText('← You are here', ox + 8, oy + 4);
    }
  });
}

function drawLocalGroupLevel(ctx, W, H, level, t) {
  const rand = seededRand(99);
  drawStarField(ctx, W, H, rand, 200, 0.3);

  // Dwarf galaxies (faint scattered blobs)
  const dwarfRand = seededRand(55);
  for (let i = 0; i < 18; i++) {
    const x = dwarfRand() * W;
    const y = dwarfRand() * H;
    const r = dwarfRand() * 5 + 3;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
    g.addColorStop(0, 'rgba(180,180,220,0.15)');
    g.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(x, y, r * 3, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }

  level.objects.forEach((obj) => {
    const ox = obj.x * W, oy = obj.y * H;
    const tilt = (obj.tilt || 0) * Math.PI / 180;

    // Galaxy glow
    if (obj.glow) {
      const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, obj.r * 4);
      g.addColorStop(0, obj.glow);
      g.addColorStop(1, 'transparent');
      ctx.save();
      ctx.translate(ox, oy);
      ctx.rotate(tilt);
      ctx.scale(1, 0.4);
      ctx.beginPath();
      ctx.arc(0, 0, obj.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    }

    // Galaxy disk
    ctx.save();
    ctx.translate(ox, oy);
    ctx.rotate(tilt);
    ctx.scale(1, 0.38);
    const diskG = ctx.createRadialGradient(0, 0, 0, 0, 0, obj.r);
    diskG.addColorStop(0, obj.color);
    diskG.addColorStop(0.4, obj.color + 'aa');
    diskG.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(0, 0, obj.r, 0, Math.PI * 2);
    ctx.fillStyle = diskG;
    ctx.fill();
    ctx.restore();

    // Hubble callout for Andromeda
    if (obj.hubble) {
      ctx.save();
      ctx.strokeStyle = 'rgba(154,180,216,0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(ox + obj.r + 5, oy);
      ctx.lineTo(ox + obj.r + 55, oy - 18);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      ctx.font = "bold 9px 'IBM Plex Mono', monospace";
      ctx.fillStyle = 'rgba(154,180,216,0.85)';
      ctx.textAlign = 'left';
      ctx.fillText('Hubble proved this', ox + obj.r + 57, oy - 22);
      ctx.fillText('is a galaxy · 1923', ox + obj.r + 57, oy - 11);
    }

    ctx.font = "10px 'IBM Plex Mono', monospace";
    ctx.fillStyle = 'rgba(200,190,170,0.8)';
    ctx.textAlign = 'center';
    ctx.fillText(obj.label, ox, oy + obj.r * 0.4 + 18);
  });
}

function drawCosmicWebLevel(ctx, W, H, t) {
  const rand = seededRand(13);

  // Generate filament nodes
  const nodes = [];
  for (let i = 0; i < 60; i++) {
    nodes.push({ x: rand() * W, y: rand() * H, r: rand() * 4 + 1 });
  }

  // Void circles (dark patches)
  const voidRand = seededRand(77);
  for (let i = 0; i < 8; i++) {
    const vx = voidRand() * W;
    const vy = voidRand() * H;
    const vr = voidRand() * 80 + 40;
    const vg = ctx.createRadialGradient(vx, vy, 0, vx, vy, vr);
    vg.addColorStop(0, 'rgba(0,0,0,0.5)');
    vg.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(vx, vy, vr, 0, Math.PI * 2);
    ctx.fillStyle = vg;
    ctx.fill();
  }

  // Filaments (lines between nearby nodes)
  nodes.forEach((a, i) => {
    nodes.forEach((b, j) => {
      if (j <= i) return;
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        const alpha = (1 - dist / 140) * 0.25;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(180,190,255,${alpha})`;
        ctx.lineWidth = (1 - dist / 140) * 1.5;
        ctx.stroke();
      }
    });
  });

  // Galaxy cluster dots at nodes
  nodes.forEach((n) => {
    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
    g.addColorStop(0, 'rgba(220,210,255,0.4)');
    g.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(220,215,255,0.7)';
    ctx.fill();
  });

  // Label our location
  ctx.font = "bold 9px 'IBM Plex Mono', monospace";
  ctx.fillStyle = 'rgba(255,220,100,0.8)';
  ctx.textAlign = 'center';
  ctx.fillText('◆ Local Group (us)', W * 0.52, H * 0.55);

  // Annotations
  ctx.font = "9px 'IBM Plex Mono', monospace";
  ctx.fillStyle = 'rgba(154,180,216,0.5)';
  ctx.fillText('Filament', W * 0.2, H * 0.22);
  ctx.fillText('Void', W * 0.75, H * 0.65);
  ctx.fillText('Galaxy cluster', W * 0.78, H * 0.28);
}

// ── Main Component ────────────────────────────────────────
export default function ObservableUniverse() {
  const canvasRef  = useRef(null);
  const animRef    = useRef(null);
  const tRef       = useRef(0);
  const [levelIdx, setLevelIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const levelIdxRef = useRef(0);

  const goTo = useCallback((idx) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setLevelIdx(idx);
      levelIdxRef.current = idx;
      setTransitioning(false);
    }, 350);
  }, [transitioning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function resize() {
      const parent = canvas.parentElement;
      canvas.width  = parent.clientWidth;
      canvas.height = Math.min(420, parent.clientWidth * 0.62);
    }
    resize();
    window.addEventListener('resize', resize);

    function render() {
      const W = canvas.width, H = canvas.height;
      const idx = levelIdxRef.current;
      const level = LEVELS[idx];

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#07080f';
      ctx.fillRect(0, 0, W, H);

      tRef.current += 0.008;
      const t = tRef.current;

      if (level.id === 'solar')      drawSolarLevel(ctx, W, H, level, t);
      else if (level.id === 'nearby')     drawNearbyLevel(ctx, W, H, level);
      else if (level.id === 'milkyway')   drawMilkyWayLevel(ctx, W, H, level, t);
      else if (level.id === 'localgroup') drawLocalGroupLevel(ctx, W, H, level, t);
      else if (level.id === 'cosmicweb')  drawCosmicWebLevel(ctx, W, H, t);

      animRef.current = requestAnimationFrame(render);
    }

    animRef.current = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const level = LEVELS[levelIdx];

  return (
    <section className="universe-section">
      <div className="container">
        <p className="section-label">05 — Scale</p>
        <h2>Where <em>Andromeda</em> sits in the grand scheme</h2>
        <p className="universe-intro">
          Zoom outward from our solar system to the cosmic web — the largest
          structure in existence. Each step multiplies the scale by roughly
          1,000. Andromeda, which once seemed like a nearby cloud, reveals
          itself as just one neighbour in an incomprehensibly vast universe.
        </p>
      </div>

      {/* ── full-bleed canvas area ── */}
      <div className="universe-stage">

        {/* zoom level nav */}
        <div className="zoom-nav">
          {LEVELS.map((l, i) => (
            <button
              key={l.id}
              className={`zoom-btn${levelIdx === i ? ' zoom-btn--active' : ''}`}
              onClick={() => goTo(i)}
            >
              <span className="zoom-btn__dot" />
              <span className="zoom-btn__label">{l.label}</span>
            </button>
          ))}
        </div>

        {/* canvas */}
        <div className={`canvas-wrap${transitioning ? ' canvas-wrap--fade' : ''}`}>
          <canvas ref={canvasRef} className="universe-canvas" />
        </div>

        {/* info panel */}
        <div className={`universe-info${transitioning ? ' universe-info--fade' : ''}`}>
          <div className="universe-info__left">
            <div className="universe-info__level">{levelIdx + 1} / {LEVELS.length}</div>
            <div className="universe-info__title">{level.label}</div>
            <div className="universe-info__desc">{level.description}</div>
          </div>
          <div className="universe-info__right">
            <div className="universe-info__scale-label">Scale</div>
            <div className="universe-info__scale">{level.scaleText}</div>
            <div className="universe-info__range">{level.range}</div>
          </div>
        </div>

        {/* prev / next */}
        <div className="universe-arrows">
          <button
            className="arrow-btn"
            onClick={() => goTo(Math.max(0, levelIdx - 1))}
            disabled={levelIdx === 0}
          >← Zoom in</button>
          <div className="arrow-dots">
            {LEVELS.map((_, i) => (
              <span
                key={i}
                className={`arrow-dot${levelIdx === i ? ' arrow-dot--active' : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <button
            className="arrow-btn"
            onClick={() => goTo(Math.min(LEVELS.length - 1, levelIdx + 1))}
            disabled={levelIdx === LEVELS.length - 1}
          >Zoom out →</button>
        </div>

      </div>

      {/* closing text */}
      <div className="container">
        <div className="universe-coda">
          <p>
            Before 1923, astronomers believed the Milky Way <em>was</em> the universe.
            Hubble's Cepheid measurement didn't just move Andromeda — it displaced
            humanity from the centre of everything, for the second time.
          </p>
          <p>
            The cosmic web you see at the largest scale contains an estimated{' '}
            <strong>2 trillion galaxies</strong>. Each one a Milky Way. Each one,
            potentially, full of stars with planets — measured, someday, by methods
            that begin with a blinking star and a simple equation.
          </p>
        </div>
      </div>
    </section>
  );
}