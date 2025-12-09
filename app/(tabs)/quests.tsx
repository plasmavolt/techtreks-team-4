import { BorderRadius, Colors, FontSize, Fonts, Shadows, Spacing } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useRouter } from 'expo-router'
import React from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Quest {
  id: string
  title: string
  description: string
  locationIds: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  points: number
  category: string
}

// Mock quest data
const QUESTS: Quest[] = [
  {
    id: 'quest_1',
    title: 'Foodie Adventure',
    description: 'Visit 3 top-rated restaurants in the East Village',
    locationIds: ['mock_1', 'mock_2', 'mock_3'],
    difficulty: 'easy',
    points: 100,
    category: 'Food & Drink'
  },
  {
    id: 'quest_2',
    title: 'Historic Landmarks Tour',
    description: 'Explore 4 iconic New York landmarks',
    locationIds: ['mock_2', 'mock_3', 'mock_4', 'mock_5'],
    difficulty: 'medium',
    points: 200,
    category: 'Sightseeing'
  },
  {
    id: 'quest_3',
    title: 'Brooklyn Bridge Walk',
    description: 'Walk across the Brooklyn Bridge and visit nearby spots',
    locationIds: ['mock_3'],
    difficulty: 'easy',
    points: 75,
    category: 'Sightseeing'
  },
  {
    id: 'quest_4',
    title: 'Manhattan Explorer',
    description: 'Visit all 5 major attractions across Manhattan',
    locationIds: ['mock_1', 'mock_2', 'mock_3', 'mock_4', 'mock_5'],
    difficulty: 'hard',
    points: 300,
    category: 'Adventure'
  }
]

const app = () => {
  const router = useRouter()
  const colorScheme = useColorScheme()

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
    // Navigate to map with highlighted locations
    router.push({
      pathname: '/',
      params: {
        highlightedLocations: JSON.stringify(quest.locationIds),
        questId: quest.id
      }
    })
  }

  const renderQuestCard = ({ item }: { item: Quest }) => (
    <TouchableOpacity
      style={styles.questCard}
      onPress={() => handleQuestPress(item)}
      activeOpacity={0.7}
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

      <View style={styles.cardFooter}>
        <View style={styles.locationInfo}>
          <Text style={styles.locationCount}>📍 {item.locationIds.length} location{item.locationIds.length > 1 ? 's' : ''}</Text>
        </View>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>+{item.points} pts</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quests</Text>
        <Text style={styles.headerSubtitle}>Complete challenges to earn points</Text>
      </View>

      <FlatList
        data={QUESTS}
        renderItem={renderQuestCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

export default app

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
    color: Colors.primary,
    fontFamily: Fonts.display,
  },

  headerSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
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
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },

  categoryText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.accent,
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
    color: Colors.background,
    fontFamily: Fonts.mono,
  },

  questTitle: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    fontFamily: Fonts.serif,
    marginBottom: Spacing.sm,
  },

  questDescription: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontFamily: Fonts.sans,
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
    color: Colors.accent,
    fontFamily: Fonts.mono,
  },
})
