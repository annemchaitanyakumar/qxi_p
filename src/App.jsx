import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import Hero from './components/Hero';
import IntelligenceGrid from './components/IntelligenceGrid';
import Marquee from './components/Marquee';
import InteractiveGrid from './components/InteractiveGrid';
import CustomCursor from './components/CustomCursor';
import HUDOverlay from './components/HUDOverlay';

import Philosophy from './components/Philosophy';
import SelectedWork from './components/SelectedWork';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    }
  }, [isLoading]);

  return (
    <div className="app-container">
      {/* Visual Overlays */}
      <div className="noise-overlay"></div>
      <div className="scanline-overlay"></div>

      <CustomCursor />

      <div style={{
        opacity: isLoading ? 0 : 1,
        transition: 'opacity 2s ease-in-out',
        pointerEvents: isLoading ? 'none' : 'auto'
      }}>
        <HUDOverlay />
        <InteractiveGrid />
      </div>

      {/* Sections */}
      <main>
        <Hero isLoading={isLoading} onLoadingComplete={() => setIsLoading(false)} />

        <div style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 2s ease-in-out',
          pointerEvents: isLoading ? 'none' : 'auto'
        }}>
          <Marquee text="GET IN TOUCH" />
          <IntelligenceGrid />
          <Philosophy />
          <Marquee text="SYSTEM STATUS ACTIVE" reverse={true} />
          <SelectedWork />
          <Contact />
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default App;
