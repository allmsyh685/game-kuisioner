'use client'
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Skeleton from '@/components/ui/Skeleton';
import { useGameStore, type GameState } from '@/lib/store';

// Dynamic dialog import helper
const dialogMap: Record<string, Scene1Frame[]> = {
  scene1: require('../../scene1Dialog').scene1Dialog as Scene1Frame[],
  scene2: require('../../scene2Dialog').scene2Dialog as Scene1Frame[],
  scene3: require('../../scene3Dialog').scene3Dialog as Scene1Frame[]
  // Add more scenes as needed
};

interface QuestionOptionLocal { id: number; text: string }
interface Question {
  id: number;
  text: string;
  type: string;
  options?: QuestionOptionLocal[];
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
  isSubmit?: boolean; // when true, submit survey + score here
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://quitionnaireapi-production.up.railway.app/api';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || '';

function getIdentifikasiText(userName: string, userAge: string, userLocation: string) {
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
  const params = useParams();
  const slug = params?.slug as string || 'scene1';
  const dialog: Scene1Frame[] = dialogMap[slug] || dialogMap['scene1'];
  const [frameIdx, setFrameIdx] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const userName = useGameStore((s: GameState) => s.userName);
  const userLocation = useGameStore((s: GameState) => s.userLocation);
  const userAge = useGameStore((s: GameState) => s.userAge);
  const setUserInfo = useGameStore((s: GameState) => s.setUserInfo);
  const userInfoSubmitted = useGameStore((s: any) => s.userInfoSubmitted) as boolean;
  const setUserInfoSubmitted = useGameStore((s: any) => s.setUserInfoSubmitted) as (v: boolean) => void;
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioPaused, setAudioPaused] = useState(false);
  const [currentAudioFile, setCurrentAudioFile] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const frame: Scene1Frame = dialog[frameIdx];

  useEffect(() => {
    // Do not auto-submit when fields become non-empty.
    // Only mark as loaded so the form can render and user can submit explicitly.
    setLoadingUserInfo(false);
  }, []);

