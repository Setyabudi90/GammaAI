"use client";
import { UserCircle2, Bot, Check, Copy, Volume2, VolumeX } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { franc } from "franc";

interface ChatMessageProps {
  isUser: boolean;
  content: string;
}

export function ChatMessage({ isUser, content }: ChatMessageProps) {
  const autoScroll: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const [copied, setIsCopied] = useState<boolean>(false);
  const [isReading, setIsReading] = useState<boolean>(false);
  const [lang, setLang] = useState<string>("en");

  useEffect(() => {
    autoScroll.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [content]);

  const handleCopyToClipBoard = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setIsCopied(true);
      })
      .catch((e) => {
        throw new Error(e);
      });
  };

  setTimeout(() => {
    setIsCopied(false);
  }, 4000);

  interface LanguageMap {
    [key: string]: string;
  }

  const iso639_3_to_1: LanguageMap = {
    eng: "en",
    deu: "de",
    fra: "fr",
    ind: "id",
    tha: "th",
    zho: "zh",
    jpn: "ja",
    fil: "tl",
    spa: "es",
    rus: "ru",
    ita: "it",
    kor: "ko",
    nld: "nl",
  };

  const detectLang = (text: string) => {
    const detectedLangCode = franc(text);
    const detectedISO639 = iso639_3_to_1[detectedLangCode] || "en";
    setLang(detectedISO639);
  };

  useEffect(() => {
    detectLang(content);
  }, [content]);

  const handleReadLoud = (text: string) => {
    if ("speechSynthesis" in window) {
      const speechSynt: SpeechSynthesis = window.speechSynthesis;
      const utterance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(
        text
      );

      if (isReading) {
        speechSynt.cancel();
        setIsReading(false);
        return;
      }

      const voices: SpeechSynthesisVoice[] = speechSynt.getVoices();
      const voice: SpeechSynthesisVoice =
        voices.find((v) => v.lang.startsWith(lang)) || voices[0];
      if (voice) {
        utterance.voice = voice;
      }

      utterance.lang = lang;

      utterance.onstart = () => setIsReading(true);
      utterance.onend = () => setIsReading(false);
      utterance.onerror = () => setIsReading(false);

      speechSynt.speak(utterance);
    } else {
      toast.error<string>("Browser does not support speech synthesis.");
    }
  };

  return (
    <div
      className={`py-4 md:py-8 relative ${
        isUser ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"
      } transition-colors duration-200`}
    >
      <div
        className="max-w-full px-4 mx-auto flex gap-4 md:gap-6"
        data-lang={lang}
      >
        {isUser ? (
          <UserCircle2 className="w-6 h-6 flex-shrink-0 text-gray-600 dark:text-gray-300" />
        ) : (
          <Bot className="w-6 h-6 flex-shrink-0 text-green-600 dark:text-green-400" />
        )}
        <div className="prose prose-slate dark:prose-invert max-w-2xl">
          <ReactMarkdown
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const code = String(children).replace(/\n$/, "");
                return match ? (
                  <div className="relative max-w-[271px] md:max-w-none">
                    <button
                      className="top-1 right-1 rounded-md absolute bg-slate-900 rounded-b-md p-1"
                      onClick={() => handleCopyToClipBoard(code)}
                    >
                      {copied ? (
                        <Check color="#eee" size={20} />
                      ) : (
                        <Copy color="#eee" size={20} />
                      )}
                    </button>

                    <SyntaxHighlighter
                      PreTag="div"
                      language={match[1]}
                      wrapLongLines
                      showLineNumbers
                      showInlineLineNumbers
                      className="max-w-[295px] max-h-[360px] md:max-h-none md:max-w-2xl rounded-md shadow-md"
                    >
                      {code}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code {...props} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>

          {!isUser && (
            <div className="flex flex-shrink-0 gap-2">
              <button
                className="bg-transparent rounded-b-md p-1"
                onClick={() => handleReadLoud(content)}
              >
                {isReading ? (
                  <VolumeX
                    size={20}
                    className="shadow-md text-slate-800 dark:text-slate-200"
                  />
                ) : (
                  <Volume2
                    size={20}
                    className="shadow-md text-slate-800 dark:text-slate-200"
                  />
                )}
              </button>
              <button
                className="bg-transparent rounded-b-md p-1"
                onClick={() => handleCopyToClipBoard(content)}
              >
                {copied ? (
                  <Check
                    size={18}
                    className="shadow-md text-slate-800 dark:text-slate-200"
                  />
                ) : (
                  <Copy
                    size={18}
                    className="shadow-md text-slate-800 dark:text-slate-200"
                  />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      <div ref={autoScroll}></div>
    </div>
  );
}
