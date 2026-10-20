import React, { useState } from 'react';
import { Cpu, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

export const WordPredictorDemo: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<number>(0);
  const [chosenWord, setChosenWord] = useState<string | null>(null);

  const testPrompts = [
    {
      sentence: 'The Great Sphinx of Egypt is made of...',
      options: [
        { word: 'solid gold cheese', probability: '48%', flag: 'Silly prediction!', isHallucination: true },
        { word: 'ancient limestone stone', probability: '38%', flag: 'Real physical fact', isHallucination: false },
        { word: 'space marshmallow', probability: '14%', flag: 'Fantasy prediction', isHallucination: true }
      ],
      lesson: 'Aria has never touched a stone or visited Egypt. It just chains words together like mathematical dominoes!'
    },
    {
      sentence: 'Leo\'s Mom is secretly...',
      options: [
        { word: 'Queen Cleopatra living in a teapot', probability: '52%', flag: 'Aria\'s silly hallucination', isHallucination: true },
        { word: 'a kind person making hot chocolate', probability: '41%', flag: 'Real world truth', isHallucination: false },
        { word: 'a galactic robot spy', probability: '7%', flag: 'Sci-fi token pattern', isHallucination: true }
      ],
      lesson: 'Aria doesn\'t know your family! It borrows words from fairy tales and jokes without understanding what a Mom is.'
    }
  ];

  const current = testPrompts[selectedPrompt];

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 border-2 border-indigo-500 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-indigo-200 font-display">
              X-Ray Mode: Inside Aria's Word Predictor
            </h4>
            <p className="text-xs text-slate-400">
              See the math calculations behind Aria's words!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedPrompt((selectedPrompt + 1) % testPrompts.length);
            setChosenWord(null);
          }}
          className="text-xs flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Switch Sentence</span>
        </button>
      </div>

      <div className="space-y-3">
        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
          <span className="text-xs text-indigo-300 font-mono uppercase tracking-wider block mb-1">
            Input Sentence:
          </span>
          <p className="text-base sm:text-lg font-bold text-amber-300 font-mono">
            "{current.sentence}"
          </p>
        </div>

        <div>
          <span className="text-xs text-slate-400 block mb-2 font-medium">
            Next Word Probability Calculator (Aria's Algorithm):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {current.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setChosenWord(opt.word)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  chosenWord === opt.word
                    ? 'bg-indigo-600/40 border-indigo-400 shadow-md ring-2 ring-indigo-400'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-indigo-300 mb-1 font-mono">
                  <span>Chance: {opt.probability}</span>
                  {opt.isHallucination ? (
                    <span className="text-[10px] bg-purple-900/60 text-purple-200 px-1.5 py-0.5 rounded">Guess</span>
                  ) : (
                    <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-1.5 py-0.5 rounded">Fact</span>
                  )}
                </div>
                <div className="font-bold text-white text-sm">
                  "{opt.word}"
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {opt.flag}
                </div>
              </button>
            ))}
          </div>
        </div>

        {chosenWord && (
          <div className="p-3 bg-indigo-950/60 border border-indigo-500/40 rounded-xl text-xs space-y-1 animate-in fade-in">
            <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Aria outputs: "{current.sentence} {chosenWord}!"</span>
            </div>
            <p className="text-slate-300">
              💡 {current.lesson}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
