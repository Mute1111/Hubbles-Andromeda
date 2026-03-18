import { useEffect, useRef, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './EquationSection.css';

// ── helpers ──────────────────────────────────────────────
function Tex({ block = false, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(children, ref.current, {
        throwOnError: false,
        displayMode: block,
      });
    }
  }, [children, block]);
  return <span ref={ref} />;
}

// ── worked-example steps ─────────────────────────────────
const STEPS = [
  {
    label: 'Step 1 — Measure the period',
    summary:
      'Hubble observed the Cepheid in Andromeda across multiple photographic plates, tracking its brightness over weeks to time its full pulsation cycle.',
    value: 'P = 31.415 \\text{ days}',
    note: 'The longer the period, the more luminous the star. This one is slow-pulsing — which means it must be intrinsically very bright.',
  },
  {
    label: 'Step 2 — Calculate absolute magnitude',
    summary: "Apply Leavitt's Period–Luminosity relation, as calibrated by Hertzsprung in 1913:",
    formula: 'M = -2.81 \\log_{10}(P) - 1.43',
    value:
      'M = -2.81 \\times \\log_{10}(31.415) - 1.43 = -2.81 \\times 1.497 - 1.43 \\approx -5.64',
    note: 'M = −5.64 means this star is roughly 16,000× more luminous than our Sun. Now we know its true brightness.',
  },
  {
    label: 'Step 3 — Measure apparent magnitude',
    summary:
      'Hubble measured how bright the star actually appeared through the telescope — its apparent magnitude m. This is what any observer on Earth would see.',
    value: 'm = 18.7',
    note: 'This is extremely faint. On the magnitude scale, larger numbers mean dimmer — our Sun has an apparent magnitude of −26.7, and the faintest stars visible to the naked eye are around +6.',
  },
  {
    label: 'Step 4 — Apply the Distance Modulus',
    summary:
      'The distance modulus links apparent brightness, true brightness, and distance in a single equation:',
    formula: 'm - M = 5 \\log_{10}(d) - 5',
    value: '18.7 - (-5.64) = 5 \\log_{10}(d) - 5',
    note: 'The left side equals 24.34 — called the distance modulus μ. Rearranging for d gives the distance in parsecs.',
  },
  {
    label: 'Step 5 — Solve for distance',
    summary: 'Isolate d by rearranging the distance modulus:',
    formula: 'd = 10^{\\,\\frac{\\mu + 5}{5}}',
    value:
      'd = 10^{\\,\\frac{24.34 + 5}{5}} = 10^{\\,5.868} \\approx 737{,}000 \\text{ pc} \\approx 2.4 \\text{ million light-years}',
    note: "Hubble's 1923 estimate was ~900,000 light-years — close, but his calibration data underestimated Cepheid luminosities. Modern measurements place Andromeda at 2.537 million light-years. Either way: it is emphatically not inside our galaxy.",
  },
];

