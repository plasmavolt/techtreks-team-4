import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './AuthContext';

export interface Quest {
  id: string;
  title: string;
  description: string;
  locationIds: string[];
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  completed?: boolean;
  progress?: number; // 0-100 percentage
}

interface QuestContextType {
  quests: Quest[];
  activeQuest: Quest | null;
  completedQuests: Quest[];
  isLoading: boolean;
  startQuest: (questId: string) => Promise<boolean>;
  completeQuest: (questId: string) => Promise<boolean>;
  checkInAtLocation: (locationId: string) => Promise<boolean>;
  abandonQuest: () => void;
  fetchQuests: () => Promise<void>;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

export function QuestProvider({ children }: { children: ReactNode }) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [completedQuests, setCompletedQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load quests when user logs in
  useEffect(() => {
    if (user) {
      fetchQuests();
      loadActiveQuest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchQuests = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with API call to fetch quests from backend
      // const response = await fetch(API_ENDPOINTS.QUESTS.GET_ALL);
      // const data = await response.json();

      // For now, using mock data
      const mockQuests: Quest[] = [
        {
          id: 'quest_1',
          title: 'Brooklyn Sweet Sweep',
          description: 'Visit 3 bakeries in Brooklyn',
          locationIds: ['mock_1', 'mock_2', 'mock_3'],
          difficulty: 'easy',
          points: 50,
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
          title: 'Bodega Cats',
          description: 'Pet three bodega cats all over NYC',
          locationIds: ['mock_3'],
          difficulty: 'medium',
          points: 100,
          category: 'Adventure'
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
      

      setQuests(mockQuests);
    } catch (error) {
      console.error('Error fetching quests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadActiveQuest = async () => {
    try {
      // TODO: Load active quest from AsyncStorage or backend
      // const activeQuestData = await AsyncStorage.getItem('activeQuest');
      // if (activeQuestData) {
      //   setActiveQuest(JSON.parse(activeQuestData));
      // }
    } catch (error) {
      console.error('Error loading active quest:', error);
    }
  };

  const startQuest = async (questId: string): Promise<boolean> => {
    try {
      const quest = quests.find(q => q.id === questId);
      if (!quest) return false;

      // Can't start a new quest if one is already active
      if (activeQuest) {
        console.warn('A quest is already active. Complete or abandon it first.');
        return false;
      }

      setActiveQuest({ ...quest, progress: 0 });

      // TODO: Save to AsyncStorage or backend
      // await AsyncStorage.setItem('activeQuest', JSON.stringify(quest));
      // await fetch(API_ENDPOINTS.QUESTS.START(questId), { method: 'POST' });

      return true;
    } catch (error) {
      console.error('Error starting quest:', error);
      return false;
    }
  };

  const checkInAtLocation = async (locationId: string): Promise<boolean> => {
    try {
      if (!activeQuest) return false;

      // Check if location is part of the active quest
      if (!activeQuest.locationIds.includes(locationId)) {
        return false;
      }

      // TODO: Update progress based on locations visited
      // This would track which locations have been checked in
      // For now, just increment progress
      const progress = Math.min(100, (activeQuest.progress || 0) + (100 / activeQuest.locationIds.length));

      const updatedQuest = { ...activeQuest, progress };
      setActiveQuest(updatedQuest);

      // If all locations visited, complete the quest
      if (progress >= 100) {
        await completeQuest(activeQuest.id);
      }

      return true;
    } catch (error) {
      console.error('Error checking in at location:', error);
      return false;
    }
  };

  const completeQuest = async (questId: string): Promise<boolean> => {
    try {
      if (!activeQuest || activeQuest.id !== questId) return false;

      // Mark quest as completed
      const completedQuest = { ...activeQuest, completed: true, progress: 100 };

      setCompletedQuests(prev => [...prev, completedQuest]);
      setActiveQuest(null);

      // TODO: Send to backend to update user points and completed quests
      // await fetch(API_ENDPOINTS.QUESTS.COMPLETE(questId), {
      //   method: 'POST',
      //   body: JSON.stringify({ userId: user.id }),
      // });

      return true;
    } catch (error) {
      console.error('Error completing quest:', error);
      return false;
    }
  };

  const abandonQuest = () => {
    Alert.alert(
      'Abandon Quest',
      `Do you want to abandon "${activeQuest?.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Abandon',
          style: 'destructive',
          onPress: async () => {
            setActiveQuest(null);
          }
        }
      ]
    )
    // TODO: Clear from AsyncStorage
    // await AsyncStorage.removeItem('activeQuest');
  };

  return (
    <QuestContext.Provider
      value={{
        quests,
        activeQuest,
        completedQuests,
        isLoading,
        startQuest,
        completeQuest,
        checkInAtLocation,
        abandonQuest,
        fetchQuests,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
}

export function useQuests() {
  const context = useContext(QuestContext);
  if (context === undefined) {
    throw new Error('useQuests must be used within a QuestProvider');
  }
  return context;
}
