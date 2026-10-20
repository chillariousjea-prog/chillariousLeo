import React, { useState, useEffect } from 'react';
import { HeaderGauges } from './components/HeaderGauges';
import { SceneSpread } from './components/SceneSpread';
import { SortingActivity } from './components/SortingActivity';
import { GlossaryModal } from './components/GlossaryModal';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { SCENE_CONFIGS } from './data/storyData';
import { SceneId } from './types/storybook';
import { speechManager } from './utils/speech';
import { BookMarked, Sparkles, HelpCircle, ArrowLeft, RotateCcw, Sliders } from 'lucide-react';

export default function App() {
  const [currentSceneId, setCurrentSceneId] = useState<SceneId>('scene-1');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isDyslexicMode, setIsDyslexicMode] = useState<boolean>(false);
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState<boolean>(false);

  const currentConfig = SCENE_CONFIGS[currentSceneId];

  // Sync speech state with speechManager
  useEffect(() => {
    speechManager.setListener((speaking) => {
      setIsAudioPlaying(speaking);
    });

    return () => {
      speechManager.stop();
    };
  }, []);

  // Update body class for dyslexia font mode
  useEffect(() => {
    if (isDyslexicMode) {
      document.body.classList.add('font-dyslexic-mode');
    } else {
      document.body.classList.remove('font-dyslexic-mode');
    }
  }, [isDyslexicMode]);

  // Handle scene change
  const handleNavigate = (sceneId: string) => {
    speechManager.stop();
    setCurrentSceneId(sceneId as SceneId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleAudio = () => {
    if (isAudioPlaying) {
      speechManager.stop();
    } else {
      speechManager.speak(currentConfig.narrationText);
    }
  };

  const scenesList: { id: SceneId; label: string; num: string }[] = [
    { id: 'scene-1', label: '1. The Hook', num: '1' },
    { id: 'scene-2a', label: '2A. The Drift', num: '2A' },
    { id: 'scene-2b', label: '2B. Code Check', num: '2B' },
    { id: 'scene-3', label: '3. Climax & Egypt', num: '3' },
    { id: 'scene-4', label: '4. Sofa & Mom', num: '4' },
    { id: 'assessment', label: '5. Sorting Game', num: '5' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBEB] font-body selection:bg-amber-200 text-slate-800">
      
      {/* 1. Global Fixed Top Header with Gauges & Accessibility Controls */}
      <HeaderGauges
        gauges={currentConfig.gauges}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
        isDyslexicMode={isDyslexicMode}
        onToggleDyslexicMode={() => setIsDyslexicMode(!isDyslexicMode)}
        textSize={textSize}
        onToggleTextSize={() => setTextSize(textSize === 'normal' ? 'large' : 'normal')}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenVoiceSettings={() => setIsVoiceSettingsOpen(true)}
      />

      {/* Main Reading Stage */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        
        {/* Story Progress Stepper / Scene Navigator for Teachers & Pupils */}
        <nav aria-label="Story chapter progress" className="bg-white/80 backdrop-blur-xs p-2 rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-amber-900 px-2 flex items-center gap-1">
              <BookMarked className="w-4 h-4 text-amber-700" />
              <span className="hidden sm:inline">Chapter:</span>
            </span>
            <div className="flex items-center gap-1">
              {scenesList.map((step) => {
                const isActive = currentSceneId === step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleNavigate(step.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-amber-400 text-amber-950 shadow-xs ring-2 ring-amber-300/60'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-800'
                    }`}
                  >
                    <span>{step.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleNavigate('scene-1')}
            className="text-xs text-amber-800 hover:text-amber-950 px-2 py-1 rounded-lg hover:bg-amber-100 flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            title="Start from beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Restart</span>
          </button>
        </nav>

        {/* Dynamic Scene Content: Spread View or Final Assessment View */}
        {currentSceneId === 'assessment' ? (
          <div className="bg-white rounded-3xl border-3 border-amber-200 storybook-card p-4 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-amber-200">
              <button
                type="button"
                onClick={() => handleNavigate('scene-4')}
                className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Story Resolution</span>
              </button>
              <span className="text-xs text-amber-800 font-bold bg-amber-100 px-3 py-1 rounded-full">
                Interactive Activity
              </span>
            </div>

            <SortingActivity
              onRestartStory={() => handleNavigate('scene-1')}
              onJumpToScene={handleNavigate}
            />
          </div>
        ) : (
          <SceneSpread
            scene={currentConfig}
            onNavigate={handleNavigate}
            isAudioPlaying={isAudioPlaying}
            onToggleAudio={handleToggleAudio}
            textSize={textSize}
          />
        )}

      </main>

      {/* Floating Audio Narration Pill for Easy Reach on Mobile & Desktop */}
      <aside aria-label="Narration audio bar" className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleAudio}
          className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-xl font-black text-sm transition-all transform hover:scale-105 active:scale-95 cursor-pointer border-2 ${
            isAudioPlaying
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-200'
              : 'bg-amber-400 hover:bg-amber-500 text-amber-950 border-amber-300 ring-4 ring-amber-100'
          }`}
          title="Toggle audio narrator"
        >
          {isAudioPlaying ? (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span>Pause Audio Narration</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-900" />
              <span>Play Audio Narration</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsVoiceSettingsOpen(true)}
          className="p-3 rounded-full bg-white hover:bg-amber-50 text-amber-900 border-2 border-amber-300 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          title="Voice Settings (Change Narrator Voice / Tone)"
        >
          <Sliders className="w-5 h-5 text-amber-800" />
        </button>
      </aside>

      {/* Quiet educational footer */}
      <footer className="w-full bg-amber-100/60 border-t border-amber-200 py-4 px-6 text-center text-xs text-slate-600 mt-8">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <p className="font-medium text-amber-950">
            <strong>"Leo and the Polite Screen"</strong> · Primary AI Literacy Storybook #1
          </p>
          <div className="flex items-center gap-4 text-amber-900">
            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="hover:underline cursor-pointer font-semibold"
            >
              Glossary of AI Terms
            </button>
            <span aria-hidden="true">·</span>
            <span>Key Stage 1 & 2 UDL Aligned</span>
          </div>
        </div>
      </footer>

      {/* Vocabulary Glossary Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      {/* Voice Settings Modal */}
      <VoiceSettingsModal
        isOpen={isVoiceSettingsOpen}
        onClose={() => setIsVoiceSettingsOpen(false)}
      />

    </div>
  );
}
