import React from 'react';
import { Lock, Shield, Eye, EyeOff, Key, Fingerprint, Database, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Vault() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-security-accent/10 border border-security-accent/20 text-security-accent text-xs font-mono uppercase tracking-widest">
          <Lock className="w-3 h-3" />
          Data Protection
        </div>
        <h2 className="text-4xl font-bold text-white tracking-tight">Sentinel Data Vault</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Your data is protected with military-grade encryption and zero-knowledge architecture. Here's how we keep your digital life secure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Key, title: 'End-to-End Encryption', desc: 'All data is encrypted before it leaves your device using AES-256.' },
          { icon: Fingerprint, title: 'Biometric Auth', desc: 'Secure access using your unique biological markers and hardware keys.' },
          { icon: Database, title: 'Zero-Knowledge', desc: 'We never store your master password or have access to your decrypted data.' },
        ].map((feature, i) => (
          <div key={i} className="bg-security-card border border-security-border p-8 rounded-2xl space-y-4 group hover:border-security-accent/30 transition-all">
            <div className="p-4 bg-security-accent/10 rounded-2xl w-fit group-hover:bg-security-accent/20 transition-all">
              <feature.icon className="w-8 h-8 text-security-accent" />
            </div>
            <h3 className="text-xl font-bold text-white">{feature.title}</h3>
            <p className="text-gray-500 leading-relaxed text-sm">{feature.desc}</p>
          </div>
        ))}
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

            <button className="px-8 py-4 bg-security-accent text-security-bg font-bold rounded-xl hover:bg-white transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(0,242,255,0.3)]">
              Configure Encryption Keys
              <ArrowRight className="w-5 h-5" />
            </button>
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
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-security-card p-8 rounded-3xl border border-security-accent/50 shadow-[0_0_40px_rgba(0,242,255,0.2)]">
                <Lock className="w-16 h-16 text-security-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
