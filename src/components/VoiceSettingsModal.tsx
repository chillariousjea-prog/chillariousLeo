import React, { useState, useEffect } from 'react';
import { X, Volume2, Sparkles, Sliders, Check, Play, BookOpen, Heart } from 'lucide-react';
import { speechManager, AvailableVoice } from '../utils/speech';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({ isOpen, onClose }) => {
  const [voices, setVoices] = useState<AvailableVoice[]>(speechManager.getAvailableVoices());
  const [selectedURI, setSelectedURI] = useState<string>(speechManager.getSelectedVoiceURI() || '');
  const [speed, setSpeed] = useState<number>(speechManager.getSpeechRate());
  const [pitch, setPitch] = useState<number>(speechManager.getSpeechPitch());
  const [isPlayingSample, setIsPlayingSample] = useState<boolean>(false);

  useEffect(() => {
    speechManager.setVoicesListener((loadedVoices) => {
      setVoices(loadedVoices);
      if (!selectedURI) {
        const best = speechManager.getBestBritishVoice();
        if (best) setSelectedURI(best.voiceURI);
      }
    });

    const initialBest = speechManager.getBestBritishVoice();
    if (initialBest && !selectedURI) {
      setSelectedURI(initialBest.voiceURI);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentBestVoice = speechManager.getBestBritishVoice();
  const britishVoices = voices.filter(v => v.isBritish);
  const otherEnglishVoices = voices.filter(v => !v.isBritish);

  const handleSelectVoice = (uri: string) => {
    setSelectedURI(uri);
    speechManager.setSelectedVoice(uri);
  };

  const handlePreset = (type: 'storyteller' | 'bedtime') => {
    if (type === 'storyteller') {
      setSpeed(0.84);
      setPitch(0.92);
      speechManager.setSpeechRate(0.84);
      speechManager.setSpeechPitch(0.92);
    } else {
      setSpeed(0.80);
      setPitch(0.88);
      speechManager.setSpeechRate(0.80);
      speechManager.setSpeechPitch(0.88);
    }
  };

  const handleSpeedChange = (val: number) => {
    setSpeed(val);
    speechManager.setSpeechRate(val);
  };

  const handlePitchChange = (val: number) => {
    setPitch(val);
    speechManager.setSpeechPitch(val);
  };

  const handleTestVoice = () => {
    setIsPlayingSample(true);
    speechManager.speak(
      "Hello Leo! Settle in, get cozy, and let's read the story of the polite screen together.",
      () => setIsPlayingSample(false)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 border-4 border-amber-300 shadow-2xl space-y-4 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-100 text-rose-800 rounded-xl">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">
                Storybook Narrator Voice
              </h3>
              <p className="text-xs text-amber-800 font-medium">
                Standard British English · Soft & Gentle Storytelling
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 pr-1">
          
          {/* Quick Story Presets for Ages 5-10 */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 space-y-2">
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block font-display">
              Storytelling Tone (Ages 5–10):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handlePreset('storyteller')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  speed >= 0.82 && pitch >= 0.90
                    ? 'bg-amber-400 text-amber-950 border-amber-500 font-bold shadow-xs'
                    : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/60'
                }`}
              >
                <div className="text-xs font-extrabold font-display">📖 British Storyteller</div>
                <div className="text-[10px] opacity-80 leading-tight mt-0.5">
                  Steady cadence (0.84x) & warm lower pitch (0.92)
                </div>
              </button>

              <button
                type="button"
                onClick={() => handlePreset('bedtime')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  speed < 0.82 || pitch < 0.90
                    ? 'bg-amber-400 text-amber-950 border-amber-500 font-bold shadow-xs'
                    : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/60'
                }`}
              >
                <div className="text-xs font-extrabold font-display">🌙 Soft Bedtime</div>
                <div className="text-[10px] opacity-80 leading-tight mt-0.5">
                  Extra gentle pace (0.80x) & deep soothing pitch (0.88)
                </div>
              </button>
            </div>
          </div>

          {/* Voice Selector List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select British Narrator:
              </span>
              <span className="text-[11px] text-amber-800 font-semibold">
                🇬🇧 Standard British English
              </span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto border border-slate-200 rounded-2xl p-1.5 bg-slate-50">
              {britishVoices.length > 0 ? (
                britishVoices.map((v) => {
                  const isSelected = selectedURI === v.voiceURI || (!selectedURI && currentBestVoice?.voiceURI === v.voiceURI);
                  return (
                    <button
                      key={v.voiceURI}
                      type="button"
                      onClick={() => handleSelectVoice(v.voiceURI)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-amber-100/80 text-amber-950 font-bold shadow-xs'
                          : 'border-transparent hover:bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-sm">🇬🇧</span>
                        <div className="truncate">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-xs font-semibold block truncate">{v.name}</span>
                            {/google uk english male/i.test(v.name) && (
                              <span className="text-[9px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded-full uppercase shrink-0">
                                ⭐ Recommended
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block">{v.lang}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="p-3 text-center text-xs text-slate-500">
                  Using system English narrator with steady rate and warm pitch tuning.
                </div>
              )}

              {/* Other English voices fallback */}
              {otherEnglishVoices.slice(0, 3).map((v) => {
                const isSelected = selectedURI === v.voiceURI;
                return (
                  <button
                    key={v.voiceURI}
                    type="button"
                    onClick={() => handleSelectVoice(v.voiceURI)}
                    className={`w-full p-2 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-amber-100/80 text-amber-950 font-bold shadow-xs'
                        : 'border-transparent hover:bg-white text-slate-600'
                    }`}
                  >
                    <span className="text-xs truncate">{v.name}</span>
                    {isSelected && <Check className="w-3 h-3 text-amber-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders: Pacing & Warmth */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Reading Pace (Steady)</span>
                <span className="font-mono text-amber-900 font-bold">{speed.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.70"
                max="1.05"
                step="0.02"
                value={speed}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Gentle (0.70x)</span>
                <span>Steady (0.84x)</span>
                <span>Brisk (1.05x)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Pitch (Lower for Warmth)</span>
                <span className="font-mono text-amber-900 font-bold">{pitch.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.80"
                max="1.10"
                step="0.02"
                value={pitch}
                onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Deep / Soothing</span>
                <span>Warm (0.92)</span>
                <span>Higher</span>
              </div>
            </div>
          </div>

        </div>

        {/* Action Footer */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 shrink-0">
          <button
            type="button"
            onClick={handleTestVoice}
            disabled={isPlayingSample}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isPlayingSample ? <Volume2 className="w-4 h-4 animate-bounce text-amber-300" /> : <Play className="w-4 h-4" />}
            <span>{isPlayingSample ? 'Speaking Sample...' : 'Hear Sample 🎧'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-extrabold text-xs transition-all shadow-sm cursor-pointer"
          >
            Save & Listen 🚀
          </button>
        </div>

      </div>
    </div>
  );
};
