export class VADDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private animationId: number | null = null;
  private onLevelUpdate: (level: number) => void;

  constructor(onLevelUpdate: (level: number) => void) {
    this.onLevelUpdate = onLevelUpdate;
  }

  public async start(): Promise<boolean> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.microphone = this.audioContext.createMediaStreamSource(this.stream);
      this.microphone.connect(this.analyser);

      this.monitor();
      return true;
    } catch (err) {
      console.warn("VAD failed to start:", err);
      return false;
    }
  }

  private monitor() {
    if (!this.analyser) return;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const checkLevel = () => {
      if (!this.analyser) return;
      this.analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      const normalized = Math.min(100, Math.round((avg / 128) * 100));

      this.onLevelUpdate(normalized);
      this.animationId = requestAnimationFrame(checkLevel);
    };

    checkLevel();
  }

  public stop() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.stream) this.stream.getTracks().forEach((t) => t.stop());
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
    }
    this.audioContext = null;
    this.analyser = null;
  }
}
