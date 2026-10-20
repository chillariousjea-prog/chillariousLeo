import React, { useState } from 'react';
import { Volume2, X, Sparkles, HelpCircle } from 'lucide-react';
import { VOCABULARY_DICTIONARY } from '../data/storyData';
import { speechManager } from '../utils/speech';

interface VocabTooltipProps {
  termKey: 'anthropomorphism' | 'algorithm' | 'word-predictor' | 'hitl';
  displayText?: string;
}

export const VocabTooltip: React.FC<VocabTooltipProps> = ({ termKey, displayText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const entry = VOCABULARY_DICTIONARY[termKey];

  if (!entry) return <span>{displayText || termKey}</span>;

  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation();
    speechManager.speak(`${entry.term}. ${entry.kidExplanation}`);
  };

  return (
    <span className="relative inline-block my-0.5">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
        aria-label={`Vocabulary word: ${entry.term}`}
      >
        <span>{displayText || entry.term}</span>
        <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 sm:w-80 p-4 bg-white rounded-2xl shadow-xl border-2 border-amber-400 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-2 border-b border-amber-100 pb-2 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-extrabold text-amber-900 font-display">
                    {entry.term}
                  </span>
                  <button
                    onClick={handlePronounce}
                    title="Listen to pronunciation"
                    className="p-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-amber-700 italic font-mono">
                  🗣️ /{entry.phonetic}/
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-slate-700">
                <span className="font-bold text-amber-900 flex items-center gap-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Kid Explanation:
                </span>
                <p className="leading-snug">{entry.kidExplanation}</p>
              </div>

              <div className="text-slate-600">
                <span className="font-semibold text-slate-800">Formal Meaning: </span>
                <span>{entry.definition}</span>
              </div>

              <div className="text-slate-500 italic text-xs bg-slate-50 p-2 rounded-lg">
                <span className="font-medium not-italic text-slate-700">In this story: </span>
                {entry.example}
              </div>
            </div>
          </div>
        </>
      )}
    </span>
  );
};
