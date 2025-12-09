import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BorderRadius, Colors, FontSize, Fonts, Shadows, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

export default function TabTwoScreen() {
  const router = useRouter();
  const { user, signOut, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.profilePicture || null);
  const [isEditingName, setIsEditingName] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to set a profile picture!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newUri = result.assets[0].uri;
        setProfilePicture(newUri);
        await updateProfile({ profilePicture: newUri });
        Alert.alert('Success', 'Profile picture updated!');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Sorry, we need camera permissions to take a photo!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newUri = result.assets[0].uri;
        setProfilePicture(newUri);
        await updateProfile({ profilePicture: newUri });
        Alert.alert('Success', 'Profile picture updated!');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        ...(profilePicture ? [{ text: 'Remove Photo', style: 'destructive' as const, onPress: () => {
          setProfilePicture(null);
          updateProfile({ profilePicture: undefined });
        }}] : []),
      ]
    );
  };

  const handleSaveName = async () => {
    if (name.trim()) {
      const success = await updateProfile({ name: name.trim() });
      if (success) {
        Alert.alert('Success', 'Name updated!');
        setIsEditingName(false);
      } else {
        Alert.alert('Error', 'Failed to update name. Please try again.');
      }
    } else {
      setIsEditingName(false);
      setName(user?.name || '');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/sign-in');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>Manage your account</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        {user && (
          <View style={styles.profileCard}>
            {/* Profile Avatar */}
            <TouchableOpacity onPress={showImagePickerOptions} style={styles.avatarContainer}>
              {profilePicture ? (
                <Image source={{ uri: profilePicture }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : user.email[0].toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={styles.editIconContainer}>
                <MaterialIcons name="camera-alt" size={20} color="#fff" />
              </View>
            </TouchableOpacity>

            {/* User Info */}
            <View style={styles.userInfo}>
              {isEditingName ? (
                <View style={styles.nameEditContainer}>
                  <TextInput
                    style={styles.nameInput}
                    value={name}
                    onChangeText={setName}
                    autoFocus
                    onBlur={handleSaveName}
                    onSubmitEditing={handleSaveName}
                    placeholder="Enter your name"
                    placeholderTextColor="#999"
                  />
                </View>
              ) : (
                <View style={styles.nameContainer}>
                  {user.name ? (
                    <>
                      <Text style={styles.userName}>{name}</Text>
                      <TouchableOpacity onPress={() => setIsEditingName(true)} style={styles.editNameButton}>
                        <MaterialIcons name="edit" size={18} color={Colors.accent} />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity onPress={() => setIsEditingName(true)}>
                      <Text style={[styles.userName, styles.addNameText]}>Add Name</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              <Text style={styles.userId}>@{user.id}</Text>
            </View>

          </View>
        )}

        {/* Stats Section */}
        <View style={styles.userStatsRow}>
          {/* Quests Completed */}
          <View style={styles.userStatCard}>
            <Text style={styles.userStatValue}>
              {user?.questsCompleted ?? 0}
            </Text>
            <Text style={styles.userStatLabel}>Quests</Text>
          </View>
          {/* User Points */}
          <View style={styles.userStatCard}>
            <Text style={styles.userStatValue}>
              {user?.points ?? 0}
            </Text>
            <Text style={styles.userStatLabel}>Points</Text>
          </View>
          {/* Rank */}
          <View style={styles.userStatCard}>
            <Text style={styles.userStatValue}>
              {user?.rank ?? '-'}
            </Text>
            <Text style={styles.userStatLabel}>Rank</Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingsList}>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => Alert.alert('About', 'SideQuest v1.0.0')}
            >
              <MaterialIcons name="info" size={24} color={Colors.primary} />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>About</Text>
                <Text style={styles.settingSubtext}>App version and info</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={Colors.accent} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },

  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
  },

  headerTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: 'bold',
    color: '#c92a2a',
    fontFamily: Fonts.display,
  },

  headerSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontFamily: Fonts.sans,
    marginTop: Spacing.xs,
  },

  scrollContent: {
    padding: Spacing.lg,
  },

  profileCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },

  avatarContainer: {
    marginBottom: Spacing.md,
    position: 'relative',
  },

  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.background,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.secondary,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: FontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.primary,
    fontFamily: Fonts.rounded,
  },

  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  userInfo: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },

  nameEditContainer: {
    width: '80%',
  },

  nameInput: {
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    fontFamily: Fonts.serif,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  editNameButton: {
    padding: 4,
  },

  userName: {
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    fontFamily: Fonts.serif,
    marginBottom: Spacing.xs,
  },

  addNameText: {
    color: Colors.accent,
    textDecorationLine: 'underline',
  },

  userId: {
    fontSize: FontSize.md,
    color: Colors.textLight,
    fontFamily: Fonts.mono,
  },

  settingsSection: {
    marginBottom: Spacing.lg,
  },

  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    fontFamily: Fonts.serif,
    marginBottom: Spacing.md,
  },

  // UserStatsRow: horizontal list of user stats (e.g. points, quests completed, rank)
  userStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.background,
    paddingVertical: Spacing.md,
    paddingHorizontal: 5,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
  },

  userStatCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },

  userStatValue: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: Colors.primary,
    fontFamily: Fonts.mono,
  },

  userStatLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: Fonts.sans,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  settingsList: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.small,
  },

  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },

  settingContent: {
    flex: 1,
  },

  settingTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: Fonts.sans,
    marginBottom: 2,
  },

  settingSubtext: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    fontFamily: Fonts.sans,
  },

  signOutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
    ...Shadows.medium,
  },

  signOutButtonText: {
    color: Colors.textWhite,
    fontSize: FontSize.md,
    fontWeight: 'bold',
    fontFamily: Fonts.sans,
  },
});
