import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { LanguageProvider } from './i18n/LanguageContext';
import { useGitHubData } from './hooks/useGitHubData';
import StarfieldCanvas from './components/StarfieldCanvas';
import Navbar from './components/Navbar';
import OrbitalIndexRail from './components/OrbitalIndexRail';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import TelemetryDashboard from './components/TelemetryDashboard';
import TrajectorySection from './components/TrajectorySection';
import ContactSection from './components/ContactSection';

const SECTION_IDS = ['hero', 'about', 'projects', 'telemetry', 'trajectory', 'contact'];

function PortfolioShell() {
  const { data, loading, refreshing, refresh, fetchRepoReadme } = useGitHubData();
  const [activeSection, setActiveSection] = useState('hero');

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 160, damping: 28 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-38% 0px -48% 0px' }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#040407] text-[#F6F6FA]">
      <motion.div
        style={{ scaleX: smoothProgress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-white via-amethyst-400 to-amethyst-600 shadow-[0_0_12px_#A855F7]"
      />

      <StarfieldCanvas speed={1} glowIntensity={1} showConstellations />

      <Navbar activeSection={activeSection} />
      <OrbitalIndexRail activeSection={activeSection} />

      <main className="relative z-10">
        <HeroSection />
        <AboutSection
          readme={data?.readme}
          onRefresh={refresh}
          refreshing={refreshing}
        />
        <ProjectsSection
          repos={data?.repos || []}
          loading={loading}
          fetchRepoReadme={fetchRepoReadme}
        />
        <TelemetryDashboard
          telemetry={data?.telemetry}
          meta={data?.meta}
          onRefresh={refresh}
          refreshing={refreshing}
        />
        <TrajectorySection />
        <ContactSection />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <PortfolioShell />
    </LanguageProvider>
  );
}
