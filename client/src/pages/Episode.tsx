import { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';

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
    total: number;
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
}

export default function Episode() {
  const [_match, params] = useRoute('/episode/:number');
  const [_location, navigate] = useLocation();
  
  const [episode, setEpisode] = useState<EpisodeData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [momConfirmed, setMomConfirmed] = useState(false);

  const episodeNumber = params?.number ? parseInt(params.number) : 1;

  // Load episode data
  useEffect(() => {
    const loadEpisode = async () => {
      try {
        const response = await fetch('/episodes-full.json');
        const data = await response.json();
        const foundEpisode = data.episodes.find((ep: EpisodeData) => ep.number === episodeNumber);
        if (foundEpisode) {
          setEpisode(foundEpisode);
          setQuizAnswers(new Array(foundEpisode.quiz.length).fill(null));
        }
      } catch (error) {
        console.error('Error loading episode:', error);
      }
    };

    loadEpisode();
  }, [episodeNumber]);

  // Load progress
  useEffect(() => {
    const saved = localStorage.getItem('alfredProgress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

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

    const quizScore = (correctCount / episode.quiz.length) * 100;
    const isPerfect = correctCount === episode.quiz.length;

    // Update progress
    if (progress) {
      const newProgress = { ...progress };
      newProgress.totalPoints += (correctCount * 20);
      if (isPerfect) {
        newProgress.totalPoints += 25;
        newProgress.perfectQuizzes.push(episode.id);
      }
      newProgress.quizScores[episode.id] = quizScore;
      
      localStorage.setItem('alfredProgress', JSON.stringify(newProgress));
      setProgress(newProgress);
    }
  };

  const handleChallengeComplete = () => {
    if (progress) {
      const newProgress = { ...progress };
      newProgress.totalPoints += 50;
      if (!newProgress.challengesCompleted.includes(episode!.id)) {
        newProgress.challengesCompleted.push(episode!.id);
      }
      if (!newProgress.episodesCompleted.includes(episode!.id)) {
        newProgress.episodesCompleted.push(episode!.id);
      }
      localStorage.setItem('alfredProgress', JSON.stringify(newProgress));
      setProgress(newProgress);
      navigate('/');
    }
  };

  if (!episode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-2xl text-slate-600">Cargando episodio...</p>
      </div>
    );
  }

  const currentPageData = episode.pages[currentPage - 1];
  const correctAnswers = quizAnswers.filter((ans, i) => ans === episode.quiz[i].correct).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-4 px-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold font-[Outfit]" style={{ color: '#1E90FF' }}>
              {episode.title}
            </h1>
            <p className="text-sm text-blue-200">Episodio {episode.number}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-300">Puntos de Luz</p>
            <p className="text-2xl font-bold" style={{ color: '#1E90FF' }}>
              {progress?.totalPoints || 0}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {!showQuiz && !showChallenge && (
          <>
            {/* Story Section */}
            <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
              {/* Gojo Avatar */}
              <div className="flex gap-6 mb-8">
                <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-5xl shadow-lg">
                  👁️
                </div>
                <div className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 relative">
                  <p className="text-lg leading-relaxed">
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
              <h2 className="text-3xl font-bold text-slate-900 mb-4 font-[Outfit]">
                {currentPageData.title}
              </h2>

              {/* Progress Dots */}
              <div className="flex gap-2 justify-center mb-8">
                {episode.pages.map((_, i) => (
                  <div
                    key={i}
                    className={`h-3 rounded-full transition-all ${
                      i < currentPage ? 'bg-green-500 w-8' : i === currentPage - 1 ? 'bg-blue-500 w-8' : 'bg-gray-300 w-3'
                    }`}
                  ></div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 justify-between">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  style={{
                    backgroundColor: currentPage === 1 ? '#ccc' : '#1E90FF',
                    color: 'white'
                  }}
                >
                  ← Anterior
                </button>

                <button
                  onClick={handleNextPage}
                  className="px-6 py-3 rounded-lg font-semibold text-white transition-all"
                  style={{ backgroundColor: '#1E90FF' }}
                >
                  {currentPage === episode.pages.length ? 'Quiz →' : 'Siguiente →'}
                </button>
              </div>
            </section>

            {/* Quranic Verse */}
            {currentPage === episode.pages.length && (
              <section className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4" style={{ borderColor: '#C9A962' }}>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 font-[Outfit]">Verso del Corán</h3>
                <div className="space-y-4">
                  <p
                    className="text-2xl leading-relaxed text-right font-[Amiri]"
                    style={{ color: '#C9A962' }}
                    dir="rtl"
                  >
                    {episode.verse.arabic}
                  </p>
                  <p className="text-lg text-slate-700 italic">
                    "{episode.verse.spanish}"
                  </p>
                  <p className="text-sm text-gray-600">
                    — {episode.verse.reference}
                  </p>
                </div>
              </section>
            )}
          </>
        )}

        {/* Quiz Section */}
        {showQuiz && (
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 font-[Outfit]">
              {quizSubmitted ? '¡Quiz Completado!' : 'Quiz'}
            </h2>

            {quizSubmitted ? (
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">
                  {correctAnswers === episode.quiz.length ? '🎉' : '✅'}
                </div>
                <p className="text-2xl font-bold text-slate-900 mb-2">
                  {correctAnswers}/{episode.quiz.length} Respuestas Correctas
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  {correctAnswers === episode.quiz.length
                    ? '¡Puntuación Perfecta! +125 puntos'
                    : `+${correctAnswers * 20} puntos`}
                </p>
                <button
                  onClick={() => setShowChallenge(true)}
                  className="px-8 py-3 rounded-lg font-semibold text-white transition-all"
                  style={{ backgroundColor: '#1E90FF' }}
                >
                  Siguiente: Desafío →
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {episode.quiz.map((question, qIndex) => (
                  <div key={qIndex} className="p-6 bg-gray-50 rounded-lg">
                    <p className="font-bold text-lg text-slate-900 mb-4">
                      {qIndex + 1}. {question.question}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <button
                          key={oIndex}
                          onClick={() => handleQuizAnswer(qIndex, oIndex)}
                          className={`w-full text-left p-3 rounded-lg transition-all border-2 ${
                            quizAnswers[qIndex] === oIndex
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 bg-white hover:border-blue-300'
                          }`}
                        >
                          <span className="font-semibold" style={{ color: quizAnswers[qIndex] === oIndex ? '#1E90FF' : '#333' }}>
                            {String.fromCharCode(65 + oIndex)}.
                          </span>{' '}
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleSubmitQuiz}
                  disabled={quizAnswers.some(a => a === null)}
                  className="w-full py-4 rounded-lg font-bold text-white text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#1E90FF' }}
                >
                  Enviar Respuestas
                </button>
              </div>
            )}
          </section>
        )}

        {/* Challenge Section */}
        {showChallenge && (
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 font-[Outfit]">Desafío</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded">
              <p className="text-lg text-slate-800 leading-relaxed">
                {episode.challenge}
              </p>
            </div>

            {!challengeCompleted ? (
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={challengeCompleted}
                    onChange={(e) => setChallengeCompleted(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span className="text-lg text-slate-900">Completé el desafío</span>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={momConfirmed}
                    onChange={(e) => setMomConfirmed(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span className="text-lg text-slate-900">Mi mamá confirma ✓</span>
                </label>

                <button
                  onClick={handleChallengeComplete}
                  disabled={!challengeCompleted}
                  className="w-full py-4 rounded-lg font-bold text-white text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#1E90FF' }}
                >
                  Completar Episodio (+50 puntos)
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-2xl text-green-600 font-bold mb-4">¡Desafío Completado!</p>
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-3 rounded-lg font-semibold text-white transition-all"
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
