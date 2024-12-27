"use client";
import { useState } from "react";
import { Plus, MessageSquare, Text, X } from "lucide-react";
import { Chat } from "../../types/Chat";

interface SidebarProps {
  chats: Chat[];
  currentChatId: string | undefined;
  onNewChatAction: () => void;
  onSelectChatAction: (id: string) => void;
}

export function Sidebar({
  chats,
  currentChatId,
  onNewChatAction,
  onSelectChatAction,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const cleanTitle = (title: string): string => {
    if (title.length > 17) {
      return title.slice(0, 17) + "...";
    }
    return title;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`md:hidden fixed transition-all duration-300 text-gray-800 dark:text-gray-200 ${
          isOpen
            ? "left-64 dark:bg-gray-900 bg-gray-200 translate-x-0 rounded-l-sm -top-1 z-40"
            : "left-4 translate-x-0 top-4 z-50 p-2"
        } hover:bg-gray-200 dark:hover:bg-gray-700 p-3 rounded-lg`}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Text className="w-5 h-5" />}
      </button>

      <div
        className={`fixed md:static inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 ease-in-out w-64 bg-slate-300 dark:bg-gray-900 text-gray-800 dark:text-gray-300 p-2 flex flex-col z-40`}
      >
        <button
          onClick={() => {
            onNewChatAction();
            setIsOpen(false);
          }}
          className="flex items-center gap-2 w-full p-3 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors duration-200 hover:text-gray-200"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>

        <div className="mt-4 flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => {
                onSelectChatAction(chat.id);
                setIsOpen(false);
              }}
              className={`flex items-center gap-2 w-full p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-left hover:text-gray-200 ${
                chat.id === currentChatId && "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="truncate">
                {cleanTitle(chat.title) || "New Chat"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
