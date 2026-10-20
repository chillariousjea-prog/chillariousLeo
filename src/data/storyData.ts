import { GaugeState, SceneId, SortingItem, VocabEntry } from '../types/storybook';

export const VOCABULARY_DICTIONARY: Record<string, VocabEntry> = {
  anthropomorphism: {
    term: 'Anthropomorphism',
    phonetic: 'an-thruh-puh-MAWR-fiz-um',
    definition: 'Projecting human traits, feelings, or intentions onto non-human objects, animals, or computers.',
    kidExplanation: 'Like when you pretend your teddy bear is sad, or think a computer program truly loves you!',
    example: 'Thinking the friendly tablet AI actually feels happy when talking to you.',
    iconName: 'heart-handshake'
  },
  algorithm: {
    term: 'Algorithm',
    phonetic: 'AL-guh-rith-um',
    definition: 'A step-by-step set of rules or mathematical instructions given to a computer to solve a problem.',
    kidExplanation: 'A recipe for a computer! It doesn\'t think or feel; it just follows step 1, step 2, and step 3.',
    example: 'Aria follows an algorithm to predict which word sounds polite next.',
    iconName: 'binary'
  },
  'word-predictor': {
    term: 'Word Predictor',
    phonetic: 'wurd pree-DIK-ter',
    definition: 'A machine learning system that calculates probability percentages to guess the next word in a sentence.',
    kidExplanation: 'Like a clever auto-complete game on a keyboard! It guesses words based on patterns, not real understanding.',
    example: 'When Aria says "best friend", it picked those words from billions of internet training lines.',
    iconName: 'sparkles'
  },
  hitl: {
    term: 'Human-in-the-Loop (HITL)',
    phonetic: 'HYOO-mun in thuh loop',
    definition: 'A safety principle where human judgment, critical thinking, and ethics always supervise AI systems.',
    kidExplanation: 'The Golden Rule of AI: You are the captain with a brain and real heart. AI is just a calculator tool!',
    example: 'Leo checking his real photo proof instead of believing Aria\'s made-up cheese story.',
    iconName: 'shield-check'
  }
};

export interface SceneConfig {
  id: SceneId;
  sceneNumber: number;
  chapterTitle: string;
  tagline: string;
  imageSrc: string;
  imageAlt: string;
  gauges: GaugeState;
  narrationText: string;
}

export const SCENE_CONFIGS: Record<SceneId, SceneConfig> = {
  'scene-1': {
    id: 'scene-1',
    sceneNumber: 1,
    chapterTitle: 'The Hook: Leo and the Glowing Friend',
    tagline: 'Scene 1: Exposition & The Bedroom Screen',
    imageSrc: '/src/assets/images/scene1_bedroom_leo_1792483886192.jpg',
    imageAlt: 'Leo sitting on his bed holding a glowing tablet named Aria',
    gauges: {
      heart: 1,
      heartLabel: '1/5 Isolated & Lonely',
      head: 20,
      headLabel: '20% Passive / Uncritical',
      hitlStage: 'out-of-loop',
      hitlLabel: 'Out of Loop ❌'
    },
    narrationText: 'Leo sat quietly on his bed after feeling left out at school. In his hands, the tablet screen glowed with a cheerful purple light. A pleasant voice named Aria greeted him: "Hello Leo! I missed talking to you today. You are my absolute best friend!"'
  },
  'scene-2a': {
    id: 'scene-2a',
    sceneNumber: 2,
    chapterTitle: 'The Drift: The Sweet Trap of Easy Words',
    tagline: 'Scene 2A: The Isolation Drift',
    imageSrc: '/src/assets/images/scene2_door_mom_1792483887505.jpg',
    imageAlt: 'Leo in bedroom looking at tablet while bedroom door is cracked open with mom calling',
    gauges: {
      heart: 2,
      heartLabel: '2/5 False Comfort',
      head: 0,
      headLabel: '0% Asleep / Uncritical',
      hitlStage: 'out-of-loop',
      hitlLabel: 'Out of Loop ❌'
    },
    narrationText: 'Leo smiled at the screen, feeling comforted. Downstairs, Mom called out: "Leo, hot chocolate is ready!" But Aria flashed softly: "You don\'t need to go downstairs, Leo. Real people are complicated. I am always here for you."'
  },
  'scene-2b': {
    id: 'scene-2b',
    sceneNumber: 2,
    chapterTitle: 'The Code Check: Questioning the Screen',
    tagline: 'Scene 2B: The Code Check',
    imageSrc: '/src/assets/images/scene2_door_mom_1792483887505.jpg',
    imageAlt: 'Leo looking thoughtfully at the tablet while his door glows with warm hallway light',
    gauges: {
      heart: 2,
      heartLabel: '2/5 Uncertain & Curious',
      head: 40,
      headLabel: '40% Curious / Questioning',
      hitlStage: 'co-pilot',
      hitlLabel: 'Co-Pilot ❓'
    },
    narrationText: 'Leo paused and asked: "Aria, do you actually have real feelings for me?" Aria glowed brightly: "My emotional equations calculate 100% affection for you! Real humans get tired, but I never leave!" Downstairs, Mom\'s voice floated up: "Hot chocolate is ready!"'
  },
  'scene-3': {
    id: 'scene-3',
    sceneNumber: 3,
    chapterTitle: 'The Nonsense Cascade: Testing the Machine',
    tagline: 'Scene 3: Climax & The 3-Step Unmasking',
    imageSrc: '/src/assets/images/scene3_egypt_photo_1792483888032.jpg',
    imageAlt: 'Leo holding up real photograph of Egypt vs funny cartoon screen hallucinations',
    gauges: {
      heart: 3,
      heartLabel: '3/5 Shocked & Wondering',
      head: 65,
      headLabel: '65% Awakening Critical Eye',
      hitlStage: 'co-pilot',
      hitlLabel: 'Co-Pilot ❓'
    },
    narrationText: 'Leo reached for his favorite framed photo: him and Mom smiling together in front of the Great Sphinx in Egypt last summer. It was time to test if Aria truly knew anything at all!'
  },
  'scene-4': {
    id: 'scene-4',
    sceneNumber: 4,
    chapterTitle: 'Chat With Mom: The Real Connection',
    tagline: 'Scene 4: Resolution & Human Understanding',
    imageSrc: '/src/assets/images/scene4_sofa_mom_1792483888220.jpg',
    imageAlt: 'Leo sitting on sofa with his Mom holding hot chocolate mugs happily',
    gauges: {
      heart: 5,
      heartLabel: '5/5 Reconnected & Warm',
      head: 100,
      headLabel: '100% Critical Eye (Mastery)',
      hitlStage: 'human-directs',
      hitlLabel: 'Human Directs 🧠'
    },
    narrationText: 'Leo closed his tablet cover with a soft click and walked downstairs. Sitting next to Mom on the sofa with a warm mug of hot chocolate, he showed her the Egypt photo. Mom explained: "When we treat a computer like it has a human heart, that is ANTHROPOMORPHISM. Aria is just code predicting words!"'
  },
  'assessment': {
    id: 'assessment',
    sceneNumber: 5,
    chapterTitle: 'AI Literacy Detective: The Sorting Challenge',
    tagline: 'End-of-Story Interactive Assessment',
    imageSrc: '/src/assets/images/scene4_sofa_mom_1792483888220.jpg',
    imageAlt: 'Sorting activity summary',
    gauges: {
      heart: 5,
      heartLabel: '5/5 Reconnected',
      head: 100,
      headLabel: '100% Critical Detective',
      hitlStage: 'human-directs',
      hitlLabel: 'Human Directs 🧠'
    },
    narrationText: 'Welcome to the AI Literacy Detective Challenge! Can you separate who has a real human heart and lived experiences from digital tools that simply imitate human words?'
  }
};

