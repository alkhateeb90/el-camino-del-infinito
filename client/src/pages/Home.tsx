import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

interface ProgressData {
  currentLevel: number;
  totalPoints: number;
  episodesCompleted: number[];
  quizScores: Record<number, number>;
  challengesCompleted: number[];
  perfectQuizzes: number[];
  lastActive: string;
  badges: string[];
}

interface Level {
  level: number;
  name: string;
  points: number;
  icon: string;
}

interface Episode {
  id: number;
  number: number;
  title: string;
  concept: string;
}

const DEFAULT_PROGRESS: ProgressData = {
  currentLevel: 1,
  totalPoints: 0,
  episodesCompleted: [],
  quizScores: {},
  challengesCompleted: [],
  perfectQuizzes: [],
  lastActive: new Date().toISOString(),
  badges: ['buscador']
};

const LEVELS: Level[] = [
  { level: 1, name: 'Buscador', points: 0, icon: '🔍' },
  { level: 2, name: 'Estudiante', points: 300, icon: '📚' },
  { level: 3, name: 'Conocedor', points: 600, icon: '💡' },
  { level: 4, name: 'Guerrero', points: 1000, icon: '⚔️' },
  { level: 5, name: 'Guardián', points: 1500, icon: '🛡️' },
  { level: 6, name: 'Maestro', points: 2000, icon: '⭐' },
  { level: 7, name: 'Iluminado', points: 2500, icon: '✨' }
];

const EPISODES: Episode[] = [
  { id: 1, number: 1, title: 'El Secreto que Gojo Nunca Contó', concept: 'Introduction to Allah' },
  { id: 2, number: 2, title: 'El Código de los Campeones', concept: 'Islam as Success System' },
  { id: 3, number: 3, title: 'Tu Mamá es Sagrada', concept: 'Status of Mothers' },
  { id: 4, number: 4, title: 'El Empresario Original', concept: 'Prophet Muhammad as Businessman' },
  { id: 5, number: 5, title: 'La Recarga Diaria', concept: 'The 5 Daily Prayers' },
  { id: 6, number: 6, title: 'Dinero Infinito', concept: 'Islamic Economics' },
  { id: 7, number: 7, title: 'El Mes del Nivel Legendario', concept: 'Ramadan' },
  { id: 8, number: 8, title: 'Tu Equipo Invisible', concept: 'Angels and Destiny' },
  { id: 9, number: 9, title: 'Los Héroes Antes de los Héroes', concept: 'Jesus, Moses, Abraham' },
  { id: 10, number: 10, title: 'El Libro que Nunca Cambia', concept: 'The Quran' },
  { id: 11, number: 11, title: 'Colombia Musulmana', concept: 'Muslims Around the World' },
  { id: 12, number: 12, title: 'Las Palabras que Cambian Todo', concept: 'The Shahada' }
];

