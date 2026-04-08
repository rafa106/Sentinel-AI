import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ThreatScanner from './components/ThreatScanner';
import SecurityAudit from './components/SecurityAudit';
import LiveFeed from './components/LiveFeed';
import Vault from './components/Vault';
import Pricing from './components/Pricing';
import Endpoints from './components/Endpoints';
import Organization from './components/Organization';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPlan, setCurrentPlan] = useState('free');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'scanner':
        return <ThreatScanner />;
      case 'audit':
        return <SecurityAudit />;
      case 'live':
        return <LiveFeed />;
      case 'endpoints':
        return <Endpoints />;
      case 'org':
        return <Organization />;
      case 'vault':
        return <Vault />;
      case 'pricing':
        return <Pricing currentPlan={currentPlan} onUpgrade={setCurrentPlan} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-security-bg overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentPlan={currentPlan} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-security-card border-b border-security-border sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-security-accent/10 rounded flex items-center justify-center border border-security-accent/30">
              <Menu className="text-security-accent w-5 h-5" onClick={() => setIsSidebarOpen(true)} />
            </div>
            <span className="font-bold text-white text-sm tracking-tight">SENTINEL AI</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-security-success uppercase">Online</span>
            <div className="w-2 h-2 rounded-full bg-security-success animate-pulse" />
          </div>
        </header>

        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full min-h-full relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global Scanline Effect */}
        <div className="scanline pointer-events-none" />
      </main>
    </div>
  );
}

