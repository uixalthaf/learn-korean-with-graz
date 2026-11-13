import { axiosInstance } from "@/api/axiosInstance";
import type {
  ConversationMessagesResponse,
  ConversationsResponse,
  ConversationMessage,
} from "../types";

export async function getConversations() {
  const response = await axiosInstance.get<ConversationsResponse>("/conversations");
  return response.data;
}

export async function getConversationMessages(conversationId: string) {
  const response = await axiosInstance.get<ConversationMessagesResponse>(
    `/conversations/${encodeURIComponent(conversationId)}/messages`,
  );
  return response.data;
}

export async function updateTypingStatus(conversationId: string, isTyping: boolean) {
  await axiosInstance.post(`/conversations/${encodeURIComponent(conversationId)}/typing`, { isTyping });
}

export async function sendConversationMessage(conversationId: string, body: string) {
  const response = await axiosInstance.post<{ message: ConversationMessage }>(
    `/conversations/${encodeURIComponent(conversationId)}/messages`,
    { body },
  );
  return response.data.message;
}

export async function updatePresence() {
  await axiosInstance.post("/presence");
}

export async function getUnreadMessageCount() {
  const response = await axiosInstance.get<{ unreadCount: number }>("/messages/unread-count");
  return response.data.unreadCount;
}
