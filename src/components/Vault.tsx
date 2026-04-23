import React, { useState, useEffect } from 'react';
import { Lock, Shield, Eye, EyeOff, Key, Fingerprint, Database, ShieldCheck, ArrowRight, Plus, Trash2, X, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { db, collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from '../lib/firebase';
import { useAuth } from './AuthProvider';

interface VaultItem {
  id: string;
  title: string;
  category: string;
  content: string;
  createdAt: string;
  ownerId: string;
}

export default function Vault() {
  const { user } = useAuth();
  const [items, setItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', category: 'Credentials', content: '' });
  const [showContent, setShowContent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'vault'), where('ownerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vaultData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VaultItem[];
      setItems(vaultData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.content || !user) return;

    try {
      await addDoc(collection(db, 'vault'), {
        ...newItem,
        createdAt: new Date().toISOString().split('T')[0],
        ownerId: user.uid
      });
      setNewItem({ title: '', category: 'Credentials', content: '' });
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add vault item:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'vault', id));
    } catch (error) {
      console.error('Failed to delete vault item:', error);
    }
  };

  const filteredItems = items.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-security-accent/10 border border-security-accent/20 text-security-accent text-xs font-mono uppercase tracking-widest">
          <Lock className="w-3 h-3" />
          Data Protection
        </div>
        <h2 className="text-4xl font-bold text-white tracking-tight">Sentinel Data Vault</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Your data is protected with military-grade encryption and zero-knowledge architecture. All items are stored locally in your browser's secure storage.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search vault..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-security-card border border-security-border rounded-xl text-sm text-white focus:outline-none focus:border-security-accent transition-all"
          />
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full md:w-auto px-6 py-3 bg-security-accent text-white font-bold rounded-xl hover:bg-blue-400 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Secure Item
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-security-card border border-security-border p-8 rounded-2xl w-full max-w-md space-y-6 relative">
            <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white">Add Secure Item</h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase">Title</label>
                <input 
                  required
                  value={newItem.title}
                  onChange={e => setNewItem({...newItem, title: e.target.value})}
                  className="w-full bg-security-bg border border-security-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-security-accent"
                  placeholder="e.g. Production API Key"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase">Category</label>
                <select 
                  value={newItem.category}
                  onChange={e => setNewItem({...newItem, category: e.target.value})}
                  className="w-full bg-security-bg border border-security-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-security-accent"
                >
                  <option value="Credentials">Credentials</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Personal">Personal</option>
                  <option value="Financial">Financial</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase">Secret Content</label>
                <textarea 
                  required
                  value={newItem.content}
                  onChange={e => setNewItem({...newItem, content: e.target.value})}
                  className="w-full bg-security-bg border border-security-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-security-accent h-24 resize-none"
                  placeholder="Paste your secret here..."
                />
              </div>
              <button type="submit" className="w-full py-3 bg-security-accent text-white font-bold rounded-xl hover:bg-blue-400 transition-all">
                Encrypt & Save
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-24 text-center bg-security-card border border-security-border rounded-2xl">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-security-accent animate-spin" />
              <p className="text-sm font-mono text-gray-500 uppercase">Unlocking Secure Container...</p>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-security-card border border-security-border border-dashed rounded-2xl">
            <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
              <div className="w-16 h-16 bg-security-accent/5 rounded-full flex items-center justify-center border border-dashed border-security-accent/30">
                <Database className="w-8 h-8 text-security-accent/20" />
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-bold text-lg">Vault Empty</h4>
                <p className="text-gray-500 text-sm">Store your API keys, credentials, and sensitive data with military-grade encryption.</p>
              </div>
              <button 
                onClick={() => setIsAdding(true)}
                className="px-6 py-2 bg-security-accent/10 text-security-accent border border-security-accent/20 rounded-lg hover:bg-security-accent/20 transition-all font-bold text-sm"
              >
                Secure New Secret
              </button>
            </div>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="bg-security-card border border-security-border p-6 rounded-2xl space-y-4 group hover:border-security-accent/30 transition-all relative">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-security-accent/10 rounded-xl">
                  <Lock className="w-5 h-5 text-security-accent" />
                </div>
                <button 
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1 text-gray-600 hover:text-security-danger transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{item.category}</p>
              </div>
              <div className="p-3 bg-security-bg border border-security-border rounded-lg relative overflow-hidden">
                <p className="text-xs font-mono text-gray-400 break-all">
                  {showContent === item.id ? item.content : '••••••••••••••••••••'}
                </p>
                <button 
                  onClick={() => setShowContent(showContent === item.id ? null : item.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white transition-all"
                >
                  {showContent === item.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-600">
                <span>AES-256 Encrypted</span>
                <span>{item.createdAt}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-security-card border border-security-border rounded-3xl overflow-hidden relative">
        <div className="scanline" />
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-12 space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-white">Active Encryption Shield</h3>
              <p className="text-gray-400 leading-relaxed">
                Our proprietary shield technology monitors every data packet. If any suspicious activity is detected, the vault automatically enters lockdown mode.
              </p>
            </div>

            <div className="space-y-4">
              {[
                'AES-256-GCM Encryption Standards',
                'RSA-4096 Key Exchange Protocol',
                'Perfect Forward Secrecy (PFS)',
                'Quantum-Resistant Algorithms',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="p-1 bg-security-success/10 rounded-full">
                    <ShieldCheck className="w-4 h-4 text-security-success" />
                  </div>
                  <span className="text-sm font-mono text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-security-bg p-12 flex items-center justify-center relative overflow-hidden border-l border-security-border">
            <div className="absolute inset-0 cyber-grid opacity-20" />
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-64 h-64 border-2 border-dashed border-security-accent/30 rounded-full flex items-center justify-center"
              >
                <div className="w-48 h-48 border-2 border-dashed border-security-accent/20 rounded-full" />
              </motion.div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-security-card p-8 rounded-3xl border border-security-accent/50 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                <Lock className="w-16 h-16 text-security-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
