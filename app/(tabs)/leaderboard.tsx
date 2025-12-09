import { BorderRadius, Colors, FontSize, Fonts, Shadows, Spacing } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useRouter } from 'expo-router'
import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface LeaderboardEntry {
  id: string
  name: string
  username: string
  points: number
  questsCompleted: number
  rank: number
}

// Mock leaderboard data
const LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    username: '@sarahexplores',
    points: 2850,
    questsCompleted: 28,
    rank: 1,
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    username: '@marcusadventures',
    points: 2640,
    questsCompleted: 25,
    rank: 2,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    username: '@emilyquest',
    points: 2420,
    questsCompleted: 23,
    rank: 3,
  },
  {
    id: '4',
    name: 'David Kim',
    username: '@davidexplorer',
    points: 2180,
    questsCompleted: 21,
    rank: 4,
  },
  {
    id: '5',
    name: 'Jessica Park',
    username: '@jessicatravels',
    points: 1950,
    questsCompleted: 19,
    rank: 5,
  },
  {
    id: '6',
    name: 'Tyler Williams',
    username: '@tylerwanders',
    points: 1820,
    questsCompleted: 17,
    rank: 6,
  },
  {
    id: '7',
    name: 'Olivia Martinez',
    username: '@oliviaonquest',
    points: 1650,
    questsCompleted: 16,
    rank: 7,
  },
  {
    id: '8',
    name: 'James Anderson',
    username: '@jamesjourney',
    points: 1480,
    questsCompleted: 14,
    rank: 8,
  },
]

const app = () => {
  const router = useRouter()
  const colorScheme = useColorScheme()

  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return null
    }
  }

  const renderLeaderboardItem = ({ item }: { item: LeaderboardEntry }) => {
    const medal = getRankMedal(item.rank)

    return (
      <View style={styles.leaderboardItem}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>{item.rank}</Text>
        </View>

        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>
            {item.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>{item.name}</Text>
            {medal && <Text style={styles.medalEmoji}>{medal}</Text>}
          </View>
          <Text style={styles.userUsername}>{item.username}</Text>
        </View>

        <View style={styles.userStats}>
          <Text style={styles.userPoints}>{item.points.toLocaleString()}</Text>
          <Text style={styles.userQuestsLabel}>points</Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Text style={styles.headerSubtitle}>See how you stack up!</Text>
      </View>

      <FlatList
        data={LEADERBOARD_DATA}
        renderItem={renderLeaderboardItem}
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
    color: '#c92a2a',
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
    paddingBottom: Spacing.lg,
  },

  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },

  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  rankText: {
    fontSize: FontSize.sm,
    fontWeight: 'bold',
    color: Colors.accent,
    fontFamily: Fonts.mono,
  },

  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  userAvatarText: {
    fontSize: FontSize.md,
    fontWeight: 'bold',
    color: Colors.primary,
    fontFamily: Fonts.rounded,
  },

  userInfo: {
    flex: 1,
  },

  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 2,
  },

  userName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: Fonts.serif,
  },

  medalEmoji: {
    fontSize: FontSize.md,
  },

  userUsername: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    fontFamily: Fonts.mono,
  },

  userStats: {
    alignItems: 'flex-end',
  },

  userPoints: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.primary,
    fontFamily: Fonts.mono,
  },

  userQuestsLabel: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    fontFamily: Fonts.sans,
  },
})
