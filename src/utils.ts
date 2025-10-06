import { Episode, EpisodeParseResult, EpisodesState } from './types';
import rawData from '../mergeconflict-metrics-20250930-2231.csv?raw';

// Constants
const STORAGE_KEY = 'podstats:episodesCsv';
const STORAGE_METADATA_KEY = 'podstats:episodesMetadata';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

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

// Expected CSV header formats (accept both variations)
const EXPECTED_HEADERS = [
  'Slug,Title,Published,Day 1,Day 7,Day 14,Day 30,Day 90,Spotify,All Time',
  'Slug,Title,Published,1 Day,7 Days,14 Days,30 Days,90 Days,Spotify,All Time'
];

export const parseEpisodesFromCsv = (csv: string): EpisodeParseResult => {
  const lines = csv.trim().split('\n');
  const episodes: Episode[] = [];
  const warnings: string[] = [];
  let skippedCount = 0;

  if (lines.length === 0) {
    warnings.push('CSV file is empty');
    return { episodes, skippedCount, warnings };
  }

  // Validate header (accept both common formats)
  const headerLine = lines[0].trim();
  const normalizedHeader = headerLine.replace(/["]/g, '').trim();
  
  const headerMatches = EXPECTED_HEADERS.some(expected => 
    normalizedHeader === expected.replace(/["]/g, '').trim()
  );
  
  if (!headerMatches) {
    warnings.push(`Header format not recognized. Expected one of: "${EXPECTED_HEADERS[0]}" or similar variations.`);
  }

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines
    
    const fields = parseCSVLine(line);
    
    if (fields.length < 10) {
      skippedCount++;
      if (import.meta.env.DEV) {
        console.warn(`Skipped row ${i + 1}: insufficient columns (${fields.length}/10)`);
      }
      continue;
    }

    const [slug, title, published, day1, day7, day14, day30, day90, spotify, allTime] = fields;
    
    // Validate required fields
    if (!slug || !title || !published) {
      skippedCount++;
      if (import.meta.env.DEV) {
        console.warn(`Skipped row ${i + 1}: missing required fields (slug, title, or published)`);
      }
      continue;
    }

    // Parse date and validate
    const parsedDate = parseDate(published);
    if (isNaN(parsedDate.getTime())) {
      skippedCount++;
      if (import.meta.env.DEV) {
        console.warn(`Skipped row ${i + 1}: invalid date "${published}"`);
      }
      continue;
    }

    episodes.push({
      slug: slug.trim(),
      title: title.trim(),
      published: parsedDate,
      day1: parseNumber(day1),
      day7: parseNumber(day7),
      day14: parseNumber(day14),
      day30: parseNumber(day30),
      day90: parseNumber(day90),
      spotify: parseNumber(spotify),
      allTime: parseNumber(allTime),
    });
  }

  if (skippedCount > 0) {
    warnings.push(`Skipped ${skippedCount} row(s) due to missing or invalid data`);
  }

  // Sort episodes descending by published date
  episodes.sort((a, b) => b.published.getTime() - a.published.getTime());

  return { episodes, skippedCount, warnings };
};

export const loadEpisodes = (): EpisodesState => {
  const result = parseEpisodesFromCsv(rawData);
  return {
    episodes: result.episodes,
    skippedCount: result.skippedCount,
    warnings: result.warnings,
    sourceLabel: 'Default Dataset',
  };
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

export const getTooltipStyle = (isDark: boolean): React.CSSProperties => {
  return {
    backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
    color: isDark ? '#f3f4f6' : '#111827'
  };
};

// Persistence helpers for localStorage
export const saveCsvToStorage = (csv: string, metadata: { sourceLabel: string; timestamp: number }): void => {
  try {
    localStorage.setItem(STORAGE_KEY, csv);
    localStorage.setItem(STORAGE_METADATA_KEY, JSON.stringify(metadata));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to save CSV to storage:', error);
    }
    throw new Error('Failed to save data. Storage quota may be exceeded.');
  }
};

export const loadCsvFromStorage = (): { csv: string; metadata: { sourceLabel: string; timestamp: number } } | null => {
  try {
    const csv = localStorage.getItem(STORAGE_KEY);
    const metadataStr = localStorage.getItem(STORAGE_METADATA_KEY);
    
    if (!csv || !metadataStr) {
      return null;
    }
    
    const metadata = JSON.parse(metadataStr);
    return { csv, metadata };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load CSV from storage:', error);
    }
    // Clear corrupted storage
    clearCsvFromStorage();
    return null;
  }
};

export const clearCsvFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_METADATA_KEY);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to clear CSV from storage:', error);
    }
  }
};

export const validateFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

export const getMaxFileSizeMB = (): number => {
  return MAX_FILE_SIZE / (1024 * 1024);
};
