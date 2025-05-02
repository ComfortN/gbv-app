import { useState, useEffect, useCallback } from 'react';
import { Message, ChatResponse, SupportType } from '../types/chat';
import { getChatHistory, sendSupportMessage } from '../services/chatService';

export const useSupportChat = (userId?: string) => {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch chat history when userId changes
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        const history = await getChatHistory(userId);
        setChatHistory(history);
      } catch (err) {
        console.error('Error fetching chat history:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch chat history'));
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [userId]);

  // Send message to support service
  const sendMessage = useCallback(async (
    message: string,
    supportType: SupportType = 'general'
  ): Promise<ChatResponse> => {
    try {
      return await sendSupportMessage(message, supportType);
    } catch (err) {
      console.error('Error in sendMessage:', err);
      setError(err instanceof Error ? err : new Error('Failed to send message'));
      throw err;
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    chatHistory,
    loading,
    error,
    sendMessage,
    clearError
  };
};

export default useSupportChat;