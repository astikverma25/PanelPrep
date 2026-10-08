// Web Speech API STT Service with auto-reconnect and error resilience

export interface STTCallbacks {
  onInterimResult: (transcript: string) => void;
  onFinalResult: (transcript: string) => void;
  onSpeechStart: () => void;
  onSpeechEnd: () => void;
  onError: (error: string) => void;
}

export class STTService {
  private recognition: any = null;
  private isListening = false;
  private callbacks: STTCallbacks;
  private shouldRestart = false;

  constructor(callbacks: STTCallbacks) {
    this.callbacks = callbacks;
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.callbacks.onError("SPEECH_NOT_SUPPORTED");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = "en-US";

    this.recognition.onspeechstart = () => {
      this.callbacks.onSpeechStart();
    };

    this.recognition.onspeechend = () => {
      this.callbacks.onSpeechEnd();
    };

    this.recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.callbacks.onFinalResult(transcript.trim());
        } else {
          interim += transcript;
        }
      }
      if (interim) {
        this.callbacks.onInterimResult(interim);
      }
    };

    this.recognition.onerror = (event: any) => {
      if (event.error === "no-speech") return;
      if (event.error === "not-allowed") {
        this.callbacks.onError("PERMISSION_DENIED");
      } else {
        this.callbacks.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.shouldRestart) {
        setTimeout(() => {
          if (this.shouldRestart) {
            try {
              this.recognition.start();
              this.isListening = true;
            } catch {}
          }
        }, 300);
      }
    };
  }

  public start() {
    if (!this.recognition) return;
    this.shouldRestart = true;
    if (!this.isListening) {
      try {
        this.recognition.start();
        this.isListening = true;
      } catch (err) {
        console.warn("Recognition already started or error:", err);
      }
    }
  }

  public stop() {
    this.shouldRestart = false;
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
      this.isListening = false;
    }
  }
}
