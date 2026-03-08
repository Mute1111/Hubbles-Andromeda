import { useEffect } from 'react';

const EVENTS = [
  {
    year: '1784',
    person: 'John Goodricke',
    title: 'The First Cepheid',
    body: `John Goodricke — an English amateur astronomer who became deaf in early
      childhood after a severe illness — discovers that Delta Cephei varies in
      brightness with a precise period of 5.37 days. He had already won the
      Copley Medal the previous year for his work on Algol. He is elected a
      Fellow of the Royal Society in April 1786, and dies four days later, aged
      21. The entire class of pulsating stars he identified would bear the name
      of his discovery: Cepheids.`,
  },
  {
    year: '1908',
    person: 'Henrietta Swan Leavitt',
    title: 'The Period–Luminosity Relation',
    body: `Working as a "computer" at the Harvard College Observatory — paid
      25 cents an hour to catalogue stellar brightness from photographic plates —
      Leavitt studies Cepheid variables in the Small Magellanic Cloud. Because
      all these stars lie at roughly the same distance from Earth, differences
      in their apparent brightness directly reflect differences in true
      luminosity. Her finding: brighter Cepheids pulse more slowly — a precise,
      reliable relationship between period and absolute magnitude.`,
  },
  {
    year: '1913',
    person: 'Ejnar Hertzsprung',
    title: 'Calibrating the Ruler',
    body: `Danish astronomer Ejnar Hertzsprung calibrates Leavitt's relationship
      by measuring distances to 13 nearby Cepheids using statistical parallax.
      Now the period doesn't just indicate relative brightness — it reveals
      absolute luminosity in real physical units. The ruler has tick marks.
      (His initial distance estimate contained an error of a factor of ten,
      later corrected — but the method itself was sound and transformative.)`,
  },
  {
    year: '1920',
    person: 'Shapley vs. Curtis',
    title: 'The Great Debate',
    body: `At the U.S. National Museum in Washington D.C. — now the Smithsonian
      Museum of Natural History — Harlow Shapley and Heber Curtis publicly
      debate whether the "spiral nebulae" lie within our galaxy or far beyond
      it. Shapley argues the Milky Way is everything; Curtis contends the
      nebulae are external galaxies. Neither side can prove their case. The
      universe holds its answer for three more years.`,
  },
  {
    year: '1923',
    person: 'Edwin Hubble',
    title: 'A Cepheid in Andromeda',
    body: `On the night of October 5–6, using the 100-inch Hooker telescope at
      Mount Wilson, Edwin Hubble photographs the outer regions of the Andromeda
      Nebula. He recognises a periodic variation in a faint point of light,
      crosses out his initial notation, and writes in red pencil: VAR! " a Variable star " 
      A Cepheid. He measures its period at ~31 days and calculates the 
      distance: roughly 900,000 light-years Andromeda is no nebula — it is a 
      galaxy far beyond our own.... 
      "While the 900.000 light-year distance was significant underestimation 
      (the error was due to a miscalibration of the Cepheid period-luminosity relation), 
      the discovery that the Andromeda Nebula was an extragalactic object was 
      correct and revolutionary."`,
  },
];

export default function HistoryTimeline() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.timeline-item').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="history-section">
      <div className="container">
        <p className="section-label">02 — The History</p>

        <h2>
          The people who <em>cracked</em> open the cosmos
        </h2>

        <p>
          The discovery that Andromeda lay far beyond our galaxy was not a
          single flash of genius — it was a relay race across decades, passed
          between astronomers who built on each other's work across institutions
          and continents.
        </p>

        <div className="timeline">
          {EVENTS.map(({ year, person, title, body }) => (
            <div className="timeline-item" key={year + person}>
              <div className="timeline-year">{year}</div>
              <div className="timeline-content">
                <div className="person-chip">{person}</div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}