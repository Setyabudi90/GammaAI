"use client";
import { useState, useEffect } from "react";
import { Chat, Message } from "../types/Chat";
import { generateResponse } from "../services/groq";
import { toast } from "react-toastify";

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [questionCount, setQuestionCount] = useState<number>(0);
  const [isRestricted, setIsRestricted] = useState<boolean>(false);

  const QUESTION_LIMIT: number = 10;
  const TIME_LIMIT: number = 2 * 60 * 60 * 1000;
  const STORAGE_KEY = "userRestrictions";

  useEffect(() => {
    const storedData = JSON.parse(
      localStorage.getItem("userRestriction") || "null"
    );
    if (storedData) {
      const { count = 0, lastUpdate = Date.now() } = storedData;

      const timePassed = Date.now() - lastUpdate;

      if (timePassed < TIME_LIMIT) {
        setQuestionCount(count);
        setIsRestricted(count >= QUESTION_LIMIT);
      } else {
        localStorage.removeItem("userRestriction");
        setQuestionCount(0);
        setIsRestricted(false);
      }
    }
  }, []);

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  const createNewChat = async () => {
    if (isRestricted) {
      toast.info(
        "Anda telah mencapai batas 10 pertanyaan. Tunggu hingga 2 jam untuk melanjutkan."
      );
      return;
    }
    try {
      setIsLoading(true);
      const response = await generateResponse("Start a new conversation");

      const newChat: Chat = {
        id: Date.now().toString(),
        title: Date.now().toString(),
        messages: [
          {
            id: Date.now().toString(),
            content: response,
            isUser: false,
          },
        ],
      };

      setChats((prev) => [...prev, newChat]);
      setCurrentChatId(newChat.id);
    } catch (error) {
      console.error("Error creating new chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectChat = (id: string) => {
    setCurrentChatId(id);
  };

  const sendMessage = async (content: string) => {
    if (!currentChatId) return;

    if (isRestricted) {
      toast.info(
        "Anda telah mencapai batas 10 pertanyaan. Tunggu hingga 2 jam untuk melanjutkan."
      );
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: [...chat.messages, userMessage],
          };
        }
        return chat;
      })
    );

    setIsLoading(true);

    try {
      const response = await generateResponse(content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
      };

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === currentChatId) {
            return {
              ...chat,
              messages: [...chat.messages, assistantMessage],
            };
          }
          return chat;
        })
      );

      const updatedRestrictions = {
        count: questionCount + 1,
        lastUpdate: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRestrictions));
      setQuestionCount(questionCount + 1);
      setIsRestricted(questionCount + 1 >= QUESTION_LIMIT);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        isUser: false,
      };

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === currentChatId) {
            return {
              ...chat,
              messages: [...chat.messages, errorMessage],
            };
          }
          return chat;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    chats,
    currentChat,
    isLoading,
    createNewChat,
    selectChat,
    sendMessage,
  };
}
