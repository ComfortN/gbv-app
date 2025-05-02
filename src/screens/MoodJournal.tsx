import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Platform,
  ActivityIndicator,
  Alert,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { format, subDays } from 'date-fns';

import MoodTracker, { MOOD_OPTIONS, MoodOption } from '../components/MoodTracker';
import { THEME_COLORS, TYPOGRAPHY, SPACING, SHADOWS, BORDER_RADIUS } from '../constants/theme';

// Mock data structure for a mood entry
interface MoodEntry {
  id: string;
  mood: string;
  date: Date;
  notes: string;
}

// In a real app, this would be fetched from an API or local storage
const mockMoodEntries: MoodEntry[] = [
  { id: '1', mood: 'happy', date: new Date(), notes: 'Had a great day! Went for a walk in the park and met up with friends for lunch.' },
  { id: '2', mood: 'sad', date: new Date(Date.now() - 86400000), notes: 'Feeling down today. Work has been stressful and I didn\'t sleep well.' },
  { id: '3', mood: 'anxious', date: new Date(Date.now() - 172800000), notes: 'Worried about my presentation tomorrow. Need to practice more.' },
  { id: '4', mood: 'calm', date: new Date(Date.now() - 259200000), notes: 'Meditated this morning. Feeling balanced and present.' },
  { id: '5', mood: 'angry', date: new Date(Date.now() - 345600000), notes: 'Frustrated with traffic. Need to find better coping mechanisms.' },
];

