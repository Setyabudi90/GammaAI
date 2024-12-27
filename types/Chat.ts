export interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
}
