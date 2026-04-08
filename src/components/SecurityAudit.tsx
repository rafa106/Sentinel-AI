import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileCheck, Shield, ChevronRight, ChevronLeft, Loader2, Award, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { generateSecurityReport } from '../services/gemini';
import { cn } from '../lib/utils';

const questions = [
  {
    id: 'passwords',
    question: 'Do you use a unique password for every account?',
    options: ['Yes, always', 'Mostly', 'Sometimes', 'No, I reuse passwords'],
  },
  {
    id: 'mfa',
    question: 'Do you have Multi-Factor Authentication (MFA) enabled on your primary accounts?',
    options: ['Yes, on all', 'On most', 'On some', 'No, never'],
  },
  {
    id: 'updates',
    question: 'How often do you update your software and operating system?',
    options: ['Automatically', 'As soon as available', 'Once a month', 'Rarely'],
  },
  {
    id: 'phishing',
    question: 'Have you ever clicked on a link in an unexpected email or SMS?',
    options: ['Never', 'Rarely', 'Once or twice', 'Yes, frequently'],
  },
  {
    id: 'backups',
    question: 'Do you perform regular backups of your important data?',
    options: ['Daily/Real-time', 'Weekly', 'Monthly', 'Never'],
  },
];

export default function SecurityAudit() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleAnswer = (option: string) => {
    setAnswers({ ...answers, [questions[step].id]: option });
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const result = await generateSecurityReport(answers);
    setReport(result);
    setLoading(false);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setReport(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-security-accent/10 border border-security-accent/20 text-security-accent text-xs font-mono uppercase tracking-widest">
          <FileCheck className="w-3 h-3" />
          Security Audit Tool
        </div>
        <h2 className="text-4xl font-bold text-white tracking-tight">Personal Security Audit</h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          Answer a few questions about your digital habits to receive a comprehensive AI-generated security report and action plan.
        </p>
      </div>

      <div className="bg-security-card border border-security-border rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="scanline" />
        
        <AnimatePresence mode="wait">
          {!report && !loading ? (
            <motion.div
              key="questions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-10 space-y-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                  {questions.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        i === step ? "w-8 bg-security-accent" : i < step ? "w-4 bg-security-success" : "w-4 bg-gray-800"
                      )} 
                    />
                  ))}
                </div>
                <span className="text-xs font-mono text-gray-500 uppercase">Step {step + 1} of {questions.length}</span>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white leading-tight">
                  {questions[step].question}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {questions[step].options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(option)}
                      className="w-full text-left p-5 bg-security-bg border border-security-border rounded-xl hover:border-security-accent/50 hover:bg-security-accent/5 transition-all group flex items-center justify-between"
                    >
                      <span className="text-gray-300 group-hover:text-white font-medium">{option}</span>
                      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-security-accent transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              {step > 0 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 text-gray-500 hover:text-white transition-all text-sm font-mono uppercase tracking-widest"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous Question
                </button>
              )}
            </motion.div>
          ) : loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-20 flex flex-col items-center justify-center space-y-6"
            >
              <div className="relative">
                <div className="w-20 h-20 border-4 border-security-accent/20 border-t-security-accent rounded-full animate-spin" />
                <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-security-accent w-8 h-8" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Generating Security Report</h3>
                <p className="text-gray-500 font-mono text-xs animate-pulse uppercase tracking-widest">Analyzing vulnerabilities...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="report"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 space-y-10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-security-success/10 border border-security-success/20 rounded-2xl">
                    <Award className="w-8 h-8 text-security-success" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Audit Complete</h3>
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Generated by Sentinel AI</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-security-accent mb-1">{report.overallScore}%</div>
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Security Score</p>
                </div>
              </div>

              <div className="p-6 bg-security-bg border border-security-border rounded-xl space-y-4">
                <h4 className="text-sm font-mono text-security-accent uppercase tracking-widest flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Executive Summary
                </h4>
                <p className="text-gray-300 leading-relaxed italic">
                  "{report.summary}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-sm font-mono text-security-danger uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Critical Findings
                  </h4>
                  <div className="space-y-3">
                    {report.criticalFindings.map((finding: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-security-danger/5 border border-security-danger/10 rounded-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-security-danger mt-1.5 shrink-0" />
                        <span className="text-sm text-gray-300">{finding}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-mono text-security-success uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Action Plan
                  </h4>
                  <div className="space-y-3">
                    {report.actionPlan.map((action: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-security-success/5 border border-security-success/10 rounded-lg group hover:border-security-success/30 transition-all">
                        <ArrowRight className="w-4 h-4 text-security-success shrink-0" />
                        <span className="text-sm text-gray-300">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={reset}
                className="w-full py-4 bg-security-accent/10 text-security-accent border border-security-accent/20 font-bold rounded-xl hover:bg-security-accent/20 transition-all flex items-center justify-center gap-3"
              >
                Start New Audit
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
