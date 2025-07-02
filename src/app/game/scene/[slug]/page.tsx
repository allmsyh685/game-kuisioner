'use client'
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

// Dynamic dialog import helper
const dialogMap: Record<string, any> = {
  scene1: require('../../scene1Dialog').scene1Dialog,
  scene2: require('../../scene2Dialog').scene2Dialog,
  scene3: require('../../scene3Dialog').scene3Dialog,
  scene4: require('../../scene4Dialog').scene4Dialog,
  // Add more scenes as needed
};

interface Question {
  id: number;
  text: string;
  type: string;
  options?: string[];
  required?: boolean;
}

interface Scene1Frame {
  image: string;
  audio: string;
  text?: string;
  effect?: string | null;
  questionId?: number | null;
  autoPlay?: boolean;
  characterImage?: string;
  redirectToTowerGames?: boolean;
  waves?: number;
}

const API_BASE = 'http://localhost:8000/api';

function getIdentifikasiText(userName: string, userAge: string, userLocation: string, lastEducation: string) {
  return (
    <span className="text-green-400">
      E.V.I :<br />identifikasi pengguna :<br />
      <span className="ml-4 text-center block ">
        - nama : {userName || '-'}<br />
        - usia : {userAge || '-'}<br />
        - asal : {userLocation || '-'}<br />
        - Pendidikan Terakhir : {'??? NOT FOUND ???'}
      </span>
    </span>
  );
}

