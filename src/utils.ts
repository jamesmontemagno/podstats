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
  
  // Tech topics organized by priority (more specific topics first)
  // Higher priority keywords are matched first to ensure specific matches take precedence
  const keywords = [
    // Multi-word specific terms (highest priority)
    'Machine Learning', 'ChatGPT', 'GitHub Copilot', 'VS Code', 'GitHub Actions', 'CI/CD', 'GitHub Spark',
    // Platform-specific and branded terms
    'visionOS', 'watchOS', 'tvOS', 'macOS', 'iOS', 'Android', 'PlayStation', 'Xbox',
    // Technology names and frameworks
    '.NET MAUI', 'MAUI', '.NET', 'Blazor', 'React', 'Swift', 'Kotlin', 'C#', 'GraphQL', 'Docker', 'Kubernetes',
    // Services and platforms
    'Azure', 'AWS', 'OpenAI', 'GitHub', 'Xcode', 'Copilot',
    // Companies (medium priority)
    'Apple', 'Microsoft', 'Google', 'Meta', 'Nintendo',
    // Tech concepts (lower priority)
    'AI', 'ML', 'VR', 'AR', 'XR', 'API', 'REST', 'SQL',
    // General categories (lowest priority - only if no specific match)
    'Mobile', 'Web', 'Desktop', 'Cloud', 'Security', 'Database', 'DevOps',
  ];

  episodes.forEach(episode => {
    const title = episode.title;
    const matchedTopics: string[] = [];
    
    // Match keywords with word boundary awareness
    // Process in order so higher priority keywords are matched first
    for (const keyword of keywords) {
      // Create a regex pattern that matches the keyword with word boundaries
      // Handle special cases for keywords with dots or special characters
      let pattern: RegExp;
      
      if (keyword.includes('.') || keyword.includes('#')) {
        // For keywords with special chars like .NET or C#, use lookahead/lookbehind
        // to match non-alphanumeric boundaries
        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        pattern = new RegExp(`(?<![a-zA-Z0-9])${escapedKeyword}(?![a-zA-Z0-9])`, 'i');
      } else {
        // For regular keywords, use word boundaries
        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        pattern = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
      }
      
      if (pattern.test(title)) {
        const keywordLower = keyword.toLowerCase();
        
        // Check if we already have a match that would be redundant
        // For example, if we matched ".NET MAUI", don't also match "MAUI" or ".NET"
        const hasContainingMatch = matchedTopics.some(existing => 
          existing.toLowerCase().includes(keywordLower) && existing !== keyword
        );
        
        if (!hasContainingMatch) {
          // Remove any existing matches that are contained in the current keyword
          const indexesToRemove: number[] = [];
          matchedTopics.forEach((existing, index) => {
            if (keywordLower.includes(existing.toLowerCase()) && keyword !== existing) {
              indexesToRemove.push(index);
            }
          });
          
          // Remove in reverse order to maintain indices
          for (let i = indexesToRemove.length - 1; i >= 0; i--) {
            matchedTopics.splice(indexesToRemove[i], 1);
          }
          
          matchedTopics.push(keyword);
        }
      }
    }

    // Add episode to all matched topics
    for (const topic of matchedTopics) {
      if (!topics.has(topic)) {
        topics.set(topic, []);
      }
      topics.get(topic)!.push(episode);
    }
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
