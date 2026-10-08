import React, { useState } from "react";
import {
  Mic,
  MicOff,
  PhoneOff,
  Send,
  FastForward,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "../common/Button";

interface RoomControlsProps {
  isMuted: boolean;
  isTextMode: boolean;
  isFullscreen?: boolean;
  onToggleMute: () => void;
  onToggleFullscreen?: () => void;
  onLeaveRoom: () => void;
  onFastForwardDemo?: () => void;
  onSendTextMessage: (text: string) => void;
}

export const RoomControls: React.FC<RoomControlsProps> = ({
  isMuted,
  isTextMode,
  isFullscreen = false,
  onToggleMute,
  onToggleFullscreen,
  onLeaveRoom,
  onFastForwardDemo,
  onSendTextMessage,
}) => {
  const [inputText, setInputText] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendTextMessage(inputText.trim());
    setInputText("");
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-3xl p-3.5 sm:p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Left: Mic toggle with audio active pulse */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <Button
          variant={isMuted ? "danger" : "primary"}
          size="md"
          onClick={onToggleMute}
          className="rounded-full !px-5 shrink-0"
        >
          {isMuted ? (
            <>
              <MicOff className="w-4 h-4" />
              <span>Mic Muted</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>Mic Active</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </>
          )}
        </Button>
      </div>

      {/* Center: Quick Text message / fallback input */}
      <form onSubmit={handleSend} className="flex-1 w-full flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Speak into your microphone or type a discussion point here..."
          className="flex-1 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white rounded-full px-4 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs transition-all"
        />
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          disabled={!inputText.trim()}
          className="rounded-full !px-4 shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </form>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        {onToggleFullscreen && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            className="rounded-full text-xs"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </Button>
        )}

        {onFastForwardDemo && (
          <Button
            variant="outline"
            size="sm"
            onClick={onFastForwardDemo}
            title="Jump directly to Closing Round for quick testing"
            className="rounded-full text-xs"
          >
            <FastForward className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Fast Forward</span>
          </Button>
        )}

        <Button
          variant="danger"
          size="sm"
          onClick={onLeaveRoom}
          className="rounded-full text-xs !px-4 shrink-0"
        >
          <PhoneOff className="w-3.5 h-3.5" />
          <span>End GD</span>
        </Button>
      </div>
    </div>
  );
};