const Scene: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string || 'scene1';
  const dialog = dialogMap[slug] || dialogMap['scene1'];
  const [frameIdx, setFrameIdx] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<{ [key: number]: string }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${slug}Answers`);
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userName, setUserName] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userInfoSubmitted, setUserInfoSubmitted] = useState(false);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const frame: Scene1Frame = dialog[frameIdx];

  useEffect(() => {
    // Cek localStorage untuk user info
    const storedName = typeof window !== 'undefined' ? localStorage.getItem('userName') : null;
    const storedLocation = typeof window !== 'undefined' ? localStorage.getItem('userLocation') : null;
    const storedAge = typeof window !== 'undefined' ? localStorage.getItem('userAge') : null;
    if (storedName && storedLocation && storedAge) {
      setUserName(storedName);
      setUserLocation(storedLocation);
      setUserAge(storedAge);
      setUserInfoSubmitted(true);
    }
    setLoadingUserInfo(false);
  }, []);

  useEffect(() => {
    if (frame && frame.questionId) {
      setLoading(true);
      axios.get(`${API_BASE}/questions`)
        .then(res => {
          let q = res.data.data.find((q: any) => Number(q.id) === Number(frame.questionId));
          if (q) {
            // mapping field agar frontend dapat .text, .type, .options
            q = {
              ...q,
              text: q.text || q.question_text,
              type: q.type || 'select',
              options: Array.isArray(q.options) ? q.options : [],
            };
            console.log('question:', q);
          } else {
            // q = scene1Questions.find(q => Number(q.id) === Number(frame.questionId));
            console.log('question (fallback local):', q);
          }
          setQuestion(q || null);
        })
        .catch(() => {
          // const q = scene1Questions.find(q => Number(q.id) === Number(frame.questionId));
          setQuestion(null);
        })
        .finally(() => setLoading(false));
    } else {
      setQuestion(null);
    }
    setAnswer('');
  }, [frameIdx]);

  const handleNext = (selectedAnswer?: string) => {
    if (frame.questionId && question) {
      const answerToSave = selectedAnswer !== undefined ? selectedAnswer : answer;
      setAnswers(prev => {
        const updated = { ...prev, [question.id]: answerToSave };
        if (typeof window !== 'undefined') {
          localStorage.setItem(`${slug}Answers`, JSON.stringify(updated));
        }
        return updated;
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFrameIdx(idx => Math.min(idx + 1, dialog.length - 1));
      }, 800);
    } else {
      // If this is the last frame
      if (frameIdx === dialog.length - 1) {
        if (slug === 'scene1' || slug === 'scene2' || slug === 'scene3') {
          const waves = slug === 'scene1' ? 1 : slug === 'scene2' ? 2 : 3;
          window.location.href = `/towergames?waves=${waves}`;
        } else if (slug === 'scene4') {
          // POST all answers to API, then navigate to main page
          handleSubmitAll().then(() => {
            window.location.href = '/';
          });
        }
        return;
      }
      setFrameIdx(idx => Math.min(idx + 1, dialog.length - 1));
    }
  };

  const handlePrev = () => {
    setFrameIdx(idx => Math.max(idx - 1, 0));
  };

  // Fungsi untuk submit ke API di frame terakhir
  const handleSubmitAll = async () => {
    const userName = localStorage.getItem('userName') || '';
    const userLocation = localStorage.getItem('userLocation') || '';
    const userAge = localStorage.getItem('userAge') || '';

    // Combine all scene answers
    const allAnswers = {
      ...JSON.parse(localStorage.getItem('scene1Answers') || '{}'),
      ...JSON.parse(localStorage.getItem('scene2Answers') || '{}'),
      ...JSON.parse(localStorage.getItem('scene3Answers') || '{}'),
      ...JSON.parse(localStorage.getItem('scene4Answers') || '{}'),
    };

    // Map to API fields (adjust question IDs as needed)
    const payload = {
      name: userName,
      age: Number(userAge),
      location: userLocation,
      education_level: allAnswers[1] || allAnswers[3] || '',
      ai_usage_frequency: allAnswers[2] || allAnswers[4] || '',
      ai_purpose: allAnswers[3] || allAnswers[5] || '',
      ai_tool_used: allAnswers[4] || allAnswers[6] || '',
      difficulty_without_ai: allAnswers[5] || allAnswers[7] || '',
      anxiety_without_ai: allAnswers[6] || allAnswers[8] || '',
      ai_important_routine: allAnswers[7] || allAnswers[9] || '',
      more_productive_with_ai: allAnswers[8] || allAnswers[10] || '',
      rely_on_ai_decisions: allAnswers[9] || allAnswers[11] || '',
      ai_better_than_humans: allAnswers[10] || allAnswers[12] || '',
    };

    try {
      // Post survey responses first
      const response = await axios.post(`${API_BASE}/responses`, payload);
      alert('Jawaban berhasil dikirim!');
      
      // Sum all tower defense points from localStorage
      const scene1Points = parseInt(localStorage.getItem('scene1Points') || '0', 10);
      const scene2Points = parseInt(localStorage.getItem('scene2Points') || '0', 10);
      const scene3Points = parseInt(localStorage.getItem('scene3Points') || '0', 10);
      const scene4Points = parseInt(localStorage.getItem('scene4Points') || '0', 10);
      
      const totalPoints = scene1Points + scene2Points + scene3Points + scene4Points;
      
      // Post score to leaderboard if there are points
      if (totalPoints > 0 && userName) {
        try {
          const scorePayload = {
            name: userName,
            points: totalPoints,
            survey_id: response.data.data.id // Get survey ID from response.data.data.id
          };
          
          await axios.post(`${API_BASE}/scores`, scorePayload);
          console.log('Score posted to leaderboard:', scorePayload);
        } catch (scoreError) {
          console.error('Failed to post score to leaderboard:', scoreError);
          // Don't show error to user, just log it
        }
      }
      
      // Clear answers and user info from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userName');
        localStorage.removeItem('userLocation');
        localStorage.removeItem('userAge');
        localStorage.removeItem('scene1Answers');
        localStorage.removeItem('scene2Answers');
        localStorage.removeItem('scene3Answers');
        localStorage.removeItem('scene4Answers');
        localStorage.removeItem('scene1Points');
        localStorage.removeItem('scene2Points');
        localStorage.removeItem('scene3Points');
        localStorage.removeItem('scene4Points');
      }
    } catch (e) {
      alert('Gagal mengirim jawaban!');
    }
  };

  if (loadingUserInfo) return null;

  return (
    <div className="w-screen h-screen min-h-screen min-w-screen flex flex-col items-center justify-center bg-gray-900 text-white overflow-hidden relative">
      {/* Background image fullscreen */}
      {userInfoSubmitted && frame.image && (
        <div
          className="absolute inset-0 w-full h-full z-0"
          style={{
            backgroundImage: `url(${frame.image})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            filter: 'brightness(0.7) blur(0px)',
          }}
        />
      )}
      <div className="w-full h-full flex flex-col items-center justify-end relative z-10 pb-16">
        {/* Form user info sebelum scene 1 */}
        {!userInfoSubmitted && (
          <form
            onSubmit={e => {
              e.preventDefault();
              // Simpan ke localStorage
              if (typeof window !== 'undefined') {
                localStorage.setItem('userName', userName);
                localStorage.setItem('userLocation', userLocation);
                localStorage.setItem('userAge', userAge);
              }
              setUserInfoSubmitted(true);
            }}
            className="flex flex-col items-center justify-center h-full w-full bg-black bg-opacity-90 absolute z-50 backdrop-blur-sm"
            style={{ top: 0, left: 0 }}
          >
            <div className="bg-gradient-to-br from-blue-900/80 to-purple-900/80 rounded-2xl p-8 md:p-12 max-w-md w-full mx-4 border border-blue-500/30 shadow-2xl">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Welcome to GameFix2025
                </h2>
                <p className="text-gray-300 text-lg">
                  Let's start your research journey
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2 text-lg">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 rounded-lg bg-gray-800 text-white text-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                    placeholder="Enter your full name"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2 text-lg">
                    Age
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    className="w-full p-4 rounded-lg bg-gray-800 text-white text-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                    placeholder="Enter your age"
                    value={userAge}
                    onChange={e => setUserAge(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2 text-lg">
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 rounded-lg bg-gray-800 text-white text-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                    placeholder="City/Province"
                    value={userLocation}
                    onChange={e => setUserLocation(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={!userName || !userLocation || !userAge}
              >
                🚀 Start Research Journey
              </button>
            </div>
          </form>
        )}
        {/* Character and Text Area */}
        {userInfoSubmitted && (
          <>
            {/* Character Image (optional, absolute center bottom) */}
            {frame.characterImage && (
              <div className="fixed left-1/2 bottom-0 transform -translate-x-1/2 z-20 pointer-events-none">
                <img src={frame.characterImage} alt="character" className="w-96 h-[36rem] object-bottom drop-shadow-2xl" />
              </div>
            )}
            {/* Modal dialog + navigation */}
            <div className="fixed left-1/2 bottom-0 transform -translate-x-1/2 z-30 w-full max-w-4xl px-4 pb-8">
              <div className="bg-gradient-to-br  backdrop-blur-sm rounded-2xl shadow-2xl px-8 py-8 border border-gray-700/50">
                {/* Progress Indicator */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{frameIdx + 1} / {dialog.length}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((frameIdx + 1) / dialog.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Question Frame */}
                {frame.questionId && question ? (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleNext();
                    }}
                    className="mb-6 flex flex-col items-center w-full"
                  >
                    <label className="block mb-6 font-bold text-2xl text-center text-white leading-relaxed">
                      {question.text}
                    </label>
                    {/* Opsi jawaban sebagai tombol list */}
                    {question.type === 'select' && question.options && (
                      <div className="flex flex-col gap-4 w-full items-center mb-6">
                        {question.options.map((opt: string) => (
                          <button
                            key={opt}
                            type="button"
                            className={`w-full max-w-md p-4 rounded-xl text-lg font-semibold border-2 transition-all duration-200 transform hover:scale-105
                              ${answer === opt 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500 shadow-lg' 
                                : 'bg-gray-800 text-white border-gray-600 hover:border-blue-500 hover:bg-gray-700'
                              }
                              ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => {
                              if (!loading) {
                                setAnswer(opt);
                                handleNext(opt);
                              }
                            }}
                            disabled={loading}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                    {/* Jika ingin tetap ada tombol submit untuk tipe lain */}
                    {question.type !== 'select' && (
                      <button
                        type="submit"
                        className="mt-4 px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:opacity-50 text-lg font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                        disabled={loading || !answer}
                      >
                        {loading ? '⏳ Sending...' : '📤 Submit & Continue'}
                      </button>
                    )}
                    {submitted && (
                      <div className="mt-4 text-green-400 text-lg font-semibold flex items-center">
                        <span className="mr-2">✅</span>
                        Answer submitted successfully!
                      </div>
                    )}
                  </form>
                ) : (
                  // Jika bukan frame pertanyaan, tampilkan dialog biasa
                  <div className="text-2xl font-mono text-center min-h-[48px] drop-shadow-lg text-white mb-6 w-full leading-relaxed">
                    {frameIdx === 2 && slug === 'scene1'
                      ? getIdentifikasiText(
                          userName,
                          userAge,
                          userLocation,
                          (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(`${slug}Answers`) || '{}')[1] : '') || '-'
                        )
                      : frame.text}
                  </div>
                )}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between w-full max-w-xl mx-auto gap-4">
                  <button
                    onClick={handlePrev}
                    className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 text-lg font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed disabled:transform-none"
                    disabled={frameIdx === 0}
                  >
                    ⬅️ Previous
                  </button>
                  {frameIdx < dialog.length - 1 ? (
                    <button
                      onClick={() => handleNext()}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                      disabled={frame.questionId ? !answer : false}
                    >
                      Next ➡️
                    </button>
                  ) : (
                    <button
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-lg font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                      onClick={() => handleNext()}
                      disabled={frame.questionId ? !answer : false}
                    >
                      🎉 Complete & Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Scene; 