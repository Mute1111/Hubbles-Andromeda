export default function Hero() {
  return (
    <section className="hero">

      {/* real Andromeda photo — NASA/ESA Hubble, public domain */}
      <div className="hero__bg" />

      {/* dark gradient overlay so text stays readable */}
      <div className="hero__overlay" />

      {/* content */}
      <div className="hero__content">
        <p className="hero-eyebrow">
          Edwin Hubble · 1923 · Mount Wilson Observatory
        </p>

        <h1 className="hero-title">
          How we learned that
          <br />
          <em>Andromeda</em>
          <br />
          was never ours
        </h1>

        <div className="hero-scroll">
          <span>Scroll to explore</span>
          <div className="scroll-line" />
        </div>
      </div>

      {/* photo credit — required by NASA/ESA usage */}
      <div className="hero__credit">
     Image Credit:   NASA, ESA, Benjamin F. Williams (UWashington),
     Zhuo Chen (UWashington), L. Clifton Johnson (Northwestern); 
     Image Processing: Joseph DePasquale (STScI)
      </div>

    </section>
  );
}