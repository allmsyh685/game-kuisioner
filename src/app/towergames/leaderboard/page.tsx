'use client'

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Score {
  name: string;
  points: number;
  created_at: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://kuisioner-api-production.up.railway.app/api';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || '';

const Leaderboard: React.FC = () => {
  const searchParams = useSearchParams();
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    const u = searchParams.get('user');
    const p = searchParams.get('points');
    setUserName(u);
    setUserPoints(p ? Number(p) : null);

    fetch(`${API_BASE}/scores/leaderboard`, { headers: { ...(API_TOKEN ? { 'Authorization': `Bearer ${API_TOKEN}` } : {}) } })
      .then(res => res.json())
      .then(async data => {
        if (data.success) {
          // Show only top 3
          const top = Array.isArray(data.data) ? data.data.slice(0, 3) : [];
          setScores(top);

          // If user just arrived with points, fetch rank announcement
          if (p) {
            try {
              const rankRes = await fetch(`${API_BASE}/scores/rank?points=${encodeURIComponent(p)}`, { headers: { ...(API_TOKEN ? { 'Authorization': `Bearer ${API_TOKEN}` } : {}) } });
              const rankJson = await rankRes.json();
              if (rankJson && rankJson.success) {
                setUserRank(rankJson.data.rank ?? null);
                // Prefer server-provided top 3 if present
                if (Array.isArray(rankJson.data.top)) {
                  setScores(rankJson.data.top);
                }
              }
            } catch {
              // Ignore rank error silently
            }
          }
        } else {
          setError('Failed to fetch leaderboard');
        }
      })
      .catch(() => setError('Failed to fetch leaderboard'))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${position + 1}.`;
    }
  };

  const getPositionStyle = (position: number) => {
    switch (position) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-xl shadow-lg border-2 border-yellow-300';
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-black font-semibold text-lg shadow-md border-2 border-gray-200';
      case 2:
        return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold text-lg shadow-md border-2 border-amber-500';
      default:
        return 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 text-white border border-blue-700/30';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            🏆 Leaderboard
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Top players from our tower defense research game. Can you make it to the top?
        </p>
      </div>

      {/* Rank Announcement */}
      {userName && userPoints !== null && (
        <div className="w-full max-w-2xl mb-8">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-xl shadow-lg border border-emerald-400/40">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">🎉 Well done, {userName}!</div>
              <div className="text-lg">
                You scored <span className="font-semibold">{userPoints.toLocaleString()}</span> points
                {userRank ? <> and your current rank is <span className="font-semibold">#{userRank}</span></> : null}.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Content */}
      <div className="w-full max-w-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mb-4"></div>
            <p className="text-gray-300 text-lg">Loading leaderboard...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😞</div>
            <div className="text-red-400 text-xl mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : scores.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <div className="text-gray-300 text-xl mb-4">No scores yet</div>
            <p className="text-gray-400 mb-6">Be the first to play and set a record!</p>
            <Link
              href="/game/scene/scene1"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Start Playing
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {scores.map((score, idx) => (
              <div
                key={idx}
                className={`${getPositionStyle(idx)} p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{getMedalIcon(idx)}</span>
                    <div>
                      <h3 className="font-bold text-lg">{score.name}</h3>
                      <p className="text-sm opacity-75">
                        {new Date(score.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{score.points.toLocaleString()}</div>
                    <div className="text-sm opacity-75">points</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <Link
          href="/game/scene/scene1"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          🎯 Start New Game
        </Link>
        <Link
          href="/towergames"
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          🏰 Play Tower Defense
        </Link>
        <Link
          href="/"
          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          🏠 Back to Home
        </Link>
      </div>

      {/* Stats */}
      {scores.length > 0 && (
        <div className="mt-12 text-center">
          <div className="bg-black bg-opacity-30 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Leaderboard Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-2xl font-bold text-yellow-400">{scores.length}</div>
                <div className="text-gray-400">Total Players</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {scores.length > 0 ? scores[0].points.toLocaleString() : '0'}
                </div>
                <div className="text-gray-400">Highest Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score.points, 0) / scores.length).toLocaleString() : '0'}
                </div>
                <div className="text-gray-400">Average Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {scores.length > 0 ? scores[scores.length - 1].points.toLocaleString() : '0'}
                </div>
                <div className="text-gray-400">Lowest Score</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400"></div></div>}>
      <Leaderboard />
    </Suspense>
  );
}