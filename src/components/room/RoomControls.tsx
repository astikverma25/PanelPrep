"use client";

import React, { useState } from "react";
import { Mic, MicOff, PhoneOff, Send, FastForward } from "lucide-react";
import { Button } from "../common/Button";

interface RoomControlsProps {
  isMuted: boolean;
  isTextMode: boolean;
  onToggleMute: () => void;
  onLeaveRoom: () => void;
  onFastForwardDemo?: () => void;
  onSendTextMessage: (text: string) => void;
}

export const RoomControls: React.FC<RoomControlsProps> = ({
  isMuted,
  isTextMode,
  onToggleMute,
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
    <div className="w-full bg-slate-900/90 border border-arena-border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
      {isTextMode ? (
        <form onSubmit={handleSend} className="flex-1 w-full flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your discussion point..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" variant="primary" size="md">
            <Send className="w-4 h-4" />
            Send
          </Button>
        </form>
      ) : (
        <div className="flex items-center gap-3">
          <Button
            variant={isMuted ? "danger" : "primary"}
            size="lg"
            onClick={onToggleMute}
            className="rounded-full !px-6"
          >
            {isMuted ? (
              <>
                <MicOff className="w-5 h-5" />
                <span>Unmute Mic</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>Microphone Active</span>
              </>
            )}
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2">
        {onFastForwardDemo && (
          <Button
            variant="outline"
            size="sm"
            onClick={onFastForwardDemo}
            title="Jump directly to Closing Round for quick testing"
          >
            <FastForward className="w-3.5 h-3.5 text-amber-400" />
            <span>Fast Forward</span>
          </Button>
        )}

        <Button
          variant="danger"
          size="sm"
          onClick={onLeaveRoom}
          className="rounded-xl"
        >
          <PhoneOff className="w-4 h-4" />
          <span>End Discussion</span>
        </Button>
      </div>
    </div>
  );
};
