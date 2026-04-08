import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ShieldAlert, ShieldCheck, Globe, Zap, AlertCircle, Terminal } from 'lucide-react';
import { cn } from '../lib/utils';

const attackTypes = [
  { type: 'Brute Force', icon: Zap, color: 'security-danger' },
  { type: 'SQL Injection', icon: ShieldAlert, color: 'security-warning' },
  { type: 'DDoS Attempt', icon: Activity, color: 'security-danger' },
  { type: 'Phishing Link', icon: AlertCircle, color: 'security-warning' },
  { type: 'Malware Scan', icon: ShieldCheck, color: 'security-success' },
];

const locations = ['New York, US', 'London, UK', 'Tokyo, JP', 'Berlin, DE', 'Moscow, RU', 'Beijing, CN', 'Paris, FR', 'Sydney, AU'];

export default function LiveFeed() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const attack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      
      const newLog = {
        id: Date.now(),
        ...attack,
        location,
        ip,
        time: new Date().toLocaleTimeString(),
        status: 'Blocked', // Force blocked status to simulate active protection
      };

      setLogs(prev => [newLog, ...prev].slice(0, 10));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Real-Time Threat Feed</h2>
          <p className="text-gray-500 font-mono text-sm">Monitoring global intrusion attempts in real-time</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-security-danger/10 border border-security-danger/20 rounded-full">
            <div className="w-2 h-2 rounded-full bg-security-danger animate-pulse" />
            <span className="text-[10px] font-mono text-security-danger uppercase tracking-widest">Live Monitoring</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-security-card border border-security-border rounded-xl overflow-hidden">
            <div className="p-4 bg-security-bg border-b border-security-border flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-gray-500">
              <div className="grid grid-cols-5 w-full gap-4">
                <div className="col-span-1">Timestamp</div>
                <div className="col-span-1">Event Type</div>
                <div className="col-span-1">Source IP</div>
                <div className="col-span-1">Location</div>
                <div className="col-span-1 text-right">Status</div>
              </div>
            </div>
            <div className="divide-y divide-security-border">
              <AnimatePresence initial={false}>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    className="p-4 hover:bg-white/5 transition-all group"
                  >
                    <div className="grid grid-cols-5 w-full gap-4 items-center">
                      <div className="col-span-1 font-mono text-xs text-gray-500">{log.time}</div>
                      <div className="col-span-1 flex items-center gap-2">
                        <log.icon className={cn("w-4 h-4", `text-${log.color}`)} />
                        <span className="text-sm font-medium text-white">{log.type}</span>
                      </div>
                      <div className="col-span-1 font-mono text-xs text-security-accent">{log.ip}</div>
                      <div className="col-span-1 flex items-center gap-2 text-xs text-gray-400">
                        <Globe className="w-3 h-3" />
                        {log.location}
                      </div>
                      <div className="col-span-1 text-right">
                        <span className={cn(
                          "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border",
                          log.status === 'Blocked' 
                            ? "bg-security-success/10 text-security-success border-security-success/20" 
                            : "bg-security-warning/10 text-security-warning border-security-warning/20 animate-pulse"
                        )}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-security-card border border-security-border p-6 rounded-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-security-accent" />
              Network Stats
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Ingress Traffic', value: '4.2 GB/s', color: 'security-accent' },
                { label: 'Egress Traffic', value: '1.8 GB/s', color: 'security-success' },
                { label: 'CPU Load', value: '12%', color: 'security-warning' },
                { label: 'Memory Usage', value: '34%', color: 'security-accent' },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                    <span className="text-gray-500">{stat.label}</span>
                    <span className="text-white">{stat.value}</span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-1000", `bg-${stat.color}`)} 
                      style={{ width: stat.value.includes('%') ? stat.value : '60%' }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-security-accent/5 border border-security-accent/20 p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-security-accent/10 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-security-accent" />
              </div>
              <h4 className="font-bold text-white">Active Protection</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Sentinel AI is currently monitoring 14,203 endpoints and has blocked 42 attacks in the last 60 seconds.
            </p>
            <button className="w-full py-2 bg-security-accent text-security-bg text-xs font-bold rounded-lg hover:bg-white transition-all">
              Download Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
