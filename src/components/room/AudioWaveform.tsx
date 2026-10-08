import React from "react";

interface AudioWaveformProps {
  isActive: boolean;
  barColor?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isActive,
  barColor = "bg-emerald-400",
}) => {
  return (
    <div className="flex items-center gap-1 h-5 px-2">
      {[1, 2, 3, 4, 5, 6].map((bar) => (
        <span
          key={bar}
          className={`w-1 rounded-full transition-all duration-200 ${barColor} ${
            isActive ? "animate-sound-wave" : "h-1 opacity-30"
          }`}
          style={{
            animationDelay: `${bar * 0.15}s`,
            animationDuration: "0.8s",
          }}
        />
      ))}
    </div>
  );
};
