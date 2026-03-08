import { useState } from 'react';
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

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      <div className={`app-content${loaded ? ' app-content--visible' : ''}`}>
        <SiteNav />
        <Hero />
        <div id="problem">  <ProblemSection />       </div>
        <div id="history">  <HistoryTimeline />      </div>
        <div id="equation"> <EquationSection />      </div>
        <div id="explorer"> <CepheidVisualization /> </div>
        <div id="scale">    <ObservableUniverse />   </div>
        <SiteFooter />
      </div>
    </>
  );
}