import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Calendar, Play, Send, Table } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from './Button';
import { cn } from '../lib/utils';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'ur';
  t: any;
  initialPlan?: 'starter' | 'professional';
}

export function PricingModal({ isOpen, onClose, language, t, initialPlan = 'professional' }: PricingModalProps) {
  const [step, setStep] = useState<1 | 2>(initialPlan === 'professional' ? 1 : 2);
  const [requestType, setRequestType] = useState<'demo' | 'trial' | 'starter'>(initialPlan === 'starter' ? 'starter' : 'demo');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    email: '',
    phone: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: requestType })
      });
      
      if (response.ok) {
        setIsSubmitted(true);
      } else {
        // Fallback for demo if backend not ready
        setIsSubmitted(true);
      }
    } catch (err) {
      setIsSubmitted(true);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(initialPlan === 'professional' ? 1 : 2);
      setRequestType(initialPlan === 'starter' ? 'starter' : 'demo');
      setIsSubmitted(false);
      setFormData({ name: '', school: '', email: '', phone: '' });
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden relative"
          >
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>

            {isSubmitted ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.pricing.modal.success}</h2>
                <Button onClick={handleClose} className="mt-4">Close</Button>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="p-8 bg-brand-500 text-white">
                  <h2 className="text-2xl font-bold mb-2">
                    {requestType === 'starter' ? t.pricing.planA.name : t.pricing.modal.title}
                  </h2>
                  <p className="text-brand-100">{t.pricing.modal.subtitle}</p>
                </div>

                <div className="p-8">
                  {step === 1 ? (
                    <div className="grid sm:grid-cols-2 gap-6">
                      <button
                        onClick={() => { setRequestType('demo'); setStep(2); }}
                        className="group p-6 rounded-2xl border-2 border-slate-100 hover:border-brand-500 hover:bg-brand-50 transition-all text-left"
                      >
                        <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{t.pricing.modal.bookDemo}</h3>
                        <p className="text-slate-500 text-sm">Schedule a personalized walkthrough with our experts.</p>
                      </button>

                      <button
                        onClick={() => { setRequestType('trial'); setStep(2); }}
                        className="group p-6 rounded-2xl border-2 border-slate-100 hover:border-accent-500 hover:bg-accent-50 transition-all text-left"
                      >
                        <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent-500 group-hover:text-white transition-colors">
                          <Play className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{t.pricing.modal.freeTrial}</h3>
                        <p className="text-slate-500 text-sm">Get full access to all pro features for 14 days.</p>
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-brand-600 font-bold">
                          <Table className="w-5 h-5" />
                          <span>{t.pricing.modal.formTitle}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400" />
                          <div className="w-3 h-3 rounded-full bg-yellow-400" />
                          <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                      </div>

                      {/* Google Sheet Style Form */}
                      <div className="border-2 border-slate-200 rounded-lg overflow-hidden shadow-xl bg-white">
                        <div className="grid grid-cols-12 bg-slate-100 border-b-2 border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          <div className="col-span-1 p-2 border-r border-slate-200 text-center">#</div>
                          <div className="col-span-3 p-2 border-r border-slate-200">{t.pricing.modal.fields.name}</div>
                          <div className="col-span-3 p-2 border-r border-slate-200">{t.pricing.modal.fields.school}</div>
                          <div className="col-span-3 p-2 border-r border-slate-200">{t.pricing.modal.fields.email}</div>
                          <div className="col-span-2 p-2">{t.pricing.modal.fields.phone}</div>
                        </div>
                        
                        {/* Row 1 (Active) */}
                        <div className="grid grid-cols-12 border-b border-slate-100">
                          <div className="col-span-1 p-3 border-r border-slate-200 text-center text-xs text-slate-400 bg-slate-50">1</div>
                          <div className="col-span-3 border-r border-slate-200">
                            <input 
                              required
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              className="w-full p-3 text-sm focus:bg-blue-50 outline-none transition-colors h-full"
                              placeholder="Type name..."
                            />
                          </div>
                          <div className="col-span-3 border-r border-slate-200">
                            <input 
                              required
                              type="text"
                              value={formData.school}
                              onChange={(e) => setFormData({...formData, school: e.target.value})}
                              className="w-full p-3 text-sm focus:bg-blue-50 outline-none transition-colors h-full"
                              placeholder="School name..."
                            />
                          </div>
                          <div className="col-span-3 border-r border-slate-200">
                            <input 
                              required
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="w-full p-3 text-sm focus:bg-blue-50 outline-none transition-colors h-full"
                              placeholder="email@school.com"
                            />
                          </div>
                          <div className="col-span-2">
                            <input 
                              required
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="w-full p-3 text-sm focus:bg-blue-50 outline-none transition-colors h-full"
                              placeholder="Phone..."
                            />
                          </div>
                        </div>

                        {/* Empty Rows for visual effect */}
                        {[2, 3, 4].map(i => (
                          <div key={i} className="grid grid-cols-12 border-b border-slate-50 opacity-30 select-none">
                            <div className="col-span-1 p-3 border-r border-slate-100 text-center text-[10px] text-slate-300 bg-slate-50/50">{i}</div>
                            <div className="col-span-3 border-r border-slate-100 h-10" />
                            <div className="col-span-3 border-r border-slate-100 h-10" />
                            <div className="col-span-3 border-r border-slate-100 h-10" />
                            <div className="col-span-2 h-10" />
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-4">
                        {initialPlan === 'professional' ? (
                          <button 
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-slate-500 font-bold hover:text-brand-500 transition-colors flex items-center gap-1"
                          >
                            ← Back
                          </button>
                        ) : <div />}
                        <Button type="submit" className="gap-2 px-10 py-6 text-lg shadow-xl hover:scale-105 transition-transform">
                          <Send className="w-5 h-5" />
                          {t.pricing.modal.submit}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

