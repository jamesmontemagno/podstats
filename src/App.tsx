import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Radio, 
  Calendar,
  Search,
  Tag,
  Activity,
  FileText
} from 'lucide-react';
import { loadEpisodes, parseEpisodesFromCsv, saveCsvToStorage, loadCsvFromStorage, clearCsvFromStorage } from './utils';
import { Episode, EpisodesState } from './types';
import Dashboard from './components/Dashboard';
import EpisodeList from './components/EpisodeList';
import TopicAnalysis from './components/TopicAnalysis';
import PerformanceCharts from './components/PerformanceCharts';
import EpisodeDetail from './components/EpisodeDetail';
import BlogPost from './components/BlogPost';
import ThemeToggle from './components/ThemeToggle';
import DataControls from './components/DataControls';

type View = 'dashboard' | 'episodes' | 'topics' | 'charts' | 'blog';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [episodesState, setEpisodesState] = useState<EpisodesState>(() => {
    // Try to load from localStorage first
    const stored = loadCsvFromStorage();
    if (stored) {
      try {
        const result = parseEpisodesFromCsv(stored.csv);
        return {
          episodes: result.episodes,
          skippedCount: result.skippedCount,
          warnings: result.warnings,
          sourceLabel: stored.metadata.sourceLabel,
          lastImportTimestamp: stored.metadata.timestamp,
        };
      } catch (error) {
        // If parsing fails, clear storage and fall back to default
        clearCsvFromStorage();
        if (import.meta.env.DEV) {
          console.warn('Failed to parse stored CSV, falling back to default:', error);
        }
      }
    }
    // Fall back to default dataset
    return loadEpisodes();
  });

  const episodes = episodesState.episodes;

  // Reset selectedEpisode if it no longer exists in the current dataset
  useEffect(() => {
    if (selectedEpisode && !episodes.find(ep => ep.slug === selectedEpisode.slug)) {
      setSelectedEpisode(null);
    }
  }, [episodes, selectedEpisode]);

  const handleFileImport = async (file: File) => {
    try {
      const text = await file.text();
      const result = parseEpisodesFromCsv(text);
      
      const newState: EpisodesState = {
        episodes: result.episodes,
        skippedCount: result.skippedCount,
        warnings: result.warnings,
        sourceLabel: file.name,
        lastImportTimestamp: Date.now(),
      };

      // Save to localStorage
      saveCsvToStorage(text, {
        sourceLabel: file.name,
        timestamp: newState.lastImportTimestamp!,
      });

      setEpisodesState(newState);
      setSelectedEpisode(null);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to import CSV');
    }
  };

  const handleReset = () => {
    clearCsvFromStorage();
    setEpisodesState(loadEpisodes());
    setSelectedEpisode(null);
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <Radio className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 dark:text-primary-400 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">Merge Conflict Analytics</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Podcast Performance Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{episodes.length} Episodes</span>
              </div>
              <div className="flex sm:hidden items-center text-xs text-gray-600 dark:text-gray-400">
                <span>{episodes.length}</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-[60px] sm:top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex space-x-1 py-2 overflow-x-auto">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                currentView === 'dashboard'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setCurrentView('episodes')}
              className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                currentView === 'episodes'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Episodes</span>
            </button>
            <button
              onClick={() => setCurrentView('topics')}
              className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                currentView === 'topics'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span className="hidden sm:inline">Topics</span>
            </button>
            <button
              onClick={() => setCurrentView('charts')}
              className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                currentView === 'charts'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <BarChart className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
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
            {/* Data Controls - shown on dashboard view */}
            {currentView === 'dashboard' && (
              <DataControls
                episodesState={episodesState}
                onImport={handleFileImport}
                onReset={handleReset}
              />
            )}
            {currentView === 'dashboard' && <Dashboard episodes={episodes} onEpisodeClick={handleEpisodeClick} />}
            {currentView === 'episodes' && <EpisodeList episodes={episodes} onEpisodeClick={handleEpisodeClick} />}
            {currentView === 'topics' && <TopicAnalysis episodes={episodes} onEpisodeClick={handleEpisodeClick} />}
            {currentView === 'charts' && <PerformanceCharts episodes={episodes} />}
            {currentView === 'blog' && <BlogPost />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center space-y-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Merge Conflict Podcast Analytics • Built with React + Vite + Recharts
            </p>
            <button
              onClick={() => setCurrentView('blog')}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium inline-flex items-center space-x-1 hover:underline"
            >
              <FileText className="w-4 h-4" />
              <span>How This Was Built</span>
            </button>
            <p className="text-gray-400 dark:text-gray-500 text-xs">
              Built with{' '}
              <a 
                href="https://code.visualstudio.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                VS Code
              </a>
              {' '}and{' '}
              <a 
                href="https://github.com/features/copilot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                GitHub Copilot
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
