import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabTwoScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;
  const { user, signOut, getStoredData } = useAuth();
  const [storedData, setStoredData] = useState<{ user: string | null; token: string | null } | null>(null);

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

  const handleViewStoredData = async () => {
    const data = await getStoredData();
    setStoredData(data);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#000000ff"
          name="person.3.sequence"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.serif,
          }}>
          Profile
        </ThemedText>
      </ThemedView>

      {/* Profile Section */}
      {user && (
        <ThemedView style={styles.profileSection}>
          {/* Profile Avatar */}
          <ThemedView style={styles.avatarContainer}>
            {user?.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={styles.avatarImage} />
            ) : (
              <ThemedView style={styles.avatar}>
                <IconSymbol
                  size={80}
                  name="person.crop.circle.fill"
                  color={tintColor}
                />
              </ThemedView>
            )}
          </ThemedView>

          {/* User Info */}
          <ThemedView style={styles.userInfo}>
            {user.name ? (
              <ThemedText type="title" style={styles.userName}>
                {user.name}
              </ThemedText>
            ) : (
              <TouchableOpacity onPress={() => router.push('/edit-profile')}>
                <ThemedText type="title" style={styles.userName}>
                  Add Name
                </ThemedText>
              </TouchableOpacity>
            )}
            <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
          </ThemedView>

          {/* Profile Actions */}
          <ThemedView style={styles.profileActions}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: tintColor }]}
              onPress={() => router.push('/edit-profile')}
            >
              <MaterialIcons name="edit" size={20} color="#fff" />
              <ThemedText style={styles.actionButtonText}>Edit Profile</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      )}

      {/* Settings Section */}
      <Collapsible title="Settings">
        <ThemedView style={styles.settingsList}>
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert('Notifications', 'Notification settings coming soon!')}
          >
            <MaterialIcons name="notifications" size={24} color={tintColor} />
            <ThemedView style={styles.settingContent}>
              <ThemedText type="defaultSemiBold">Notifications</ThemedText>
              <ThemedText style={styles.settingSubtext}>Manage your notifications</ThemedText>
            </ThemedView>
            <MaterialIcons name="chevron-right" size={20} color={tintColor} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert('Privacy', 'Privacy settings coming soon!')}
          >
            <MaterialIcons name="lock" size={24} color={tintColor} />
            <ThemedView style={styles.settingContent}>
              <ThemedText type="defaultSemiBold">Privacy</ThemedText>
              <ThemedText style={styles.settingSubtext}>Control your privacy</ThemedText>
            </ThemedView>
            <MaterialIcons name="chevron-right" size={20} color={tintColor} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert('About', 'SideQuest v1.0.0')}
          >
            <MaterialIcons name="info" size={24} color={tintColor} />
            <ThemedView style={styles.settingContent}>
              <ThemedText type="defaultSemiBold">About</ThemedText>
              <ThemedText style={styles.settingSubtext}>App version and info</ThemedText>
            </ThemedView>
            <MaterialIcons name="chevron-right" size={20} color={tintColor} />
          </TouchableOpacity>
        </ThemedView>
      </Collapsible>

      {/* Sign Out Button */}
      <ThemedView style={styles.navigationSection}>
        <TouchableOpacity 
          style={[styles.signOutButton, { backgroundColor: '#ff4444' }]}
          onPress={handleSignOut}
        >
          <ThemedText style={styles.navButtonText}>Sign Out</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <Collapsible title="View Stored Data (Debug)">
        <ThemedText style={{ marginBottom: 12 }}>
          Click the button below to view what's stored in SecureStore:
        </ThemedText>
        <TouchableOpacity 
          style={[styles.debugButton, { backgroundColor: tintColor }]}
          onPress={handleViewStoredData}
        >
          <ThemedText style={styles.navButtonText}>View Stored Data</ThemedText>
        </TouchableOpacity>
        
        {storedData && (
          <ThemedView style={styles.debugSection}>
            <ThemedText type="defaultSemiBold" style={{ marginBottom: 8 }}>
              User Data (JSON):
            </ThemedText>
            <ScrollView style={styles.debugScroll}>
              <ThemedText style={styles.debugText}>
                {storedData.user || 'No user data stored'}
              </ThemedText>
            </ScrollView>
            
            <ThemedText type="defaultSemiBold" style={{ marginTop: 16, marginBottom: 8 }}>
              Auth Token:
            </ThemedText>
            <ScrollView style={styles.debugScroll}>
              <ThemedText style={styles.debugText}>
                {storedData.token || 'No token stored'}
              </ThemedText>
            </ScrollView>
          </ThemedView>
        )}
      </Collapsible>
      
      <ThemedText>This app includes example code to help you get started.</ThemedText>
      <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
          different screen densities
        </ThemedText>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful{' '}
          <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
            react-native-reanimated
          </ThemedText>{' '}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  profileSection: {
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 150, 190, 0.1)',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    marginBottom: 4,
    fontFamily: Fonts.sans,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
    fontFamily: Fonts.sans,
  },
  profileActions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },
  settingsList: {
    marginTop: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingSubtext: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  navigationSection: {
    marginTop: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 200,
  },
  debugButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 200,
    marginBottom: 16,
  },
  debugSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
  },
  debugScroll: {
    maxHeight: 100,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 4,
    padding: 8,
  },
  debugText: {
    fontFamily: Fonts.mono,
    fontSize: 12,
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
