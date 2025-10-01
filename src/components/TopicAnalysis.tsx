import { useMemo, useState } from 'react';
import { Tag, TrendingUp, Search, BarChart3 } from 'lucide-react';
import { Episode, TopicData } from '../types';
import { extractTopics, formatNumber } from '../utils';

interface TopicAnalysisProps {
  episodes: Episode[];
  onEpisodeClick: (episode: Episode) => void;
}

export default function TopicAnalysis({ episodes, onEpisodeClick }: TopicAnalysisProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topicData = useMemo((): TopicData[] => {
    const topicsMap = extractTopics(episodes);
    const data: TopicData[] = [];

    topicsMap.forEach((episodeList, topic) => {
      const totalListens = episodeList.reduce((sum, ep) => sum + ep.allTime, 0);
      const avgListens = totalListens / episodeList.length;
      
      data.push({
        topic,
        count: episodeList.length,
        totalListens,
        avgListens,
        episodes: episodeList.sort((a, b) => b.allTime - a.allTime),
      });
    });

    return data.sort((a, b) => b.totalListens - a.totalListens);
  }, [episodes]);

  const filteredTopics = useMemo(() => {
    return topicData.filter(topic => 
      topic.topic.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [topicData, searchTerm]);

  const selectedTopicData = useMemo(() => {
    return topicData.find(t => t.topic === selectedTopic);
  }, [topicData, selectedTopic]);

  const getTopicColor = (index: number) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-yellow-500', 'bg-indigo-500', 'bg-red-500', 'bg-teal-500',
      'bg-orange-500', 'bg-cyan-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Topic Analysis</h2>
        <p className="text-gray-600 mb-6">
          Explore topics discussed across {episodes.length} episodes. Topics are automatically extracted from episode titles.
        </p>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Topic Cloud */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
          <Tag className="w-6 h-6 text-primary-600" />
          <span>Topic Cloud</span>
        </h3>
        <div className="flex flex-wrap gap-3">
          {filteredTopics.slice(0, 50).map((topic) => {
            const size = Math.min(Math.max(topic.count / 2, 1), 4);
            const fontSize = `${0.875 + size * 0.25}rem`;
            
            return (
              <button
                key={topic.topic}
                onClick={() => setSelectedTopic(topic.topic)}
                className={`px-4 py-2 rounded-full font-semibold transition-all transform hover:scale-110 ${
                  selectedTopic === topic.topic
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{ fontSize }}
              >
                {topic.topic} ({topic.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Topics Table */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-primary-600" />
          <span>Top Topics by Total Listens</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Topic</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Episodes</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Listens</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg per Episode</th>
              </tr>
            </thead>
            <tbody>
              {filteredTopics.slice(0, 20).map((topic, index) => (
                <tr
                  key={topic.topic}
                  onClick={() => setSelectedTopic(topic.topic)}
                  className="border-b border-gray-100 hover:bg-primary-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className={`w-8 h-8 rounded-full ${getTopicColor(index)} flex items-center justify-center text-white font-bold text-sm`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-gray-800">{topic.topic}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">{topic.count}</td>
                  <td className="px-4 py-3 text-right font-semibold text-primary-600">
                    {formatNumber(topic.totalListens)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {formatNumber(topic.avgListens)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Topic Details */}
      {selectedTopicData && (
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold flex items-center space-x-2">
              <Tag className="w-8 h-8" />
              <span>{selectedTopicData.topic}</span>
            </h3>
            <button
              onClick={() => setSelectedTopic(null)}
              className="px-4 py-2 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-primary-100 text-sm">Episodes</p>
              <p className="text-3xl font-bold">{selectedTopicData.count}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-primary-100 text-sm">Total Listens</p>
              <p className="text-3xl font-bold">{formatNumber(selectedTopicData.totalListens)}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-primary-100 text-sm">Avg per Episode</p>
              <p className="text-3xl font-bold">{formatNumber(selectedTopicData.avgListens)}</p>
            </div>
          </div>

          <h4 className="text-lg font-bold mb-4">Top Episodes</h4>
          <div className="space-y-3">
            {selectedTopicData.episodes.slice(0, 5).map((episode, index) => (
              <div
                key={episode.slug}
                onClick={() => {
                  onEpisodeClick(episode);
                  setSelectedTopic(null);
                }}
                className="bg-white/10 rounded-lg p-4 hover:bg-white/20 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-primary-100 font-bold">#{index + 1}</span>
                      <h5 className="font-semibold">{episode.title}</h5>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-primary-100">Day 7</p>
                        <p className="font-semibold">{formatNumber(episode.day7)}</p>
                      </div>
                      <div>
                        <p className="text-primary-100">Day 30</p>
                        <p className="font-semibold">{formatNumber(episode.day30)}</p>
                      </div>
                      <div>
                        <p className="text-primary-100">All-Time</p>
                        <p className="font-bold">{formatNumber(episode.allTime)}</p>
                      </div>
                    </div>
                  </div>
                  <TrendingUp className="w-6 h-6 ml-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredTopics.length === 0 && (
        <div className="card text-center py-12">
          <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No topics found matching your search</p>
        </div>
      )}
    </div>
  );
}
