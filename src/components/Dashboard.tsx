import { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, Radio, Headphones, Award, Download } from 'lucide-react';
import { Episode, EpisodesState } from '../types';
import { generatePDFReport } from '../utils/pdfExport';
import { formatNumber, formatDate } from '../utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

interface DashboardProps {
  episodes: Episode[];
  episodesState: EpisodesState;
  onEpisodeClick: (episode: Episode) => void;
}

export default function Dashboard({ episodes, episodesState, onEpisodeClick }: DashboardProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      await generatePDFReport(episodesState.sourceLabel);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

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
  }, [episodes, episodesState.lastImportTimestamp, episodesState.sourceLabel]);

  const timelineData = useMemo(() => {
    return episodes
      .slice(0, 50)
      .reverse()
      .map(ep => ({
        name: ep.slug.substring(0, 15),
        listens: ep.allTime,
        day7: ep.day7,
      }));
  }, [episodes, episodesState.lastImportTimestamp]);

  const topEpisodes = useMemo(() => {
    return [...episodes]
      .sort((a, b) => b.allTime - a.allTime)
      .slice(0, 10);
  }, [episodes, episodesState.lastImportTimestamp, episodesState.sourceLabel]);

  return (
    <div className="space-y-6">
      {/* Export Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p><strong>� Export:</strong> Generate a comprehensive PDF report with all dashboard and analytics charts.</p>
        </div>
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="btn btn-primary flex items-center space-x-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Generating PDF...' : 'Export PDF Report'}</span>
        </button>
      </div>

      {/* Export Error */}
      {exportError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-700 dark:text-red-400">{exportError}</p>
        </div>
      )}

      {/* Key Metrics */}
      <div className="dashboard-metrics grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="dashboard-performance grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Day 1 Average</h3>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{formatNumber(stats.avgDay1)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">First day listens</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Day 7 Average</h3>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{formatNumber(stats.avgDay7)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">First week listens</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Retention Rate</h3>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            {((stats.avgDay7 / stats.avgAllTime) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Week 1 to all-time</p>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="dashboard-timeline card">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Recent Performance Timeline</h3>
        <ResponsiveContainer width="100%" height={250} minWidth={0}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.3)" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke="currentColor" className="text-gray-600 dark:text-gray-400" fontSize={12} />
            <YAxis stroke="currentColor" className="text-gray-600 dark:text-gray-400" fontSize={12} />
            <Tooltip formatter={(value) => formatNumber(value as number)} contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb' }} />
            <Line type="monotone" dataKey="listens" stroke="#0ea5e9" strokeWidth={2} name="All-Time" />
            <Line type="monotone" dataKey="day7" stroke="#10b981" strokeWidth={2} name="Day 7" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Episodes */}
      <div className="dashboard-top-episodes card">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Top 10 Episodes by All-Time Listens</h3>
        <div className="space-y-3">
          {topEpisodes.map((episode, index) => (
            <div
              key={episode.slug}
              onClick={() => onEpisodeClick(episode)}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900 cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 dark:text-gray-200 truncate text-sm sm:text-base">{episode.title}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{formatDate(episode.published)}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className="text-base sm:text-lg font-bold text-primary-600 dark:text-primary-400">{formatNumber(episode.allTime)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">listens</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Performing Episode Highlight */}
      {stats.topEpisode && (
        <div className="dashboard-best-episode card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                <h3 className="text-lg sm:text-xl font-bold">Best Performing Episode</h3>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold mb-2">{stats.topEpisode.title}</h4>
              <p className="text-primary-100 mb-4 text-sm sm:text-base">{formatDate(stats.topEpisode.published)}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <p className="text-primary-100 text-xs sm:text-sm">Day 1</p>
                  <p className="text-xl sm:text-2xl font-bold">{formatNumber(stats.topEpisode.day1)}</p>
                </div>
                <div>
                  <p className="text-primary-100 text-xs sm:text-sm">Day 7</p>
                  <p className="text-xl sm:text-2xl font-bold">{formatNumber(stats.topEpisode.day7)}</p>
                </div>
                <div>
                  <p className="text-primary-100 text-xs sm:text-sm">Day 30</p>
                  <p className="text-xl sm:text-2xl font-bold">{formatNumber(stats.topEpisode.day30)}</p>
                </div>
                <div>
                  <p className="text-primary-100 text-xs sm:text-sm">All-Time</p>
                  <p className="text-xl sm:text-2xl font-bold">{formatNumber(stats.topEpisode.allTime)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