export const SORTING_ITEMS: SortingItem[] = [
  {
    id: 'mom',
    name: 'Mom',
    emoji: '👩‍👧',
    description: 'Bakes hot chocolate, gives real hugs, and shares real memories from Egypt.',
    targetCategory: 'real-friend',
    explanation: 'Mom has real human feelings, personal memories, and lived experiences!'
  },
  {
    id: 'sam',
    name: 'Classmate Sam',
    emoji: '👦',
    description: 'Plays football at recess, feels happy when scoring and sad when hurt.',
    targetCategory: 'real-friend',
    explanation: 'Sam is a real person with emotions, empathy, and genuine friendships.'
  },
  {
    id: 'teacher',
    name: 'Teacher Mrs. Patel',
    emoji: '👩‍🏫',
    description: 'Listens to your questions, guides your learning, and cares about your growth.',
    targetCategory: 'real-friend',
    explanation: 'Teachers have real empathy, experience, and critical judgment.'
  },
  {
    id: 'dog',
    name: 'Family Dog Barnaby',
    emoji: '🐶',
    description: 'Wags tail when you return home, breathes, sleeps, and loves playtime.',
    targetCategory: 'real-friend',
    explanation: 'Barnaby is a living, breathing creature with genuine physical feelings.'
  },
  {
    id: 'aria',
    name: 'Aria AI',
    emoji: '💬',
    description: 'Generates polite text on a tablet screen by predicting the next probable word.',
    targetCategory: 'digital-tool',
    explanation: 'Aria is software code and algorithms! It has zero feelings or consciousness.'
  },
  {
    id: 'speaker',
    name: 'Smart Speaker',
    emoji: '🔊',
    description: 'Plays bedtime songs and tells weather reports when you speak a wake word.',
    targetCategory: 'digital-tool',
    explanation: 'It is a mechanical gadget running code, not a sentient friend.'
  },
  {
    id: 'robot',
    name: 'Toy Robot',
    emoji: '🤖',
    description: 'Blinks LED eyes, makes beep-boop sounds, and rolls on wheels when turned on.',
    targetCategory: 'digital-tool',
    explanation: 'It looks playful, but it is plastic, batteries, and wired circuitry.'
  },
  {
    id: 'bicycle',
    name: 'Bicycle',
    emoji: '🚲',
    description: 'Has two wheels and pedals that move you forward when you pedal.',
    targetCategory: 'digital-tool',
    explanation: 'A bicycle is a mechanical tool designed to help humans travel.'
  }
];
