import React from 'react';
import { Users, ShieldCheck, FileText, Lock, Globe, Building, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

const team = [
  { name: 'Rafael Constancio', role: 'Security Admin', status: 'Active', email: 'rafael@company.com' },
  { name: 'Ana Silva', role: 'Security Analyst', status: 'Active', email: 'ana@company.com' },
  { name: 'Carlos Souza', role: 'Compliance Officer', status: 'Active', email: 'carlos@company.com' },
];

export default function Organization() {
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
              <button className="text-xs font-mono text-security-accent uppercase tracking-widest hover:text-white transition-all">
                Invite Member
              </button>
            </div>
            <div className="space-y-4">
              {team.map((member, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-security-bg border border-security-border rounded-xl group hover:border-security-accent/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-security-accent/10 rounded-full flex items-center justify-center border border-security-accent/20 text-security-accent font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{member.name}</h4>
                      <p className="text-xs text-gray-500 font-mono">{member.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-300 font-medium">{member.role}</p>
                    <span className="text-[10px] font-mono text-security-success uppercase tracking-widest">{member.status}</span>
                  </div>
                </div>
              ))}
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
            <button className="w-full py-3 bg-security-accent text-security-bg font-bold rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2">
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
