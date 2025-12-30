import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { StreakBadges } from '@/components/StreakBadges';
import { useStreakTracking } from '@/hooks/useStreakTracking';

interface ProgressData {
  currentLevel: number;
  totalPoints: number;
  episodesCompleted: number[];
  quizScores: Record<number, number>;
  challengesCompleted: number[];
  perfectQuizzes: number[];
  lastActive: string;
  badges: string[];
  levelRewards: Record<number, boolean>;
}

interface Episode {
  id: number;
  number: number;
  title: string;
  concept: string;
  level: string;
}

interface LevelInfo {
  level: number;
  name: string;
  points: number;
  icon: string;
  minScore: number;
}

const LEVELS: LevelInfo[] = [
  { level: 1, name: 'Buscador', points: 0, icon: '🔍', minScore: 0 },
  { level: 2, name: 'Estudiante', points: 300, icon: '📚', minScore: 90 },
  { level: 3, name: 'Conocedor', points: 600, icon: '💡', minScore: 90 },
  { level: 4, name: 'Guerrero', points: 1000, icon: '⚔️', minScore: 90 },
  { level: 5, name: 'Guardián', points: 1500, icon: '🛡️', minScore: 90 },
  { level: 6, name: 'Maestro', points: 2000, icon: '⭐', minScore: 90 },
  { level: 7, name: 'Iluminado', points: 2500, icon: '✨', minScore: 90 }
];

