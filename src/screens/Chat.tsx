import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../context/AuthContext';
import { useSupportChat } from '../hooks/useSupportChat';
import ChatInterface from '../components/ChatInterface';
import { Message } from '../../types/chat';
import { saveMessageToHistory } from '../services/chatService';

const Chat = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get the support type from route params or default to general support
  const { supportType = 'general' } = route.params || {};
  
  // Define support names based on type
  const supportNames = {
    general: 'Support Assistant',
    crisis: 'Crisis Counselor',
    therapy: 'Therapy Guide',
  };
  
  const supportName = supportNames[supportType] || supportNames.general;
  
  // Chat state management
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use custom hook for chat functionality
  const { sendMessage, chatHistory, loading: historyLoading } = useSupportChat(user?.id);
  
  // Load chat history on component mount
  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      setMessages(chatHistory);
    }
  }, [chatHistory]);
  
  // Handle sending a new message
  const handleSendMessage = useCallback(async (content: string) => {
    // Create user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      read: true,
    };
    
    // Add user message to state
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Save to history
    if (user?.id) {
      await saveMessageToHistory(user.id, userMessage);
    }
    
    // Show typing indicator
    setIsLoading(true);
    
    try {
      // Send message to support service and get response
      const response = await sendMessage(content, supportType);
      
      // Create assistant message
      const assistantMessage: Message = {
        id: uuidv4(),
        content: response.message,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      // Add assistant message to state
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      
      // Save to history
      if (user?.id) {
        await saveMessageToHistory(user.id, assistantMessage);
      }
      
      // Check if urgent response is needed based on content analysis
      if (response.urgencyLevel && response.urgencyLevel >= 8) {
        // Show crisis resources or notification
        navigation.navigate('Resources', { filter: 'crisis' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [user, sendMessage, supportType, navigation]);
  
  // Handle when user leaves the chat
  useEffect(() => {
    return () => {
      // Mark all messages as read when leaving chat
      if (user?.id && messages.length > 0) {
        const unreadMessages = messages.filter(msg => !msg.read);
        if (unreadMessages.length > 0) {
          // Update message read status
          // Implementation depends on your data structure
        }
      }
    };
  }, [messages, user]);
  
  return (
    <View style={styles.container}>
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading || historyLoading}
        supportName={supportName}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default Chat;