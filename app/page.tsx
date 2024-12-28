"use client";
import { ChatMessage } from "@/components/Chat/ChatMessage";
import { ChatInput } from "@/components/Chat/ChatInput";
import { Sidebar } from "@/components/Sidebar";
import { useChats } from "@/hooks/useChats";
import { Navbar } from "@/components/Navbar/";
import { Notification } from "@/components/Notification";

export default function Home() {
  const {
    chats,
    currentChat,
    isLoading,
    createNewChat,
    selectChat,
    sendMessage,
  } = useChats();

  const hasMessages =
    currentChat?.messages && currentChat?.messages?.length > 0;

  return (
    <div className="flex h-screen bg-white dark:bg-gray-800 transition-colors duration-200">
      <Sidebar
        chats={chats}
        onNewChatAction={createNewChat}
        onSelectChatAction={selectChat}
        currentChatId={currentChat?.id}
      />
      <main className="flex-1 overflow-auto relative">
        <Navbar />
        <div className="pb-32 pt-20">
          {!currentChat ? (
            <div className="flex flex-col items-center justify-center text-slate-700 dark:text-slate-200 h-[90vh] mx-2">
              <h1 className="text-3xl font-extrabold mb-2">
                👋 Hai, Selamat Datang!
              </h1>
              <p className="text-base text-center max-w-md leading-relaxed">
                Senang bertemu dengan Anda! Mulai percakapan seru dengan
                mengklik tombol
                <span className="font-semibold text-blue-500">
                  {" "}
                  "New Chat"{" "}
                </span>
                di bilah sisi. Mari berbagi ide dan cerita!
              </p>
            </div>
          ) : !hasMessages ? (
            <div className="flex flex-col items-center justify-center  text-gray-500 dark:text-gray-400 h-[90vh]">
              <p className="text-lg font-medium">
                This chat has no messages yet.
              </p>
              <p className="mt-2 text-center">
                Type a message below to start the conversation.
              </p>
            </div>
          ) : (
            currentChat.messages.map((message) => (
              <ChatMessage
                key={message.id}
                isUser={message.isUser}
                content={message.content}
              />
            ))
          )}
        </div>
        {currentChat && (
          <ChatInput onSendAction={sendMessage} isLoading={isLoading} />
        )}
      </main>
      <Notification />
    </div>
  );
}
