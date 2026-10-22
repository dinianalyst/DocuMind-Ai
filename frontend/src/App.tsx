import React, { useState } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { AppView } from './types';

export function App() {
  const [view, setView] = useState<AppView>('landing');

  if (view === 'app') {
    return <DashboardLayout onReturnToLanding={() => setView('landing')} />;
  }

  return <LandingPage onEnterApp={() => setView('app')} />;
}

export default App;
