import React, { useState } from 'react';
import { X, User, Lock, Mail, ArrowLeft, Chrome } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../lib/utils';
import { auth, googleProvider, signInWithPopup } from '../firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: 'admin' | 'teacher' | 'parent' | 'student') => void;
  language: 'en' | 'ur';
}

type ModalState = 'login' | 'forgot';

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, language }) => {
  const [modalState, setModalState] = useState<ModalState>('login');
  
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      
      // Determine role based on email (Mock logic for now)
      let role: 'admin' | 'teacher' | 'parent' | 'student' = 'student';
      if (user.email?.includes('admin')) role = 'admin';
      else if (user.email?.includes('teacher')) role = 'teacher';
      else if (user.email?.includes('parent')) role = 'parent';
      
      onLogin(role);
      onClose();
    } catch (err: any) {
      setError(language === 'en' ? 'Invalid credentials. Please try again.' : 'غلط اسناد۔ براہ کرم دوبارہ کوشش کریں۔');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Default role for Google login
      onLogin('student');
      onClose();
    } catch (err: any) {
      setError(language === 'en' ? 'Google login failed.' : 'گوگل لاگ ان ناکام رہا۔');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    if (!email) return;
    
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      alert(language === 'en' ? 'Password reset email sent!' : 'پاس ورڈ ری سیٹ ای میل بھیج دی گئی ہے!');
      setModalState('login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const t = {
    en: {
      title: 'Login to Portal',
      subtitle: 'Enter your credentials to access your dashboard',
      username: 'Username or Email',
      password: 'Password',
      forgot: 'Forgot Password?',
      login: 'Login Now',
      noAccount: "Don't have an account?",
      contact: 'Contact Administrator',
      forgotTitle: 'Reset Password',
      forgotSubtitle: 'Enter your email to receive a reset link',
      email: 'Email Address',
      sendReset: 'Send Reset Link',
      backToLogin: 'Back to Login',
    },
    ur: {
      title: 'پورٹل میں لاگ ان کریں',
      subtitle: 'اپنے ڈیش بورڈ تک رسائی کے لیے اپنی اسناد درج کریں',
      username: 'صارف کا نام یا ای میل',
      password: 'پاس ورڈ',
      forgot: 'پاس ورڈ بھول گئے؟',
      login: 'ابھی لاگ ان کریں',
      noAccount: 'کیا آپ کا اکاؤنٹ نہیں ہے؟',
      contact: 'ایڈمنسٹریٹر سے رابطہ کریں',
      forgotTitle: 'پاس ورڈ دوبارہ ترتیب دیں',
      forgotSubtitle: 'ری سیٹ لنک حاصل کرنے کے لیے اپنا ای میل درج کریں',
      email: 'ای میل ایڈریس',
      sendReset: 'ری سیٹ لنک بھیجیں',
      backToLogin: 'لاگ ان پر واپس جائیں',
    }
  };

  const content = t[language];
  const isRtl = language === 'ur';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <button 
          onClick={onClose}
          className={cn(
            "absolute top-4 p-2 text-slate-400 hover:text-slate-600 transition-colors",
            isRtl ? "left-4" : "right-4"
          )}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          {modalState === 'login' ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-500 mb-2">{content.title}</h2>
                <p className="text-slate-500 text-sm">{content.subtitle}</p>
              </div>

              <form className="space-y-6" onSubmit={handleLogin}>
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{content.username}</label>
                  <div className="relative">
                    <div className={cn(
                      "absolute inset-y-0 flex items-center pointer-events-none text-slate-400",
                      isRtl ? "right-3" : "left-3"
                    )}>
                      <User className="w-5 h-5" />
                    </div>
                    <input 
                      type="email" 
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={cn(
                        "block w-full py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none",
                        isRtl ? "pr-10 pl-3" : "pl-10 pr-3"
                      )}
                      placeholder="admin@pakeducation.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{content.password}</label>
                  <div className="relative">
                    <div className={cn(
                      "absolute inset-y-0 flex items-center pointer-events-none text-slate-400",
                      isRtl ? "right-3" : "left-3"
                    )}>
                      <Lock className="w-5 h-5" />
                    </div>
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn(
                        "block w-full py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none",
                        isRtl ? "pr-10 pl-3" : "pl-10 pr-3"
                      )}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    type="button"
                    onClick={() => setModalState('forgot')}
                    className="text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors"
                  >
                    {content.forgot}
                  </button>
                </div>

                <Button type="submit" variant="primary" className="w-full py-4 text-lg font-bold rounded-xl" disabled={loading}>
                  {loading ? (isRtl ? 'لاگ ان ہو رہا ہے...' : 'Logging in...') : content.login}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">{isRtl ? 'یا' : 'Or'}</span>
                  </div>
                </div>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full py-4 text-lg font-bold rounded-xl flex items-center justify-center gap-3"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <Chrome className="w-6 h-6 text-red-500" />
                  {isRtl ? 'گوگل کے ساتھ لاگ ان کریں' : 'Login with Google'}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-500 mb-2">{content.forgotTitle}</h2>
                <p className="text-slate-500 text-sm">{content.forgotSubtitle}</p>
              </div>

              <form className="space-y-6" onSubmit={handleForgotPassword}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{content.email}</label>
                  <div className="relative">
                    <div className={cn(
                      "absolute inset-y-0 flex items-center pointer-events-none text-slate-400",
                      isRtl ? "right-3" : "left-3"
                    )}>
                      <Mail className="w-5 h-5" />
                    </div>
                    <input 
                      type="email" 
                      name="email"
                      required
                      className={cn(
                        "block w-full py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none",
                        isRtl ? "pr-10 pl-3" : "pl-10 pr-3"
                      )}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" className="w-full py-4 text-lg font-bold rounded-xl" disabled={loading}>
                  {loading ? (isRtl ? 'بھیجا جا رہا ہے...' : 'Sending...') : content.sendReset}
                </Button>

                <button 
                  type="button"
                  onClick={() => setModalState('login')}
                  className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-500 transition-colors"
                >
                  <ArrowLeft className={cn("w-4 h-4", isRtl && "rotate-180")} />
                  {content.backToLogin}
                </button>
              </form>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              {content.noAccount} <button className="text-brand-500 font-bold hover:underline">{content.contact}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
