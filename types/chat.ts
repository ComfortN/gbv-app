/**
 * Represents a chat message sender
 */
export type MessageSender = 'user' | 'assistant' | 'system';

/**
 * Message status to track delivery and read state
 */
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

/**
 * Represents a single chat message
 */
export interface Message {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: number;
  status?: MessageStatus;
  isDeleted?: boolean;
  metadata?: MessageMetadata;
}

/**
 * Optional metadata for messages
 */
export interface MessageMetadata {
  sentimentScore?: number;  // For tracking message sentiment (if analyzed)
  attachments?: Attachment[];
  replyTo?: string;  // ID of message being replied to
  tags?: string[];  // Any relevant tags (e.g., "urgent", "follow-up")
}

/**
 * Message attachment interface
 */
export interface Attachment {
  id: string;
  type: 'image' | 'audio' | 'document' | 'location';
  url?: string;
  name?: string;
  size?: number;
  mimeType?: string;
  thumbnailUrl?: string;
}

/**
 * Represents a full chat conversation
 */
export interface Conversation {
  id: string;
  title?: string;
  participants: string[];  // User IDs or identifiers
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  metadata?: ConversationMetadata;
}

/**
 * Optional metadata for conversations
 */
export interface ConversationMetadata {
  category?: 'support' | 'therapy' | 'crisis' | 'general';
  summary?: string;
  tags?: string[];
  aiAssistant?: string;  // Type of AI model or assistant used
}

/**
 * Chat context to store session information
 */
export interface ChatContext {
  conversationId: string;
  userId: string;
  userProfile?: UserProfile;
  supportName?: string;
  history?: Message[];
  lastRead?: number;  // Timestamp of last read message
}

/**
 * Basic user profile information relevant to chat
 */
export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  preferences?: {
    notifications?: boolean;
    theme?: 'light' | 'dark' | 'system';
    fontSize?: 'small' | 'medium' | 'large';
  };
}

/**
 * Message sending options
 */
export interface SendMessageOptions {
  withAttachments?: Attachment[];
  replyToMessageId?: string;
  sendImmediately?: boolean;
  priority?: 'normal' | 'high';
}