export default function Home() {
  const [_location, navigate] = useLocation();
  const [progress, setProgress] = useState<ProgressData>(DEFAULT_PROGRESS);
  const [currentLevel, setCurrentLevel] = useState<Level>(LEVELS[0]);
  const [nextLevelPoints, setNextLevelPoints] = useState<number>(300);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('alfredProgress');
    if (saved) {
      const data = JSON.parse(saved);
      setProgress(data);
      updateLevel(data.totalPoints);
    }
  }, []);

  const updateLevel = (points: number) => {
    let newLevel = LEVELS[0];
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (points >= LEVELS[i].points) {
        newLevel = LEVELS[i];
        break;
      }
    }
    setCurrentLevel(newLevel);
    
    // Find next level
    const nextLevelIndex = LEVELS.findIndex(l => l.points > points);
    if (nextLevelIndex !== -1) {
      setNextLevelPoints(LEVELS[nextLevelIndex].points as number);
    } else {
      setNextLevelPoints(points as number);
    }
  };

  const getProgressPercentage = () => {
    const currentLevelPoints = currentLevel.points;
    const nextLevelPts = nextLevelPoints;
    const pointsInRange = progress.totalPoints - currentLevelPoints;
    const rangeSize = nextLevelPts - currentLevelPoints;
    return (pointsInRange / rangeSize) * 100;
  };

  const handleStartEpisode = (episodeNumber: number) => {
    navigate(`/episode/${episodeNumber}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16 px-4 border-b-2" style={{ borderColor: '#1E90FF' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 font-[Outfit]" style={{ color: '#1E90FF' }}>
              El Camino del Infinito
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-blue-200">
              Un viaje con Gojo hacia el conocimiento
            </p>
            <p className="text-lg text-gray-300 max-w-xl">
              Cada punto = 1¢ USD. Necesitas 90% en quizzes para desbloquear recompensas.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-6xl shadow-2xl">
              👁️
            </div>
          </div>
        </div>
      </section>

      {/* Progress Dashboard */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center gap-4">
              <span className="text-4xl">✨</span>
              <div>
                <p className="text-sm text-gray-600 font-medium">Puntos de Luz</p>
                <p className="text-3xl font-bold" style={{ color: '#1E90FF' }}>${(progress.totalPoints * 0.01).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: '#C9A962' }}>
            <div className="flex items-center gap-4">
              <span className="text-4xl">{currentLevel.icon}</span>
              <div>
                <p className="text-sm text-gray-600 font-medium">Nivel Actual</p>
                <p className="text-2xl font-bold text-slate-900">{currentLevel.name}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2 lg:col-span-3 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 font-medium mb-2">Progreso al siguiente nivel</p>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500" 
                style={{ width: `${getProgressPercentage()}%`, backgroundColor: '#1E90FF' }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {progress.totalPoints} / {nextLevelPoints} puntos
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center gap-4">
              <span className="text-3xl">📖</span>
              <div>
                <p className="text-sm text-gray-600 font-medium">Episodios Completados</p>
                <p className="text-2xl font-bold text-slate-900">{progress.episodesCompleted.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center gap-4">
              <span className="text-3xl">🎯</span>
              <div>
                <p className="text-sm text-gray-600 font-medium">Quiz Perfectos</p>
                <p className="text-2xl font-bold text-slate-900">{progress.perfectQuizzes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center gap-4">
              <span className="text-3xl">⚔️</span>
              <div>
                <p className="text-sm text-gray-600 font-medium">Desafíos Completados</p>
                <p className="text-2xl font-bold text-slate-900">{progress.challengesCompleted.length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Episodes Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold mb-8 text-slate-900 font-[Outfit]">Episodios Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EPISODES.map((episode) => {
            const isCompleted = progress.episodesCompleted.includes(episode.id);
            const score = progress.quizScores[episode.id];
            
            return (
              <div 
                key={episode.id}
                className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all hover:shadow-xl hover:scale-105 border-l-4 ${
                  isCompleted ? 'border-green-500' : 'border-gray-300'
                }`}
                onClick={() => handleStartEpisode(episode.number)}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-bold" style={{ color: '#1E90FF' }}>EP {episode.number}</span>
                  {isCompleted && <span className="text-xl text-green-500">✓</span>}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 font-[Outfit]">{episode.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{episode.concept}</p>
                {isCompleted && score !== undefined && (
                  <div className="mb-4 p-2 bg-green-50 rounded">
                    <p className="text-xs text-gray-600">Puntuación: <span className="font-bold text-green-600">{score}/100</span></p>
                  </div>
                )}
                <button className="w-full py-2 px-4 rounded font-semibold text-white transition-all" style={{ backgroundColor: '#1E90FF' }}>
                  {isCompleted ? 'Revisar' : 'Comenzar'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Badges Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold mb-8 text-slate-900 font-[Outfit]">Insignias Ganadas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {LEVELS.map((level) => {
            const earned = progress.badges.includes(level.name.toLowerCase());
            return (
              <div 
                key={level.level}
                className={`text-center p-4 rounded-lg transition-all ${
                  earned 
                    ? 'bg-gradient-to-b from-yellow-100 to-yellow-50 border-2 border-yellow-400' 
                    : 'bg-gray-100 border-2 border-gray-300 opacity-50'
                }`}
              >
                <span className="text-4xl block mb-2">{level.icon}</span>
                <p className="font-bold text-sm text-slate-900">{level.name}</p>
                <p className="text-xs text-gray-600">{level.points} pts</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Gojo Message */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-lg p-8 flex gap-6 items-start">
          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-3xl">
            👁️
          </div>
          <div className="flex-1">
            <p className="text-lg mb-3 italic">
              "Oye, Alfred. Estoy impresionado con tu progreso. Cada punto que ganas es una luz más en tu camino. Sigue así, y pronto serás más fuerte de lo que imaginas."
            </p>
            <p className="text-blue-300 font-semibold">— Gojo</p>
          </div>
        </div>
      </section>
    </div>
  );
}
