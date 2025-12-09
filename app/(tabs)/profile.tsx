import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BorderRadius, Colors, FontSize, Fonts, Shadows, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

export default function TabTwoScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

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
            <View style={styles.avatarContainer}>
              {user?.profilePicture ? (
                <Image source={{ uri: user.profilePicture }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : user.email[0].toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
              {user.name ? (
                <Text style={styles.userName}>{user.name}</Text>
              ) : (
                <TouchableOpacity onPress={() => router.push('/edit-profile')}>
                  <Text style={[styles.userName, styles.addNameText]}>Add Name</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.userId}>@{user.id}</Text>
            </View>

            {/* Profile Actions */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push('/edit-profile')}
            >
              <MaterialIcons name="edit" size={20} color={Colors.background} />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
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
              onPress={() => Alert.alert('Notifications', 'Notification settings coming soon!')}
            >
              <MaterialIcons name="notifications" size={24} color={Colors.primary} />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingSubtext}>Manage your notifications</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={Colors.accent} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => Alert.alert('Privacy', 'Privacy settings coming soon!')}
            >
              <MaterialIcons name="lock" size={24} color={Colors.primary} />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Privacy</Text>
                <Text style={styles.settingSubtext}>Control your privacy</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={Colors.accent} />
            </TouchableOpacity>

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

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },

  editButtonText: {
    color: Colors.background,
    fontSize: FontSize.sm,
    fontWeight: '600',
    fontFamily: Fonts.sans,
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