const MoodJournal = () => {
  const params = useLocalSearchParams();
  const paramMood = params.mood as string | undefined;
  const paramMoodId = params.moodId as string | undefined;

  const [selectedMood, setSelectedMood] = useState<string | undefined>(paramMood);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(mockMoodEntries);
  const [viewMode, setViewMode] = useState<'add' | 'history'>('add');
  const [editingEntry, setEditingEntry] = useState<MoodEntry | null>(null);
  
  useEffect(() => {
    // If a specific mood ID was passed, find and edit that entry
    if (paramMoodId) {
      setIsLoading(true);
      // Simulate API fetch delay
      setTimeout(() => {
        const entry = moodEntries.find(entry => entry.id === paramMoodId);
        if (entry) {
          setEditingEntry(entry);
          setSelectedMood(entry.mood);
          setNotes(entry.notes);
          setViewMode('add'); // Switch to edit mode
        }
        setIsLoading(false);
      }, 500);
    }
    // If a mood was passed but no ID, it's a new entry with preselected mood
    else if (paramMood) {
      setSelectedMood(paramMood);
      setViewMode('add');
    }
  }, [paramMoodId, paramMood]);

  const handleMoodSelect = (mood: MoodOption) => {
    setSelectedMood(mood.id);
  };

  const handleSaveMood = () => {
    if (!selectedMood) {
      Alert.alert('Please select a mood');
      return;
    }

    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      if (editingEntry) {
        // Update existing entry
        const updatedEntries = moodEntries.map(entry => 
          entry.id === editingEntry.id 
            ? { ...entry, mood: selectedMood, notes } 
            : entry
        );
        setMoodEntries(updatedEntries);
        setEditingEntry(null);
      } else {
        // Create new entry
        const newEntry: MoodEntry = {
          id: Date.now().toString(),
          mood: selectedMood,
          date: new Date(),
          notes,
        };
        setMoodEntries([newEntry, ...moodEntries]);
      }
      
      // Reset form
      setSelectedMood(undefined);
      setNotes('');
      setIsSaving(false);
      
      // Show success feedback
      Alert.alert(
        'Success', 
        editingEntry ? 'Mood updated successfully!' : 'Mood saved successfully!',
        [{ text: 'OK', onPress: () => setViewMode('history') }]
      );
    }, 1000);
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
    setSelectedMood(undefined);
    setNotes('');
  };
  
  const handleDeleteEntry = (entryId: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this mood entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setMoodEntries(moodEntries.filter(entry => entry.id !== entryId));
          }
        },
      ]
    );
  };

  const getMoodEmoji = (moodId: string) => {
    const mood = MOOD_OPTIONS.find(m => m.id === moodId);
    return mood ? mood.emoji : '😐';
  };

  const formatMoodDate = (date: Date) => {
    const today = new Date();
    const yesterday = subDays(today, 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy, h:mm a');
    }
  };

  const renderMoodEntry = ({ item }: { item: MoodEntry }) => (
    <TouchableOpacity 
      style={styles.moodEntryCard}
      onPress={() => {
        setEditingEntry(item);
        setSelectedMood(item.mood);
        setNotes(item.notes);
        setViewMode('add');
      }}
    >
      <View style={styles.moodEntryHeader}>
        <View style={styles.moodEmojiContainer}>
          <Text style={styles.moodEmoji}>{getMoodEmoji(item.mood)}</Text>
        </View>
        <View style={styles.moodInfoContainer}>
          <Text style={styles.moodName}>
            {MOOD_OPTIONS.find(m => m.id === item.mood)?.name || 'Unknown'}
          </Text>
          <Text style={styles.moodDate}>{formatMoodDate(item.date)}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => handleDeleteEntry(item.id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={18} color={THEME_COLORS.error} />
        </TouchableOpacity>
      </View>
      
      {item.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME_COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={THEME_COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mood Journal</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'add' && styles.activeTab]}
          onPress={() => setViewMode('add')}
        >
          <Text style={[styles.tabText, viewMode === 'add' && styles.activeTabText]}>
            {editingEntry ? 'Edit Mood' : 'Add Mood'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'history' && styles.activeTab]}
          onPress={() => setViewMode('history')}
        >
          <Text style={[styles.tabText, viewMode === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'add' ? (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <MoodTracker 
            onMoodSelect={handleMoodSelect}
            selectedMood={selectedMood}
            title={editingEntry ? "How were you feeling?" : "How are you feeling right now?"}
          />

          <View style={styles.notesCard}>
            <Text style={styles.notesTitle}>Add notes (optional)</Text>
            <TextInput
              style={styles.notesInput}
              multiline
              placeholder="What's on your mind? Add details about your mood..."
              value={notes}
              onChangeText={setNotes}
              placeholderTextColor={THEME_COLORS.inactive}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.buttonContainer}>
            {editingEntry && (
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancelEdit}
                disabled={isSaving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.saveButton, isSaving && styles.disabledButton]}
              onPress={handleSaveMood}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={THEME_COLORS.white} />
              ) : (
                <Text style={styles.saveButtonText}>
                  {editingEntry ? 'Update' : 'Save'} Mood
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.historyContainer}>
          <View style={styles.insightsCard}>
            <Text style={styles.insightsTitle}>Your Mood Insights</Text>
            <Text style={styles.insightsText}>
              In the past week, you've been mostly feeling 
              <Text style={styles.highlightText}> happy</Text>. That's 
              <Text style={styles.positiveText}> better</Text> than last week!
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Mood History</Text>
          
          <FlatList
            data={moodEntries}
            renderItem={renderMoodEntry}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.entriesList}
          />
        </View>
      )}
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
    paddingVertical: SPACING.sm,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.heading2,
    fontWeight: '600',
    color: THEME_COLORS.text,
  },
  placeholder: {
    width: 30,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    backgroundColor: THEME_COLORS.surface,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.xs,
  },
  tab: {
    flex: 1,
    padding: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.small,
  },
  activeTab: {
    backgroundColor: THEME_COLORS.background,
    ...Platform.select({
      ios: {
        shadowColor: THEME_COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  tabText: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: THEME_COLORS.textSecondary,
  },
  activeTabText: {
    color: THEME_COLORS.primary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  notesCard: {
    backgroundColor: THEME_COLORS.background,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: THEME_COLORS.secondary,
  },
  notesTitle: {
    fontSize: TYPOGRAPHY.fontSize.body,
    fontWeight: '600',
    color: THEME_COLORS.text,
    marginBottom: SPACING.sm,
  },
  notesInput: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: THEME_COLORS.secondary,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.body,
    color: THEME_COLORS.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
  },
  saveButton: {
    flex: 1,
    backgroundColor: THEME_COLORS.primary,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: THEME_COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.body,
    fontWeight: '600',
  },
  cancelButton: {
    marginRight: SPACING.sm,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME_COLORS.inactive,
    borderRadius: BORDER_RADIUS.medium,
    width: 100,
  },
  cancelButtonText: {
    color: THEME_COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.body,
  },
  historyContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  insightsCard: {
    backgroundColor: THEME_COLORS.background,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: THEME_COLORS.secondary,
  },
  insightsTitle: {
    fontSize: TYPOGRAPHY.fontSize.heading3,
    fontWeight: '600',
    color: THEME_COLORS.text,
    marginBottom: SPACING.sm,
  },
  insightsText: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: THEME_COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.body,
  },
  highlightText: {
    fontWeight: '600',
    color: THEME_COLORS.primary,
  },
  positiveText: {
    fontWeight: '600',
    color: THEME_COLORS.success,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.heading3,
    fontWeight: '600',
    color: THEME_COLORS.text,
    marginBottom: SPACING.md,
  },
  entriesList: {
    paddingBottom: SPACING.lg,
  },
  moodEntryCard: {
    backgroundColor: THEME_COLORS.background,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: THEME_COLORS.secondary,
  },
  moodEntryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodEmojiContainer: {
    width: 45,
    height: 45,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: THEME_COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  moodEmoji: {
    fontSize: 24,
  },
  moodInfoContainer: {
    flex: 1,
  },
  moodName: {
    fontSize: TYPOGRAPHY.fontSize.body,
    fontWeight: '600',
    color: THEME_COLORS.text,
  },
  moodDate: {
    fontSize: TYPOGRAPHY.fontSize.small,
    color: THEME_COLORS.textSecondary,
    marginTop: 2,
  },
  deleteButton: {
    padding: SPACING.sm,
  },
  notesContainer: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: THEME_COLORS.secondary,
  },
  notesText: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: THEME_COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.body,
  },
});

export default MoodJournal;