import { Episode } from './types';
import rawData from '../mergeconflict-metrics-20250930-2231.csv?raw';

const parseNumber = (value: string): number => {
  if (!value || value === '–' || value === '-') return 0;
  return parseInt(value.replace(/,/g, ''), 10) || 0;
};

const parseDate = (dateStr: string): Date => {
  return new Date(dateStr);
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

export const loadEpisodes = (): Episode[] => {
  const lines = rawData.trim().split('\n');
  const episodes: Episode[] = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const fields = parseCSVLine(line);
    
    if (fields.length >= 10) {
      const [slug, title, published, day1, day7, day14, day30, day90, spotify, allTime] = fields;
      
      episodes.push({
        slug: slug.trim(),
        title: title.trim(),
        published: parseDate(published),
        day1: parseNumber(day1),
        day7: parseNumber(day7),
        day14: parseNumber(day14),
        day30: parseNumber(day30),
        day90: parseNumber(day90),
        spotify: parseNumber(spotify),
        allTime: parseNumber(allTime),
      });
    }
  }

  return episodes.sort((a, b) => b.published.getTime() - a.published.getTime());
};

export const extractTopics = (episodes: Episode[]): Map<string, Episode[]> => {
  const topics = new Map<string, Episode[]>();
  
  // Common tech topics and keywords to extract
  const keywords = [
    'AI', 'iOS', 'Android', 'macOS', 'Swift', 'Kotlin', 'C#', '.NET', 'MAUI',
    'Blazor', 'React', 'Azure', 'GitHub', 'VS Code', 'Xcode', 'Apple', 'Microsoft',
    'Google', 'Meta', 'Nintendo', 'Xbox', 'PlayStation', 'VR', 'AR', 'XR',
    'GPT', 'ChatGPT', 'Copilot', 'OpenAI', 'Machine Learning', 'ML',
    'Docker', 'Kubernetes', 'AWS', 'Cloud', 'API', 'REST', 'GraphQL',
    'Testing', 'CI/CD', 'DevOps', 'Security', 'Database', 'SQL',
    'Mobile', 'Web', 'Desktop', 'Watch', 'visionOS', 'watchOS', 'tvOS',
    'App', 'Development', 'Coding', 'Programming', 'Debug', 'Build'
  ];

  episodes.forEach(episode => {
    const title = episode.title.toLowerCase();
    
    keywords.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase();
      if (title.includes(lowerKeyword)) {
        if (!topics.has(keyword)) {
          topics.set(keyword, []);
        }
        topics.get(keyword)!.push(episode);
      }
    });
  });

  return topics;
};

export const calculateRetention = (episode: Episode): { day1: number; day7: number; day30: number } => {
  if (episode.allTime === 0) {
    return { day1: 0, day7: 0, day30: 0 };
  }

  return {
    day1: (episode.day1 / episode.allTime) * 100,
    day7: (episode.day7 / episode.allTime) * 100,
    day30: (episode.day30 / episode.allTime) * 100,
  };
};

export const getEpisodePerformance = (episode: Episode, avgAllTime: number): 'excellent' | 'good' | 'average' | 'below-average' => {
  const ratio = episode.allTime / avgAllTime;
  
  if (ratio >= 1.5) return 'excellent';
  if (ratio >= 1.1) return 'good';
  if (ratio >= 0.9) return 'average';
  return 'below-average';
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(Math.round(num));
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).format(date);
};
