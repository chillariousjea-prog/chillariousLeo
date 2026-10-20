import React, { useState } from 'react';
import { Heart, Brain, Info, BookOpen, Volume2, VolumeX, Type, ShieldCheck, AlertCircle, HelpCircle, Sliders } from 'lucide-react';
import { GaugeState, HitlStage } from '../types/storybook';

interface HeaderGaugesProps {
  gauges: GaugeState;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  isDyslexicMode: boolean;
  onToggleDyslexicMode: () => void;
  textSize: 'normal' | 'large';
  onToggleTextSize: () => void;
  onOpenGlossary: () => void;
  onOpenVoiceSettings: () => void;
}

export const HeaderGauges: React.FC<HeaderGaugesProps> = ({
  gauges,
  isAudioPlaying,
  onToggleAudio,
  isDyslexicMode,
  onToggleDyslexicMode,
  textSize,
  onToggleTextSize,
  onOpenGlossary,
  onOpenVoiceSettings
}) => {
  const [showInfoModal, setShowInfoModal] = useState<null | 'heart' | 'head' | 'hitl'>(null);

  // Render 5 heart icons with fill according to state (1-5)
  const renderHearts = () => {
    return Array.from({ length: 5 }).map((_, index) => {
      const isFilled = index < gauges.heart;
      return (
        <Heart
          key={index}
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
            isFilled
              ? 'fill-rose-500 text-rose-500 scale-110 drop-shadow-xs'
              : 'fill-rose-100 text-rose-300'
          }`}
        />
      );
    });
  };

  const getHitlBadge = (stage: HitlStage) => {
    switch (stage) {
      case 'out-of-loop':
        return {
          color: 'bg-rose-100 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
          title: 'Out of Loop',
          icon: '❌',
          sub: 'Trusting the screen blindly'
        };
      case 'co-pilot':
        return {
          color: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-500',
          title: 'Co-Pilot',
          icon: '❓',
          sub: 'Questioning & checking facts'
        };
      case 'human-directs':
        return {
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          dot: 'bg-emerald-500',
          title: 'Human Directs',
          icon: '🧠',
          sub: 'Human mind in control!'
        };
    }
  };

  const hitlInfo = getHitlBadge(gauges.hitlStage);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b-2 border-amber-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
          
          {/* Logo / Book Title */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white font-bold shadow-sm">
              📖
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base text-slate-900 font-display tracking-tight block leading-tight">
                Leo & the Polite Screen
              </span>
              <span className="text-[10px] sm:text-xs text-amber-700 font-medium">
                AI Literacy Storybook #1
              </span>
            </div>
          </div>

          {/* Gauges Panel: Heart, Head, HITL Dial */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 bg-amber-50/80 p-1.5 sm:p-2 rounded-2xl border border-amber-200">
            
            {/* Heart Gauge */}
            <button
              type="button"
              onClick={() => setShowInfoModal('heart')}
              className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-left transition-colors cursor-pointer group"
              title="Click to learn about Leo's Heart Gauge"
            >
              <div className="flex items-center">{renderHearts()}</div>
              <div className="hidden md:block text-[11px] font-semibold text-rose-900 leading-none">
                <div>Heart: {gauges.heart}/5</div>
                <div className="text-[9px] text-rose-600 font-normal">{gauges.heartLabel}</div>
              </div>
              <Info className="w-3 h-3 text-rose-400 group-hover:text-rose-600" />
            </button>

            {/* Head Gauge */}
            <button
              type="button"
              onClick={() => setShowInfoModal('head')}
              className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white hover:bg-sky-50 border border-sky-200 text-left transition-colors cursor-pointer group"
              title="Click to learn about Leo's Head Gauge"
            >
              <div className="relative flex items-center">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="w-14 sm:w-20">
                <div className="flex justify-between items-center text-[10px] font-bold text-sky-900">
                  <span>Head</span>
                  <span>{gauges.head}%</span>
                </div>
                <div className="w-full bg-sky-100 rounded-full h-2 overflow-hidden border border-sky-200">
                  <div
                    className="bg-sky-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${gauges.head}%` }}
                  />
                </div>
              </div>
              <Info className="w-3 h-3 text-sky-400 group-hover:text-sky-600" />
            </button>

            {/* HITL Control Dial */}
            <button
              type="button"
              onClick={() => setShowInfoModal('hitl')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${hitlInfo.color}`}
              title="Click to learn about the Human-in-the-Loop Dial"
            >
              <span className="text-sm">{hitlInfo.icon}</span>
              <div className="text-left text-[11px] font-bold leading-tight">
                <span className="block">{hitlInfo.title}</span>
                <span className="text-[9px] opacity-80 hidden lg:inline font-normal">HITL Dial</span>
              </div>
              <Info className="w-3 h-3 opacity-60" />
            </button>
          </div>

          {/* Accessibility Quick Controls (UDL) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Audio Narration Toggle */}
            <button
              type="button"
              onClick={onToggleAudio}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isAudioPlaying
                  ? 'bg-emerald-500 text-white border-emerald-600 animate-pulse'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
              title={isAudioPlaying ? 'Pause narration' : 'Play audio narration'}
            >
              {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {isAudioPlaying ? 'Reading...' : 'Read Aloud'}
              </span>
            </button>

            {/* Voice Settings Button (Warm Voice Selector) */}
            <button
              type="button"
              onClick={onOpenVoiceSettings}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
              title="Voice Settings (Choose Friendly Storyteller Voice)"
            >
              <Sliders className="w-4 h-4 text-amber-700" />
              <span className="hidden lg:inline">Voice</span>
            </button>

            {/* Dyslexia-friendly Font Mode Toggle */}
            <button
              type="button"
              onClick={onToggleDyslexicMode}
              className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                isDyslexicMode
                  ? 'bg-amber-400 text-amber-950 border-amber-500'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
              title="Toggle Dyslexia-friendly font (Comic Neue)"
            >
              <Type className="w-4 h-4" />
              <span className="sr-only">Dyslexia font</span>
            </button>

            {/* Text Size Toggle */}
            <button
              type="button"
              onClick={onToggleTextSize}
              className={`px-2 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                textSize === 'large'
                  ? 'bg-amber-400 text-amber-950 border-amber-500'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
              title="Toggle Large Text size"
            >
              {textSize === 'large' ? 'A+' : 'A'}
            </button>

            {/* Glossary Button */}
            <button
              type="button"
              onClick={onOpenGlossary}
              className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              title="Open Vocabulary & Concept Glossary"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">Glossary</span>
            </button>
          </div>

        </div>
      </div>

      {/* Info Explainer Modals for Gauges */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-4 border-amber-300 shadow-2xl space-y-4">
            {showInfoModal === 'heart' && (
              <>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
                    <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 font-display">Leo's Heart Gauge</h3>
                    <p className="text-xs text-rose-600 font-semibold">Emotional Connection & Well-being</p>
                  </div>
                </div>
                <div className="text-sm text-slate-700 space-y-2">
                  <p>
                    This gauge tracks Leo's real feelings. When he isolates himself with the tablet screen, his heart starts lonely (1/5) or gets false comfort (2/5).
                  </p>
                  <p className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-rose-900">
                    💖 <strong>Key Lesson:</strong> A screen cannot replace real friends or loving family members who have living hearts!
                  </p>
                </div>
              </>
            )}

            {showInfoModal === 'head' && (
              <>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-sky-100 text-sky-600 rounded-2xl">
                    <Brain className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 font-display">Leo's Head Gauge</h3>
                    <p className="text-xs text-sky-600 font-semibold">Critical Thinking & Skepticism</p>
                  </div>
                </div>
                <div className="text-sm text-slate-700 space-y-2">
                  <p>
                    This gauge measures Leo's <strong>critical thinking</strong>. At first, Leo believes everything Aria says (0% - 20%).
                  </p>
                  <p className="bg-sky-50 p-3 rounded-xl border border-sky-200 text-sky-900">
                    🧠 <strong>Key Lesson:</strong> When Leo tests Aria with real photo evidence, his critical eye wakes up to 100%!
                  </p>
                </div>
              </>
            )}

            {showInfoModal === 'hitl' && (
              <>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl text-2xl">
                    🛡️
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 font-display">Human-in-the-Loop (HITL) Dial</h3>
                    <p className="text-xs text-amber-700 font-semibold">The Golden Rule of AI</p>
                  </div>
                </div>
                <div className="text-sm text-slate-700 space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50 border border-rose-200">
                      <span className="text-lg">❌</span>
                      <div>
                        <strong className="text-rose-800 text-xs">Stage 1: Out of Loop</strong>
                        <p className="text-[11px] text-slate-600">The human blindly accepts whatever the computer prints.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200">
                      <span className="text-lg">❓</span>
                      <div>
                        <strong className="text-amber-800 text-xs">Stage 2: Co-Pilot</strong>
                        <p className="text-[11px] text-slate-600">The human questions, checks sources, and spots mistakes.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                      <span className="text-lg">🧠</span>
                      <div>
                        <strong className="text-emerald-800 text-xs">Stage 3: Human Directs</strong>
                        <p className="text-[11px] text-slate-600">The human makes all final decisions and values real human relationships.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => setShowInfoModal(null)}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-sm transition-all shadow-md cursor-pointer"
            >
              Got it, let's read! 🚀
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
