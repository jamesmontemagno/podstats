import { useMemo } from 'react';
import { Episode } from '../types';
import { formatNumber, getTooltipStyle } from '../utils';
import { useTheme } from '../contexts/ThemeContext';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface PerformanceChartsProps {
  episodes: Episode[];
}

export default function PerformanceCharts({ episodes }: PerformanceChartsProps) {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const monthlyData = useMemo(() => {
    const dataByMonth = new Map<string, { listens: number; count: number }>();
    
    episodes.forEach(ep => {
      const monthKey = `${ep.published.getFullYear()}-${String(ep.published.getMonth() + 1).padStart(2, '0')}`;
      const existing = dataByMonth.get(monthKey) || { listens: 0, count: 0 };
      dataByMonth.set(monthKey, {
        listens: existing.listens + ep.allTime,
        count: existing.count + 1
      });
    });

    return Array.from(dataByMonth.entries())
      .map(([month, data]) => ({
        month,
        listens: data.listens,
        avgPerEpisode: Math.round(data.listens / data.count),
        count: data.count
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-24); // Last 24 months
  }, [episodes]);

  const retentionData = useMemo(() => {
    return episodes
      .filter(ep => ep.day1 > 0 && ep.day7 > 0 && ep.day30 > 0)
      .slice(0, 50)
      .map(ep => ({
        name: ep.slug.substring(0, 15),
        day1Percent: (ep.day1 / ep.allTime) * 100,
        day7Percent: (ep.day7 / ep.allTime) * 100,
        day30Percent: (ep.day30 / ep.allTime) * 100,
        day90Percent: ep.day90 > 0 ? (ep.day90 / ep.allTime) * 100 : 0,
      }));
  }, [episodes]);

  const performanceDistribution = useMemo(() => {
    const ranges = [
      { name: '0-1K', min: 0, max: 1000, count: 0 },
      { name: '1K-2K', min: 1000, max: 2000, count: 0 },
      { name: '2K-3K', min: 2000, max: 3000, count: 0 },
      { name: '3K-4K', min: 3000, max: 4000, count: 0 },
      { name: '4K-5K', min: 4000, max: 5000, count: 0 },
      { name: '5K+', min: 5000, max: Infinity, count: 0 },
    ];

    episodes.forEach(ep => {
      const range = ranges.find(r => ep.allTime >= r.min && ep.allTime < r.max);
      if (range) range.count++;
    });

    return ranges;
  }, [episodes]);

  const day1VsAllTime = useMemo(() => {
    return episodes
      .filter(ep => ep.day1 > 0)
      .map(ep => ({
        day1: ep.day1,
        allTime: ep.allTime,
        title: ep.title.substring(0, 30)
      }));
  }, [episodes]);

  const growthTrend = useMemo(() => {
    const recentEpisodes = [...episodes].reverse();
    return recentEpisodes.slice(0, 100).map((ep, index) => ({
      episode: index + 1,
      allTime: ep.allTime,
      day7: ep.day7,
      day30: ep.day30
    }));
  }, [episodes]);

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Performance Analytics</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Deep dive into podcast performance metrics, trends, and patterns.
        </p>
      </div>

      {/* Monthly Performance */}
      <div className="analytics-monthly-trends card">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Monthly Performance Trend</h3>
        <ResponsiveContainer width="100%" height={300} minWidth={0}>
          <AreaChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.3)" />
            <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} stroke="currentColor" className="text-gray-600 dark:text-gray-400" fontSize={12} />
            <YAxis stroke="currentColor" className="text-gray-600 dark:text-gray-400" fontSize={12} />
            <Tooltip formatter={(value) => formatNumber(value as number)} contentStyle={getTooltipStyle(isDark)} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Area
              type="monotone"
              dataKey="listens"
              stroke="#0ea5e9"
              fill="#0ea5e9"
              fillOpacity={0.6}
              name="Total Listens"
            />
            <Area
              type="monotone"
              dataKey="avgPerEpisode"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.4}
              name="Avg per Episode"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Distribution */}
      <div className="analytics-performance-distribution card">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Episode Performance Distribution</h3>
        <ResponsiveContainer width="100%" height={250} minWidth={0}>
          <BarChart data={performanceDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.3)" />
            <XAxis dataKey="name" stroke="currentColor" className="text-gray-600 dark:text-gray-400" fontSize={12} />
            <YAxis stroke="currentColor" className="text-gray-600 dark:text-gray-400" fontSize={12} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="count" name="Number of Episodes">
              {performanceDistribution.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <p>Distribution of episodes across different performance ranges (all-time listens)</p>
        </div>
      </div>

      {/* Retention Analysis */}
      <div className="analytics-retention card">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Retention Analysis (Recent 50 Episodes)</h3>
        <ResponsiveContainer width="100%" height={300} minWidth={0}>
          <LineChart data={retentionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.3)" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke="currentColor" className="text-gray-600 dark:text-gray-400" fontSize={12} />
            <YAxis label={{ value: 'Percentage of All-Time', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} stroke="currentColor" className="text-gray-600 dark:text-gray-400" fontSize={12} />
            <Tooltip formatter={(value) => `${(value as number).toFixed(1)}%`} contentStyle={getTooltipStyle(isDark)} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="day1Percent" stroke="#ef4444" name="Day 1 %" strokeWidth={2} />
            <Line type="monotone" dataKey="day7Percent" stroke="#f59e0b" name="Day 7 %" strokeWidth={2} />
            <Line type="monotone" dataKey="day30Percent" stroke="#10b981" name="Day 30 %" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <p>Shows what percentage of all-time listens occur in the first day, week, and month</p>
        </div>
      </div>

      {/* Day 1 vs All-Time Correlation */}
      <div className="analytics-day7-scatter card">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Day 1 vs All-Time Listens Correlation</h3>
        <ResponsiveContainer width="100%" height={350} minWidth={0}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.3)" />
            <XAxis
              type="number"
              dataKey="day1"
              name="Day 1"
              label={{ value: 'Day 1 Listens', position: 'insideBottom', offset: -5, style: { fontSize: 12 } }}
              stroke="currentColor" className="text-gray-600 dark:text-gray-400"
              fontSize={12}
            />
            <YAxis
              type="number"
              dataKey="allTime"
              name="All-Time"
              label={{ value: 'All-Time Listens', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              stroke="currentColor" className="text-gray-600 dark:text-gray-400"
              fontSize={12}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value) => formatNumber(value as number)}
              contentStyle={getTooltipStyle(isDark)}
            />
            <Scatter name="Episodes" data={day1VsAllTime} fill="#0ea5e9">
              {day1VsAllTime.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <p>Correlation between first-day performance and total lifetime listens</p>
        </div>
      </div>

      {/* Growth Trend */}
      <div className="analytics-growth-patterns card">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Recent 100 Episodes Performance</h3>
        <ResponsiveContainer width="100%" height={300} minWidth={0}>
          <LineChart data={growthTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.3)" />
            <XAxis dataKey="episode" label={{ value: 'Episode Number', position: 'insideBottom', offset: -5, style: { fontSize: 12 } }} stroke="currentColor" className="text-gray-600 dark:text-gray-400" fontSize={12} />
            <YAxis stroke="currentColor" className="text-gray-600 dark:text-gray-400" fontSize={12} />
            <Tooltip formatter={(value) => formatNumber(value as number)} contentStyle={getTooltipStyle(isDark)} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="allTime" stroke="#0ea5e9" strokeWidth={2} name="All-Time" />
            <Line type="monotone" dataKey="day30" stroke="#10b981" strokeWidth={2} name="Day 30" />
            <Line type="monotone" dataKey="day7" stroke="#f59e0b" strokeWidth={2} name="Day 7" />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <p>Performance trend across the most recent 100 episodes</p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <h3 className="text-lg font-bold mb-3">Average Retention</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Day 1:</span>
              <span className="text-2xl font-bold">
                {(retentionData.reduce((sum, d) => sum + d.day1Percent, 0) / retentionData.length).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Day 7:</span>
              <span className="text-2xl font-bold">
                {(retentionData.reduce((sum, d) => sum + d.day7Percent, 0) / retentionData.length).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Day 30:</span>
              <span className="text-2xl font-bold">
                {(retentionData.reduce((sum, d) => sum + d.day30Percent, 0) / retentionData.length).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <h3 className="text-lg font-bold mb-3">Performance Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Highest Episode:</span>
              <span className="text-2xl font-bold">
                {formatNumber(Math.max(...episodes.map(e => e.allTime)))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Median Episode:</span>
              <span className="text-2xl font-bold">
                {formatNumber(episodes[Math.floor(episodes.length / 2)].allTime)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Avg Growth:</span>
              <span className="text-2xl font-bold">
                {((episodes.slice(0, 30).reduce((s, e) => s + e.allTime, 0) / 30 - 
                   episodes.slice(-30).reduce((s, e) => s + e.allTime, 0) / 30) / 
                   (episodes.slice(-30).reduce((s, e) => s + e.allTime, 0) / 30) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
