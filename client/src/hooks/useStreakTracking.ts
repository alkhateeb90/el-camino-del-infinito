import { useState, useEffect } from 'react';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  badges: {
    sevenDay: boolean;
    thirtyDay: boolean;
    hundredDay: boolean;
  };
  streakStartDate: string;
}

export interface BadgeInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  daysRequired: number;
  color: string;
  unlocked: boolean;
  unlockedDate?: string;
}

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: new Date().toISOString().split('T')[0],
  badges: {
    sevenDay: false,
    thirtyDay: false,
    hundredDay: false,
  },
  streakStartDate: new Date().toISOString().split('T')[0],
};

export const BADGES: BadgeInfo[] = [
  {
    id: 'seven-day',
    name: 'Aprendiz Dedicado',
    description: '7 días de aprendizaje consecutivo',
    icon: '🔥',
    daysRequired: 7,
    color: '#FF6B6B',
    unlocked: false,
  },
  {
    id: 'thirty-day',
    name: 'Guerrero Imparable',
    description: '30 días de aprendizaje consecutivo',
    icon: '⚡',
    daysRequired: 30,
    color: '#FFD93D',
    unlocked: false,
  },
  {
    id: 'hundred-day',
    name: 'Leyenda Viviente',
    description: '100 días de aprendizaje consecutivo',
    icon: '👑',
    daysRequired: 100,
    color: '#6BCB77',
    unlocked: false,
  },
];

export function useStreakTracking() {
  const [streak, setStreak] = useState<StreakData>(DEFAULT_STREAK);
  const [badges, setBadges] = useState<BadgeInfo[]>(BADGES);

  // Load streak data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('alfredStreak');
    if (saved) {
      const data = JSON.parse(saved);
      setStreak(data);
      updateBadges(data);
    } else {
      // Initialize with today
      const today = new Date().toISOString().split('T')[0];
      const newStreak = {
        ...DEFAULT_STREAK,
        lastActivityDate: today,
        streakStartDate: today,
      };
      setStreak(newStreak);
      localStorage.setItem('alfredStreak', JSON.stringify(newStreak));
    }
  }, []);

  // Update badges based on streak
  const updateBadges = (streakData: StreakData) => {
    const updatedBadges = BADGES.map((badge) => ({
      ...badge,
      unlocked: streakData.badges[badge.id as keyof typeof streakData.badges] || false,
    }));
    setBadges(updatedBadges);
  };

  // Record activity and update streak
  const recordActivity = () => {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = streak.lastActivityDate;
    
    // Calculate days between last activity and today
    const lastDateObj = new Date(lastDate);
    const todayObj = new Date(today);
    const daysDifference = Math.floor(
      (todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24)
    );

    let newStreak = { ...streak };

    if (daysDifference === 0) {
      // Same day, no change to streak
      return newStreak;
    } else if (daysDifference === 1) {
      // Consecutive day, increment streak
      newStreak.currentStreak += 1;
      newStreak.lastActivityDate = today;
      
      // Update longest streak if needed
      if (newStreak.currentStreak > newStreak.longestStreak) {
        newStreak.longestStreak = newStreak.currentStreak;
      }

      // Check for badge unlocks
      const newBadges = { ...newStreak.badges };
      if (newStreak.currentStreak === 7 && !newBadges.sevenDay) {
        newBadges.sevenDay = true;
      }
      if (newStreak.currentStreak === 30 && !newBadges.thirtyDay) {
        newBadges.thirtyDay = true;
      }
      if (newStreak.currentStreak === 100 && !newBadges.hundredDay) {
        newBadges.hundredDay = true;
      }
      newStreak.badges = newBadges;
    } else {
      // Streak broken, reset
      newStreak.currentStreak = 1;
      newStreak.lastActivityDate = today;
      newStreak.streakStartDate = today;
    }

    setStreak(newStreak);
    updateBadges(newStreak);
    localStorage.setItem('alfredStreak', JSON.stringify(newStreak));
    
    return newStreak;
  };

  // Get unlocked badges
  const getUnlockedBadges = (): BadgeInfo[] => {
    return badges.filter((badge) => badge.unlocked);
  };

  // Get next badge to unlock
  const getNextBadge = (): BadgeInfo | null => {
    const locked = badges.find((badge) => !badge.unlocked);
    return locked || null;
  };

  // Get days until next badge
  const getDaysUntilNextBadge = (): number => {
    const nextBadge = getNextBadge();
    if (!nextBadge) return 0;
    return Math.max(0, nextBadge.daysRequired - streak.currentStreak);
  };

  return {
    streak,
    badges,
    recordActivity,
    getUnlockedBadges,
    getNextBadge,
    getDaysUntilNextBadge,
  };
}
