export type SceneId = 
  | 'scene-1' 
  | 'scene-2a' 
  | 'scene-2b' 
  | 'scene-3' 
  | 'scene-4' 
  | 'assessment';

export type HitlStage = 'out-of-loop' | 'co-pilot' | 'human-directs';

export interface GaugeState {
  heart: number; // 1 to 5
  heartLabel: string;
  head: number; // 0 to 100 percentage
  headLabel: string;
  hitlStage: HitlStage;
  hitlLabel: string;
}

export interface VocabEntry {
  term: string;
  phonetic: string;
  definition: string;
  kidExplanation: string;
  example: string;
  iconName: string;
}

export interface SortingItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  targetCategory: 'real-friend' | 'digital-tool';
  explanation: string;
}
