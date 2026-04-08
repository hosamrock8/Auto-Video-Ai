import { useStudioStore } from '@/store/useStudioStore';
import { useTranslationStore } from '@/store/useTranslationStore';
import SelectableCard from './shared/SelectableCard';
import { Mic, Globe, Play, FileText, Sparkles, Wand2 } from 'lucide-react';

const VOICES = [
  { id: 'adam', title: 'Adam', desc: 'Deep, engaging male narration', icon: Mic, badge: 'Male' },
  { id: 'john', title: 'John', desc: 'Authoritative, clear voice', icon: Mic, badge: 'Male' },
  { id: 'bella', title: 'Bella', desc: 'Soft, mysterious female tone', icon: Mic, badge: 'Female' },
  { id: 'emily', title: 'Emily', desc: 'Energetic, fast-paced narration', icon: Mic, badge: 'Female' },
];

const LANGUAGES = [
  { id: 'english', label: 'English (US)', flag: '🇺🇸' },
  { id: 'arabic', label: 'Arabic', flag: '🇸🇦' },
  { id: 'spanish', label: 'Spanish', flag: '🇪🇸' },
  { id: 'french', label: 'French', flag: '🇫🇷' },
];

export default function Step2Voice() {
  const { wizardData, updateWizardData } = useStudioStore();
  const { t, lang } = useTranslationStore();

  const script = wizardData.generatedScript;

  const handleScriptChange = (text: string) => {
    if (!script) return;
    // For simplicity in this personal tool, we edit the first scene's text or a combined view
    const newScenes = [...script.scenes];
    newScenes[0].narrator_text = text;
    updateWizardData({ 
      generatedScript: { ...script, scenes: newScenes } 
    });
  };

  return (
    <div className={`w-full h-full flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ${lang === 'ar' ? 'text-right' : ''}`}>
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">
          {lang === 'en' ? 'Script & ' : 'السيناريو و'} <span className="text-secondary">{t('voice')}</span>
        </h2>
        <p className="text-gray-500 text-sm font-medium">
          {lang === 'en' ? 'Review the AI-generated scenario and choose your narrator.' : 'راجع السيناريو المولد واختبر صوت المعلق.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Left: Script Review */}
        <div className="space-y-6 flex flex-col">
          <label className={`text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 block ${lang === 'ar' ? 'text-right' : ''}`}>
             <div className="flex items-center gap-2 mb-2">
                <FileText className="w-3 h-3 text-primary" />
                {lang === 'en' ? 'Mastermind Scenario' : 'سيناريو لومينا'}
             </div>
          </label>
          <div className="flex-1 relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[2.5rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
             <textarea
                value={script?.scenes[0]?.narrator_text || ''}
                onChange={(e) => handleScriptChange(e.target.value)}
                className={`relative w-full h-[350px] bg-[#050505] border border-white/10 rounded-[2rem] p-8 text-lg font-medium leading-relaxed focus:outline-none focus:border-primary/40 transition-all no-scrollbar ${lang === 'ar' ? 'text-right' : ''}`}
                placeholder={t('mastermind_loading')}
             />
             <div className="absolute bottom-6 right-8 flex items-center gap-2 pointer-events-none">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                   {lang === 'en' ? 'AI Optimized' : 'محسن بالذكاء الاصطناعي'}
                </span>
             </div>
          </div>
        </div>

        {/* Right: Language & Voice */}
        <div className="space-y-8">
           <div className="space-y-4">
              <label className={`text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 block ${lang === 'ar' ? 'text-right' : ''}`}>
                {lang === 'en' ? 'Primary Language' : 'اللغة الأساسية'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => updateWizardData({ language: l.id })}
                    className={`flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all ${
                      wizardData.language === l.id
                        ? 'bg-primary/10 border-primary text-white shadow-lg'
                        : 'bg-white/[0.02] border-white/5 text-gray-500 hover:border-white/20'
                    }`}
                  >
                    <span className="text-lg">{l.flag}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{l.label}</span>
                  </button>
                ))}
              </div>
           </div>

           <div className="space-y-4">
              <label className={`text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 block ${lang === 'ar' ? 'text-right' : ''}`}>
                {lang === 'en' ? 'Select Narration Voice' : 'اختر صوت المعلق'}
              </label>
              <div className="grid grid-cols-1 gap-3">
                {VOICES.map((v) => (
                  <div key={v.id} className="relative">
                    <SelectableCard
                      {...v}
                      selected={wizardData.voice === v.id}
                      onClick={() => updateWizardData({ voice: v.id })}
                    />
                    <button className={`absolute bottom-6 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-primary transition-all active:scale-95 ${lang === 'ar' ? 'left-6' : 'right-6'}`}>
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

