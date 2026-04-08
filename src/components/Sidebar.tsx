import React from 'react';
import { Shield, LayoutDashboard, Search, FileCheck, Activity, Settings, Lock, CreditCard, Laptop, Users, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentPlan: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, currentPlan, isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'scanner', icon: Search, label: 'Threat Scanner' },
    { id: 'audit', icon: FileCheck, label: 'Security Audit' },
    { id: 'live', icon: Activity, label: 'Live Feed' },
    { id: 'endpoints', icon: Laptop, label: 'Endpoints', corporate: true },
    { id: 'org', icon: Users, label: 'Organization', corporate: true },
    { id: 'vault', icon: Lock, label: 'Data Vault' },
    { id: 'pricing', icon: CreditCard, label: 'Pricing' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div className={cn(
        "fixed lg:static inset-y-0 left-0 w-64 bg-security-card border-r border-security-border flex flex-col z-50 transition-transform duration-300 transform lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between border-b border-security-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-security-accent/10 rounded-lg flex items-center justify-center border border-security-accent/30">
              <Shield className="text-security-accent w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-white tracking-tight">SENTINEL AI</h1>
              <p className="text-[10px] font-mono text-security-accent uppercase tracking-widest">Cyber Shield</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) onClose();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative",
                activeTab === item.id 
                  ? "bg-security-accent/10 text-security-accent border border-security-accent/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                activeTab === item.id ? "text-security-accent" : "text-gray-500 group-hover:text-gray-300"
              )} />
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">{item.label}</span>
                {item.corporate && (
                  <span className="text-[8px] font-mono text-security-warning uppercase tracking-tighter">Enterprise</span>
                )}
              </div>
              {activeTab === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-security-accent shadow-[0_0_8px_rgba(0,242,255,0.8)]" />
              )}
            </button>
          ))}
        </nav>

      <div className="p-4 border-t border-security-border">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
        <div className="mt-4 p-3 bg-security-bg rounded-lg border border-security-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Protection Level</span>
            <span className={cn(
              "text-[10px] font-mono font-bold uppercase",
              currentPlan === 'free' ? "text-gray-400" : "text-security-accent"
            )}>
              {currentPlan}
            </span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-gray-500 uppercase">System Status</span>
            <span className="text-[10px] font-mono text-security-success uppercase">Online</span>
          </div>
          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="w-full h-full bg-security-success animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  </>
  );
}
