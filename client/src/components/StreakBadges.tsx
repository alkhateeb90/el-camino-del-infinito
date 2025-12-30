import { BadgeInfo, StreakData } from '@/hooks/useStreakTracking';

interface StreakBadgesProps {
  badges: BadgeInfo[];
  streak: StreakData;
  daysUntilNext: number;
  showDetails?: boolean;
  onBadgeUnlock?: (badgeName: string) => void;
  recipientName?: string;
}

export function StreakBadges({
  badges,
  streak,
  daysUntilNext,
  showDetails = true,
  onBadgeUnlock,
  recipientName = 'Alfred',
}: StreakBadgesProps) {
  const unlockedBadges = badges.filter((b) => b.unlocked);
  const nextBadge = badges.find((b) => !b.unlocked);

  return (
    <div className="space-y-6">
      {/* Current Streak Display */}
      <div className="bg-gradient-to-r from-orange-900 to-red-900 rounded-lg p-6 border-2 border-orange-500">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-orange-200 font-medium">Racha Actual</p>
            <p className="text-4xl font-bold text-white mt-2">{streak.currentStreak}</p>
            <p className="text-xs text-orange-100 mt-1">días consecutivos</p>
          </div>
          <span className="text-6xl animate-bounce">🔥</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, (streak.currentStreak / (nextBadge?.daysRequired || 7)) * 100)}%`,
              backgroundColor: '#FF6B6B',
            }}
          ></div>
        </div>
        <p className="text-xs text-orange-100 mt-2">
          Racha más larga: {streak.longestStreak} días
        </p>
      </div>

      {/* Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4 font-[Outfit]">
            Insignias Desbloqueadas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {unlockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border-2 transition-all transform hover:scale-105"
                style={{ borderColor: badge.color }}
              >
                <div className="text-center">
                  <p className="text-5xl mb-2 animate-pulse">{badge.icon}</p>
                  <p className="font-bold text-white mb-1">{badge.name}</p>
                  <p className="text-xs text-gray-300 mb-3">{badge.description}</p>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <span className="text-lg">✓</span>
                    <span className="text-xs text-green-300 font-semibold">Desbloqueado</span>
                  </div>
                  <button
                    onClick={() => onBadgeUnlock?.(badge.name)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-xs font-semibold py-2 rounded transition-all"
                  >
                    📜 Certificado
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Badge */}
      {nextBadge && showDetails && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4 font-[Outfit]">
            Próxima Insignia
          </h3>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border-2 border-gray-500">
            <div className="flex items-start gap-6">
              <div className="text-6xl opacity-50">{nextBadge.icon}</div>
              <div className="flex-1">
                <p className="font-bold text-white mb-1">{nextBadge.name}</p>
                <p className="text-sm text-gray-300 mb-4">{nextBadge.description}</p>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">Progreso</span>
                    <span className="text-sm font-semibold text-blue-300">
                      {streak.currentStreak} / {nextBadge.daysRequired} días
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(streak.currentStreak / nextBadge.daysRequired) * 100}%`,
                        backgroundColor: '#1E90FF',
                      }}
                    ></div>
                  </div>
                </div>

                {/* Days Remaining */}
                <p className="text-sm text-amber-300 font-semibold">
                  {daysUntilNext} días restantes para desbloquear
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Badges Overview */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 font-[Outfit]">Todas las Insignias</h3>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-lg text-center transition-all ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-2'
                  : 'bg-slate-800 border-2 border-gray-600 opacity-40'
              }`}
              style={badge.unlocked ? { borderColor: badge.color } : {}}
            >
              <p className={`text-3xl mb-1 ${!badge.unlocked ? 'grayscale' : ''}`}>
                {badge.icon}
              </p>
              <p className="text-xs font-bold text-white mb-1">{badge.name}</p>
              <p className="text-xs text-gray-400">{badge.daysRequired}d</p>
              {badge.unlocked && (
                <p className="text-xs text-green-400 font-semibold mt-1">✓</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
