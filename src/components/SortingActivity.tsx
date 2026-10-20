import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, RotateCcw, Sparkles, HelpCircle, ArrowRight, ShieldCheck, Heart, Cpu } from 'lucide-react';
import { SORTING_ITEMS } from '../data/storyData';
import { SortingItem } from '../types/storybook';
import { speechManager } from '../utils/speech';

interface SortingActivityProps {
  onRestartStory: () => void;
  onJumpToScene: (sceneId: string) => void;
}

export const SortingActivity: React.FC<SortingActivityProps> = ({ onRestartStory, onJumpToScene }) => {
  const [items, setItems] = useState<SortingItem[]>(SORTING_ITEMS);
  const [realFriends, setRealFriends] = useState<SortingItem[]>([]);
  const [digitalTools, setDigitalTools] = useState<SortingItem[]>([]);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; isCorrect: boolean } | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [selectedItemForTap, setSelectedItemForTap] = useState<SortingItem | null>(null);

  const totalItems = SORTING_ITEMS.length;
  const sortedCount = realFriends.length + digitalTools.length;
  const isCompleted = sortedCount === totalItems;

  const triggerCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    speechManager.speak('Fantastic work! You correctly sorted real friends with human hearts from digital tools and algorithms! You are an official Human-in-the-Loop Champion!');
  };

  const handleDropItem = (item: SortingItem, targetCategory: 'real-friend' | 'digital-tool') => {
    const isCorrect = item.targetCategory === targetCategory;

    if (isCorrect) {
      // Remove from pool
      setItems(prev => prev.filter(i => i.id !== item.id));
      if (targetCategory === 'real-friend') {
        setRealFriends(prev => [...prev, item]);
      } else {
        setDigitalTools(prev => [...prev, item]);
      }

      setFeedbackMessage({
        text: `Spot on! ${item.explanation}`,
        isCorrect: true
      });
      speechManager.speak(`Spot on! ${item.explanation}`);

      if (sortedCount + 1 === totalItems) {
        setShowCertificate(true);
        triggerCelebration();
      }
    } else {
      const hint = targetCategory === 'real-friend'
        ? `Remember: ${item.name} doesn't have a human heart or feelings. It is a machine or tool!`
        : `Think again! ${item.name} has real biological feelings and lived experiences!`;
      setFeedbackMessage({
        text: hint,
        isCorrect: false
      });
      speechManager.speak(hint);
    }
  };

  const handleDragStart = (e: React.DragEvent, item: SortingItem) => {
    e.dataTransfer.setData('text/plain', item.id);
    setActiveDragId(item.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnZone = (e: React.DragEvent, category: 'real-friend' | 'digital-tool') => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain') || activeDragId;
    if (!itemId) return;

    const item = items.find(i => i.id === itemId);
    if (item) {
      handleDropItem(item, category);
    }
    setActiveDragId(null);
  };

  const handleReset = () => {
    setItems(SORTING_ITEMS);
    setRealFriends([]);
    setDigitalTools([]);
    setFeedbackMessage(null);
    setShowCertificate(false);
    setSelectedItemForTap(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & Instructions Banner */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-200 rounded-3xl border-2 border-amber-300 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white text-xs font-extrabold rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> End-of-Story Challenge
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              The AI Literacy Sorting Challenge
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 max-w-2xl">
              Can you sort each card into the right category? Drag & drop, or tap an item below and then tap a box!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-500 block font-semibold">Sorted</span>
              <span className="text-xl font-black text-amber-900 font-mono">
                {sortedCount} / {totalItems}
              </span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title="Reset Challenge"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Live Feedback Message Bar */}
        {feedbackMessage && (
          <div
            className={`mt-4 p-3 rounded-2xl border text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-200 ${
              feedbackMessage.isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            {feedbackMessage.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <HelpCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <p className="font-medium leading-relaxed">{feedbackMessage.text}</p>
          </div>
        )}
      </div>

      {/* Target Drop Zones: 2 Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Category 1: Real Friends */}
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDropOnZone(e, 'real-friend')}
          onClick={() => {
            if (selectedItemForTap) {
              handleDropItem(selectedItemForTap, 'real-friend');
              setSelectedItemForTap(null);
            }
          }}
          className={`min-h-[260px] p-4 sm:p-5 rounded-3xl border-3 transition-all flex flex-col justify-between ${
            selectedItemForTap
              ? 'border-dashed border-rose-400 bg-rose-50/70 hover:bg-rose-100/70 cursor-pointer ring-2 ring-rose-400'
              : 'border-rose-300 bg-rose-50/40'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-rose-200 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500 text-white">
                  <Heart className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-rose-950 font-display">
                    Category 1: Real Friend
                  </h3>
                  <p className="text-xs text-rose-700 font-medium">
                    Has a living heart & lived experiences
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-800 bg-rose-200/60 px-2 py-0.5 rounded-full">
                {realFriends.length} / 4
              </span>
            </div>

            {/* List of sorted items */}
            <div className="space-y-2">
              {realFriends.length === 0 ? (
                <div className="text-center py-8 text-xs sm:text-sm text-rose-400 italic">
                  Drag items here or tap an item below then tap this box!
                </div>
              ) : (
                realFriends.map(item => (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-2xl border border-rose-200 shadow-xs flex items-center justify-between gap-3 animate-in zoom-in-95"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <span className="font-extrabold text-sm text-slate-900 block font-display">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">
                          {item.description}
                        </span>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  </div>
                ))
              )}
            </div>
          </div>

          {selectedItemForTap && (
            <div className="mt-3 text-center py-2 bg-rose-200/80 rounded-xl text-xs font-bold text-rose-900 animate-pulse">
              👉 Tap here to place "{selectedItemForTap.name}" in Real Friends
            </div>
          )}
        </div>

        {/* Category 2: Digital Tools */}
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDropOnZone(e, 'digital-tool')}
          onClick={() => {
            if (selectedItemForTap) {
              handleDropItem(selectedItemForTap, 'digital-tool');
              setSelectedItemForTap(null);
            }
          }}
          className={`min-h-[260px] p-4 sm:p-5 rounded-3xl border-3 transition-all flex flex-col justify-between ${
            selectedItemForTap
              ? 'border-dashed border-sky-400 bg-sky-50/70 hover:bg-sky-100/70 cursor-pointer ring-2 ring-sky-400'
              : 'border-sky-300 bg-sky-50/40'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-sky-200 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-500 text-white">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-sky-950 font-display">
                    Category 2: Digital Tool
                  </h3>
                  <p className="text-xs text-sky-700 font-medium">
                    Anthropomorphized object (code & machinery)
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-sky-800 bg-sky-200/60 px-2 py-0.5 rounded-full">
                {digitalTools.length} / 4
              </span>
            </div>

            {/* List of sorted items */}
            <div className="space-y-2">
              {digitalTools.length === 0 ? (
                <div className="text-center py-8 text-xs sm:text-sm text-sky-400 italic">
                  Drag items here or tap an item below then tap this box!
                </div>
              ) : (
                digitalTools.map(item => (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-2xl border border-sky-200 shadow-xs flex items-center justify-between gap-3 animate-in zoom-in-95"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <span className="font-extrabold text-sm text-slate-900 block font-display">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">
                          {item.description}
                        </span>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  </div>
                ))
              )}
            </div>
          </div>

          {selectedItemForTap && (
            <div className="mt-3 text-center py-2 bg-sky-200/80 rounded-xl text-xs font-bold text-sky-900 animate-pulse">
              👉 Tap here to place "{selectedItemForTap.name}" in Digital Tools
            </div>
          )}
        </div>
      </div>

      {/* Available Items Pool */}
      {!isCompleted ? (
        <div className="p-5 bg-white rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Items to Sort (Tap or Drag):
            </span>
            {selectedItemForTap && (
              <span className="text-xs text-amber-700 font-bold animate-pulse">
                Selected: {selectedItemForTap.name} — now tap a box above!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {items.map(item => {
              const isSelected = selectedItemForTap?.id === item.id;
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onClick={() => setSelectedItemForTap(isSelected ? null : item)}
                  className={`p-3.5 rounded-2xl border-2 cursor-grab active:cursor-grabbing transition-all select-none ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50 shadow-md scale-102 ring-2 ring-amber-300'
                      : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="font-extrabold text-sm text-slate-900 font-display">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                    <span>{isSelected ? 'Selected ✓' : 'Tap or Drag'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Completion Certificate Card */
        <div className="p-6 sm:p-8 bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50 rounded-3xl border-4 border-amber-400 shadow-xl text-center space-y-4 animate-in zoom-in-95">
          <div className="inline-flex p-4 rounded-3xl bg-amber-400 text-amber-950 shadow-inner">
            <Award className="w-12 h-12" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              Official AI Literacy Champion Certificate!
            </h3>
            <p className="text-sm text-amber-900 font-medium max-w-lg mx-auto">
              You mastered the Golden Rule: <strong>Keep the Human-in-the-Loop!</strong> You know that machines don't have hearts, and you know how to tell real friendship from code.
            </p>
          </div>

          <div className="p-4 bg-white/80 rounded-2xl max-w-md mx-auto border border-amber-200 text-xs text-slate-700 text-left space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Recognizes Anthropomorphism</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Understands Word-Prediction Algorithms</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Values Real Human Experiences</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onRestartStory}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Read Story Again 📖
            </button>
            <button
              type="button"
              onClick={() => onJumpToScene('scene-3')}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm transition-all cursor-pointer"
            >
              Revisit The Egypt Climax 🏛️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
