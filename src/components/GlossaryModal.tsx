import React from 'react';
import { X, Volume2, Sparkles, BookOpen } from 'lucide-react';
import { VOCABULARY_DICTIONARY } from '../data/storyData';
import { speechManager } from '../utils/speech';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const entries = Object.values(VOCABULARY_DICTIONARY);

  const handlePronounce = (term: string, explanation: string) => {
    speechManager.speak(`${term}. ${explanation}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col border-4 border-amber-300 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 flex items-center justify-between border-b border-amber-300">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/30 rounded-xl">
              <BookOpen className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-display">
                AI Literacy Explorer Glossary
              </h2>
              <p className="text-xs text-amber-950 font-medium">
                Key concepts every young digital detective should know!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/40 hover:bg-white text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.term}
              className="p-4 rounded-2xl bg-amber-50/60 border-2 border-amber-200 hover:border-amber-300 transition-all space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-extrabold text-amber-950 font-display flex items-center gap-2">
                    {entry.term}
                    <button
                      onClick={() => handlePronounce(entry.term, entry.kidExplanation)}
                      className="p-1 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 transition-transform active:scale-90"
                      title="Listen"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </h3>
                  <span className="text-xs text-amber-700 font-mono">
                    🗣️ /{entry.phonetic}/
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-100 text-sm text-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Kid Explanation:
                </div>
                <p className="leading-snug">{entry.kidExplanation}</p>
              </div>

              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Formal Definition: </span>
                {entry.definition}
              </div>

              <div className="text-xs text-slate-500 italic bg-amber-100/50 p-2 rounded-lg">
                <span className="font-semibold not-italic text-amber-900">Story Example: </span>
                {entry.example}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            Back to the Story 📖
          </button>
        </div>
      </div>
    </div>
  );
};
