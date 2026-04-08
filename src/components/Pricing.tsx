import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Shield, Zap, Crown, CreditCard, Loader2, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

interface PricingProps {
  currentPlan: string;
  onUpgrade: (plan: string) => void;
}

const plans = [
  {
    id: 'free',
    name: 'Basic Shield',
    price: '0',
    description: 'Essential protection for casual browsing.',
    features: [
      'Basic Threat Scanning',
      'Real-time Dashboard',
      'Community Support',
      '1 Device Protection'
    ],
    icon: Shield,
    color: 'gray-500'
  },
  {
    id: 'pro',
    name: 'Sentinel Pro',
    price: '9.99',
    trial: '3 days free',
    description: 'Advanced AI-powered security for power users.',
    features: [
      'Unlimited AI Threat Scans',
      'Priority Live Feed Access',
      'Full Security Audits',
      'Data Vault Encryption',
      '5 Devices Protection',
      '24/7 Priority Support'
    ],
    icon: Zap,
    color: 'security-accent',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Cyber Titan',
    price: '29.99',
    trial: '3 days free',
    description: 'Maximum security for businesses and high-risk profiles.',
    features: [
      'Everything in Pro',
      'Custom AI Training',
      'Dedicated Security Expert',
      'API Access for Endpoints',
      'Unlimited Devices',
      'Advanced Firewall Controls'
    ],
    icon: Crown,
    color: 'security-warning'
  }
];

export default function Pricing({ currentPlan, onUpgrade }: PricingProps) {
  const [isCheckingOut, setIsCheckingOut] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCheckout = (planId: string) => {
    if (planId === currentPlan) return;
    setIsCheckingOut(planId);
    
    // Simulate a checkout process
    setTimeout(() => {
      setIsCheckingOut(null);
      setShowSuccess(true);
      onUpgrade(planId);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-security-accent/10 border border-security-accent/20 text-security-accent text-xs font-mono uppercase tracking-widest">
          <CreditCard className="w-3 h-3" />
          Subscription Plans
        </div>
        <h2 className="text-4xl font-bold text-white tracking-tight">Choose Your Protection Level</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Affordable, military-grade security for everyone. Upgrade your digital shield today and stay ahead of cybercriminals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={cn(
              "bg-security-card border rounded-3xl p-8 flex flex-col relative transition-all duration-500 group",
              plan.popular ? "border-security-accent shadow-[0_0_40px_rgba(0,242,255,0.1)]" : "border-security-border",
              currentPlan === plan.id && "ring-2 ring-security-success ring-offset-4 ring-offset-security-bg"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-security-accent text-security-bg text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border",
                `bg-${plan.color}/10 border-${plan.color}/20 text-${plan.color}`
              )}>
                <plan.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{plan.description}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-gray-500 text-sm">/month</span>
              </div>
              {plan.trial && (
                <div className="mt-2 text-security-success text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {plan.trial} trial included
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4 mb-8">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="p-1 bg-security-success/10 rounded-full">
                    <Check className="w-3 h-3 text-security-success" />
                  </div>
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleCheckout(plan.id)}
              disabled={currentPlan === plan.id || isCheckingOut !== null}
              className={cn(
                "w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                currentPlan === plan.id 
                  ? "bg-security-success/10 text-security-success border border-security-success/20 cursor-default" 
                  : plan.popular 
                    ? "bg-security-accent text-security-bg hover:bg-white shadow-[0_0_20px_rgba(0,242,255,0.2)]" 
                    : "bg-security-bg border border-security-border text-white hover:border-security-accent hover:text-security-accent"
              )}
            >
              {isCheckingOut === plan.id ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : currentPlan === plan.id ? (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Current Plan
                </>
              ) : (
                <>
                  {plan.id === 'free' ? 'Get Started' : `Start ${plan.trial} Trial`}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-security-success text-security-bg p-6 rounded-2xl shadow-2xl flex items-center gap-4 z-50"
          >
            <div className="p-2 bg-white/20 rounded-full">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold">Trial Started!</h4>
              <p className="text-sm opacity-90">Your 3-day free trial has been activated successfully.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-security-card border border-security-border p-12 rounded-3xl relative overflow-hidden">
        <div className="scanline opacity-5" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white">Secure Checkout Guaranteed</h3>
            <p className="text-gray-400 leading-relaxed">
              We use industry-standard encryption for all transactions. Your payment data is never stored on our servers, ensuring 100% privacy and security.
            </p>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-security-accent" />
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-security-accent" />
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">PCI Compliant</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center md:justify-end gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Payment icons placeholder */}
            <div className="w-12 h-8 bg-white/10 rounded border border-white/20" />
            <div className="w-12 h-8 bg-white/10 rounded border border-white/20" />
            <div className="w-12 h-8 bg-white/10 rounded border border-white/20" />
            <div className="w-12 h-8 bg-white/10 rounded border border-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
