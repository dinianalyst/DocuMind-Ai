import React from 'react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { TrustTechStrip } from './TrustTechStrip';
import { FeaturesSection } from './FeaturesSection';
import { HowItWorksSection } from './HowItWorksSection';
import { RagArchitectureSection } from './RagArchitectureSection';
import { InteractiveDemoSection } from './InteractiveDemoSection';
import { TechStackSection } from './TechStackSection';
import { CtaSection } from './CtaSection';
import { Footer } from './Footer';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-background-darkest text-slate-100 flex flex-col">
      <Navbar onEnterApp={onEnterApp} />
      <main className="flex-grow">
        <HeroSection onStartChatting={onEnterApp} />
        <TrustTechStrip />
        <FeaturesSection />
        <HowItWorksSection />
        <RagArchitectureSection />
        <InteractiveDemoSection onEnterApp={onEnterApp} />
        <TechStackSection />
        <CtaSection onEnterApp={onEnterApp} />
      </main>
      <Footer />
    </div>
  );
};
