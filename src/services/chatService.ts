import { firestore } from '../config/firebase';
import { Message, ChatResponse, SupportType } from '../types/chat';

// Save a message to the user's chat history
export const saveMessageToHistory = async (userId: string, message: Message): Promise<void> => {
  try {
    await firestore
      .collection('chatHistory')
      .doc(userId)
      .collection('messages')
      .doc(message.id)
      .set({
        ...message,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    
    // Update last message timestamp
    await firestore
      .collection('chatHistory')
      .doc(userId)
      .set({
        lastUpdated: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

// Get chat history for a user
export const getChatHistory = async (userId: string): Promise<Message[]> => {
  try {
    const snapshot = await firestore
      .collection('chatHistory')
      .doc(userId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .get();
    
    return snapshot.docs.map(doc => doc.data() as Message);
  } catch (error) {
    console.error('Error getting chat history:', error);
    throw error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (userId: string, messageIds: string[]): Promise<void> => {
  try {
    const batch = firestore.batch();
    
    messageIds.forEach(id => {
      const messageRef = firestore
        .collection('chatHistory')
        .doc(userId)
        .collection('messages')
        .doc(id);
      
      batch.update(messageRef, { read: true });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

// Send message to AI support service and get response
export const sendSupportMessage = async (
  message: string, 
  supportType: SupportType = 'general'
): Promise<ChatResponse> => {
  try {
    // This would connect to your backend API that interfaces with the AI service
    const response = await fetch(`https://api.safespacementalhealth.com/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        supportType,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message to support service');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending support message:', error);
    throw error;
  }
};