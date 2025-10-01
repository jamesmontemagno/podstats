import { useState, useMemo } from 'react';
import { Search, Calendar, TrendingUp, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Episode } from '../types';
import { formatNumber, formatDate, getEpisodePerformance } from '../utils';

interface EpisodeListProps {
  episodes: Episode[];
  onEpisodeClick: (episode: Episode) => void;
}

type SortField = 'published' | 'allTime' | 'day1' | 'day7' | 'day30';
type SortOrder = 'asc' | 'desc';

export default function EpisodeList({ episodes, onEpisodeClick }: EpisodeListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('published');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [minListens, setMinListens] = useState('');
  const [maxListens, setMaxListens] = useState('');

  const avgAllTime = useMemo(() => {
    return episodes.reduce((sum, ep) => sum + ep.allTime, 0) / episodes.length;
  }, [episodes]);

  const filteredAndSortedEpisodes = useMemo(() => {
    let filtered = episodes.filter(ep => {
      const matchesSearch = ep.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ep.slug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMin = !minListens || ep.allTime >= parseInt(minListens);
      const matchesMax = !maxListens || ep.allTime <= parseInt(maxListens);
      return matchesSearch && matchesMin && matchesMax;
    });

    filtered.sort((a, b) => {
      let aVal, bVal;
      
      if (sortField === 'published') {
        aVal = a.published.getTime();
        bVal = b.published.getTime();
      } else {
        aVal = a[sortField];
        bVal = b[sortField];
      }

      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return filtered;
  }, [episodes, searchTerm, sortField, sortOrder, minListens, maxListens]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getPerformanceBadge = (episode: Episode) => {
    const performance = getEpisodePerformance(episode, avgAllTime);
    const badges = {
      'excellent': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      'good': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      'average': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
      'below-average': 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badges[performance]}`}>
        {performance}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Search Episodes</h2>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Listens
              </label>
              <input
                type="number"
                placeholder="e.g., 2000"
                value={minListens}
                onChange={(e) => setMinListens(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Listens
              </label>
              <input
                type="number"
                placeholder="e.g., 5000"
                value={maxListens}
                onChange={(e) => setMaxListens(e.target.value)}
                className="input"
              />
            </div>
          </div>

          {/* Sort Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => toggleSort('published')}
              className={`btn flex items-center space-x-2 ${
                sortField === 'published' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Date</span>
              {sortField === 'published' && (
                sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => toggleSort('allTime')}
              className={`btn flex items-center space-x-2 ${
                sortField === 'allTime' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>All-Time</span>
              {sortField === 'allTime' && (
                sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => toggleSort('day7')}
              className={`btn flex items-center space-x-2 ${
                sortField === 'day7' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <span>Day 7</span>
              {sortField === 'day7' && (
                sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => toggleSort('day1')}
              className={`btn flex items-center space-x-2 ${
                sortField === 'day1' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <span>Day 1</span>
              {sortField === 'day1' && (
                sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
              )}
            </button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedEpisodes.length} of {episodes.length} episodes
          </p>
        </div>
      </div>

      {/* Episodes List */}
      <div className="space-y-4">
        {filteredAndSortedEpisodes.map((episode) => (
          <div
            key={episode.slug}
            onClick={() => onEpisodeClick(episode)}
            className="card hover:shadow-xl cursor-pointer transform hover:-translate-y-1 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">{episode.title}</h3>
                  {getPerformanceBadge(episode)}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(episode.published)}</span>
                  </span>
                  <span>•</span>
                  <span className="text-gray-600 dark:text-gray-400 font-mono">{episode.slug}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Day 1</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{formatNumber(episode.day1)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Day 7</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{formatNumber(episode.day7)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Day 30</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{formatNumber(episode.day30)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Day 90</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{formatNumber(episode.day90)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">All-Time</p>
                    <p className="font-bold text-primary-600 dark:text-primary-400">{formatNumber(episode.allTime)}</p>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-primary-500" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedEpisodes.length === 0 && (
        <div className="card text-center py-12">
          <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No episodes found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
