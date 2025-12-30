import { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useStreakTracking } from '@/hooks/useStreakTracking';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface EpisodeData {
  id: number;
  number: number;
  title: string;
  concept: string;
  level: string;
  pages: Array<{
    number: number;
    title: string;
    content: string;
  }>;
  verse: {
    arabic: string;
    spanish: string;
    reference: string;
  };
  quiz: QuizQuestion[];
  challenge: string;
  points: {
    quiz: number;
    perfect: number;
    challenge: number;
  };
}

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

const playSound = (type: 'correct' | 'wrong' | 'levelup' | 'success') => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  if (type === 'correct') {
    oscillator.frequency.value = 800;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } else if (type === 'wrong') {
    oscillator.frequency.value = 300;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } else if (type === 'levelup') {
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(1000, audioContext.currentTime + 0.3);
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } else if (type === 'success') {
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.2);
      osc.start(audioContext.currentTime + i * 0.1);
      osc.stop(audioContext.currentTime + i * 0.1 + 0.2);
    });
  }
};

export default function EpisodeV2() {
  const [_match, params] = useRoute('/episode/:number');
  const [_location, navigate] = useLocation();
  const { recordActivity } = useStreakTracking();
  
  const [episode, setEpisode] = useState<EpisodeData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [momConfirmed, setMomConfirmed] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationText, setAnimationText] = useState('');
  const [quizScore, setQuizScore] = useState(0);
  const [passedRequirement, setPassedRequirement] = useState(false);

  const episodeNumber = params?.number ? parseInt(params.number) : 1;

  useEffect(() => {
    const loadEpisode = async () => {
      try {
        const response = await fetch('/all-episodes-complete.json');
        const data = await response.json();
        const foundEpisode = data.episodes.find((ep: EpisodeData) => ep.number === episodeNumber);
        if (foundEpisode) {
          setEpisode(foundEpisode);
          setQuizAnswers(new Array(foundEpisode.quiz.length).fill(null));
          // Record activity for streak tracking
          recordActivity();
        }
      } catch (error) {
        console.error('Error loading episode:', error);
      }
    };

    loadEpisode();
  }, [episodeNumber]);

  useEffect(() => {
    const saved = localStorage.getItem('alfredProgress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  const triggerAnimation = (text: string, points: number) => {
    setAnimationText(text);
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1500);
  };

  const handleNextPage = () => {
    if (episode && currentPage < episode.pages.length) {
      setCurrentPage(currentPage + 1);
    } else if (episode && currentPage === episode.pages.length) {
      setShowQuiz(true);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleQuizAnswer = (questionIndex: number, optionIndex: number) => {
    if (!quizSubmitted) {
      const newAnswers = [...quizAnswers];
      newAnswers[questionIndex] = optionIndex;
      setQuizAnswers(newAnswers);
      playSound('correct');
    }
  };

  const handleSubmitQuiz = () => {
    if (episode && quizAnswers.every(a => a !== null)) {
      setQuizSubmitted(true);
      calculateScore();
    }
  };

  const calculateScore = () => {
    if (!episode) return;
    
    let correctCount = 0;
    episode.quiz.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) {
        correctCount++;
      }
    });

    const score = (correctCount / episode.quiz.length) * 100;
    const isPerfect = correctCount === episode.quiz.length;
    const passed = score >= 90;

    setQuizScore(score);
    setPassedRequirement(passed);

    if (passed) {
      playSound('levelup');
      triggerAnimation(`+${correctCount * 20} puntos`, correctCount * 20);
    } else {
      playSound('wrong');
      triggerAnimation('Necesitas 90% para pasar', 0);
    }

    // Update progress
    if (progress && passed) {
      const newProgress = { ...progress };
      let pointsEarned = correctCount * 20;
      
      if (isPerfect) {
        pointsEarned += 25;
        newProgress.perfectQuizzes.push(episode.id);
      }

      newProgress.totalPoints += pointsEarned;
      newProgress.quizScores[episode.id] = score;
      
      localStorage.setItem('alfredProgress', JSON.stringify(newProgress));
      setProgress(newProgress);
    }
  };

  const handleChallengeComplete = () => {
    if (progress && episode && passedRequirement) {
      const newProgress = { ...progress };
      newProgress.totalPoints += 50;
      
      if (!newProgress.challengesCompleted.includes(episode.id)) {
        newProgress.challengesCompleted.push(episode.id);
      }
      if (!newProgress.episodesCompleted.includes(episode.id)) {
        newProgress.episodesCompleted.push(episode.id);
      }

      playSound('success');
      triggerAnimation('+50 puntos (Desafío)', 50);
      
      localStorage.setItem('alfredProgress', JSON.stringify(newProgress));
      setProgress(newProgress);
      
      setTimeout(() => navigate('/'), 2000);
    }
  };

  if (!episode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⚡</div>
          <p className="text-2xl text-blue-300">Cargando episodio...</p>
        </div>
      </div>
    );
  }

  const currentPageData = episode.pages[currentPage - 1];
  const correctAnswers = quizAnswers.filter((ans, i) => ans === episode.quiz[i].correct).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
      {/* Floating Animation */}
      {showAnimation && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="animate-bounce text-center">
            <div className="text-6xl mb-4 font-bold" style={{ color: '#1E90FF' }}>
              {animationText.includes('+') ? '✨' : '🎯'}
            </div>
            <p className="text-2xl font-bold text-white">{animationText}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-4 px-4 sticky top-0 z-10 shadow-2xl border-b-2" style={{ borderColor: '#1E90FF' }}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold font-[Outfit]" style={{ color: '#1E90FF' }}>
              {episode.title}
            </h1>
            <p className="text-sm text-blue-200">Episodio {episode.number} • {episode.level}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-300">Puntos de Luz</p>
            <p className="text-2xl font-bold" style={{ color: '#1E90FF' }}>
              {progress?.totalPoints || 0}¢
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {!showQuiz && !showChallenge && (
          <>
            {/* Story Section */}
            <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl p-8 mb-8 border-l-4" style={{ borderColor: '#1E90FF' }}>
              {/* Gojo Avatar */}
              <div className="flex gap-6 mb-8">
                <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-5xl shadow-2xl animate-pulse">
                  👁️
                </div>
                <div className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg p-6 relative shadow-lg">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">
                    {currentPageData.content}
                  </p>
                  <div className="absolute -left-3 top-6 w-0 h-0" style={{
                    borderLeft: '8px solid #1E90FF',
                    borderRight: '0',
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent'
                  }}></div>
                </div>
              </div>

              {/* Page Title */}
              <h2 className="text-3xl font-bold text-white mb-4 font-[Outfit]">
                {currentPageData.title}
              </h2>

              {/* Progress Dots */}
              <div className="flex gap-2 justify-center mb-8">
                {episode.pages.map((_, i) => (
                  <div
                    key={i}
                    className={`h-3 rounded-full transition-all ${
                      i < currentPage ? 'bg-green-500 w-8' : i === currentPage - 1 ? 'w-8' : 'bg-gray-600 w-3'
                    }`}
                    style={{
                      backgroundColor: i === currentPage - 1 ? '#1E90FF' : i < currentPage ? '#22c55e' : '#4b5563'
                    }}
                  ></div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 justify-between">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                  style={{
                    backgroundColor: currentPage === 1 ? '#4b5563' : '#1E90FF',
                    color: 'white'
                  }}
                >
                  ← Anterior
                </button>

                <button
                  onClick={handleNextPage}
                  className="px-6 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 shadow-lg"
                  style={{ backgroundColor: '#1E90FF' }}
                >
                  {currentPage === episode.pages.length ? 'Quiz →' : 'Siguiente →'}
                </button>
              </div>
            </section>

            {/* Quranic Verse */}
            {currentPage === episode.pages.length && (
              <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl p-8 mb-8 border-l-4" style={{ borderColor: '#C9A962' }}>
                <h3 className="text-2xl font-bold text-white mb-6 font-[Outfit]">Verso del Corán</h3>
                <div className="space-y-4">
                  <p
                    className="text-2xl leading-relaxed text-right font-[Amiri]"
                    style={{ color: '#C9A962' }}
                    dir="rtl"
                  >
                    {episode.verse.arabic}
                  </p>
                  <p className="text-lg text-blue-200 italic">
                    "{episode.verse.spanish}"
                  </p>
                  <p className="text-sm text-gray-400">
                    — {episode.verse.reference}
                  </p>
                </div>
              </section>
            )}
          </>
        )}

        {/* Quiz Section */}
        {showQuiz && (
          <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-8 font-[Outfit]">
              {quizSubmitted ? '¡Quiz Completado!' : 'Quiz - Necesitas 90% para pasar'}
            </h2>

            {quizSubmitted ? (
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">
                  {passedRequirement ? '🎉' : '📚'}
                </div>
                <p className="text-2xl font-bold text-blue-300 mb-2">
                  {correctAnswers}/{episode.quiz.length} Respuestas Correctas
                </p>
                <p className="text-xl mb-2" style={{ color: passedRequirement ? '#22c55e' : '#ef4444' }}>
                  Puntuación: {quizScore.toFixed(1)}%
                </p>
                {passedRequirement ? (
                  <>
                    <p className="text-lg text-green-400 mb-6">
                      ¡Pasaste! +{correctAnswers * 20}{correctAnswers === episode.quiz.length ? ' +25' : ''} puntos
                    </p>
                    <button
                      onClick={() => setShowChallenge(true)}
                      className="px-8 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105"
                      style={{ backgroundColor: '#1E90FF' }}
                    >
                      Siguiente: Desafío →
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-lg text-red-400 mb-6">
                      Necesitas 90% para pasar. Intenta de nuevo.
                    </p>
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizAnswers(new Array(episode.quiz.length).fill(null));
                      }}
                      className="px-8 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105"
                      style={{ backgroundColor: '#1E90FF' }}
                    >
                      Reintentar Quiz
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {episode.quiz.map((question, qIndex) => (
                  <div key={qIndex} className="p-6 bg-slate-700 rounded-lg border-l-4" style={{ borderColor: '#1E90FF' }}>
                    <p className="font-bold text-lg text-white mb-4">
                      {qIndex + 1}. {question.question}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <button
                          key={oIndex}
                          onClick={() => handleQuizAnswer(qIndex, oIndex)}
                          className={`w-full text-left p-3 rounded-lg transition-all border-2 transform hover:scale-102 text-white ${
                            quizAnswers[qIndex] === oIndex
                              ? 'border-blue-400 bg-blue-900'
                              : 'border-gray-600 bg-slate-800 hover:border-blue-400'
                          }`}
                        >
                          <span className="font-semibold" style={{ color: quizAnswers[qIndex] === oIndex ? '#1E90FF' : '#93c5fd' }}>
                            {String.fromCharCode(65 + oIndex)}.
                          </span>{' '}
                          <span className="text-white">{option}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleSubmitQuiz}
                  disabled={quizAnswers.some(a => a === null)}
                  className="w-full py-4 rounded-lg font-bold text-white text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  style={{ backgroundColor: '#1E90FF' }}
                >
                  Enviar Respuestas
                </button>
              </div>
            )}
          </section>
        )}

        {/* Challenge Section */}
        {showChallenge && passedRequirement && (
          <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6 font-[Outfit]">Desafío</h2>
            <div className="bg-yellow-900 border-l-4 border-yellow-400 p-6 mb-8 rounded text-yellow-100">
              <p className="text-lg leading-relaxed">
                {episode.challenge}
              </p>
            </div>

            {!challengeCompleted ? (
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border-2 border-gray-600 rounded-lg cursor-pointer hover:bg-slate-700 transition-all">
                  <input
                    type="checkbox"
                    checked={challengeCompleted}
                    onChange={(e) => setChallengeCompleted(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span className="text-lg text-blue-200">Completé el desafío</span>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-gray-600 rounded-lg cursor-pointer hover:bg-slate-700 transition-all">
                  <input
                    type="checkbox"
                    checked={momConfirmed}
                    onChange={(e) => setMomConfirmed(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span className="text-lg text-blue-200">Mi mamá confirma ✓</span>
                </label>

                <button
                  onClick={handleChallengeComplete}
                  disabled={!challengeCompleted}
                  className="w-full py-4 rounded-lg font-bold text-white text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  style={{ backgroundColor: '#1E90FF' }}
                >
                  Completar Episodio (+50 puntos)
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-2xl text-green-400 font-bold mb-4">¡Desafío Completado!</p>
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105"
                  style={{ backgroundColor: '#1E90FF' }}
                >
                  Volver al Inicio
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
