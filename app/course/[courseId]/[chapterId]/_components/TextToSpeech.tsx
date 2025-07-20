"use client";

import { useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TextToSpeechProps {
  content: string;
}

export default function TextToSpeech({ content }: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check if browser supports speech synthesis
  const supportsSpeechSynthesis =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // Clean HTML content for speech
  const cleanContent = (htmlContent: string) => {
    if (!htmlContent) return "";

    // Remove HTML tags
    let cleanText = htmlContent.replace(/<[^>]*>/g, "");

    // Decode HTML entities
    cleanText = cleanText
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ");

    // Remove extra whitespace and normalize
    cleanText = cleanText.replace(/\s+/g, " ").trim();

    return cleanText;
  };

  const handlePlay = () => {
    if (isPlaying) {
      // Stop current speech
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    if (!supportsSpeechSynthesis) {
      setError("Speech synthesis not supported in this browser");
      return;
    }

    setError(null);

    try {
      const text = cleanContent(content);
      const utterance = new SpeechSynthesisUtterance(text);
      speechRef.current = utterance;

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = () => {
        setError("Failed to play audio");
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    } catch (err) {
      setError("Failed to start speech synthesis");
      console.error("Speech synthesis error:", err);
    }
  };

  if (!supportsSpeechSynthesis) {
    return (
      <div className="text-sm text-gray-500 mb-4">
        Speech synthesis is not supported in this browser.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mb-4">
      <Button
        onClick={handlePlay}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        {isPlaying ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
        {isPlaying ? "Stop Reading" : "Read Chapter"}
      </Button>

      {error && <span className="text-sm text-red-500">{error}</span>}

      {isPlaying && (
        <span className="text-sm text-green-600">Reading chapter...</span>
      )}
    </div>
  );
}
