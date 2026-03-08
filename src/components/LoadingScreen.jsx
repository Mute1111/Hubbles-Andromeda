import { useEffect, useRef, useState } from 'react';
import './LoadingScreen.css';

const SEQUENCE = [
  { delay: 300,  text: 'Locating Cepheid variable in M31...',         dim: true  },
  { delay: 1100, text: 'P = 31.415 days',                             dim: false },
  { delay: 1900, text: 'Applying Leavitt\'s Period–Luminosity Law...', dim: true  },
  { delay: 2700, text: 'M = −5.64',                                   dim: false },
  { delay: 3500, text: 'Measuring apparent magnitude...',             dim: true  },
  { delay: 4300, text: 'm = 18.7',                                    dim: false },
  { delay: 5100, text: 'Solving distance modulus...',                 dim: true  },
  { delay: 5900, text: 'd = 737,000 pc',                              dim: false },
];

export default function LoadingScreen({ onDone }) {
  const canvasRef  = useRef(null);
  const animRef    = useRef(null);
  const phaseRef   = useRef(0);
  const [lines,    setLines]    = useState([]);
  const [reveal,   setReveal]   = useState(false);
  const [exiting,  setExiting]  = useState(false);

  // ── canvas pulsing star ──────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const W = canvas.width = 140;
    const H = canvas.height = 140;
    const cx = W / 2, cy = H / 2;

    // static bg stars
    const bgStars = Array.from({ length: 40 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 0.9 + 0.2,
      o: Math.random() * 0.5 + 0.2,
    }));

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#04050c';
      ctx.fillRect(0, 0, W, H);

      bgStars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.o})`;
        ctx.fill();
      });

      const pulse = (Math.sin(phaseRef.current * Math.PI * 2) + 1) / 2;
      const r     = 14 + pulse * 18;

      // glow layers
      [[r * 4.5, 0.04], [r * 3, 0.08], [r * 2, 0.14], [r * 1.4, 0.22]].forEach(([gr, go]) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, gr);
        g.addColorStop(0, `rgba(255,220,140,${go})`);
        g.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(cx, cy, gr, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      // core
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      core.addColorStop(0,   'rgba(255,255,220,1)');
      core.addColorStop(0.4, 'rgba(255,220,120,1)');
      core.addColorStop(1,   'rgba(200,120,20,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = core;
      ctx.fill();

      phaseRef.current = (phaseRef.current + 0.008) % 1;
      animRef.current  = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // ── sequence timer ───────────────────────────────────────
  useEffect(() => {
    const timers = [];

    SEQUENCE.forEach(({ delay, text, dim }) => {
      timers.push(setTimeout(() => {
        setLines(prev => [...prev, { text, dim }]);
      }, delay));
    });

    // reveal the final result
    timers.push(setTimeout(() => setReveal(true), 6800));

    // exit
    timers.push(setTimeout(() => {
      setExiting(true);
      setTimeout(onDone, 800);
    }, 8400));

    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className={`loading-screen${exiting ? ' loading-screen--exit' : ''}`}>

      {/* star canvas */}
      <canvas ref={canvasRef} className="loading-screen__star" />

      {/* terminal lines */}
      <div className="loading-screen__terminal">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`loading-screen__line${line.dim ? ' loading-screen__line--dim' : ' loading-screen__line--value'}`}
            style={{ animationDelay: '0s' }}
          >
            {!line.dim && <span className="loading-screen__prompt">›</span>}
            {line.text}
          </div>
        ))}
      </div>

      {/* final result */}
      <div className={`loading-screen__result${reveal ? ' loading-screen__result--visible' : ''}`}>
        <div className="loading-screen__result-label">Distance to Andromeda</div>
        <div className="loading-screen__result-number">2.537 million</div>
        <div className="loading-screen__result-unit">light-years</div>
      </div>

    </div>
  );
}