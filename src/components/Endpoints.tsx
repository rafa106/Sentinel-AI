import React from 'react';
import { Laptop, Smartphone, Monitor, ShieldCheck, AlertTriangle, Activity, Search } from 'lucide-react';
import { cn } from '../lib/utils';

const devices = [
  { id: 1, name: 'CEO-MacBook-Pro', type: 'Laptop', status: 'Protected', risk: 'Low', user: 'Rafael Constancio', lastSeen: '2m ago' },
  { id: 2, name: 'Finance-Desktop-01', type: 'Desktop', status: 'Scanning', risk: 'Medium', user: 'Ana Silva', lastSeen: 'Just now' },
  { id: 3, name: 'Marketing-iPhone', type: 'Smartphone', status: 'Protected', risk: 'Low', user: 'Carlos Souza', lastSeen: '15m ago' },
  { id: 4, name: 'Dev-Workstation-04', type: 'Desktop', status: 'Vulnerable', risk: 'High', user: 'Lucas Lima', lastSeen: '1h ago' },
];

export default function Endpoints() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Endpoint Management</h2>
          <p className="text-gray-500 font-mono text-sm">Monitoring 12 active devices across the organization</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search devices..." 
              className="pl-10 pr-4 py-2 bg-security-card border border-security-border rounded-lg text-sm text-white focus:outline-none focus:border-security-accent transition-all"
            />
          </div>
          <button className="px-4 py-2 bg-security-accent text-security-bg font-bold rounded-lg text-sm hover:bg-white transition-all">
            Add Device
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Endpoints', value: '12', color: 'security-accent' },
          { label: 'Protected', value: '10', color: 'security-success' },
          { label: 'At Risk', value: '2', color: 'security-danger' },
        ].map((stat, i) => (
          <div key={i} className="bg-security-card border border-security-border p-6 rounded-xl">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className={cn("text-2xl font-bold", `text-${stat.color}`)}>{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-security-card border border-security-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-security-bg border-b border-security-border">
              <tr>
                <th className="px-6 py-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Device Name</th>
                <th className="px-6 py-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Risk</th>
                <th className="px-6 py-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-security-border">
              {devices.map((device) => (
                <tr key={device.id} className="hover:bg-white/5 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-security-bg rounded border border-security-border group-hover:border-security-accent/30 transition-all">
                        {device.type === 'Laptop' && <Laptop className="w-4 h-4 text-gray-400" />}
                        {device.type === 'Desktop' && <Monitor className="w-4 h-4 text-gray-400" />}
                        {device.type === 'Smartphone' && <Smartphone className="w-4 h-4 text-gray-400" />}
                      </div>
                      <span className="text-sm font-medium text-white">{device.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{device.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{device.user}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border",
                      device.risk === 'Low' ? "bg-security-success/10 text-security-success border-security-success/20" :
                      device.risk === 'Medium' ? "bg-security-warning/10 text-security-warning border-security-warning/20" :
                      "bg-security-danger/10 text-security-danger border-security-danger/20"
                    )}>
                      {device.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        device.status === 'Protected' ? "bg-security-success" :
                        device.status === 'Scanning' ? "bg-security-accent animate-pulse" :
                        "bg-security-danger"
                      )} />
                      <span className="text-sm text-gray-300">{device.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{device.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