  useEffect(() => {
    if (frame && frame.questionId) {
      setLoading(true);
      axios.get(`${API_BASE}/questions`, { headers: { ...(API_TOKEN ? { 'Authorization': `Bearer ${API_TOKEN}` } : {}) } })
        .then(res => {
          // Find question by order instead of ID to handle edited questions properly
          let q = res.data.data.find((q: unknown) => Number((q as { order: number }).order) === Number(frame.questionId));
          if (q) {
            // mapping field agar frontend dapat .text, .type, .options
            q = {
              ...q,
              text: (q as any).question_text,
              type: 'select',
              options: Array.isArray((q as any).options) ? (q as any).options : [],
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
    setAnswer(null);
  }, [frameIdx]);

  // Audio functionality
  useEffect(() => {
    if (frame && frame.audio && userInfoSubmitted) {
      console.log('Loading audio for frame:', frameIdx, 'Audio path:', frame.audio);
      
      // Only create new audio if the audio file has changed
      if (currentAudioFile !== frame.audio) {
        console.log('Audio file changed, creating new audio element');
        
        // Stop any currently playing audio
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }

        // Reset audio states for new audio file
        setAudioPaused(false);
        setAudioPlaying(false);
        setAudioLoaded(false);
        setCurrentAudioFile(frame.audio);

        // Create new audio element
        const audio = new Audio(frame.audio);
        audioRef.current = audio;
        
        // Set up audio event listeners
        audio.addEventListener('loadstart', () => {
          console.log('Audio loading started');
        });
        
        audio.addEventListener('canplaythrough', () => {
          console.log('Audio can play through');
          setAudioLoaded(true);
          // Auto-play audio for new audio file unless manually paused
          if (!audioPaused) {
            audio.play().catch(error => {
              console.log('Audio autoplay failed (this is normal due to browser restrictions):', error);
            });
            setAudioPlaying(true);
          }
        });
        
        audio.addEventListener('play', () => {
          setAudioPlaying(true);
        });
        
        audio.addEventListener('pause', () => {
          setAudioPlaying(false);
        });
        
        audio.addEventListener('ended', () => {
          setAudioPlaying(false);
        });
        
        audio.addEventListener('error', (error) => {
          console.error('Audio error:', error);
          setAudioPlaying(false);
        });

        // Load the audio
        audio.load();
      } else {
        console.log('Same audio file, continuing playback');
        // Same audio file, just resume if it was playing
        if (audioRef.current && !audioPaused && !audioPlaying) {
          audioRef.current.play().catch(error => {
            console.log('Error resuming audio:', error);
          });
          setAudioPlaying(true);
        }
      }
    }

    // Cleanup function
    return () => {
      // Don't cleanup audio on frame change, only on component unmount
    };
  }, [frameIdx, frame, userInfoSubmitted, audioPaused, currentAudioFile]);

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setAudioPlaying(false);
      setAudioLoaded(false);
      setAudioPaused(false);
    };
  }, []);

  const handleNext = async (selectedAnswer?: number) => {
    // Don't stop audio when navigating - let it continue if same audio file
    
    if (frame.questionId && question) {
      const answerToSave = selectedAnswer !== undefined ? selectedAnswer : answer;
      // Save answer to store (persisted)
      useGameStore.getState().saveAnswer(slug as string, Number(question.id), Number(answerToSave));
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFrameIdx(idx => Math.min(idx + 1, dialog.length - 1));
      }, 800);
    } else {
      // If this frame instructs to submit, do it now (scene-controlled submit)
      if (frame?.isSubmit) {
        const res = await handleSubmitAll();
        const query = res ? `?user=${encodeURIComponent(res.userName)}&points=${encodeURIComponent(String(res.totalPoints))}` : '';
        window.location.href = `/towergames/leaderboard${query}`;
        return;
      }

      // Otherwise, handle optional redirect to tower game with waves for this scene
      if (frame?.redirectToTowerGames) {
        const waves = frame.waves ?? (slug === 'scene1' ? 1 : slug === 'scene2' ? 2 : 3);
        window.location.href = `/towergames?waves=${waves}`;
        return;
      }

      // Default: go to next frame or stop at the last
      if (frameIdx < dialog.length - 1) {
        setFrameIdx(idx => Math.min(idx + 1, dialog.length - 1));
      } else {
        // At end with no submit/redirect, just show done state or go leaderboard
        const res = await handleSubmitAll();
        const query = res ? `?user=${encodeURIComponent(res.userName)}&points=${encodeURIComponent(String(res.totalPoints))}` : '';
        window.location.href = `/towergames/leaderboard${query}`;
      }
    }
  };

  const handlePrev = () => {
    // Don't stop audio when navigating - let it continue if same audio file
    setFrameIdx(idx => Math.max(idx - 1, 0));
  };

  const handleAudioToggle = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        // Stop/pause audio
        audioRef.current.pause();
        setAudioPlaying(false);
        setAudioPaused(true);
      } else {
        // Resume audio
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
        setAudioPlaying(true);
        setAudioPaused(false);
      }
    }
  };

  // Fungsi untuk submit ke API di frame terakhir
  const handleSubmitAll = async (): Promise<{ userName: string; totalPoints: number } | null> => {
    const { answersByScene, pointsByScene } = useGameStore.getState();
    const allAnswers = (Object.values(answersByScene as Record<string, Record<number, number>>) as Record<number, number>[]) 
      .reduce((acc: Record<number, number>, obj: Record<number, number>) => ({ ...acc, ...obj }), {} as Record<number, number>);

    // Build new payload for backend: answers with question_id & option_id
    const answersArray = Object.entries(allAnswers).map(([qid, optId]) => ({
      question_id: Number(qid),
      option_id: Number(optId as any),
    }));

    const payload = {
      name: userName,
      age: Number(userAge),
      location: userLocation,
      answers: answersArray,
    };

    try {
      // Post survey responses first
      const response = await axios.post(`${API_BASE}/responses`, payload, { headers: { ...(API_TOKEN ? { 'Authorization': `Bearer ${API_TOKEN}` } : {}) } });
      alert('Jawaban berhasil dikirim!');
      
      // Sum all tower defense points from store and legacy localStorage, prefer higher
      const storePoints = (Object.values(pointsByScene as Record<string, number>) as number[])
        .reduce((sum: number, p: number) => sum + (p || 0), 0);
      const ls1 = parseInt(localStorage.getItem('scene1Points') || '0', 10);
      const ls2 = parseInt(localStorage.getItem('scene2Points') || '0', 10);
      const ls3 = parseInt(localStorage.getItem('scene3Points') || '0', 10);
      const ls4 = parseInt(localStorage.getItem('scene4Points') || '0', 10);
      const localPoints = ls1 + ls2 + ls3 + ls4;
      const totalPoints = Math.max(storePoints, localPoints);
      
      // Post score to leaderboard if there are points
      if (totalPoints > 0 && userName) {
        try {
          const scorePayload = {
            name: userName,
            points: totalPoints,
            survey_id: response.data.data.id // Get survey ID from response.data.data.id
          };
          
          await axios.post(`${API_BASE}/scores`, scorePayload, { headers: { ...(API_TOKEN ? { 'Authorization': `Bearer ${API_TOKEN}` } : {}) } });
          console.log('Score posted to leaderboard:', scorePayload);
        } catch (scoreError) {
          console.error('Failed to post score to leaderboard:', scoreError);
          // Don't show error to user, just log it
        }
      }
      
      // Clear answers and user info from store and legacy localStorage
      useGameStore.getState().clearAll();
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
      return { userName, totalPoints };
    } catch (e) {
      alert('Gagal mengirim jawaban!');
      return null;
    }
  };

  if (loadingUserInfo) return (
    <div className="w-screen h-screen min-h-screen min-w-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-4xl px-6">
        <Skeleton className="w-full h-10 mb-4" />
        <Skeleton className="w-full h-80" />
      </div>
    </div>
  );

  return (
    <div className="w-screen h-screen min-h-screen min-w-screen flex flex-col items-center justify-center bg-gray-900 text-white overflow-hidden relative">
      {/* Background image fullscreen */}
      {userInfoSubmitted && frame.image && (
        <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center">
          <Image
            src={frame.image}
            alt="background"
            fill
            sizes="100vw"
            priority={frameIdx === 0}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMycgaGVpZ2h0PSczJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPSczJyBoZWlnaHQ9JzMnIGZpbGw9JyMxMTEnIC8+PC9zdmc+"
            quality={60}
            style={{ objectFit: 'contain', filter: 'brightness(0.7) blur(0px)' }}
          />
        </div>
      )}
      <div className="w-full h-full flex flex-col items-center justify-end relative z-10 pb-16">
        {/* Form user info sebelum scene 1 */}
        {slug === 'scene1' && !userInfoSubmitted && (
          <form
            onSubmit={e => {
              e.preventDefault();
              setUserInfoSubmitted(true);
            }}
            className="flex flex-col items-center justify-center h-full w-full absolute z-50 backdrop-blur-sm"
            style={{ 
              top: 0, 
              left: 0,
              background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.6) 0%, rgba(10, 10, 10, 0.6) 50%, rgba(10, 10, 10, 0.6) 100%)'
            }}
          >
            <div className="relative max-w-lg w-full mx-4">
              {/* Main Form Card */}
              <div className="relative bg-black/60 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-2xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full mb-6 shadow-lg">
                      <span className="text-4xl">🎯</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>
                      Selamat Datang di Quizzyplay
                    </h2>
                    <p className="text-white text-lg font-light" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
                      Mari mulai pengisian survei Anda
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-semibold mb-3 text-lg">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        className="w-full p-4 rounded-2xl bg-black/60 text-white text-lg border border-white/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:outline-none transition-all duration-300 placeholder-white/80 caret-white"
                        placeholder="Masukkan nama lengkap Anda"
                        value={userName}
                        onChange={e => setUserInfo(e.target.value, userAge, userLocation)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white font-semibold mb-3 text-lg">
                        Umur
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        className="w-full p-4 rounded-2xl bg-black/60 text-white text-lg border border-white/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 focus:outline-none transition-all duration-300 placeholder-white/80 caret-white"
                        placeholder="Masukkan umur Anda"
                        value={userAge}
                        onChange={e => setUserInfo(userName, e.target.value, userLocation)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white font-semibold mb-3 text-lg">
                        Lokasi
                      </label>
                      <input
                        type="text"
                        className="w-full p-4 rounded-2xl bg-black/60 text-white text-lg border border-white/30 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/50 focus:outline-none transition-all duration-300 placeholder-white/80 caret-white"
                        placeholder="Kota/Provinsi"
                        value={userLocation}
                        onChange={e => setUserInfo(userName, userAge, e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="group relative w-full mt-10 px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-400 hover:via-purple-400 hover:to-pink-400 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                    disabled={!userName || !userLocation || !userAge}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <span className="mr-2">🚀</span>
                      Jelajahi Inovasi Kuisioner Interaktif
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
        {/* Character and Text Area */}
        {userInfoSubmitted && (
          <>
            {/* Character Image (optional, absolute center bottom) */}
            {frame.characterImage && (
              <div className="fixed left-1/2 bottom-0 transform -translate-x-1/2 z-20 pointer-events-none">
                <Image src={frame.characterImage} alt="character" width={384} height={576} priority={frameIdx === 0} loading={frameIdx === 0 ? 'eager' : 'lazy'} className="w-96 h-[36rem] object-bottom drop-shadow-2xl" />
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
                  {frame.audio && (
                    <div className="flex justify-center mt-2">
                      <span className="text-xs text-gray-400">
                        {!audioLoaded ? '🔄 Loading audio...' : audioPlaying ? '🔊 Audio playing...' : audioPaused ? '⏸️ Audio paused' : '🔊 Audio ready'}
                      </span>
                    </div>
                  )}
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
                        {question.options.map((opt: any) => (
                          <button
                            key={opt.id}
                            type="button"
                            className={`w-full max-w-md p-4 rounded-xl text-lg font-semibold border-2 transition-all duration-200 transform hover:scale-105
                              ${answer === opt.id 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500 shadow-lg' 
                                : 'bg-gray-800 text-white border-gray-600 hover:border-blue-500 hover:bg-gray-700'
                              }
                              ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => {
                              if (!loading) {
                                setAnswer(opt.id);
                                handleNext(opt.id);
                              }
                            }}
                            disabled={loading}
                          >
                            {opt.text}
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
                  <div className="text-2xl font-mono text-center min-h-[32px] drop-shadow-lg text-white mb-4 w-full leading-tight">
                    {frameIdx === 2 && slug === 'scene1'
                      ? getIdentifikasiText(
                          userName,
                          userAge,
                          userLocation
                        )
                      : frame.text}
                  </div>
                )}
                
                {/* Audio Controls */}
                {frame.audio && (
                  <div className="flex justify-center mb-4">
                    <button
                      onClick={handleAudioToggle}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                      disabled={!audioLoaded}
                    >
                      {!audioLoaded ? '🔄 Loading Audio...' : audioPlaying ? '⏸️ Stop Audio' : '▶️ Resume Audio'}
                    </button>
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
                      disabled={frame.questionId ? answer === null : false}
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