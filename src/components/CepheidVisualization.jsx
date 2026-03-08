import { useEffect, useRef, useState, useCallback } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './CepheidVisualization.css';

// ── helpers ───────────────────────────────────────────────
function Tex({ block = false, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(children, ref.current, { throwOnError: false, displayMode: block });
    }
  }, [children, block]);
  return <span ref={ref} />;
}

function formatDistance(pc) {
  const ly = pc * 3.26156;
  if (ly >= 1e6) return `${(ly / 1e6).toFixed(2)} million light-years`;
  if (ly >= 1000) return `${Math.round(ly / 1000).toLocaleString()}k light-years`;
  return `${Math.round(ly).toLocaleString()} light-years`;
}

function getContext(ly) {
  if (ly < 1000)   return 'Still inside our own galaxy.';
  if (ly < 10000)  return 'Deep in the Milky Way — far, but local.';
  if (ly < 100000) return 'Approaching the edge of our galaxy.';
  if (ly < 500000) return 'In the cosmic void between galaxies.';
  if (ly < 1500000) return 'Approaching the Magellanic Clouds — our nearest galactic neighbours.';
  if (ly < 3000000) return "In Andromeda's neighbourhood. Hubble was here.";
  if (ly < 20000000) return 'Within the Local Group of galaxies.';
  return 'Deep in the observable universe.';
}

