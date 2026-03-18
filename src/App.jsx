import { useState, useEffect } from 'react';
import './index.css';
import LoadingScreen from './components/LoadingScreen';
import SiteNav from './components/SiteNav';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import HistoryTimeline from './components/HistoryTimeline';
import EquationSection from './components/EquationSection';
import CepheidVisualization from './components/CepheidVisualization';
import ObservableUniverse from './components/ObservableUniverse';
import SiteFooter from './components/SiteFooter';

const SECTIONS = [
  { id: 'problem',  Component: ProblemSection       },
  { id: 'history',  Component: HistoryTimeline       },
  { id: 'equation', Component: EquationSection       },
  { id: 'explorer', Component: CepheidVisualization  },
  { id: 'scale',    Component: ObservableUniverse    },
];

export default function App() {
  const [loaded, setLoaded] = useState(false);

  /* Prevent body scroll while loading screen is visible */
  useEffect(() => {
    document.body.style.overflow = loaded ? '' : 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [loaded]);

  return (
    <>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      <div className={`app-content${loaded ? ' app-content--visible' : ''}`}>
        <SiteNav />

        <main id="main-content">
          <Hero />

          {SECTIONS.map(({ id, Component }) => (
            <section key={id} id={id} className="page-section">
              <Component />
            </section>
          ))}
        </main>

        <SiteFooter />
      </div>
    </>
  );
}