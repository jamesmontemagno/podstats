import { useState, useMemo } from 'react';
import { 
  BarChart, 
  Radio, 
  Calendar,
  Search,
  Tag,
  Activity
} from 'lucide-react';
import { loadEpisodes } from './utils';
import { Episode } from './types';
import Dashboard from './components/Dashboard';
import EpisodeList from './components/EpisodeList';
import TopicAnalysis from './components/TopicAnalysis';
import PerformanceCharts from './components/PerformanceCharts';
import EpisodeDetail from './components/EpisodeDetail';
import ThemeToggle from './components/ThemeToggle';

type View = 'dashboard' | 'episodes' | 'topics' | 'charts';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const episodes = useMemo(() => loadEpisodes(), []);

  const handleEpisodeClick = (episode: Episode) => {
    setSelectedEpisode(episode);
  };

  const handleBackToList = () => {
    setSelectedEpisode(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Radio className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Merge Conflict Analytics</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Podcast Performance Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{episodes.length} Episodes</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-2">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentView === 'dashboard'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setCurrentView('episodes')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentView === 'episodes'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Episodes</span>
            </button>
            <button
              onClick={() => setCurrentView('topics')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentView === 'topics'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Topics</span>
            </button>
            <button
              onClick={() => setCurrentView('charts')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentView === 'charts'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <BarChart className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedEpisode ? (
          <EpisodeDetail 
            episode={selectedEpisode} 
            episodes={episodes}
            onBack={handleBackToList}
          />
        ) : (
          <>
            {currentView === 'dashboard' && <Dashboard episodes={episodes} onEpisodeClick={handleEpisodeClick} />}
            {currentView === 'episodes' && <EpisodeList episodes={episodes} onEpisodeClick={handleEpisodeClick} />}
            {currentView === 'topics' && <TopicAnalysis episodes={episodes} onEpisodeClick={handleEpisodeClick} />}
            {currentView === 'charts' && <PerformanceCharts episodes={episodes} />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            Merge Conflict Podcast Analytics • Built with React + Vite + Recharts
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
