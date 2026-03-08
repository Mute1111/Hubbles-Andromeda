export default function ProblemSection() {
  return (
    <section className="intro-section">
      <div className="container">
        <p className="section-label">01 — The Problem</p>

        <h2>
          A universe that stopped
          <br />
          <em>at the Milky Way</em>
        </h2>

        <p>
          For centuries, astronomers gazed at faint, fuzzy smudges scattered
          across the night sky and called them <em>nebulae</em> — clouds of gas
          and dust drifting within our own galaxy. The Milky Way, it was assumed,
          was the whole of creation. The universe had edges, and we lived near
          its centre.
        </p>

        <p>
          But a nagging question refused to die: what if those spiraling smudges
          were not clouds at all, but entire <em>island universes</em> — galaxies
          in their own right, separated from us by distances so vast they made
          the mind reel? This was the heart of the Great Debate of 1920, and no
          one had the tools to settle it.
        </p>

        <p>
          The obstacle was fundamental. You cannot measure the distance to a
          faint light simply by looking at it. A dim star might be nearby and
          intrinsically faint, or it might be blindingly brilliant and
          unimaginably far away. Without knowing the true brightness of an
          object — its <em>absolute luminosity</em> — apparent brightness tells
          you almost nothing.
        </p>

        <div className="pull-quote">
          <p>
            "We need a <em>standard candle</em> — an object whose true brightness
            we already know, so that by comparing it to how bright it{' '}
            <em>appears</em>, we can calculate exactly how far away it must be."
          </p>
          <cite>— The core logic of cosmic distance measurement</cite>
        </div>

        <p>
          The solution came not from a famous observatory director, but from a
          woman cataloguing photographic plates at the Harvard College
          Observatory. And it came in the form of a star that breathes.
        </p>

        <div className="ornament">· · · · ·</div>

        <p className="section-label">The Approach</p>

        <p>
          <strong>Cepheid variable stars</strong> are supergiant stars that
          rhythmically expand and contract, brightening and dimming over periods
          of days to months. In 1908, Henrietta Swan Leavitt discovered something
          extraordinary: the <em>longer</em> a Cepheid's pulsation period, the{' '}
          <em>brighter</em> it truly is. Period and luminosity are locked together
          by physics.
        </p>

        <p>
          This meant that by simply watching a Cepheid blink — timing its cycle —
          you could know its absolute brightness. And if you know how bright
          something truly is, and you can measure how bright it <em>appears</em>,
          the distance falls directly out of the math. A cosmic ruler, built from
          starlight.
        </p>

        <p>
          Edwin Hubble turned the 100-inch Hooker Telescope — at the time the
          largest telescope in the world — toward the Andromeda Nebula, and
          hunted for Cepheids. When he found them, and ran the numbers, the
          answer was staggering.
        </p>
      </div>
    </section>
  );
}