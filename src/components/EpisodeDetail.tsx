import { ArrowLeft, Calendar, TrendingUp, Award, BarChart3 } from 'lucide-react';
import { Episode } from '../types';
import { formatNumber, formatDate, getEpisodePerformance, calculateRetention, getTooltipStyle } from '../utils';
import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface EpisodeDetailProps {
  episode: Episode;
  episodes: Episode[];
  onBack: () => void;
}

export default function EpisodeDetail({ episode, episodes, onBack }: EpisodeDetailProps) {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  
  const avgAllTime = useMemo(() => {
    return episodes.reduce((sum, ep) => sum + ep.allTime, 0) / episodes.length;
  }, [episodes]);

  const performance = getEpisodePerformance(episode, avgAllTime);
  const retention = calculateRetention(episode);

  const performanceData = useMemo(() => {
    return [
      { name: 'Day 1', listens: episode.day1 },
      { name: 'Day 7', listens: episode.day7 },
      { name: 'Day 14', listens: episode.day14 },
      { name: 'Day 30', listens: episode.day30 },
      { name: 'Day 90', listens: episode.day90 },
      { name: 'All-Time', listens: episode.allTime },
    ];
  }, [episode]);

  const comparisonData = useMemo(() => {
    const episodeIndex = episodes.findIndex(ep => ep.slug === episode.slug);
    const nearby = [];
    
    for (let i = Math.max(0, episodeIndex - 2); i <= Math.min(episodes.length - 1, episodeIndex + 2); i++) {
      if (i !== episodeIndex) {
        nearby.push(episodes[i]);
      }
    }

    return nearby.map(ep => ({
      name: ep.slug.substring(0, 15),
      allTime: ep.allTime,
      day7: ep.day7,
    }));
  }, [episode, episodes]);

  const rank = useMemo(() => {
    const sorted = [...episodes].sort((a, b) => b.allTime - a.allTime);
    return sorted.findIndex(ep => ep.slug === episode.slug) + 1;
  }, [episode, episodes]);

  const performanceBadge = {
    'excellent': { bg: 'bg-green-500', text: 'Excellent Performance', icon: '🌟' },
    'good': { bg: 'bg-blue-500', text: 'Good Performance', icon: '👍' },
    'average': { bg: 'bg-gray-500', text: 'Average Performance', icon: '📊' },
    'below-average': { bg: 'bg-orange-500', text: 'Below Average', icon: '📉' },
  }[performance];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="btn btn-secondary flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to List</span>
      </button>

      {/* Episode Header */}
      <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <span className={`${performanceBadge.bg} px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2`}>
                <span>{performanceBadge.icon}</span>
                <span>{performanceBadge.text}</span>
              </span>
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-bold">
                Rank #{rank} of {episodes.length}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-3">{episode.title}</h1>
            <div className="flex items-center space-x-4 text-primary-100">
              <span className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(episode.published)}</span>
              </span>
              <span>•</span>
              <span className="font-mono">{episode.slug}</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-primary-100 text-sm mb-1">Day 1</p>
            <p className="text-2xl font-bold">{formatNumber(episode.day1)}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-primary-100 text-sm mb-1">Day 7</p>
            <p className="text-2xl font-bold">{formatNumber(episode.day7)}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-primary-100 text-sm mb-1">Day 30</p>
            <p className="text-2xl font-bold">{formatNumber(episode.day30)}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-primary-100 text-sm mb-1">All-Time</p>
            <p className="text-3xl font-bold">{formatNumber(episode.allTime)}</p>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Performance Timeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.3)" />
            <XAxis dataKey="name" stroke="currentColor" className="text-gray-600 dark:text-gray-400" />
            <YAxis stroke="currentColor" className="text-gray-600 dark:text-gray-400" />
            <Tooltip formatter={(value) => formatNumber(value as number)} contentStyle={getTooltipStyle(isDark)} />
            <Bar dataKey="listens" fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Retention Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
          <h3 className="text-lg font-semibold mb-3">Day 1 Retention</h3>
          <p className="text-4xl font-bold">{retention.day1.toFixed(1)}%</p>
          <p className="text-red-100 text-sm mt-2">of all-time listens</p>
        </div>
        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <h3 className="text-lg font-semibold mb-3">Day 7 Retention</h3>
          <p className="text-4xl font-bold">{retention.day7.toFixed(1)}%</p>
          <p className="text-orange-100 text-sm mt-2">of all-time listens</p>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <h3 className="text-lg font-semibold mb-3">Day 30 Retention</h3>
          <p className="text-4xl font-bold">{retention.day30.toFixed(1)}%</p>
          <p className="text-green-100 text-sm mt-2">of all-time listens</p>
        </div>
      </div>

      {/* Comparison with Nearby Episodes */}
      {comparisonData.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Comparison with Nearby Episodes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.3)" />
              <XAxis dataKey="name" stroke="currentColor" className="text-gray-600 dark:text-gray-400" />
              <YAxis stroke="currentColor" className="text-gray-600 dark:text-gray-400" />
              <Tooltip formatter={(value) => formatNumber(value as number)} contentStyle={getTooltipStyle(isDark)} />
              <Legend />
              <Line type="monotone" dataKey="allTime" stroke="#0ea5e9" strokeWidth={2} name="All-Time" />
              <Line type="monotone" dataKey="day7" stroke="#10b981" strokeWidth={2} name="Day 7" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">vs Average</h4>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            {((episode.allTime / avgAllTime - 1) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3 mb-2">
            <Award className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Spotify</h4>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{formatNumber(episode.spotify)}</p>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3 mb-2">
            <BarChart3 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Day 90</h4>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{formatNumber(episode.day90)}</p>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Day 14</h4>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{formatNumber(episode.day14)}</p>
        </div>
      </div>
    </div>
  );
}
