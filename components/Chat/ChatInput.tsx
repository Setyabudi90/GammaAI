"use client";
import React, { useState } from "react";
import { RotateCcw, SendHorizontal, Mic, MicOff } from "lucide-react";
import { resetHistory } from "../../services/groq";
import { toast } from "react-toastify";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ChatInputProps {
  onSendAction: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSendAction, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.length > 500) {
      toast.error<string>(
        "Message is too long. Please keep it under 500 characters."
      );
      return;
    }

    if (message.trim() && !isLoading) {
      onSendAction(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key == "Enter") {
      handleSubmit(e);
    }
  };

  const startSpeechToText = () => {
    if (!recognition) {
      console.error("SpeechRecognition API tidak didukung di browser ini.");
      toast.error<string>(
        "SpeechRecognition API tidak didukung di browser ini."
      );
      return;
    }

    recognition.lang = "id-ID";
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage((prevMessage) => `${prevMessage} ${transcript}`);
    };

    recognition.onerror = (event: any) => {
      console.error("SpeechRecognition error:", event.error);
    };

    recognition.start();
    setIsRecording(true);

    recognition.onend = () => {
      setIsRecording(false);
    };
  };

  const stopSpeechToText = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  return (
    <>
      <div className="mt-8"></div>
      <div className="fixed bottom-0 left-0 md:-right-32 bg-gradient-to-t from-white via-white dark:from-gray-800 dark:via-gray-800 transition-colors duration-200">
        <div className="max-w-3xl mx-auto p-4 md:p-6">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              rows={1}
              value={message}
              minLength={3}
              maxLength={500}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
              placeholder={
                isLoading ? "Waiting for response..." : "Send a message..."
              }
              disabled={isLoading}
              className="w-full resize-none rounded-t-lg bg-white dark:bg-gray-700 px-4 py-3 md:pr-12 text-md text-gray-800 dark:text-gray-200 transition-colors duration-200  focus:ring-0 dark:border-none border-b-0 border-t border-l border-r border-gray-200 dark:border-gray-600"
              style={{ maxHeight: "200px", overflowY: "auto" }}
            />
            <div
              className="flex items-center justify-between w-full bg-white dark:bg-gray-700 px-4 py-2 text-md relative rounded-b-lg border-b border-gray-200 dark:border-gray-600 border-t-0 border-l border-r dark:border-none"
              style={{ marginTop: "-7px" }}
            >
              <div className="flex items-center">
                <button
                  className="p-1 rounded-lg"
                  aria-label="Reset History"
                  title="Reset History"
                  name="Reset"
                  disabled={isLoading}
                  onClick={() => resetHistory()}
                >
                  <RotateCcw className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" />
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  name="Record"
                  className="p-1 rounded-lg selection:text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={isRecording ? stopSpeechToText : startSpeechToText}
                >
                  {isRecording ? (
                    <MicOff className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" />
                  ) : (
                    <Mic className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                name="Sender"
                className="p-1 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SendHorizontal className="w-5 h-5" />
              </button>
            </div>
          </form>
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-200">
            <p className="font-bold">
              Gamma may display inaccurate info, including about people, so
              double-check its responses.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
