import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, Wifi } from 'lucide-react';
import { verifyAdminPin, setPinSessionValid } from '../services/pinService';
import { useLanguage } from '../i18n/LanguageContext';
import { useToast } from '../components/Toast';

interface AdminPinLoginProps {
  onSuccess: () => void;
}

export const AdminPinLogin: React.FC<AdminPinLoginProps> = ({ onSuccess }) => {
  const { t, lang, setLang } = useLanguage();
  const { showToast } = useToast();

  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      setError(t.pinError);
      return;
    }

    setLoading(true);
    setError('');

    const isValid = await verifyAdminPin(pin);
    setLoading(false);

    if (isValid) {
      setPinSessionValid();
      showToast(lang === 'mg' ? 'Tafiditra soa aman-tsara amin\'ny Espace Admin!' : 'Accès administrateur validé avec succès !', 'success');
      onSuccess();
    } else {
      setError(t.pinError);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Language Switcher on Top Right */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
        <button
          type="button"
          onClick={() => setLang('mg')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
            lang === 'mg' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          🇲🇬 MG
        </button>
        <button
          type="button"
          onClick={() => setLang('fr')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
            lang === 'fr' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          🇫🇷 FR
        </button>
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-700 via-cyan-600 to-sky-400 p-0.5 mx-auto shadow-2xl shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <KeyRound className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">BOX WIFI – POCKET WIFI</h1>
          <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
            {t.pinTitle}
          </p>
        </div>

        {/* PIN Entry Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-5">
          <p className="text-xs text-slate-300 text-center leading-relaxed">
            {t.pinSubtitle}
          </p>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder={t.pinPlaceholder}
                  autoFocus
                  className="w-full pl-10 pr-11 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-base font-mono text-center tracking-widest text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 hover:from-blue-500 hover:to-sky-300 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? '...' : t.pinSubmit}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 text-center">
            <span className="text-[11px] text-slate-500">
              {t.pinHint}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
