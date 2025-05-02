import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ResourceLocator from '../components/ResourceLocator';
import { THEME_COLORS, TYPOGRAPHY, SPACING, SHADOWS, BORDER_RADIUS } from '../constants/theme';
import LoadingScreen from '../components/LoadingScreen';

// Resource type definition
type Resource = {
  id: string;
  title: string;
  type: string;
  source?: string;
  duration?: string;
  content?: string;
  imageUrl: any;
  category: string;
};

const Resources = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { resourceId } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [resourceList, setResourceList] = useState<Resource[]>([]);

  // Sample resources data - in a real app, fetch from API or state management
  const mockResources: Resource[] = [
    { 
      id: '1', 
      title: 'Coping with Anxiety', 
      type: 'article', 
      source: 'Mental Health Foundation',
      content: `Anxiety is a normal human emotion that everyone experiences at times. Many people feel anxious, or nervous, when faced with a problem at work, before taking a test, or making an important decision.\n\nAnxiety disorders, however, are different. They can cause such distress that it interferes with a person's ability to lead a normal life. Here are some strategies to cope:\n\n1. Practice deep breathing exercises\n2. Challenge negative thoughts\n3. Stay physically active\n4. Maintain a regular sleep schedule\n5. Limit caffeine and alcohol\n6. Connect with supportive people\n7. Try mindfulness meditation\n8. Consider professional help if anxiety persists`,
      imageUrl: require('../../assets/images/resource-anxiety.jpeg'),
      category: 'article',
    },
    { 
      id: '2', 
      title: 'Mindfulness Meditation', 
      type: 'exercise', 
      duration: '10 min',
      content: `This guided mindfulness meditation will help you cultivate awareness and presence. Find a comfortable position and follow along with the instructions.\n\nStart by focusing on your breath - notice the sensation of air moving in and out of your body.\n\nWhen your mind wanders (which is normal), gently redirect your attention back to your breath.\n\nTry to observe your thoughts without judgment, letting them pass by like clouds in the sky.\n\nGradually expand your awareness to include sensations throughout your entire body, sounds in your environment, and the space around you.`,
      imageUrl: require('../../assets/images/resource-meditation.jpeg'),
      category: 'meditation',
    },
    { 
      id: '3', 
      title: 'Building Resilience', 
      type: 'video', 
      duration: '15 min',
      content: `This video explores practical strategies for developing resilience - the ability to adapt well in the face of adversity, trauma, tragedy, threats, or significant sources of stress.\n\nKey topics covered:\n- Understanding what resilience really means\n- The role of positive relationships in building resilience\n- How to develop healthy thought patterns\n- Setting realistic goals and taking decisive actions\n- Maintaining perspective during difficult times\n- Self-care practices that strengthen your ability to bounce back`,
      imageUrl: require('../../assets/images/resource-resilience.jpeg'),
      category: 'video',
    },
  ];

  useEffect(() => {
    // Simulate fetching resources
    setTimeout(() => {
      setResourceList(mockResources);
      
      if (resourceId) {
        const resource = mockResources.find(r => r.id === resourceId);
        if (resource) {
          setSelectedResource(resource);
        }
      }
      
      setIsLoading(false);
    }, 800);
  }, [resourceId]);

  const handleResourceSelect = (id: string) => {
    const resource = mockResources.find(r => r.id === id);
    if (resource) {
      setSelectedResource(resource);
    }
  };

  const handleBackPress = () => {
    if (selectedResource) {
      setSelectedResource(null);
    } else {
      router.back();
    }
  };

  const renderResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <Ionicons name="document-text" size={20} color={THEME_COLORS.primary} />;
      case 'video':
        return <Ionicons name="videocam" size={20} color={THEME_COLORS.primary} />;
      case 'exercise':
        return <Ionicons name="fitness" size={20} color={THEME_COLORS.primary} />;
      default:
        return <Ionicons name="book" size={20} color={THEME_COLORS.primary} />;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color={THEME_COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectedResource ? selectedResource.title : 'Resources'}
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {selectedResource ? (
          <ScrollView style={styles.resourceDetailContainer}>
            <Image 
              source={selectedResource.imageUrl} 
              style={styles.resourceDetailImage} 
            />
            
            <View style={styles.resourceDetailContent}>
              <View style={styles.resourceMetaContainer}>
                <View style={styles.resourceTypeBadge}>
                  {renderResourceTypeIcon(selectedResource.type)}
                  <Text style={styles.resourceTypeBadgeText}>{selectedResource.type}</Text>
                </View>
                
                {selectedResource.duration && (
                  <View style={styles.resourceMetaItem}>
                    <Ionicons name="time-outline" size={16} color={THEME_COLORS.textSecondary} />
                    <Text style={styles.resourceMetaText}>{selectedResource.duration}</Text>
                  </View>
                )}
                
                {selectedResource.source && (
                  <View style={styles.resourceMetaItem}>
                    <Ionicons name="globe-outline" size={16} color={THEME_COLORS.textSecondary} />
                    <Text style={styles.resourceMetaText}>{selectedResource.source}</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.resourceDetailTitle}>{selectedResource.title}</Text>
              
              <Text style={styles.resourceDetailBody}>
                {selectedResource.content}
              </Text>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.locatorContainer}>
            <ResourceLocator onResourceSelect={handleResourceSelect} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: THEME_COLORS.white,
    ...Platform.select({
      ios: {
        shadowColor: THEME_COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  contentContainer: {
    flex: 1,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.heading3,
    fontWeight: '600',
    color: THEME_COLORS.text,
    textAlign: 'center',
    flex: 1,
  },
  headerRight: {
    width: 24, // Same width as backButton to center the title
  },
  locatorContainer: {
    flex: 1,
  },
  resourceDetailContainer: {
    flex: 1,
    backgroundColor: THEME_COLORS.white,
  },
  resourceDetailImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  resourceDetailContent: {
    padding: SPACING.lg,
  },
  resourceMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  resourceTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.secondary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.md,
    marginBottom: SPACING.xs,
  },
  resourceTypeBadgeText: {
    color: THEME_COLORS.primary,
    fontSize: TYPOGRAPHY.fontSize.small,
    fontWeight: '500',
    marginLeft: SPACING.xs,
    textTransform: 'capitalize',
  },
  resourceMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
    marginBottom: SPACING.xs,
  },
  resourceMetaText: {
    color: THEME_COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.small,
    marginLeft: 4,
  },
  resourceDetailTitle: {
    fontSize: TYPOGRAPHY.fontSize.heading2,
    fontWeight: '700',
    color: THEME_COLORS.text,
    marginBottom: SPACING.md,
  },
  resourceDetailBody: {
    fontSize: TYPOGRAPHY.fontSize.body,
    lineHeight: TYPOGRAPHY.fontSize.body * TYPOGRAPHY.lineHeight.body,
    color: THEME_COLORS.text,
  },
});

export default Resources;