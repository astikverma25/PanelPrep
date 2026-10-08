"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { Mic, MicOff, Volume2, Headphones, Keyboard, CheckCircle } from "lucide-react";
import { VADDetector } from "@/lib/speech/vadDetector";

interface MicCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToRoom: (isTextFallback: boolean) => void;
}

export const MicCheckModal: React.FC<MicCheckModalProps> = ({
  isOpen,
  onClose,
  onProceedToRoom,
}) => {
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [hasMicAccess, setHasMicAccess] = useState<boolean | null>(null);
  const [detector, setDetector] = useState<VADDetector | null>(null);

  useEffect(() => {
    if (isOpen) {
      const vad = new VADDetector((level) => {
        setAudioLevel(level);
      });
      setDetector(vad);
      vad.start().then((success) => {
        setHasMicAccess(success);
      });
    } else {
      if (detector) {
        detector.stop();
        setDetector(null);
      }
    }

    return () => {
      if (detector) detector.stop();
    };
  }, [isOpen]);

  const handleStartVoiceMode = () => {
    if (detector) detector.stop();
    onProceedToRoom(false);
  };

  const handleStartTextMode = () => {
    if (detector) detector.stop();
    onProceedToRoom(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Audio & Microphone Check">
      <div className="space-y-5">
        {/* Headphone Advisory */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 p-3.5 rounded-xl">
          <Headphones className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-blue-900 mb-0.5">
              Headphones Recommended
            </p>
            <p className="text-slate-600 leading-relaxed">
              Using headphones prevents laptop speaker echo, giving you seamless barge-in and instant interruption capabilities.
            </p>
          </div>
        </div>

        {/* Live Mic Level Visualizer */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-800 flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-emerald-600" />
              Microphone Sensitivity Level
            </span>
            <span className={audioLevel > 10 ? "text-emerald-700 font-bold" : "text-slate-500"}>
              {audioLevel > 10 ? "Voice Detected" : "Speak to test..."}
            </span>
          </div>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
            <div
              className={`h-full rounded-full transition-all duration-75 ${
                audioLevel > 50
                  ? "bg-emerald-500 shadow-md"
                  : audioLevel > 15
                  ? "bg-blue-500"
                  : "bg-slate-300"
              }`}
              style={{ width: `${Math.min(100, Math.max(5, audioLevel))}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <Button
            variant="primary"
            onClick={handleStartVoiceMode}
            className="flex-1"
          >
            <Mic className="w-4 h-4" />
            Enter Room (Voice Mode)
          </Button>

          <Button
            variant="outline"
            onClick={handleStartTextMode}
            className="text-xs"
          >
            <Keyboard className="w-3.5 h-3.5" />
            Use Typing Mode Fallback
          </Button>
        </div>
      </div>
    </Modal>
  );
};
