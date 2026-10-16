import React from 'react';
import { X, BookOpen, CheckCircle2, ShieldCheck, HelpCircle, Smartphone, Database, Globe } from 'lucide-react';

interface AdminGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminGuideModal: React.FC<AdminGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:px-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Torolalana Feno ho an'ny Tompon'ny Tranonkala
              </h2>
              <p className="text-xs text-slate-400">BOX WIFI – POCKET WIFI (Teny Malagasy)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guide Content */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-3 p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>1. Fidirana Admin sy Code PIN Secret (/admin)</span>
            </h3>
            <p>
              Nafenina tsy ho hitan'ny besinimaro ny bokotra Admin. Ny tompon'ny tranonkala ihany no afaka miditra amin'ny alalan'ny fanoratana mivantana ny <strong>/admin</strong> amin'ny navigateur.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400 text-xs">
              <li>
                <strong>Rohy fidirana:</strong> soraty eo amin'ny fikarohan'ny navigateur (URL) ny <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded">.../admin</code>.
              </li>
              <li>
                <strong>Code PIN par défaut:</strong> <code className="text-cyan-300 font-mono font-bold bg-slate-900 px-2 py-0.5 rounded">123456789000</code>.
              </li>
              <li>
                <strong>Fanovana ny Code PIN:</strong> Mandehana ao amin'ny menu <strong>"Fikirakirana & Fiarovana"</strong> ao amin'ny Admin dia afaka manova ny Code PIN vaovao ianao amin'ny fotoana rehetra.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              <span>2. Fitantanana ny Laharana WhatsApp</span>
            </h3>
            <p>
              Ity no laharana handraisan'ny orinasa ireo commande alefan'ny mpanjifa avy amin'ny bokotra "Hividy amin'ny WhatsApp".
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400 text-xs">
              <li>Mandehana ao amin'ny menu <strong>"Fikirakirana & WhatsApp"</strong> ao amin'ny Admin.</li>
              <li>Soraty amin'ny endrika iraisam-pirenena ny laharana (tsy misy marika "+" na habaka). Ohatra: <strong>261341234567</strong>.</li>
              <li>Tsindrio ny <strong>"Hitsapa ny rohy wa.me"</strong> hanamarinana fa misokatra tsara ny WhatsApp-nao.</li>
              <li>Aza adino ny manindry ny <strong>"Mitahiry ny Fandrindrana Rehetra"</strong>.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <h3 className="text-base font-bold text-blue-400 flex items-center gap-2">
              <Database className="w-5 h-5" />
              <span>3. Sary Base64 sy Compression Automatique (Tsy misy Storage)</span>
            </h3>
            <p>
              Araka ny toromarika, <strong>tsy mampiasa Firebase Storage</strong> ity tranonkala ity mba hisorohana ny fandaniana. Ny sary dia voatsindry ho azy amin'ny alalan'ny HTML Canvas:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400 text-xs">
              <li>
                Ahena ho azy ho <strong>800 × 800 px ambony indrindra</strong> ny refy, ary kendrena ho <strong>latsaky ny 150 Ko</strong> ny habeny.
              </li>
              <li>
                Avadika ho <strong>Base64 Data URL</strong> ary tehirizina ao amin'ny document Firestore.
              </li>
              <li>
                Misy rafitra manokana manamarina fa <strong>latsaky ny 700 KiB</strong> ny fitambaran'ny document tsirairay mba hanajana ny fetra 1 MiB an'ny Firestore.
              </li>
              <li>
                Raha lehibe loatra ny sary dia hampandrenesina avy hatrany ianao mba hisafidy sary maivana kokoa alohan'ny hitahirizana azy.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3 p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span>4. Fiarovana sy Firestore Security Rules</span>
            </h3>
            <p>
              Voaaro tanteraka ny database:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400 text-xs">
              <li>
                <strong>Mpitsidika (Public):</strong> Afaka mamaky ireo vokatra navoaka ihany (isActive == true) sy ny votoatin'ny pejy fandraisana.
              </li>
              <li>
                <strong>Administrateur:</strong> Ianao irery ihany no afaka manampy, manova, mamafa vokatra, sary, ary manova ny laharana WhatsApp.
              </li>
              <li>
                Ny Security Rules dia efa voarafitra ao amin'ny <code className="text-cyan-300">firestore.rules</code> ary voapetraka ao amin'ny Firebase.
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="space-y-3 p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <h3 className="text-base font-bold text-purple-400 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <span>5. Fomba Famoahana ny Tranonkala (Production)</span>
            </h3>
            <p>
              Rehefa hamoaka ny tranonkala amin'ny aterineto ianao:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400 text-xs">
              <li>Raha ao amin'ny AI Studio dia mandeha mivantana amin'ny URL nomena ny fampiharana.</li>
              <li>
                Raha handefa amin'ny hosting manokana (Firebase Hosting, Vercel, Netlify): ataovy ny baiko <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">npm run build</code>, dia apetraho ny lahatahiry <code className="text-cyan-300">dist/</code>.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-8 border-t border-slate-800 flex justify-end bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
          >
            Mazava tsara, misaotra
          </button>
        </div>
      </div>
    </div>
  );
};
