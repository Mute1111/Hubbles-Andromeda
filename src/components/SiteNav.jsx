import { useEffect, useState, useRef } from 'react';
import './SiteNav.css';

const SECTIONS = [
  { id: 'problem',  label: 'The Problem'    },
  { id: 'history',  label: 'History'        },
  { id: 'equation', label: 'The Equation'   },
  { id: 'explorer', label: 'Try It Yourself' },
  { id: 'scale',    label: 'Scale'          },
];

export default function SiteNav() {
  const [scrolled,    setScrolled]    = useState(false);
  const [active,      setActive]      = useState('');
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navLinksRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const scrollY   = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      setScrolled(scrollY > 60);
      setProgress(docHeight > 0 ? (scrollY / docHeight) * 100 : 0);

      let current = '';
      let currentIdx = -1;
      SECTIONS.forEach(({ id }, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          current    = id;
          currentIdx = i;
        }
      });
      setActive(current);
      setActiveIndex(currentIdx);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <header className={[
      'site-nav',
      scrolled  ? 'site-nav--scrolled' : '',
      menuOpen  ? 'site-nav--open'     : '',
    ].filter(Boolean).join(' ')}>

      {/* ── scroll progress bar ── */}
      <div className="site-nav__progress">
        <div className="site-nav__progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="site-nav__inner">

        {/* wordmark */}
        <button
          className="site-nav__wordmark"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="site-nav__wordmark-title">Measuring the Universe</span>
          <span className="site-nav__wordmark-sub">
            Hubble · Cepheids · 1923 &nbsp;·&nbsp; Almgdad Z Hassan
          </span>
        </button>

        {/* desktop links */}
        <nav className="site-nav__links" ref={navLinksRef}>
          {SECTIONS.map(({ id, label }, i) => (
            <button
              key={id}
              className={`site-nav__link${active === id ? ' site-nav__link--active' : ''}`}
              onClick={() => scrollTo(id)}
            >
              {label}
              {active === id && <span className="site-nav__link-underline" />}
            </button>
          ))}
        </nav>

        {/* hamburger → X */}
        <button
          className={`site-nav__burger${menuOpen ? ' site-nav__burger--open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* mobile dropdown */}
      <div className={`site-nav__mobile${menuOpen ? ' site-nav__mobile--open' : ''}`}>
        {SECTIONS.map(({ id, label }, i) => (
          <button
            key={id}
            className={`site-nav__mobile-link${active === id ? ' site-nav__mobile-link--active' : ''}`}
            onClick={() => scrollTo(id)}
            style={{ transitionDelay: menuOpen ? `${i * 0.04}s` : '0s' }}
          >
            <span className="mobile-link__num">{String(i + 1).padStart(2, '0')}</span>
            {label}
          </button>
        ))}
      </div>

    </header>
  );
}