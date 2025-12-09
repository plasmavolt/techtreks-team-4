import { BorderRadius, Colors, Fonts, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SignInScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    // Validation
    if (!username || !username.trim()) {
      Alert.alert('Error', 'Please enter your username');
      return;
    }

    if (isSignUp && (!email || !email.trim())) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    // Username validation (alphanumeric, underscores, hyphens)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username.trim())) {
      Alert.alert('Error', 'Username can only contain letters, numbers, underscores, and hyphens');
      return;
    }

    if (username.trim().length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters');
      return;
    }

    if (isSignUp) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }
    }

    setIsLoading(true);

    try {
      let success = false;
      if (isSignUp) {
        success = await signUp(
          username.trim(),
          password,
          email.trim().toLowerCase(),
          name.trim() || undefined
        );
      } else {
        success = await signIn(username.trim(), password);
      }

      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert(
          'Error',
          isSignUp
            ? 'Failed to create account. Please check your information and try again.'
            : 'Invalid username or password. Please try again.'
        );
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Sidequest</Text>
        <Text style={styles.subtitle}>
          {isSignUp ? 'Create your account' : 'Welcome back!'}
        </Text>

        <View style={styles.form}>
          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Name (optional)"
              placeholderTextColor={Colors.textLight}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}

          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Colors.textLight}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={Colors.textLight}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoComplete="username"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.textLight}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.backgroundDark} />
            ) : (
              <Text style={styles.buttonText}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsSignUp(!isSignUp)}
          >
            <Text style={styles.switchText}>
              {isSignUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: Fonts.display,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    fontFamily: Fonts.sans,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    fontFamily: Fonts.mono,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.backgroundDark,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },
  switchButton: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  switchText: {
    color: Colors.accent,
    fontSize: 14,
    fontFamily: Fonts.sans,
  },
});

