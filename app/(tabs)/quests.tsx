import { BorderRadius, Colors, FontSize, Fonts, Shadows, Spacing } from '@/constants/theme'
import { Quest, useQuests } from '@/contexts/QuestContext'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const app = () => {
  const router = useRouter()
  const colorScheme = useColorScheme()
  const { quests, activeQuest, isLoading, startQuest } = useQuests()

  const getDifficultyColor = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return '#4CAF50'
      case 'medium':
        return '#FF9800'
      case 'hard':
        return '#F44336'
    }
  }

  const handleQuestPress = (quest: Quest) => {
    // Check if there's already an active quest
    if (activeQuest && activeQuest.id !== quest.id) {
      Alert.alert(
        'Active Quest',
        `You already have an active quest: "${activeQuest.title}". Complete or abandon it first.`,
        [{ text: 'OK' }]
      )
      return
    }

    // Check if this quest is already active
    if (activeQuest?.id === quest.id) {
      // Navigate to map to continue the quest
      router.push({
        pathname: '/',
        params: {
          highlightedLocations: JSON.stringify(quest.locationIds),
          questId: quest.id
        }
      })
      return
    }

    Alert.alert(
      'Start Quest',
      `Do you want to start "${quest.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start!',
          style: 'default',
          onPress: async () => {
            const success = await startQuest(quest.id)
            if (success) {
              router.push({
                pathname: '/',
                params: {
                  highlightedLocations: JSON.stringify(quest.locationIds),
                  questId: quest.id
                }
              })
            } else {
              Alert.alert('Error', 'Failed to start quest. Please try again.')
            }
          },
        },
      ]
    )
  }

  const renderQuestCard = ({ item }: { item: Quest }) => {
    const isActive = activeQuest?.id === item.id
    const isCompleted = item.completed

    return (
      <TouchableOpacity
        style={[
          styles.questCard,
          isActive && styles.activeQuestCard,
          isCompleted && styles.completedQuestCard
        ]}
        onPress={() => handleQuestPress(item)}
        activeOpacity={0.7}
        disabled={isCompleted}
      >
        <View style={styles.cardHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
            <Text style={styles.difficultyText}>{item.difficulty.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.questTitle}>{item.title}</Text>
        <Text style={styles.questDescription}>{item.description}</Text>

        {/* Show progress if quest is active */}
        {isActive && item.progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(item.progress)}% Complete</Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          <View style={styles.locationInfo}>
            <Text style={styles.locationCount}>📍 {item.locationIds.length} location{item.locationIds.length > 1 ? 's' : ''}</Text>
          </View>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>
              {isCompleted ? '✓ ' : ''}+{item.points} pts
            </Text>
          </View>
        </View>

        {isActive && (
          <View style={styles.activeIndicator}>
            <Text style={styles.activeIndicatorText}>ACTIVE</Text>
          </View>
        )}

        {isCompleted && (
          <View style={styles.completedOverlay}>
            <Text style={styles.completedText}>✓ COMPLETED</Text>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Quests</Text>
          <Text style={styles.headerSubtitle}>Complete challenges to earn points</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading quests...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quests</Text>
        <Text style={styles.headerSubtitle}>
          {activeQuest
            ? `Active: ${activeQuest.title}`
            : 'Complete challenges to earn points'}
        </Text>
      </View>

      <FlatList
        data={quests}
        renderItem={renderQuestCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No quests available</Text>
            <Text style={styles.emptySubtext}>Check back later for new adventures!</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
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
    color: 'beige',
    fontFamily: Fonts.sans,
    marginTop: Spacing.xs,
  },

  listContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },

  questCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.medium,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  categoryBadge: {
    backgroundColor: 'beige',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },

  categoryText: {
    fontSize: FontSize.xs,
    fontWeight: 'bold',
    color: '#c92a2a',
    fontFamily: Fonts.mono,
  },

  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },

  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'Colors.background',
    fontFamily: Fonts.mono,
  },

  questTitle: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: 'beige',
    fontFamily: Fonts.display,
    marginBottom: Spacing.sm,
  },

  questDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationCount: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    fontFamily: Fonts.mono,
  },

  pointsBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },

  pointsText: {
    fontSize: FontSize.xs,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: Fonts.mono,
  },

  activeQuestCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: Colors.backgroundDark,
  },

  completedQuestCard: {
    opacity: 0.6,
  },

  progressContainer: {
    marginBottom: Spacing.md,
  },

  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },

  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },

  progressText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    textAlign: 'center',
  },

  activeIndicator: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },

  activeIndicatorText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.background,
    fontFamily: Fonts.mono,
  },

  completedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: BorderRadius.lg,
  },

  completedText: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: '#4CAF50',
    fontFamily: Fonts.mono,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },

  loadingText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontFamily: Fonts.sans,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    marginTop: 100,
  },

  emptyText: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: Colors.text,
    fontFamily: Fonts.display,
    marginBottom: Spacing.sm,
  },

  emptySubtext: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontFamily: Fonts.sans,
    textAlign: 'center',
  },
})