export default function ParentDashboard() {
  const [_location, navigate] = useLocation();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const { streak, badges, getNextBadge, getDaysUntilNextBadge } = useStreakTracking();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentLevel, setCurrentLevel] = useState<LevelInfo>(LEVELS[0]);
  const [nextLevelPoints, setNextLevelPoints] = useState<number>(300);
  const [stats, setStats] = useState({
    completionRate: 0,
    averageScore: 0,
    perfectScores: 0,
    challengesCompleted: 0,
    pointsPerDay: 0,
    daysActive: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem('alfredProgress');
    if (saved) {
      const data = JSON.parse(saved);
      setProgress(data);
      
      // Calculate current level
      const level = LEVELS.find(l => data.totalPoints >= l.points) || LEVELS[0];
      setCurrentLevel(level);
      
      // Find next level
      const nextLevel = LEVELS.find(l => l.points > data.totalPoints);
      if (nextLevel) {
        setNextLevelPoints(nextLevel.points);
      }
      
      // Calculate statistics
      calculateStats(data);
    }
  }, []);

  useEffect(() => {
    const loadEpisodes = async () => {
      try {
        const response = await fetch('/all-episodes-complete.json');
        const data = await response.json();
        setEpisodes(data.episodes);
      } catch (error) {
        console.error('Error loading episodes:', error);
      }
    };
    loadEpisodes();
  }, []);

  const calculateStats = (data: ProgressData) => {
    const completionRate = (data.episodesCompleted.length / 16) * 100;
    const avgScore = Object.values(data.quizScores).length > 0
      ? Object.values(data.quizScores).reduce((a, b) => a + b, 0) / Object.values(data.quizScores).length
      : 0;
    
    const lastActive = new Date(data.lastActive || new Date());
    const now = new Date();
    const daysActive = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const pointsPerDay = Math.round(data.totalPoints / daysActive);

    setStats({
      completionRate,
      averageScore: Math.round(avgScore),
      perfectScores: data.perfectQuizzes.length,
      challengesCompleted: data.challengesCompleted.length,
      pointsPerDay,
      daysActive
    });
  };

  const getEpisodeStatus = (episodeId: number) => {
    if (!progress) return 'locked';
    if (progress.episodesCompleted.includes(episodeId)) {
      const score = progress.quizScores[episodeId];
      return score === 100 ? 'perfect' : 'completed';
    }
    return 'pending';
  };

  const getProgressPercentage = () => {
    if (!progress) return 0;
    const currentLevelIndex = LEVELS.findIndex(l => l.level === currentLevel.level);
    const nextLevelIndex = currentLevelIndex + 1;
    
    if (nextLevelIndex >= LEVELS.length) return 100;
    
    const currentLevelPoints = LEVELS[currentLevelIndex].points;
    const nextLevelPoints = LEVELS[nextLevelIndex].points;
    const pointsInRange = progress.totalPoints - currentLevelPoints;
    const rangeSize = nextLevelPoints - currentLevelPoints;
    
    return Math.min(100, (pointsInRange / rangeSize) * 100);
  };

  if (!progress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⚡</div>
          <p className="text-2xl text-blue-300">Cargando datos de Alfred...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-6 px-4 sticky top-0 z-10 shadow-2xl border-b-2" style={{ borderColor: '#1E90FF' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-[Outfit]" style={{ color: '#1E90FF' }}>
              Panel de Seguimiento de Alfred
            </h1>
            <p className="text-sm text-blue-200">Monitoreo de Progreso Espiritual</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 rounded-lg font-semibold text-white transition-all transform hover:scale-105"
            style={{ backgroundColor: '#1E90FF' }}
          >
            ← Volver a Inicio
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl p-6 border-l-4" style={{ borderColor: '#1E90FF' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200 font-medium">Puntos Totales</p>
                <p className="text-3xl font-bold text-white mt-2">${(progress.totalPoints * 0.01).toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-1">{progress.totalPoints} puntos</p>
              </div>
              <span className="text-5xl">✨</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl p-6 border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-200 font-medium">Nivel Actual</p>
                <p className="text-3xl font-bold text-white mt-2">{currentLevel.name}</p>
                <p className="text-xs text-gray-400 mt-1">{currentLevel.icon}</p>
              </div>
              <span className="text-5xl">{currentLevel.icon}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-200 font-medium">Episodios Completados</p>
                <p className="text-3xl font-bold text-white mt-2">{progress.episodesCompleted.length}/16</p>
                <p className="text-xs text-gray-400 mt-1">{Math.round(stats.completionRate)}% completado</p>
              </div>
              <span className="text-5xl">📖</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-200 font-medium">Puntuación Promedio</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.averageScore}%</p>
                <p className="text-xs text-gray-400 mt-1">En quizzes completados</p>
              </div>
              <span className="text-5xl">🎯</span>
            </div>
          </div>
        </section>

        {/* Progress Bar */}
        <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl p-6 mb-8 border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-white mb-4 font-[Outfit]">Progreso al Siguiente Nivel</h2>
          <div className="space-y-4">
            <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%`, backgroundColor: '#1E90FF' }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{progress.totalPoints} / {nextLevelPoints} puntos</span>
              <span className="text-blue-300 font-semibold">{Math.round(getProgressPercentage())}%</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {nextLevelPoints - progress.totalPoints} puntos restantes para alcanzar el siguiente nivel
            </p>
          </div>
        </section>

        {/* Streak and Badges */}
        <section className="mb-8">
          <StreakBadges 
            badges={badges} 
            streak={streak} 
            daysUntilNext={getDaysUntilNextBadge()}
            showDetails={true}
          />
        </section>

        {/* Statistics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl p-6 border-l-4 border-yellow-500">
            <h3 className="text-lg font-bold text-white mb-4 font-[Outfit]">Quizzes Perfectos</h3>
            <p className="text-4xl font-bold" style={{ color: '#1E90FF' }}>{stats.perfectScores}</p>
            <p className="text-sm text-gray-300 mt-2">100% de puntuación</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl p-6 border-l-4 border-red-500">
            <h3 className="text-lg font-bold text-white mb-4 font-[Outfit]">Desafíos Completados</h3>
            <p className="text-4xl font-bold" style={{ color: '#1E90FF' }}>{stats.challengesCompleted}</p>
            <p className="text-sm text-gray-300 mt-2">Tareas del mundo real</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl p-6 border-l-4 border-cyan-500">
            <h3 className="text-lg font-bold text-white mb-4 font-[Outfit]">Puntos por Día</h3>
            <p className="text-4xl font-bold" style={{ color: '#1E90FF' }}>{stats.pointsPerDay}</p>
            <p className="text-sm text-gray-300 mt-2">Promedio de {stats.daysActive} días</p>
          </div>
        </section>

        {/* Episodes Status */}
        <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl p-8 mb-8 border-l-4" style={{ borderColor: '#1E90FF' }}>
          <h2 className="text-2xl font-bold text-white mb-6 font-[Outfit]">Estado de Episodios</h2>
          
          <div className="space-y-6">
            {/* Main Series */}
            <div>
              <h3 className="text-lg font-bold text-blue-300 mb-4">Serie Principal (12 Episodios)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {episodes.slice(0, 12).map((episode) => {
                  const status = getEpisodeStatus(episode.id);
                  const score = progress.quizScores[episode.id];
                  
                  return (
                    <div
                      key={episode.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        status === 'perfect'
                          ? 'bg-green-900 border-green-400'
                          : status === 'completed'
                          ? 'bg-blue-900 border-blue-400'
                          : 'bg-slate-700 border-gray-600'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-bold" style={{ color: '#1E90FF' }}>EP {episode.number}</span>
                        {status === 'perfect' && <span className="text-lg">⭐</span>}
                        {status === 'completed' && <span className="text-lg">✓</span>}
                      </div>
                      <p className="text-sm font-semibold text-white mb-1">{episode.title}</p>
                      {score !== undefined && (
                        <p className="text-xs text-gray-200">Puntuación: {score}%</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">{episode.level}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shield Series */}
            <div>
              <h3 className="text-lg font-bold text-amber-300 mb-4">Serie Escudo (4 Episodios Avanzados)</h3>
              <p className="text-sm text-gray-300 mb-4">Se desbloquean al alcanzar el nivel "Maestro"</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {episodes.slice(12, 16).map((episode) => {
                  const status = getEpisodeStatus(episode.id);
                  const score = progress.quizScores[episode.id];
                  const isUnlocked = currentLevel.level >= 6;
                  
                  return (
                    <div
                      key={episode.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        !isUnlocked
                          ? 'bg-slate-700 border-gray-600 opacity-50'
                          : status === 'perfect'
                          ? 'bg-green-900 border-green-400'
                          : status === 'completed'
                          ? 'bg-blue-900 border-blue-400'
                          : 'bg-slate-700 border-gray-600'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-bold" style={{ color: '#C9A962' }}>EP {episode.number}</span>
                        {!isUnlocked && <span className="text-lg">🔒</span>}
                        {isUnlocked && status === 'perfect' && <span className="text-lg">⭐</span>}
                        {isUnlocked && status === 'completed' && <span className="text-lg">✓</span>}
                      </div>
                      <p className="text-sm font-semibold text-white mb-1">{episode.title}</p>
                      {isUnlocked && score !== undefined && (
                        <p className="text-xs text-gray-200">Puntuación: {score}%</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">{episode.level}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Insights & Recommendations */}
        <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl p-8 border-l-4" style={{ borderColor: '#C9A962' }}>
          <h2 className="text-2xl font-bold text-white mb-6 font-[Outfit]">Insights y Recomendaciones</h2>
          
          <div className="space-y-4">
            {/* Completion Rate */}
            <div className="p-4 bg-slate-700 rounded-lg">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📊</span>
                <div className="flex-1">
                  <p className="font-semibold text-white mb-1">Tasa de Completación</p>
                  <p className="text-sm text-gray-300">
                    Alfred ha completado {progress.episodesCompleted.length} de 16 episodios ({Math.round(stats.completionRate)}%). 
                    {stats.completionRate < 50 
                      ? ' ¡Sigue animándolo a continuar!' 
                      : stats.completionRate < 100 
                      ? ' ¡Va muy bien! Está en la mitad del camino.' 
                      : ' ¡Excelente! Ha completado todos los episodios principales.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quiz Performance */}
            <div className="p-4 bg-slate-700 rounded-lg">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🎯</span>
                <div className="flex-1">
                  <p className="font-semibold text-white mb-1">Desempeño en Quizzes</p>
                  <p className="text-sm text-gray-300">
                    Puntuación promedio: {stats.averageScore}%. 
                    {stats.perfectScores > 0 
                      ? ` Ha obtenido ${stats.perfectScores} puntuaciones perfectas (100%).` 
                      : ' Sigue trabajando para alcanzar 90% o más.'}
                    {stats.averageScore >= 90 
                      ? ' ¡Excelente comprensión del contenido!' 
                      : ' Considera repasar los episodios anteriores.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Challenge Completion */}
            <div className="p-4 bg-slate-700 rounded-lg">
              <div className="flex items-start gap-4">
                <span className="text-3xl">⚔️</span>
                <div className="flex-1">
                  <p className="font-semibold text-white mb-1">Desafíos Completados</p>
                  <p className="text-sm text-gray-300">
                    Alfred ha completado {stats.challengesCompleted} desafíos del mundo real. 
                    {stats.challengesCompleted === 0 
                      ? ' Estos son importantes para aplicar lo aprendido en la vida diaria.' 
                      : stats.challengesCompleted < progress.episodesCompleted.length 
                      ? ' Algunos desafíos aún están pendientes.' 
                      : ' ¡Ha completado todos los desafíos! Excelente dedicación.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Consistency */}
            <div className="p-4 bg-slate-700 rounded-lg">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📅</span>
                <div className="flex-1">
                  <p className="font-semibold text-white mb-1">Consistencia</p>
                  <p className="text-sm text-gray-300">
                    Alfred ha estado activo durante {stats.daysActive} días, ganando un promedio de {stats.pointsPerDay} puntos por día. 
                    {stats.pointsPerDay > 100 
                      ? '¡Muy consistente! Mantén este ritmo.' 
                      : stats.pointsPerDay > 50 
                      ? 'Buen ritmo de aprendizaje.' 
                      : 'Considera aumentar la frecuencia de estudio.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="p-4 bg-blue-900 rounded-lg border-l-4 border-blue-400">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🎓</span>
                <div className="flex-1">
                  <p className="font-semibold text-white mb-1">Próximos Pasos</p>
                  <p className="text-sm text-blue-100">
                    {nextLevelPoints - progress.totalPoints > 0 
                      ? `Alfred necesita ${nextLevelPoints - progress.totalPoints} puntos más para alcanzar el nivel "${LEVELS.find(l => l.points === nextLevelPoints)?.name}". ` 
                      : 'Alfred ha alcanzado el nivel máximo. '}
                    Continúa motivándolo a completar los episodios pendientes y a reflexionar sobre lo aprendido.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Motivational Message from Gojo */}
        <section className="mt-8 bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-lg p-8 flex gap-6 items-start">
          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-3xl">
            👁️
          </div>
          <div className="flex-1">
            <p className="text-lg mb-3 italic">
              "El progreso de Alfred es impresionante. Cada punto que gana es una prueba de su dedicación. Como padre/madre, tu apoyo es la clave para que continúe en este camino. Recuerda: no se trata solo de puntos, sino de transformación espiritual. Sigue siendo su guía."
            </p>
            <p className="text-blue-300 font-semibold">— Gojo</p>
          </div>
        </section>
      </div>
    </div>
  );
}
