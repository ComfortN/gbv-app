import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import LoadingScreen from '../components/LoadingScreen'; from '../components/LoadingScreen';

// Import theme constants
import {
  THEME_COLORS,
  TYPOGRAPHY,
  SPACING,
  SHADOWS,
  BORDER_RADIUS
} from '../constants/theme';

// Sample data for moods - in a real app, you would fetch this from state or API
const recentMoods = [
  { id: '1', mood: 'happy', date: new Date(), notes: 'Had a great day!' },
  { id: '2', mood: 'sad', date: new Date(Date.now() - 86400000), notes: 'Feeling down today' },
  { id: '3', mood: 'anxious', date: new Date(Date.now() - 172800000), notes: 'Worried about presentation' },
];

// Sample data for resources - in a real app, you would fetch this from state or API
const recommendedResources = [
  { 
    id: '1', 
    title: 'Coping with Anxiety', 
    type: 'article', 
    source: 'Mental Health Foundation',
    // Fixed image path format for Expo
    imageUrl: require('../../assets/images/resource-anxiety.jpeg'),
  },
  { 
    id: '2', 
    title: 'Mindfulness Meditation', 
    type: 'exercise', 
    duration: '10 min',
    imageUrl: require('../../assets/images/resource-meditation.jpeg'),
  },
  { 
    id: '3', 
    title: 'Building Resilience', 
    type: 'video', 
    duration: '15 min',
    imageUrl: require('../../assets/images/resource-resilience.jpeg'),
  },
];

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');

  // Navigate to chat
  const handleChatPress = () => {
    router.push('/tabs/chat');
  };
  
  // Navigate to settings
  const handleSettingsPress = () => {
    router.push('/tabs/settings');
  };
  
  // Navigate to mood journal
  const handleMoodPress = (mood?: string, moodId?: string) => {
    router.push({
      pathname: '/tabs/mood-journal',
      params: { mood, moodId }
    });
  };
  
  // Navigate to resources
  const handleResourcesPress = (resourceId?: string) => {
    router.push({
      pathname: '/tabs/resources',
      params: { resourceId }
    });
  };

  // Simulate loading user data
  useEffect(() => {
    setTimeout(() => {
      setUserName('Alex');
      setIsLoading(false);
    }, 1000);
  }, []);

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'sad': return '😔';
      case 'anxious': return '😰';
      case 'calm': return '😌';
      case 'angry': return '😡';
      default: return '😐';
    }
  };

  const formatMoodDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  };

  if (isLoading) {
    return < LoadingScreen />
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettingsPress}
        >
          <Ionicons name="settings-outline" size={24} color={THEME_COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleChatPress}
          >
            <View style={[styles.actionIcon, { backgroundColor: THEME_COLORS.secondary }]}>
              <Ionicons name="chatbubbles-outline" size={24} color={THEME_COLORS.primary} />
            </View>
            <Text style={styles.actionText}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleMoodPress()}
          >
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(15, 134, 124, 0.1)' }]}>
              <Ionicons name="heart-outline" size={24} color={THEME_COLORS.primary} />
            </View>
            <Text style={styles.actionText}>Mood</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleResourcesPress()}
          >
            <View style={[styles.actionIcon, { backgroundColor: THEME_COLORS.secondary }]}>
              <Ionicons name="book-outline" size={24} color={THEME_COLORS.primary} />
            </View>
            <Text style={styles.actionText}>Resources</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Check-in Card */}
        <View style={styles.checkInCard}>
          <Text style={styles.checkInTitle}>How are you feeling today?</Text>
          <View style={styles.moodSelector}>
            <TouchableOpacity 
              style={styles.moodOption}
              onPress={() => handleMoodPress('happy')}
            >
              <Text style={styles.moodEmoji}>😊</Text>
              <Text style={styles.moodText}>Happy</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.moodOption}
              onPress={() => handleMoodPress('calm')}
            >
              <Text style={styles.moodEmoji}>😌</Text>
              <Text style={styles.moodText}>Calm</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.moodOption}
              onPress={() => handleMoodPress('sad')}
            >
              <Text style={styles.moodEmoji}>😔</Text>
              <Text style={styles.moodText}>Sad</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.moodOption}
              onPress={() => handleMoodPress('anxious')}
            >
              <Text style={styles.moodEmoji}>😰</Text>
              <Text style={styles.moodText}>Anxious</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.moodOption}
              onPress={() => handleMoodPress('angry')}
            >
              <Text style={styles.moodEmoji}>😡</Text>
              <Text style={styles.moodText}>Angry</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Moods */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Moods</Text>
            <TouchableOpacity onPress={() => handleMoodPress()}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.moodHistory}>
            {recentMoods.map(item => (
              <TouchableOpacity 
                key={item.id}
                style={styles.moodItem}
                onPress={() => handleMoodPress(undefined, item.id)}
              >
                <Text style={styles.moodItemEmoji}>{getMoodEmoji(item.mood)}</Text>
                <View style={styles.moodItemDetails}>
                  <Text style={styles.moodItemMood}>{item.mood.charAt(0).toUpperCase() + item.mood.slice(1)}</Text>
                  <Text style={styles.moodItemDate}>{formatMoodDate(item.date)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={THEME_COLORS.inactive} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recommended Resources */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended Resources</Text>
            <TouchableOpacity onPress={() => handleResourcesPress()}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.resourcesScrollView}
          >
            {recommendedResources.map(resource => (
              <TouchableOpacity 
                key={resource.id}
                style={styles.resourceCard}
                onPress={() => handleResourcesPress(resource.id)}
              >
                <Image source={resource.imageUrl} style={styles.resourceImage} />
                <View style={styles.resourceContent}>
                  <Text style={styles.resourceType}>{resource.type}</Text>
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                  {resource.source && (
                    <Text style={styles.resourceSource}>{resource.source}</Text>
                  )}
                  {resource.duration && (
                    <Text style={styles.resourceDuration}>{resource.duration}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Need to Talk? */}
        <TouchableOpacity 
          style={styles.chatPrompt}
          onPress={handleChatPress}
        >
          <View style={styles.chatPromptContent}>
            <Text style={styles.chatPromptTitle}>Need someone to talk to?</Text>
            <Text style={styles.chatPromptDescription}>
              Our AI assistant is here to listen and provide support anytime.
            </Text>
          </View>
          <View style={styles.chatPromptIcon}>
            <Ionicons name="chatbubbles" size={28} color={THEME_COLORS.white} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  greeting: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: THEME_COLORS.textSecondary,
  },
  userName: {
    fontSize: TYPOGRAPHY.fontSize.heading1,
    fontWeight: '700',
    color: THEME_COLORS.text,
  },
  settingsButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: THEME_COLORS.surface,
  },
  scrollView: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    backgroundColor: THEME_COLORS.white,
    borderRadius: BORDER_RADIUS.large,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
    ...Platform.select({
      ios: SHADOWS.small,
      android: {
        elevation: 2,
      },
    }),
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  actionText: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: THEME_COLORS.textSecondary,
  },
  checkInCard: {
    backgroundColor: THEME_COLORS.white,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    ...Platform.select({
      ios: SHADOWS.small,
      android: {
        elevation: 2,
      },
    }),
  },
  checkInTitle: {
    fontSize: TYPOGRAPHY.fontSize.heading3,
    fontWeight: '600',
    color: THEME_COLORS.text,
    marginBottom: SPACING.md,
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodOption: {
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  moodText: {
    fontSize: TYPOGRAPHY.fontSize.small,
    color: THEME_COLORS.textSecondary,
  },
  sectionContainer: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.heading3,
    fontWeight: '600',
    color: THEME_COLORS.text,
  },
  seeAllText: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: THEME_COLORS.primary,
  },
  moodHistory: {
    paddingHorizontal: SPACING.lg,
  },
  moodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.white,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...Platform.select({
      ios: SHADOWS.small,
      android: {
        elevation: 1,
      },
    }),
  },
  moodItemEmoji: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  moodItemDetails: {
    flex: 1,
  },
  moodItemMood: {
    fontSize: TYPOGRAPHY.fontSize.body,
    fontWeight: '500',
    color: THEME_COLORS.text,
  },
  moodItemDate: {
    fontSize: TYPOGRAPHY.fontSize.small,
    color: THEME_COLORS.textSecondary,
    marginTop: 2,
  },
  resourcesScrollView: {
    paddingHorizontal: SPACING.md,
  },
  resourceCard: {
    width: 200,
    backgroundColor: THEME_COLORS.white,
    borderRadius: BORDER_RADIUS.large,
    overflow: 'hidden',
    marginHorizontal: SPACING.xs,
    ...Platform.select({
      ios: SHADOWS.small,
      android: {
        elevation: 1,
      },
    }),
  },
  resourceImage: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
  },
  resourceContent: {
    padding: SPACING.md,
  },
  resourceType: {
    fontSize: TYPOGRAPHY.fontSize.small,
    color: THEME_COLORS.primary,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  resourceTitle: {
    fontSize: TYPOGRAPHY.fontSize.body,
    fontWeight: '500',
    color: THEME_COLORS.text,
    marginBottom: SPACING.xs,
  },
  resourceSource: {
    fontSize: TYPOGRAPHY.fontSize.small,
    color: THEME_COLORS.textSecondary,
  },
  resourceDuration: {
    fontSize: TYPOGRAPHY.fontSize.small,
    color: THEME_COLORS.textSecondary,
  },
  chatPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.primary,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  chatPromptContent: {
    flex: 1,
  },
  chatPromptTitle: {
    fontSize: TYPOGRAPHY.fontSize.heading3,
    fontWeight: '600',
    color: THEME_COLORS.white,
    marginBottom: SPACING.xs,
  },
  chatPromptDescription: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  chatPromptIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;