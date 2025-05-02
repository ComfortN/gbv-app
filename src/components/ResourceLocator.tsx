import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME_COLORS, TYPOGRAPHY, SPACING, SHADOWS, BORDER_RADIUS } from '../constants/theme';

// Types for resource categories and resources
type ResourceCategory = {
  id: string;
  name: string;
  icon: string;
};

type Resource = {
  id: string;
  title: string;
  type: string;
  source?: string;
  duration?: string;
  description?: string;
  imageUrl: any; // Could be require() for local images
  category: string;
};

interface ResourceLocatorProps {
  onResourceSelect: (resourceId: string) => void;
  filterByCategory?: string;
}

const ResourceLocator: React.FC<ResourceLocatorProps> = ({ 
  onResourceSelect,
  filterByCategory 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(filterByCategory || null);
  
  // Sample categories
  const categories: ResourceCategory[] = [
    { id: 'all', name: 'All', icon: 'grid-outline' },
    { id: 'article', name: 'Articles', icon: 'document-text-outline' },
    { id: 'video', name: 'Videos', icon: 'videocam-outline' },
    { id: 'exercise', name: 'Exercises', icon: 'fitness-outline' },
    { id: 'meditation', name: 'Meditation', icon: 'leaf-outline' },
  ];

  // Sample resources data
  const allResources: Resource[] = [
    { 
      id: '1', 
      title: 'Coping with Anxiety', 
      type: 'article', 
      source: 'Mental Health Foundation',
      description: 'Learn effective strategies to manage anxiety in daily life',
      imageUrl: require('../../assets/images/resource-anxiety.jpeg'),
      category: 'article',
    },
    { 
      id: '2', 
      title: 'Mindfulness Meditation', 
      type: 'exercise', 
      duration: '10 min',
      description: 'A guided meditation practice to help reduce stress',
      imageUrl: require('../../assets/images/resource-meditation.jpeg'),
      category: 'meditation',
    },
    { 
      id: '3', 
      title: 'Building Resilience', 
      type: 'video', 
      duration: '15 min',
      description: 'Expert tips on building mental strength during difficult times',
      imageUrl: require('../../assets/images/resource-resilience.jpeg'),
      category: 'video',
    },
    { 
      id: '4', 
      title: 'Sleep Improvement Guide', 
      type: 'article', 
      source: 'Sleep Research Institute',
      description: 'Evidence-based approaches to better sleep quality',
      imageUrl: require('../../assets/images/resource-anxiety.jpeg'), // Reused for demo
      category: 'article',
    },
    { 
      id: '5', 
      title: 'Deep Breathing Technique', 
      type: 'exercise', 
      duration: '5 min',
      description: 'Quick breathing exercise to reduce stress instantly',
      imageUrl: require('../../assets/images/resource-meditation.jpeg'), // Reused for demo
      category: 'exercise',
    },
  ];

  // Filter resources based on search and category
  const filteredResources = allResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resource.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || selectedCategory === 'all' || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const renderCategoryItem = ({ item }: { item: ResourceCategory }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.selectedCategoryButton
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons 
        name={item.icon as any} 
        size={20} 
        color={selectedCategory === item.id ? THEME_COLORS.white : THEME_COLORS.primary} 
      />
      <Text 
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.selectedCategoryText
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderResourceItem = ({ item }: { item: Resource }) => (
    <TouchableOpacity
      style={styles.resourceCard}
      onPress={() => onResourceSelect(item.id)}
    >
      <Image source={item.imageUrl} style={styles.resourceImage} />
      <View style={styles.resourceContent}>
        <Text style={styles.resourceType}>{item.type}</Text>
        <Text style={styles.resourceTitle}>{item.title}</Text>
        {item.source && (
          <Text style={styles.resourceDetails}>{item.source}</Text>
        )}
        {item.duration && (
          <Text style={styles.resourceDetails}>{item.duration}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={THEME_COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search resources..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={THEME_COLORS.inactive}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={THEME_COLORS.inactive} />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories horizontal list */}
      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      />

      {/* Resources list */}
      {filteredResources.length > 0 ? (
        <FlatList
          data={filteredResources}
          renderItem={renderResourceItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resourcesContainer}
          numColumns={2}
          columnWrapperStyle={styles.resourceColumnsWrapper}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="search-outline" size={60} color={THEME_COLORS.inactive} />
          <Text style={styles.emptyStateText}>No resources found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.surface,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.white,
    borderRadius: BORDER_RADIUS.medium,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    ...SHADOWS.small,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    color: THEME_COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.body,
    padding: SPACING.xs,
  },
  categoriesContainer: {
    paddingHorizontal: SPACING.md,
    // paddingBottom: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.secondary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.sm,
  },
  selectedCategoryButton: {
    backgroundColor: THEME_COLORS.primary,
  },
  categoryText: {
    color: THEME_COLORS.primary,
    fontSize: TYPOGRAPHY.fontSize.caption,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: THEME_COLORS.white,
  },
  resourcesContainer: {
    padding: SPACING.sm,
    // backgroundColor: 'black',
  },
  resourceColumnsWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.sm,
  },
  resourceCard: {
    width: '48%',
    backgroundColor: THEME_COLORS.white,
    borderRadius: BORDER_RADIUS.large,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  resourceImage: {
    width: '100%',
    height: 120,
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
    fontWeight: '600',
    color: THEME_COLORS.text,
    marginBottom: SPACING.xs,
  },
  resourceDetails: {
    fontSize: TYPOGRAPHY.fontSize.small,
    color: THEME_COLORS.textSecondary,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyStateText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.body,
    color: THEME_COLORS.textSecondary,
  },
});

export default ResourceLocator;