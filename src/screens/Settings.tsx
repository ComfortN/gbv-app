import React, { useState } from 'react';
import { router } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME_COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('9:00 AM');
  const [dataSharing, setDataSharing] = useState(false);
  
  // Navigate back to home
  const handleBackPress = () => {
    router.back();
  };
  
  // Handle notification toggle
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };
  
  // Handle dark mode toggle
  const toggleDarkMode = () => {
    setDarkModeEnabled(!darkModeEnabled);
    // In a real app, you would apply theme changes here
  };
  
  // Handle data sharing toggle
  const toggleDataSharing = () => {
    setDataSharing(!dataSharing);
  };
  
  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: () => {
            // In a real app, you would implement actual logout functionality
            console.log("User logged out");
            // Navigate to login screen or similar
          },
          style: "destructive"
        }
      ]
    );
  };
  
  // Handle account deletion
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            // In a real app, you would implement actual account deletion
            console.log("Account deleted");
            // Navigate to registration screen or similar
          },
          style: "destructive"
        }
      ]
    );
  };
  
  // Set reminder time
  const handleSetReminder = () => {
    // In a real app, you would show a time picker here
    Alert.alert(
      "Set Reminder Time",
      "This would open a time picker in a real app."
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Ionicons name="chevron-back" size={24} color={THEME_COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} /> {/* Empty view for spacing */}
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitials}>A</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Alex</Text>
            <Text style={styles.profileEmail}>alex@example.com</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={22} color={THEME_COLORS.text} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: THEME_COLORS.inactive, true: THEME_COLORS.primaryLight }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : notificationsEnabled ? THEME_COLORS.primary : '#f4f3f4'}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleSetReminder}>
            <View style={styles.settingInfo}>
              <Ionicons name="time-outline" size={22} color={THEME_COLORS.text} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Daily Reminder</Text>
            </View>
            <View style={styles.settingAction}>
              <Text style={styles.settingValue}>{reminderTime}</Text>
              <Ionicons name="chevron-forward" size={20} color={THEME_COLORS.inactive} />
            </View>
          </TouchableOpacity>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={22} color={THEME_COLORS.text} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={toggleDarkMode}
              trackColor={{ false: THEME_COLORS.inactive, true: THEME_COLORS.primaryLight }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : darkModeEnabled ? THEME_COLORS.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="analytics-outline" size={22} color={THEME_COLORS.text} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Data Sharing</Text>
            </View>
            <Switch
              value={dataSharing}
              onValueChange={toggleDataSharing}
              trackColor={{ false: THEME_COLORS.inactive, true: THEME_COLORS.primaryLight }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : dataSharing ? THEME_COLORS.primary : '#f4f3f4'}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="document-text-outline" size={22} color={THEME_COLORS.text} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={THEME_COLORS.inactive} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="help-circle-outline" size={22} color={THEME_COLORS.text} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={THEME_COLORS.inactive} />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="help-buoy-outline" size={22} color={THEME_COLORS.text} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Help Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={THEME_COLORS.inactive} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="mail-outline" size={22} color={THEME_COLORS.text} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Contact Us</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={THEME_COLORS.inactive} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="star-outline" size={22} color={THEME_COLORS.text} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Rate the App</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={THEME_COLORS.inactive} />
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleLogout}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="log-out-outline" size={22} color={THEME_COLORS.error} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: THEME_COLORS.error }]}>Logout</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleDeleteAccount}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="trash-outline" size={22} color={THEME_COLORS.error} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: THEME_COLORS.error }]}>Delete Account</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>MindfulMe v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: THEME_COLORS.white,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.heading3,
    fontWeight: '600',
    color: THEME_COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  profileInitials: {
    fontSize: TYPOGRAPHY.fontSize.heading2,
    fontWeight: 'bold',
    color: THEME_COLORS.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: TYPOGRAPHY.fontSize.heading3,
    fontWeight: '600',
    color: THEME_COLORS.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: THEME_COLORS.textSecondary,
  },
  editButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: THEME_COLORS.secondary,
  },
  editButtonText: {
    fontSize: TYPOGRAPHY.fontSize.small,
    fontWeight: '500',
    color: THEME_COLORS.primary,
  },
  section: {
    backgroundColor: THEME_COLORS.white,
    borderRadius: BORDER_RADIUS.medium,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    paddingVertical: SPACING.xs,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.body,
    fontWeight: '600',
    color: THEME_COLORS.text,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: SPACING.sm,
  },
  settingLabel: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: THEME_COLORS.text,
  },
  settingAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: THEME_COLORS.textSecondary,
    marginRight: SPACING.xs,
  },
  appInfo: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  appVersion: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: THEME_COLORS.textSecondary,
  },
});

export default Settings;