// ── Pulsing Star Canvas ───────────────────────────────────
function StarCanvas({ period, apparentMag }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const phaseRef  = useRef(0);

  // Map apparent magnitude to a perceived size modifier
  const dimFactor = Math.max(0.15, 1 - (apparentMag - 1) / 25);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    // period in days → animation speed (faster period = faster pulse)
    // We map period [3,100] to frame-increment [0.025, 0.003]
    const speedMin = 0.003;
    const speedMax = 0.025;
    const t = (period - 3) / (100 - 3);
    const speed = speedMax - t * (speedMax - speedMin);

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = '#07080f';
      ctx.fillRect(0, 0, W, H);

      // Background stars
      ctx.save();
      // (painted once via a separate static layer would be ideal,
      //  but for simplicity we use a seeded-looking pattern)
      const bgStars = [
        [30,20,0.8],[80,45,0.5],[120,15,0.7],[160,55,0.4],[200,25,0.6],
        [240,50,0.3],[20,80,0.5],[70,90,0.7],[140,75,0.4],[190,85,0.6],
        [220,70,0.3],[260,88,0.5],[50,110,0.4],[100,100,0.6],[170,105,0.5],
        [230,115,0.4],[280,95,0.7],[15,130,0.3],[85,125,0.5],[155,135,0.6],
        [210,128,0.4],[265,140,0.3],[40,155,0.5],[110,148,0.4],[180,158,0.6],
        [245,150,0.3],[290,162,0.5],[60,175,0.4],[130,168,0.7],[200,178,0.3],
      ];
      bgStars.forEach(([x, y, o]) => {
        ctx.beginPath();
        ctx.arc(x, y, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${o})`;
        ctx.fill();
      });
      ctx.restore();

      // Pulse: smooth sine wave between min and max radius
      const pulse = (Math.sin(phaseRef.current * Math.PI * 2) + 1) / 2; // 0→1
      const baseR  = 28 * dimFactor;
      const peakR  = 44 * dimFactor;
      const r      = baseR + pulse * (peakR - baseR);

      // Outer glow layers
      const glowColors = [
        [r * 4.5, 0.03],
        [r * 3.2, 0.06],
        [r * 2.2, 0.10],
        [r * 1.6, 0.18],
      ];
      glowColors.forEach(([gr, go]) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, gr);
        g.addColorStop(0, `rgba(255, 230, 160, ${go})`);
        g.addColorStop(1, 'rgba(255,200,100,0)');
        ctx.beginPath();
        ctx.arc(cx, cy, gr, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      // Core star
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      coreGrad.addColorStop(0,   'rgba(255, 255, 220, 1)');
      coreGrad.addColorStop(0.3, 'rgba(255, 230, 140, 1)');
      coreGrad.addColorStop(0.7, 'rgba(220, 160,  60, 0.9)');
      coreGrad.addColorStop(1,   'rgba(200, 120,  20, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Period label overlay
      ctx.font = "500 11px 'IBM Plex Mono', monospace";
      ctx.fillStyle = 'rgba(154,180,216,0.5)';
      ctx.textAlign = 'center';
      ctx.fillText(`P = ${period.toFixed(1)} days`, cx, H - 14);

      // Advance phase
      phaseRef.current = (phaseRef.current + speed) % 1;
      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [period, dimFactor]);

  return (
    <canvas
      ref={canvasRef}
      width={310}
      height={200}
      className="star-canvas"
    />
  );
}

// ── Main Component ────────────────────────────────────────
export default function CepheidVisualization() {
  const [period, setPeriod]     = useState(31.4);
  const [appMag, setAppMag]     = useState(18.7);
  const [showHubble, setShowHubble] = useState(false);

  // Derived values
  const absMag  = parseFloat((-2.81 * Math.log10(period) - 1.43).toFixed(3));
  const modulus = parseFloat((appMag - absMag).toFixed(3));
  const distPc  = parseFloat(Math.pow(10, (modulus + 5) / 5).toFixed(0));
  const distLy  = distPc * 3.26156;

  const resetToHubble = () => {
    setPeriod(31.415);
    setAppMag(18.7);
    setShowHubble(true);
    setTimeout(() => setShowHubble(false), 2000);
  };

  return (
    <section className="viz-section">
      <div className="container">
        <p className="section-label">04 — Visualization</p>
        <h2>Try it <em>yourself</em></h2>
        <p className="viz-intro">
          Adjust the period and apparent magnitude below. Watch the star pulse,
          and see the distance fall out of the math in real time — exactly as
          Hubble did, minus the freezing nights at Mount Wilson.
        </p>

        <div className="viz-layout">

          {/* ── LEFT: star + controls ── */}
          <div className="viz-left">
            <StarCanvas period={period} apparentMag={appMag} />

            <div className="controls">

              {/* Period slider */}
              <div className="control-group">
                <div className="control-label">
                  <span>Pulsation Period</span>
                  <span className="control-value">{period.toFixed(1)} days</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="100"
                  step="0.1"
                  value={period}
                  onChange={(e) => setPeriod(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-hints">
                  <span>3 days (dim)</span>
                  <span>100 days (brilliant)</span>
                </div>
              </div>

              {/* Apparent magnitude */}
              <div className="control-group">
                <div className="control-label">
                  <span>Apparent Magnitude</span>
                  <span className="control-value">{appMag.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="0.1"
                  value={appMag}
                  onChange={(e) => setAppMag(parseFloat(e.target.value))}
                  className="slider slider--gold"
                />
                <div className="slider-hints">
                  <span>1 (very bright)</span>
                  <span>25 (very faint)</span>
                </div>
              </div>

              <button className="hubble-btn" onClick={resetToHubble}>
                {showHubble ? '✦ Loaded!' : 'Use Hubble\'s 1923 values'}
              </button>
            </div>
          </div>

          {/* ── RIGHT: live calculation ── */}
          <div className="viz-right">

            <div className="calc-panel">
              <div className="calc-panel__title">Live Calculation</div>

              <div className="calc-row">
                <div className="calc-row__label">Period</div>
                <div className="calc-row__eq">
                  <Tex>{`P = ${period.toFixed(2)} \\text{ days}`}</Tex>
                </div>
              </div>

              <div className="calc-row calc-row--derived">
                <div className="calc-row__label">Absolute Magnitude</div>
                <div className="calc-row__eq">
                  <Tex>{`M = ${absMag}`}</Tex>
                </div>
                <div className="calc-row__formula">
                  <Tex>{`-2.81\\log_{10}(${period.toFixed(2)}) - 1.43`}</Tex>
                </div>
              </div>

              <div className="calc-row">
                <div className="calc-row__label">Apparent Magnitude</div>
                <div className="calc-row__eq">
                  <Tex>{`m = ${appMag.toFixed(1)}`}</Tex>
                </div>
              </div>

              <div className="calc-row calc-row--derived">
                <div className="calc-row__label">Distance Modulus</div>
                <div className="calc-row__eq">
                  <Tex>{`\\mu = ${modulus}`}</Tex>
                </div>
                <div className="calc-row__formula">
                  <Tex>{`m - M = ${appMag.toFixed(1)} - (${absMag})`}</Tex>
                </div>
              </div>

              <div className="calc-divider" />

              <div className="calc-result">
                <div className="calc-result__label">Distance</div>
                <div className="calc-result__value">
                  <Tex block>{`d = 10^{\\frac{${modulus} + 5}{5}} = ${distPc.toLocaleString()} \\text{ pc}`}</Tex>
                </div>
              </div>
            </div>

            {/* Distance meter */}
            <div className="distance-meter">
              <div className="distance-meter__number">
                {formatDistance(distPc)}
              </div>
              <div className="distance-meter__context">
                {getContext(distLy)}
              </div>

              {/* Visual scale bar */}
              <div className="scale-bar-wrap">
                <div className="scale-bar-labels">
                  <span>Nearby star</span>
                  <span>Edge of MW</span>
                  <span>Andromeda</span>
                  <span>Deep universe</span>
                </div>
                <div className="scale-bar">
                  <div
                    className="scale-bar__fill"
                    style={{
                      width: `${Math.min(100, Math.max(1,
                        (Math.log10(distLy) - 1) / (10 - 1) * 100
                      ))}%`
                    }}
                  />
                  <div
                    className="scale-bar__marker scale-bar__marker--andromeda"
                    title="Andromeda (2.537M ly)"
                  />
                </div>
                <div className="scale-bar-ticks">
                  <span>10 ly</span>
                  <span>10k ly</span>
                  <span>10M ly</span>
                  <span>10B ly</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}