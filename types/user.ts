export interface UserPreferences {
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
    privacyLevel: 'high' | 'standard' | 'basic';
    reminderFrequency?: 'daily' | 'weekly' | 'none';
    moodTrackingEnabled?: boolean;
    journalReminders?: boolean;
    crisisResourcesEnabled?: boolean;
  }
  
  export interface User {
    id: string;
    email: string;
    name: string;
    photoURL: string | null;
    createdAt: string;
    preferences: Partial<UserPreferences>;
    lastActive?: string;
    supportPlan?: 'free' | 'basic' | 'premium';
  }