import React, { useState, useEffect } from 'react';
import { Laptop, Smartphone, Monitor, Search, Plus, Trash2, X, Loader2, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { db, collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from '../lib/firebase';
import { useAuth } from './AuthProvider';

interface Device {
  id: string;
  name: string;
  type: 'Laptop' | 'Desktop' | 'Smartphone';
  status: 'Protected' | 'Scanning' | 'Vulnerable';
  risk: 'Low' | 'Medium' | 'High';
  user: string;
  lastSeen: string;
  ownerId: string;
}

export default function Endpoints() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newDevice, setNewDevice] = useState({ name: '', type: 'Laptop' as const, user: '' });

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'devices'), where('ownerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const devicesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Device[];
      setDevices(devicesData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const filteredDevices = devices.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevice.name || !newDevice.user || !user) return;

    try {
      await addDoc(collection(db, 'devices'), {
        ...newDevice,
        status: 'Protected',
        risk: 'Low',
        lastSeen: 'Just now',
        ownerId: user.uid
      });
      setNewDevice({ name: '', type: 'Laptop', user: '' });
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add device:', error);
    }
  };

  const handleDeleteDevice = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'devices', id));
    } catch (error) {
      console.error('Failed to delete device:', error);
    }
  };

  const stats = {
    total: devices.length,
    protected: devices.filter(d => d.status === 'Protected').length,
    atRisk: devices.filter(d => d.status === 'Vulnerable' || d.risk === 'High').length
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Endpoint Management</h2>
          <p className="text-gray-500 font-mono text-sm">Monitoring {stats.total} active devices across the organization</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search devices..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-security-card border border-security-border rounded-lg text-sm text-white focus:outline-none focus:border-security-accent transition-all"
            />
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-security-accent text-white font-bold rounded-lg text-sm hover:bg-blue-400 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Device
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-security-card border border-security-border p-8 rounded-2xl w-full max-w-md space-y-6 relative">
            <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white">Add New Endpoint</h3>
            <form onSubmit={handleAddDevice} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase">Device Name</label>
                <input 
                  required
                  value={newDevice.name}
                  onChange={e => setNewDevice({...newDevice, name: e.target.value})}
                  className="w-full bg-security-bg border border-security-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-security-accent"
                  placeholder="e.g. Marketing-Mac-02"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase">Device Type</label>
                <select 
                  value={newDevice.type}
                  onChange={e => setNewDevice({...newDevice, type: e.target.value as any})}
                  className="w-full bg-security-bg border border-security-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-security-accent"
                >
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop">Desktop</option>
                  <option value="Smartphone">Smartphone</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase">Assigned User</label>
                <input 
                  required
                  value={newDevice.user}
                  onChange={e => setNewDevice({...newDevice, user: e.target.value})}
                  className="w-full bg-security-bg border border-security-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-security-accent"
                  placeholder="e.g. John Doe"
                />
              </div>
              <button type="submit" className="w-full py-3 bg-security-accent text-white font-bold rounded-xl hover:bg-blue-400 transition-all">
                Register Device
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Endpoints', value: stats.total, color: 'security-accent' },
          { label: 'Protected', value: stats.protected, color: 'security-success' },
          { label: 'At Risk', value: stats.atRisk, color: 'security-danger' },
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
                <th className="px-6 py-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-security-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-8 h-8 text-security-accent animate-spin" />
                      <p className="text-sm font-mono text-gray-500 uppercase">Synchronizing with Node Network...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
                      <div className="w-16 h-16 bg-security-accent/5 rounded-full flex items-center justify-center border border-dashed border-security-accent/30">
                        <Activity className="w-8 h-8 text-security-accent/20" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-white font-bold text-lg">No Devices Detected</h4>
                        <p className="text-gray-500 text-sm">Register your first endpoint to start real-time monitoring and threat prevention.</p>
                      </div>
                      <button 
                        onClick={() => setIsAdding(true)}
                        className="px-6 py-2 bg-security-accent/10 text-security-accent border border-security-accent/20 rounded-lg hover:bg-security-accent/20 transition-all font-bold text-sm"
                      >
                        Register First Device
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDevices.map((device) => (
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
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDeleteDevice(device.id)}
                        className="p-2 text-gray-500 hover:text-security-danger transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