// ── component ─────────────────────────────────────────────
export default function EquationSection() {
  const [visibleSteps, setVisibleSteps] = useState(new Set());
  const stepRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number(e.target.dataset.idx);
            setVisibleSteps((prev) => new Set([...prev, idx]));
          }
        });
      },
      { threshold: 0.15 }
    );

    stepRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="equation-section">
      <div className="container">

        {/* ── header ── */}
        <p className="section-label">03 — The Equation</p>
        <h2>Two formulas that <em>measured</em> the cosmos</h2>
        <p>
          Hubble's proof rested on two elegant relationships — one discovered
          by a woman cataloguing stars for 25 cents an hour, the other a
          direct consequence of how light fades across space.
        </p>

        {/* ── formula cards ── */}
        <div className="formula-cards">

          <div className="formula-card">
            <div className="formula-card__eyebrow">Leavitt's Law · 1908</div>
            <div className="formula-card__title">Period–Luminosity Relation</div>
            <div className="formula-card__eq">
              <Tex block>{'M = -2.81 \\log_{10}(P) - 1.43'}</Tex>
            </div>
            <dl className="formula-card__legend">
              <div><dt><Tex>{'M'}</Tex></dt><dd>Absolute magnitude — the star's true brightness</dd></div>
              <div><dt><Tex>{'P'}</Tex></dt><dd>Pulsation period in days</dd></div>
            </dl>
            <p className="formula-card__prose">
              The longer a Cepheid takes to complete one pulse, the more
              luminous it truly is. Period is something you can <em>observe</em>;
              luminosity is what you need to know. This formula bridges the two.
            </p>
          </div>

          <div className="formula-card formula-card--alt">
            <div className="formula-card__eyebrow">Distance Modulus</div>
            <div className="formula-card__title">Apparent vs. Absolute Magnitude</div>
            <div className="formula-card__eq">
              <Tex block>{'m - M = 5\\log_{10}(d) - 5'}</Tex>
            </div>
            <dl className="formula-card__legend">
              <div><dt><Tex>{'m'}</Tex></dt><dd>Apparent magnitude — how bright it looks from Earth</dd></div>
              <div><dt><Tex>{'M'}</Tex></dt><dd>Absolute magnitude — its true brightness</dd></div>
              <div><dt><Tex>{'d'}</Tex></dt><dd>Distance in parsecs &nbsp;(1 pc ≈ 3.26 light-years)</dd></div>
            </dl>
            <p className="formula-card__prose">
              Light obeys the inverse-square law — double the distance and it
              appears four times dimmer. This formula encodes that relationship
              on a logarithmic scale, letting you solve directly for{' '}
              <Tex>{'d'}</Tex>.
            </p>
          </div>

        </div>

        {/* ── worked example ── */}
        <div className="worked-header">
          <p className="section-label">Worked Example</p>
          <h3>Hubble's calculation, <em>step by step</em></h3>
          <p>
            On the night of October 5–6, 1923, Hubble identified a Cepheid
            variable — later designated V1 — in the outer spiral arm of the
            Andromeda Nebula. Here is exactly how he turned a blinking star
            into a distance measurement that rewrote our understanding of
            the universe.
          </p>
        </div>

        <div className="steps">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`step${visibleSteps.has(i) ? ' step--visible' : ''}`}
              data-idx={i}
              ref={(el) => (stepRefs.current[i] = el)}
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              <div className="step__number">{String(i + 1).padStart(2, '0')}</div>

              {/*
                step__body is the KEY addition.
                As a grid child with min-width:0 and overflow:hidden,
                it forms a proper containing block for KaTeX's wide equations.
                Without it, KaTeX renders into the grid's implicit track and
                blows the layout on any screen narrower than the equation.
              */}
              <div className="step__body">
                <div className="step__label">{step.label}</div>
                <p className="step__summary">{step.summary}</p>

                {step.formula && (
                  <div className="step__formula">
                    <Tex block>{step.formula}</Tex>
                  </div>
                )}

                <div className="step__value">
                  <Tex block>{step.value}</Tex>
                </div>

                <div className="step__note">
                  <span className="step__note-icon">→</span>
                  <span>{step.note}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── result callout ── */}
        <div className="result-callout">
          <div className="result-callout__label">The Answer</div>
          <div className="result-callout__number">2.4 million</div>
          <div className="result-callout__unit">light-years</div>
          <p className="result-callout__prose">
            Andromeda is not a cloud of gas in our galaxy. It is an entire
            galaxy — containing perhaps a trillion stars — separated from us
            by a gulf so immense that the light reaching your eye tonight
            left before <em>Homo sapiens walked the Earth</em>.
          </p>
          <div className="result-callout__sub">
            Modern value: 2,537,000 light-years &nbsp;·&nbsp; Hubble's 1923 estimate: ~900,000 ly
          </div>
        </div>

      </div>
    </section>
  );
}