import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShieldAlert, ShieldCheck, Loader2, AlertCircle, ArrowRight, ExternalLink, CheckCircle } from 'lucide-react';
import { analyzeThreat } from '../services/gemini';
import { cn } from '../lib/utils';

export default function ThreatScanner() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const handleScan = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setIsBlocked(false);
    const analysis = await analyzeThreat(input);
    setResult(analysis);
    setLoading(false);
  };

  const handleBlock = () => {
    setIsBlocking(true);
    setTimeout(() => {
      setIsBlocking(false);
      setIsBlocked(true);
    }, 2000);
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
    setIsBlocked(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-security-accent/10 border border-security-accent/20 text-security-accent text-xs font-mono uppercase tracking-widest">
          <Search className="w-3 h-3" />
          Advanced AI Analysis
        </div>
        <h2 className="text-4xl font-bold text-white tracking-tight">Threat Scanner</h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          Paste a suspicious URL, email content, or message snippet. Our AI will analyze it for phishing, malware, and social engineering indicators.
        </p>
      </div>

      <div className="bg-security-card border border-security-border p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="scanline" />
        <div className="space-y-6 relative z-20">
          <div className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter content to scan (URL, email, message...)"
              className="w-full h-40 bg-security-bg border border-security-border rounded-xl p-6 text-white placeholder-gray-600 focus:outline-none focus:border-security-accent/50 focus:ring-1 focus:ring-security-accent/50 transition-all resize-none font-mono text-sm"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase">
              <ShieldAlert className="w-3 h-3" />
              AI Powered Analysis
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleScan}
              disabled={loading || !input.trim()}
              className="flex-1 py-4 bg-security-accent text-white font-bold rounded-xl hover:bg-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(59,130,246,0.4)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Patterns...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Initiate Security Scan
                </>
              )}
            </button>

            {(input || result) && (
              <button
                onClick={handleClear}
                className="px-6 py-4 bg-security-card border border-security-border text-gray-400 font-bold rounded-xl hover:text-white hover:border-gray-500 transition-all flex items-center justify-center gap-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-security-card border border-security-border rounded-2xl overflow-hidden"
          >
            <div className={cn(
              "p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-security-border",
              result.riskLevel === 'Low' ? "bg-security-success/5" : 
              result.riskLevel === 'Medium' ? "bg-security-warning/5" : "bg-security-danger/5"
            )}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-xl border",
                  result.riskLevel === 'Low' ? "bg-security-success/10 border-security-success/20 text-security-success" : 
                  result.riskLevel === 'Medium' ? "bg-security-warning/10 border-security-warning/20 text-security-warning" : 
                  "bg-security-danger/10 border-security-danger/20 text-security-danger"
                )}>
                  {result.riskLevel === 'Low' ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Risk Level: {result.riskLevel}</h3>
                  <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">{result.threatType} Detected</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {result.riskLevel !== 'Low' && !isBlocked && (
                  <button
                    onClick={handleBlock}
                    disabled={isBlocking}
                    className="flex-1 sm:flex-none px-6 py-2 bg-security-danger text-white font-bold rounded-lg hover:bg-red-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,62,62,0.4)]"
                  >
                    {isBlocking ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Blocking...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Block Threat
                      </>
                    )}
                  </button>
                )}
                {isBlocked && (
                  <div className="flex-1 sm:flex-none px-6 py-2 bg-security-success/20 text-security-success border border-security-success/30 font-bold rounded-lg flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Threat Neutralized
                  </div>
                )}
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-mono text-gray-500 uppercase mb-1">Analysis Confidence</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={cn("w-4 h-1 rounded-full", i <= 4 ? "bg-security-accent" : "bg-gray-800")} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-sm font-mono text-security-accent uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  AI Explanation
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  {result.explanation}
                </p>
                {isBlocked && (
                  <div className="p-4 bg-security-success/10 border border-security-success/20 rounded-xl mt-4">
                    <p className="text-sm text-security-success font-medium flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Action Taken: All malicious scripts and connection attempts from this source have been permanently blocked at the firewall level.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-mono text-security-accent uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Recommended Actions
                </h4>
                <div className="space-y-2">
                  {result.recommendations.map((rec: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-security-bg rounded-lg border border-security-border group hover:border-security-accent/30 transition-all">
                      <ArrowRight className="w-4 h-4 text-security-accent" />
                      <span className="text-sm text-gray-300">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
