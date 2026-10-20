export interface AvailableVoice {
  name: string;
  lang: string;
  isBritish: boolean;
  voiceURI: string;
}

class SpeechManager {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;
  private onStateChange: ((speaking: boolean) => void) | null = null;
  private onVoicesLoaded: ((voices: AvailableVoice[]) => void) | null = null;
  // Storyteller defaults: slightly lower pitch (0.92) and steady rate (0.84) for warm bedtime tone
  private speechRate = 0.84; // Steady, unhurried storytelling pace
  private speechPitch = 0.92; // Slightly lower pitch for a warm, comforting, resonant tone
  private selectedVoiceURI: string | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
    }
  }

  private initVoices() {
    if (!this.synth) return;

    const loadVoices = () => {
      const allVoices = this.synth?.getVoices() || [];
      if (allVoices.length > 0) {
        this.cachedVoices = allVoices;
        this.isInitialized = true;
        this.notifyVoicesChanged();
      }
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
    // Backup check after 200ms in case onvoiceschanged does not fire
    setTimeout(loadVoices, 250);
  }

  public setListener(listener: (speaking: boolean) => void) {
    this.onStateChange = listener;
  }

  public setVoicesListener(listener: (voices: AvailableVoice[]) => void) {
    this.onVoicesLoaded = listener;
    if (this.cachedVoices.length > 0) {
      this.notifyVoicesChanged();
    }
  }

  private notifyVoicesChanged() {
    if (!this.onVoicesLoaded) return;
    const voiceList = this.getAvailableVoices();
    this.onVoicesLoaded(voiceList);
  }

  public getAvailableVoices(): AvailableVoice[] {
    const isRobotic = (name: string) => /espeak|festival|robot|whisper|klatt/i.test(name);
    
    return this.cachedVoices
      .filter(v => v.lang.startsWith('en') && !isRobotic(v.name))
      .map(v => ({
        name: v.name,
        lang: v.lang,
        isBritish: /gb|uk/i.test(v.lang) || /british|uk|england/i.test(v.name),
        voiceURI: v.voiceURI,
      }))
      .sort((a, b) => {
        // Prioritize 'Google UK English Male' first if present
        const aIsGoogleMale = /google uk english male/i.test(a.name);
        const bIsGoogleMale = /google uk english male/i.test(b.name);
        if (aIsGoogleMale && !bIsGoogleMale) return -1;
        if (!aIsGoogleMale && bIsGoogleMale) return 1;

        // Then other British English voices
        if (a.isBritish && !b.isBritish) return -1;
        if (!a.isBritish && b.isBritish) return 1;
        return a.name.localeCompare(b.name);
      });
  }

  public setSelectedVoice(voiceURI: string) {
    this.selectedVoiceURI = voiceURI;
  }

  public getSelectedVoiceURI(): string | null {
    return this.selectedVoiceURI;
  }

  public setSpeechRate(rate: number) {
    this.speechRate = Math.max(0.65, Math.min(1.2, rate));
  }

  public getSpeechRate(): number {
    return this.speechRate;
  }

  public setSpeechPitch(pitch: number) {
    this.speechPitch = Math.max(0.75, Math.min(1.2, pitch));
  }

  public getSpeechPitch(): number {
    return this.speechPitch;
  }

  /**
   * Selects the gentlest, warmest Standard British English voice available.
   * Prioritizes 'Google UK English Male' or similar warm British storytelling voices.
   */
  public getBestBritishVoice(): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.cachedVoices.length > 0 ? this.cachedVoices : this.synth.getVoices();
    if (voices.length === 0) return null;

    // 1. If user explicitly picked a voice
    if (this.selectedVoiceURI) {
      const found = voices.find(v => v.voiceURI === this.selectedVoiceURI);
      if (found) return found;
    }

    const isRobotic = (name: string) => /espeak|festival|robot|whisper|klatt/i.test(name);
    const validVoices = voices.filter(v => !isRobotic(v.name));

    // Priority 1: Specifically check for 'Google UK English Male' (natural, warm, resonant British male tone)
    const googleUkMale = validVoices.find(v =>
      /google uk english male/i.test(v.name)
    );
    if (googleUkMale) return googleUkMale;

    // Priority 2: Other British male natural voices (Daniel, Ryan, George, Oliver, Arthur)
    const britishMale = validVoices.find(v =>
      /gb|uk/i.test(v.lang) &&
      /daniel|ryan|george|oliver|arthur|male/i.test(v.name)
    );
    if (britishMale) return britishMale;

    // Priority 3: High quality Standard British storytelling voices (Google UK English Female, Libby, Sonia, Serena, Kate)
    const topBritishStorytellers = validVoices.find(v =>
      /gb|uk/i.test(v.lang) &&
      /google uk english female|libby|sonia|maisie|serena|kate|martha|alice|natural|online/i.test(v.name)
    );
    if (topBritishStorytellers) return topBritishStorytellers;

    // Priority 4: Any British English voice (en-GB / en_GB)
    const anyBritish = validVoices.find(v => /gb|uk/i.test(v.lang) || /british/i.test(v.name));
    if (anyBritish) return anyBritish;

    // Priority 5: Natural gentle English voice
    const naturalEnglish = validVoices.find(v =>
      v.lang.startsWith('en') &&
      /natural|samantha|daniel|karen|moira|jenny/i.test(v.name)
    );
    if (naturalEnglish) return naturalEnglish;

    // Fallback: First non-robotic English voice
    return validVoices.find(v => v.lang.startsWith('en')) || voices[0] || null;
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.synth) {
      onEnd?.();
      return;
    }

    this.stop();

    // Clean formatting and quotes, add natural pacing
    const cleanText = text
      .replace(/[*_#"`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      onEnd?.();
      return;
    }

    // Split into gentle sentences or clauses so speech flows with gentle pauses
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = this.speechRate;
    utterance.pitch = this.speechPitch;

    const chosenVoice = this.getBestBritishVoice();
    if (chosenVoice) {
      utterance.voice = chosenVoice;
      utterance.lang = chosenVoice.lang || 'en-GB';
    } else {
      utterance.lang = 'en-GB';
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.onStateChange?.(true);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.onStateChange?.(false);
      onEnd?.();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.onStateChange?.(false);
      onEnd?.();
    };

    this.currentUtterance = utterance;
    
    // Resume in case speech synthesis was paused by browser
    if (this.synth.paused) {
      this.synth.resume();
    }
    
    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.onStateChange?.(false);
  }

  public toggle(text: string, onEnd?: () => void) {
    if (this.isSpeaking) {
      this.stop();
    } else {
      this.speak(text, onEnd);
    }
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }
}

export const speechManager = new SpeechManager();
