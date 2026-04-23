import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, FileText, Lock, Globe, Building, ArrowRight, CheckCircle2, X, Plus, Trash2, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { db, collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from '../lib/firebase';
import { useAuth } from './AuthProvider';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: string;
  email: string;
  ownerId: string;
}

export default function Organization() {
  const { user } = useAuth();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: 'Security Analyst', email: '' });

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'team'), where('ownerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teamData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TeamMember[];
      setTeam(teamData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email || !user) return;

    try {
      await addDoc(collection(db, 'team'), {
        ...newMember,
        status: 'Active',
        ownerId: user.uid
      });
      setNewMember({ name: '', role: 'Security Analyst', email: '' });
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add team member:', error);
    }
  };

  const handleRemoveMember = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'team', id));
    } catch (error) {
      console.error('Failed to delete team member:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-security-accent/10 border border-security-accent/20 text-security-accent text-xs font-mono uppercase tracking-widest">
          <Building className="w-3 h-3" />
          Enterprise Management
        </div>
        <h2 className="text-4xl font-bold text-white tracking-tight">Organization Control</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Manage your security team, enforce compliance policies, and monitor organization-wide security posture.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-security-card border border-security-border p-8 rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-security-accent" />
                Security Team
              </h3>
              <button 
                onClick={() => setIsAdding(true)}
                className="text-xs font-mono text-security-accent uppercase tracking-widest hover:text-white transition-all"
              >
                Invite Member
              </button>
            </div>

            {isAdding && (
              <div className="p-6 bg-security-bg border border-security-accent/30 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white">Invite New Member</h4>
                  <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    required
                    value={newMember.name}
                    onChange={e => setNewMember({...newMember, name: e.target.value})}
                    placeholder="Full Name"
                    className="bg-security-card border border-security-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-security-accent"
                  />
                  <input 
                    required
                    type="email"
                    value={newMember.email}
                    onChange={e => setNewMember({...newMember, email: e.target.value})}
                    placeholder="Email Address"
                    className="bg-security-card border border-security-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-security-accent"
                  />
                  <select 
                    value={newMember.role}
                    onChange={e => setNewMember({...newMember, role: e.target.value})}
                    className="bg-security-card border border-security-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-security-accent"
                  >
                    <option value="Security Admin">Security Admin</option>
                    <option value="Security Analyst">Security Analyst</option>
                    <option value="Compliance Officer">Compliance Officer</option>
                  </select>
                  <button type="submit" className="bg-security-accent text-white font-bold rounded-lg px-4 py-2 text-sm hover:bg-blue-400 transition-all">
                    Send Invitation
                  </button>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {loading ? (
                <div className="py-12 text-center">
                  <Loader2 className="w-8 h-8 text-security-accent animate-spin mx-auto mb-4" />
                  <p className="text-xs font-mono text-gray-500 uppercase">Synchronizing Team Directory...</p>
                </div>
              ) : team.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-security-border rounded-xl">
                  <Users className="w-8 h-8 text-security-accent/20 mx-auto mb-4" />
                  <p className="text-sm text-white font-bold">No Team Members</p>
                  <p className="text-xs text-gray-500 mb-4">Invite your security team to collaborate on protection.</p>
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="text-xs font-bold text-security-accent hover:text-white transition-all underline decoration-security-accent/30 underline-offset-4"
                  >
                    Invite First Collaborator
                  </button>
                </div>
              ) : (
                team.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-security-bg border border-security-border rounded-xl group hover:border-security-accent/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-security-accent/10 rounded-full flex items-center justify-center border border-security-accent/20 text-security-accent font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{member.name}</h4>
                        <p className="text-xs text-gray-500 font-mono">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-gray-300 font-medium">{member.role}</p>
                        <span className="text-[10px] font-mono text-security-success uppercase tracking-widest">{member.status}</span>
                      </div>
                      <button 
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 text-gray-700 hover:text-security-danger transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-security-card border border-security-border p-8 rounded-2xl space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-security-accent" />
              Compliance Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'SOC2 Type II', status: 'Compliant', date: 'Oct 2025' },
                { name: 'GDPR Readiness', status: 'Compliant', date: 'Jan 2026' },
                { name: 'ISO 27001', status: 'In Progress', date: 'Mar 2026' },
                { name: 'HIPAA Compliance', status: 'N/A', date: '-' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-security-bg border border-security-border rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Next Audit: {item.date}</p>
                  </div>
                  <span className={cn(
                    "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border",
                    item.status === 'Compliant' ? "bg-security-success/10 text-security-success border-security-success/20" :
                    item.status === 'In Progress' ? "bg-security-warning/10 text-security-warning border-security-warning/20" :
                    "bg-gray-800 text-gray-500 border-gray-700"
                  )}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-security-accent/5 border border-security-accent/20 p-8 rounded-2xl space-y-6">
            <div className="p-4 bg-security-accent/10 rounded-2xl w-fit">
              <FileText className="w-8 h-8 text-security-accent" />
            </div>
            <h3 className="text-xl font-bold text-white">Security Policies</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Enforce organization-wide security policies like mandatory MFA, password rotation, and endpoint encryption.
            </p>
            <div className="space-y-3">
              {[
                'Enforce MFA for all users',
                'Block unencrypted endpoints',
                'Auto-quarantine high risk IPs',
              ].map((policy, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-security-success" />
                  <span className="text-sm text-gray-300">{policy}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-3 bg-security-accent text-white font-bold rounded-xl hover:bg-blue-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              Manage Policies
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-security-card border border-security-border p-8 rounded-2xl space-y-4">
            <h4 className="text-sm font-mono text-gray-500 uppercase tracking-widest">Data Residency</h4>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-security-accent" />
              <span className="text-sm text-white font-medium">Region: US-West (Primary)</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your organization's data is stored and processed in compliance with local regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
