"use client";
import { UserCircle2, Bot, Check, Copy, Volume2, VolumeX } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { franc } from "franc";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface ChatMessageProps {
  isUser: boolean;
  content: string;
}

export function ChatMessage({ isUser, content }: ChatMessageProps) {
  const autoScroll: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const [copied, setIsCopied] = useState<boolean>();
  const [isReading, setIsReading] = useState<boolean>(false);
  const [lang, setLang] = useState<string>("en");
  const [embedId, setEmbedId] = useState<string | null>(null);
  const [embedWiki, setEmbedWiki] = useState<string | null>(null);
  const isDark = document.documentElement.classList.contains("dark");

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
        setIsCopied(false);
        throw new Error(e);
      });

    setTimeout(() => {
      setIsCopied(false);
    }, 4000);
  };

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

const youtubeEmbed = (content: string) => {
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w-]{11})/;
    const wikipediaRegex = /https?:\/\/([a-z]{2})\.wikipedia\.org\/\S*/;
    const matchYT = content.match(youtubeRegex);
    const matchWiki = content.match(wikipediaRegex);
    if (matchYT) {
      const videoId = matchYT[1];
      setEmbedId(videoId);
    } else if (matchWiki) {
      const takeWikiUrl = matchWiki[0];
      setEmbedWiki(takeWikiUrl);
    }
  };

  useEffect(() => {
    detectLang(content);
    youtubeEmbed(content);
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
    <>
      <div
        className={`py-4 md:py-8 relative ${
          isUser ? "bg-[#eee] dark:bg-[#252525]" : "bg-transparent"
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
                    <>
                      <div className="relative max-w-[271px] md:max-w-none">
                        <div className="flex absolute w-full justify-between items-center p-1 bg-[#2f2f2f] text-[#bfaca8] text-xs rounded-t-md capitalize -top-5">
                          <span className="font-bold text-md">
                            {match[1] || "Text"}
                          </span>

                          <button
                            className="flex items-center gap-1 bg-[#4b4848] px-2 py-1 rounded hover:bg-gray-600 transition text-white"
                            onClick={() => handleCopyToClipBoard(code)}
                          >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            <span>{copied ? "Copied" : "Copy"}</span>
                          </button>
                        </div>

                        <SyntaxHighlighter
                          PreTag="div"
                          style={isDark ? atomDark : atomOneLight}
                          language={match[1]}
                          wrapLongLines
                          showLineNumbers
                          showInlineLineNumbers
                          className="max-w-[295px] max-h-[360px] md:max-h-none md:max-w-2xl rounded-b-md"
                        >
                          {code}
                        </SyntaxHighlighter>
                      </div>
                    </>
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

            {embedWiki && !isUser && (
              <iframe
                className="w-full flex-shrink-0 rounded-sm shadow-md mb-3"
                src={embedWiki}
                height="384px"
                title="Wikipedia Embed"
                allowFullScreen
              ></iframe>
            )}

            {embedId && !isUser && (
              <iframe
                className="w-full aspect-video rounded-md shadow-md mb-3"
                src={`https://www.youtube.com/embed/${embedId}`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}

            {!isUser && (
              <div className="flex flex-shrink-0 gap-2">
                <button
                  className="bg-transparent rounded-b-md p-1"
                  onClick={() => handleReadLoud(content)}
                >
                  {isReading ? (
                    <VolumeX
                      size={20}
                      className="text-slate-800 dark:text-slate-200"
                    />
                  ) : (
                    <Volume2
                      size={20}
                      className="text-slate-800 dark:text-slate-200"
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
                      className="text-slate-800 dark:text-slate-200"
                    />
                  ) : (
                    <Copy
                      size={18}
                      className="text-slate-800 dark:text-slate-200"
                    />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        <div ref={autoScroll}></div>
      </div>
    </>
  );
}
