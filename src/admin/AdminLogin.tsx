import React, { useState } from 'react';
import { Wifi, ShieldAlert, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { loginWithGoogle, loginWithEmail, createAdminAccount } from '../services/authService';
import { AdminUser } from '../types';
import { useToast } from '../components/Toast';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const user = await loginWithGoogle();
      if (!user.isAdmin) {
        setErrorMessage(
          `Ny kaonty ${user.email} dia tsy manana alalana amin'ny maha-administrateur. Mampiasà ny kaonty voatondro (boutiquemevasoa@gmail.com) na mifandraisa amin'ny mpamorona.`
        );
        setLoading(false);
        return;
      }
      showToast('Tafiditra soa aman-tsara amin\'ny maha-administrateur ianao!', 'success');
      onLoginSuccess(user);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message?.includes('popup-closed')
          ? 'Nakatona ny varavarankely Google.'
          : 'Tsy nahomby ny fidirana tamin\'ny Google: ' + (err.message || 'Hafatra tsy fantatra')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Fenoy azafady ny mailaka sy ny tenimiafina.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      if (isRegisterMode) {
        const user = await createAdminAccount(email.trim(), password);
        showToast('Voaforona soa aman-tsara ny kaonty administrateur!', 'success');
        onLoginSuccess(user);
      } else {
        const user = await loginWithEmail(email.trim(), password);
        if (!user.isAdmin) {
          setErrorMessage(
            `Ny kaonty ${user.email} dia tsy manana alalana amin'ny maha-administrateur. Ampidiro ny kaonty tompon'ny tranonkala (boutiquemevasoa@gmail.com).`
          );
          setLoading(false);
          return;
        }
        showToast('Tafiditra soa aman-tsara ianao!', 'success');
        onLoginSuccess(user);
      }
    } catch (err: any) {
      console.error(err);
      let msg = 'Nisy olana tamin\'ny fidirana.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'Diso ny mailaka na ny tenimiafina nampidirinao.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'Efa misy mampiasa io mailaka io. Mandehana amin\'ny Fidirana (Connexion).';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Farafahakeliny 6 litera na tarehimarika ny tenimiafina.';
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-blue-700 to-cyan-500 p-0.5 mx-auto shadow-xl shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Wifi className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">BOX WIFI – POCKET WIFI</h1>
          <p className="text-xs text-slate-400">Espace Fidirana ho an'ny Mpandrindra (Admin)</p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Quick Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Miditra amin'ny Google</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
              na amin'ny Mailaka
            </span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Adiresy Mailaka (Email)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="boutiquemevasoa@gmail.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Tenimiafina (Mot de passe)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Eo am-panamarinana...' : isRegisterMode ? 'Mamorona Kaonty Admin' : 'Hiditra (Connexion)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle register mode for initial setup */}
          <div className="pt-2 text-center border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMessage('');
              }}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              {isRegisterMode
                ? 'Efa manana kaonty? Midira eto'
                : 'Mbola tsy manana tenimiafina? Mamoròna kaonty admin'}
            </button>
          </div>
        </div>

        {/* Security / Help note */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            Fanamarihana ara-piarovana:
          </p>
          <p className="text-[11px] leading-relaxed">
            Ity pejy ity dia voatokana ho an'ny tompon'ny BOX WIFI ihany. Ny mailaka ofisialy dia <strong>boutiquemevasoa@gmail.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
