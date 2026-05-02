import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, AlertTriangle, CheckCircle, Activity, Globe, Cpu, Zap, Lock, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';
import { db, collection, query, where, onSnapshot } from '../lib/firebase';
import { useAuth } from './AuthProvider';
import AdUnit from './AdUnit';

const data = [
  { time: '00:00', threats: 12, traffic: 400 },
  { time: '04:00', threats: 18, traffic: 300 },
  { time: '08:00', threats: 45, traffic: 800 },
  { time: '12:00', threats: 32, traffic: 1200 },
  { time: '16:00', threats: 28, traffic: 900 },
  { time: '20:00', threats: 55, traffic: 1100 },
  { time: '23:59', threats: 22, traffic: 600 },
];

const StatCard = ({ icon: Icon, label, value, color, trend }: any) => (
  <div className="bg-security-card border border-security-border p-6 rounded-xl relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}/5 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-${color}/10 transition-all duration-500`} />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-xs font-mono uppercase tracking-wider mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-white mb-2">{value}</h3>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-${color}/10 text-${color} border border-${color}/20`}>
            {trend}
          </span>
          <span className="text-[10px] text-gray-500 font-mono">vs last 24h</span>
        </div>
      </div>
      <div className={`p-3 bg-${color}/10 rounded-lg border border-${color}/20`}>
        <Icon className={`w-6 h-6 text-${color}`} />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [isFirewallActive, setIsFirewallActive] = useState(true);
  const [counts, setCounts] = useState({ devices: 0, team: 0, items: 0 });
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (!user) return;

    const unsubDevices = onSnapshot(query(collection(db, 'devices'), where('ownerId', '==', user.uid)), (snap) => {
      setCounts(prev => ({ ...prev, devices: snap.size }));
    });

    const unsubTeam = onSnapshot(query(collection(db, 'team'), where('ownerId', '==', user.uid)), (snap) => {
      setCounts(prev => ({ ...prev, team: snap.size }));
    });

    const unsubVault = onSnapshot(query(collection(db, 'vault'), where('ownerId', '==', user.uid)), (snap) => {
      setCounts(prev => ({ ...prev, items: snap.size }));
    });

    return () => {
      unsubDevices();
      unsubTeam();
      unsubVault();
    };
  }, [user]);

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-3xl font-bold text-white tracking-tight">Security Overview</h2>
            <span className="px-2 py-0.5 bg-security-warning/10 text-security-warning border border-security-warning/20 rounded text-[10px] font-mono uppercase tracking-tighter">Enterprise Node</span>
          </div>
          <p className="text-gray-500 font-mono text-sm">
            System status: <span className={isFirewallActive ? "text-security-success" : "text-security-danger"}>
              {isFirewallActive ? "Protected" : "Vulnerable"}
            </span> • Last scan: 12m ago
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-security-card border border-security-border rounded-xl">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Auto-Block</span>
            <button 
              onClick={() => setIsFirewallActive(!isFirewallActive)}
              className={cn(
                "w-12 h-6 rounded-full relative transition-all duration-300",
                isFirewallActive ? "bg-security-success" : "bg-gray-700"
              )}
            >
              <div className={cn(
                "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                isFirewallActive ? "left-7" : "left-1"
              )} />
            </button>
          </div>
          <button 
            onClick={handleStartScan}
            disabled={isScanning}
            className="flex-1 sm:flex-none px-4 py-2 bg-security-accent/10 text-security-accent border border-security-accent/20 rounded-lg font-medium hover:bg-security-accent/20 transition-all flex items-center justify-center gap-2 relative overflow-hidden"
          >
            {isScanning && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${scanProgress}%` }}
                className="absolute inset-y-0 left-0 bg-security-accent/20"
              />
            )}
            <Activity className={cn("w-4 h-4", isScanning && "animate-spin")} />
            <span className="relative z-10">{isScanning ? `Scanning... ${scanProgress}%` : "Full System Scan"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Shield} 
          label="Protection Status" 
          value={isFirewallActive ? "Active Shield" : "Shield Offline"} 
          color={isFirewallActive ? "security-success" : "security-danger"} 
          trend={isFirewallActive ? "Optimum" : "Critical"} 
        />
        <StatCard 
          icon={Cpu} 
          label="Secured Endpoints" 
          value={counts.devices.toString()} 
          color="security-accent" 
          trend="+0%" 
        />
        <StatCard 
          icon={Lock} 
          label="Vault Items" 
          value={counts.items.toString()} 
          color="security-warning" 
          trend="Secure" 
        />
        <StatCard 
          icon={Users} 
          label="Team Members" 
          value={counts.team.toString()} 
          color="security-success" 
          trend="Stable" 
        />
      </div>

      <AdUnit slot="0000000000" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-security-card border border-security-border p-6 rounded-xl relative overflow-hidden">
          {isFirewallActive && <div className="scanline opacity-5" />}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Threat Activity</h3>
              <p className="text-xs text-gray-500 font-mono">Real-time monitoring of blocked intrusion attempts</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-security-accent" />
                <span className="text-[10px] text-gray-400 font-mono uppercase">Traffic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-security-danger" />
                <span className="text-[10px] text-gray-400 font-mono uppercase">Threats</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="traffic" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorTraffic)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="threats" 
                  stroke="#ef4444" 
                  fillOpacity={1} 
                  fill="url(#colorThreats)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-security-card border border-security-border p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Recent Alerts</h3>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-security-danger animate-pulse" />
              <span className="text-[10px] font-mono text-security-danger uppercase">Live</span>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { type: 'danger', msg: 'Brute force attack blocked', time: '2m ago', icon: Zap, status: 'BLOCKED' },
              { type: 'warning', msg: 'Suspicious login attempt', time: '15m ago', icon: Globe, status: 'FLAGGED' },
              { type: 'success', msg: 'Database backup completed', time: '1h ago', icon: CheckCircle, status: 'SECURE' },
              { type: 'accent', msg: 'System update applied', time: '3h ago', icon: Shield, status: 'UPDATED' },
            ].map((alert, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-security-bg rounded-lg border border-security-border group hover:border-security-accent/30 transition-all">
                <div className={`p-2 rounded bg-security-${alert.type}/10 border border-security-${alert.type}/20`}>
                  <alert.icon className={`w-4 h-4 text-security-${alert.type}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-white font-medium truncate">{alert.msg}</p>
                    <span className={cn(
                      "text-[8px] font-mono px-1.5 py-0.5 rounded border",
                      alert.type === 'danger' ? "bg-security-danger/10 text-security-danger border-security-danger/20" : "bg-gray-800 text-gray-400 border-gray-700"
                    )}>
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono uppercase">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-xs font-mono text-security-accent uppercase tracking-widest hover:text-white transition-all">
            View All Logs
          </button>
        </div>
      </div>
    </div>
  );
}
