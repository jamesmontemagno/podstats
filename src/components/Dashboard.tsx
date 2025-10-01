import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Radio, Calendar, Headphones, Award } from 'lucide-react';
import { Episode } from '../types';
import { formatNumber, formatDate } from '../utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface DashboardProps {
  episodes: Episode[];
  onEpisodeClick: (episode: Episode) => void;
}

export default function Dashboard({ episodes, onEpisodeClick }: DashboardProps) {
  const stats = useMemo(() => {
    const totalListens = episodes.reduce((sum, ep) => sum + ep.allTime, 0);
    const avgDay1 = episodes.reduce((sum, ep) => sum + ep.day1, 0) / episodes.length;
    const avgDay7 = episodes.reduce((sum, ep) => sum + ep.day7, 0) / episodes.length;
    const avgAllTime = episodes.reduce((sum, ep) => sum + ep.allTime, 0) / episodes.length;
    
    const recent30 = episodes.slice(0, 30);
    const old30 = episodes.slice(Math.max(0, episodes.length - 30));
    const recentAvg = recent30.reduce((sum, ep) => sum + ep.allTime, 0) / recent30.length;
    const oldAvg = old30.reduce((sum, ep) => sum + ep.allTime, 0) / old30.length;
    const growthRate = ((recentAvg - oldAvg) / oldAvg) * 100;

    const topEpisode = [...episodes].sort((a, b) => b.allTime - a.allTime)[0];

    return {
      totalEpisodes: episodes.length,
      totalListens,
      avgDay1,
      avgDay7,
      avgAllTime,
      topEpisode,
      recentAvg,
      oldAvg,
      growthRate
    };
  }, [episodes]);

  const timelineData = useMemo(() => {
    return episodes
      .slice(0, 50)
      .reverse()
      .map(ep => ({
        name: ep.slug.substring(0, 15),
        listens: ep.allTime,
        day7: ep.day7,
      }));
  }, [episodes]);

  const topEpisodes = useMemo(() => {
    return [...episodes]
      .sort((a, b) => b.allTime - a.allTime)
      .slice(0, 10);
  }, [episodes]);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Total Episodes</p>
              <p className="text-3xl font-bold mt-2">{stats.totalEpisodes}</p>
            </div>
            <Radio className="w-12 h-12 text-primary-200" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-br from-emerald-500 to-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Total Listens</p>
              <p className="text-3xl font-bold mt-2">{formatNumber(stats.totalListens)}</p>
            </div>
            <Headphones className="w-12 h-12 text-emerald-200" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-br from-purple-500 to-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Avg All-Time</p>
              <p className="text-3xl font-bold mt-2">{formatNumber(stats.avgAllTime)}</p>
            </div>
            <Award className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className={`stat-card bg-gradient-to-br ${
          stats.growthRate > 0 ? 'from-green-500 to-green-600' : 'from-orange-500 to-orange-600'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${stats.growthRate > 0 ? 'text-green-100' : 'text-orange-100'}`}>
                Growth Rate
              </p>
              <p className="text-3xl font-bold mt-2">
                {stats.growthRate > 0 ? '+' : ''}{stats.growthRate.toFixed(1)}%
              </p>
            </div>
            {stats.growthRate > 0 ? (
              <TrendingUp className="w-12 h-12 text-green-200" />
            ) : (
              <TrendingDown className="w-12 h-12 text-orange-200" />
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Day 1 Average</h3>
          <p className="text-3xl font-bold text-primary-600">{formatNumber(stats.avgDay1)}</p>
          <p className="text-sm text-gray-500 mt-1">First day listens</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Day 7 Average</h3>
          <p className="text-3xl font-bold text-primary-600">{formatNumber(stats.avgDay7)}</p>
          <p className="text-sm text-gray-500 mt-1">First week listens</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Retention Rate</h3>
          <p className="text-3xl font-bold text-primary-600">
            {((stats.avgDay7 / stats.avgAllTime) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500 mt-1">Week 1 to all-time</p>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Performance Timeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip formatter={(value) => formatNumber(value as number)} />
            <Line type="monotone" dataKey="listens" stroke="#0ea5e9" strokeWidth={2} name="All-Time" />
            <Line type="monotone" dataKey="day7" stroke="#10b981" strokeWidth={2} name="Day 7" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Episodes */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Top 10 Episodes by All-Time Listens</h3>
        <div className="space-y-3">
          {topEpisodes.map((episode, index) => (
            <div
              key={episode.slug}
              onClick={() => onEpisodeClick(episode)}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{episode.title}</p>
                  <p className="text-sm text-gray-500">{formatDate(episode.published)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary-600">{formatNumber(episode.allTime)}</p>
                <p className="text-xs text-gray-500">listens</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Performing Episode Highlight */}
      {stats.topEpisode && (
        <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <Award className="w-6 h-6" />
                <h3 className="text-xl font-bold">Best Performing Episode</h3>
              </div>
              <h4 className="text-2xl font-bold mb-2">{stats.topEpisode.title}</h4>
              <p className="text-primary-100 mb-4">{formatDate(stats.topEpisode.published)}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-primary-100 text-sm">Day 1</p>
                  <p className="text-2xl font-bold">{formatNumber(stats.topEpisode.day1)}</p>
                </div>
                <div>
                  <p className="text-primary-100 text-sm">Day 7</p>
                  <p className="text-2xl font-bold">{formatNumber(stats.topEpisode.day7)}</p>
                </div>
                <div>
                  <p className="text-primary-100 text-sm">Day 30</p>
                  <p className="text-2xl font-bold">{formatNumber(stats.topEpisode.day30)}</p>
                </div>
                <div>
                  <p className="text-primary-100 text-sm">All-Time</p>
                  <p className="text-2xl font-bold">{formatNumber(stats.topEpisode.allTime)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
