import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, LogIn, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import { cn } from './lib/utils';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ThreatScanner from './components/ThreatScanner';
import SecurityAudit from './components/SecurityAudit';
import LiveFeed from './components/LiveFeed';
import Vault from './components/Vault';
import Pricing from './components/Pricing';
import Endpoints from './components/Endpoints';
import Organization from './components/Organization';
import { useAuth } from './components/AuthProvider';

export default function App() {
  const { user, loading, login } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPlan, setCurrentPlan] = useState(() => {
    return localStorage.getItem('sentinel_plan') || 'free';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success')) {
      setNotification({ type: 'success', message: 'Payment successful! Your enterprise node has been activated.' });
      window.history.replaceState({}, '', window.location.pathname);
      setTimeout(() => setNotification(null), 8000);
    }
    if (params.get('canceled')) {
      setNotification({ type: 'error', message: 'Payment process was interrupted. No changes were applied.' });
      window.history.replaceState({}, '', window.location.pathname);
      setTimeout(() => setNotification(null), 5000);
    }
  }, []);

  const handleUpgrade = (plan: string) => {
    setCurrentPlan(plan);
    localStorage.setItem('sentinel_plan', plan);
  };

  if (loading) {
    return (
      <div className="h-screen bg-security-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-security-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-security-accent font-mono text-sm uppercase tracking-widest">Initializing Secure Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen bg-security-bg relative overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
        <div className="scanline" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-security-card border border-security-border p-10 rounded-3xl relative z-10 space-y-8 text-center"
        >
          <div className="w-20 h-20 bg-security-accent/10 rounded-2xl mx-auto flex items-center justify-center border border-security-accent/30">
            <ShieldAlert className="w-10 h-10 text-security-accent animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Access Restricted</h1>
            <p className="text-gray-500 font-mono text-sm uppercase">Secure login required to enter dashboard</p>
          </div>

          <button 
            onClick={() => login()}
            className="w-full py-4 bg-security-accent text-white font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-blue-400 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            <LogIn className="w-5 h-5" />
            Sign in with Google
          </button>

          <p className="text-[10px] text-gray-600 font-mono italic">
            Sentinel AI uses enterprise-grade OAuth v2 protocol for identity verification.
          </p>
        </motion.div>
      </div>
    );
  }

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
        return <Pricing currentPlan={currentPlan} onUpgrade={handleUpgrade} />;
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

        {/* Global Notifications */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 20, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className={cn(
                "fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl border shadow-2xl flex items-center gap-4 min-w-[320px]",
                notification.type === 'success' 
                  ? "bg-security-success/10 border-security-success/30 text-security-success backdrop-blur-xl" 
                  : "bg-security-danger/10 border-security-danger/30 text-security-danger backdrop-blur-xl"
              )}
            >
              {notification.type === 'success' ? (
                <div className="p-2 bg-security-success/20 rounded-full">
                  <CheckCircle className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-2 bg-security-danger/20 rounded-full">
                  <XCircle className="w-5 h-5" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-bold text-sm">{notification.type === 'success' ? 'Operation Success' : 'Operation Failed'}</p>
                <p className="text-xs opacity-80">{notification.message}</p>
              </div>
              <button onClick={() => setNotification(null)} className="p-1 hover:bg-white/10 rounded-lg transition-all">
                <XCircle className="w-4 h-4 opacity-50" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1 relative z-10 flex flex-col">
          <div className="flex-1">
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
          
          <footer className="mt-12 py-8 border-t border-security-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              Sentinel AI Security Cluster v4.2.0 • © 2026
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-security-success uppercase tracking-tighter">System Health: 100%</span>
              <div className="w-1 h-1 rounded-full bg-security-success animate-ping" />
            </div>
          </footer>
        </div>

        {/* Global Scanline Effect */}
        <div className="scanline pointer-events-none" />
      </main>
    </div>
  );
}

