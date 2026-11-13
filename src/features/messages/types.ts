export type MessagingRole = "TUTOR" | "STUDENT";

export interface ConversationMessage {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  readAt: string | null;
}

export interface ConversationSummary {
  id: string;
  peer: {
    id: string;
    name: string;
    email: string;
    role: MessagingRole;
    isOnline: boolean;
  };
  lastMessage: ConversationMessage | null;
  unreadCount: number;
  updatedAt: string;
}

export interface ConversationsResponse {
  role: MessagingRole;
  viewerId: string;
  conversations: ConversationSummary[];
}

export interface ConversationMessagesResponse {
  messages: ConversationMessage[];
  peerIsTyping: boolean;
}
