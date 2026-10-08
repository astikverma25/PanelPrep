import { PersonaProfile } from "../types/personas";

export class TTSService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  private selectVoice(persona: PersonaProfile): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) return null;
    const pref = persona.voiceConfig.preferredVoiceNames;

    for (const name of pref) {
      const match = this.voices.find(
        (v) =>
          v.name.toLowerCase().includes(name.toLowerCase()) ||
          v.lang.toLowerCase().includes(name.toLowerCase())
      );
      if (match) return match;
    }
    return this.voices[0] || null;
  }

  public speak(
    text: string,
    persona: PersonaProfile,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) {
        onEnd?.();
        resolve();
        return;
      }

      this.cancel(); // cancel any active speech first

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      const voice = this.selectVoice(persona);
      if (voice) utterance.voice = voice;

      utterance.pitch = persona.voiceConfig.pitch;
      utterance.rate = persona.voiceConfig.rate;

      utterance.onstart = () => {
        onStart?.();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        onEnd?.();
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn("TTS Error:", e);
        this.currentUtterance = null;
        onEnd?.();
        resolve();
      };

      this.synth.speak(utterance);
    });
  }

  public cancel() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }
}
