import { FileText, ExternalLink } from 'lucide-react';

export default function BlogPost() {
  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Complete Beginner's Guide to Vibe Coding an App in 5 Minutes
            </h1>
          </div>
        </div>
        
        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 italic mb-6">
            How I built a full-featured podcast analytics dashboard with GitHub Copilot without writing a single line of code myself
          </p>

          {/* Quick Links */}
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 sm:p-6 mb-8 not-prose">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">🔗 Quick Links:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
              <li><a href="https://jamesmontemagno.github.io/podstats/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1">📊 Live Demo <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://github.com/jamesmontemagno/podstats" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1">💻 Source Code <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://www.mergeconflict.fm/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1">🎙️ Merge Conflict Podcast <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://github.com/features/copilot" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1">🤖 GitHub Copilot <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>

          {/* The Story */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">The Vibe: "I Have Data, Now What?"</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Picture this: It's September 30th, 2025, and I'm staring at a CSV file containing metrics from 492 episodes of my podcast, <a href="https://www.mergeconflict.fm/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Merge Conflict</a>. Years of data—listen counts, retention rates, performance metrics—all sitting there, waiting to tell a story.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            So I did what any modern developer would do: I opened <a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">VS Code</a>, fired up <a href="https://github.com/features/copilot" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">GitHub Copilot</a> with Sonnet 4.5 as my reasoning model, and decided to <strong>vibe code</strong> my way to a beautiful analytics platform.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            <strong className="text-primary-600 dark:text-primary-400">Time from prompt to running dashboard: 5 minutes.</strong>
          </p>

          {/* The Opening Prompt */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">The Opening Prompt: Dream Big, Start Simple</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Here's literally what I typed into GitHub Copilot:
          </p>
          <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-700 dark:text-gray-300 mb-4 bg-gray-50 dark:bg-gray-800/50 py-3 rounded-r">
            "In the attached file is all of our podcast metrics for every episode. Create a beautiful website that helps visualize, search, finds topics, and more. Come up with a bunch of ideas for what a podcast creator would want and build it out. Use a vite based app that i can use and publish on github pages."
          </blockquote>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            That's it. No technical specs. No wireframes. No "please use React 18.2 with TypeScript 5.3 and Tailwind 3.4." Just pure <strong>vibes</strong>.
          </p>

          {/* Why Sonnet 4.5 */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">Why Sonnet 4.5?</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            I chose Sonnet 4.5 as my reasoning model in GitHub Copilot because this wasn't just about code completion—I needed <strong>deep architectural reasoning</strong>. Sonnet 4.5 excels at:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6 pl-4">
            <li>Understanding complex requirements from natural language</li>
            <li>Making smart technology choices based on context</li>
            <li>Architecting entire systems, not just functions</li>
            <li>Anticipating edge cases (like the CSV parsing issue we'll see later)</li>
          </ul>

          {/* Tech Stack */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">The Tech Stack</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            GitHub Copilot (powered by Sonnet 4.5) filled in all the technical decisions. It chose:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6 pl-4">
            <li><a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">React</a> + <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">TypeScript</a> (type safety + modern UI)</li>
            <li><a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Tailwind CSS</a> (rapid styling)</li>
            <li><a href="https://recharts.org/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Recharts</a> (beautiful data visualization)</li>
            <li><a href="https://lucide.dev/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Lucide React</a> (clean icons)</li>
          </ul>

          {/* Type Interface Example */}
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 mb-6 overflow-x-auto">
            <pre className="text-sm text-gray-100"><code>{`export interface Episode {
  slug: string;
  title: string;
  published: Date;
  day1: number;
  day7: number;
  day14: number;
  day30: number;
  day90: number;
  spotify: number;
  allTime: number;
}`}</code></pre>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Clean. Simple. Exactly what I needed.</p>

          {/* CSV Parsing Bug */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">The First Bug: CSV Parsing Drama</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            I ran <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">npm run dev</code>, opened the browser, and... the numbers looked wrong. Way wrong.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            My CSV had entries like:
          </p>
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm text-gray-100"><code>{`477,"477: From Spark, To Blazor, To Mobile, To Production in 1 Day",2025-08-25,"1,781"`}</code></pre>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The original regex parser choked on commas inside quoted fields. I typed into Copilot Chat:
          </p>
          <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-700 dark:text-gray-300 mb-4 bg-gray-50 dark:bg-gray-800/50 py-3 rounded-r">
            "double check the CSV parsing, doesn't seem correct here as the numbers aren't accurate"
          </blockquote>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            GitHub Copilot immediately understood and rewrote the parser:
          </p>
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 mb-6 overflow-x-auto">
            <pre className="text-sm text-gray-100"><code>{`const parseCSVLine = (line: string): string[] => {
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
};`}</code></pre>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            <strong>This is the beauty of vibe coding</strong>: I didn't need to know how to write a CSV parser. I just needed to recognize that the output was wrong. The AI handled the implementation.
          </p>

          {/* What Got Built */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">What I Actually Built</h2>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-3">1. Dashboard with Smart Analytics</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6 pl-4">
            <li>Total episodes, listens, averages, growth rates</li>
            <li>Performance timeline with Recharts</li>
            <li>Top 10 episodes ranked by performance</li>
            <li>Best episode spotlight</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-3">2. Topic Analysis with AI Extraction</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The AI extracted topics from episode titles:
          </p>
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 mb-6 overflow-x-auto">
            <pre className="text-sm text-gray-100"><code>{`export const extractTopics = (episodes: Episode[]): Map<string, Episode[]> => {
  const topics = new Map<string, Episode[]>();
  
  const keywords = [
    'AI', 'iOS', 'Android', 'macOS', 'Swift', 'Kotlin', 
    'C#', '.NET', 'MAUI', 'Blazor', 'React', 'Azure',
    // ... and 30+ more
  ];

  episodes.forEach(episode => {
    const title = episode.title.toLowerCase();
    keywords.forEach(keyword => {
      if (title.includes(keyword.toLowerCase())) {
        if (!topics.has(keyword)) {
          topics.set(keyword, []);
        }
        topics.get(keyword)!.push(episode);
      }
    });
  });

  return topics;
};`}</code></pre>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-3">3. Retention Analysis</h3>
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 mb-6 overflow-x-auto">
            <pre className="text-sm text-gray-100"><code>{`export const calculateRetention = (episode: Episode) => {
  if (episode.allTime === 0) {
    return { day1: 0, day7: 0, day30: 0 };
  }

  return {
    day1: (episode.day1 / episode.allTime) * 100,
    day7: (episode.day7 / episode.allTime) * 100,
    day30: (episode.day30 / episode.allTime) * 100,
  };
};`}</code></pre>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            I can now see that on average: ~58% of all-time listens happen in day 1, ~85% in week 1, ~92% in month 1. <strong>That's actionable insight I didn't have before.</strong>
          </p>

          {/* The Vibe Coding Methodology */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">The Vibe Coding Methodology</h2>
          
          <div className="space-y-4 mb-6">
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">1. Outcome-Driven Prompts</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">Don't say: "Create a React component with props for data"<br />Say: "Build a dashboard showing my podcast metrics"</p>
            </div>
            
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">2. Let AI Make Technical Decisions</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">The AI chose component architecture, state management patterns, styling approach, chart library, and build tooling. All good choices.</p>
            </div>
            
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">3. Iterate on Bugs, Not Features</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">Describe the symptom: "numbers aren't accurate" → Fixed CSV parser<br />"build fails with errors" → Cleaned up imports</p>
            </div>
            
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">4. Ship Fast, Iterate Faster</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">Get to production quickly, improve based on real use</p>
            </div>
          </div>

          {/* Results Timeline */}
          <div className="bg-gray-900 dark:bg-gray-950 text-white rounded-lg p-6 text-center mb-8 not-prose">
            <h3 className="text-xl font-bold mb-4">The Results: 5 Minutes to Production</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-primary-400 font-bold text-2xl">5 min</p>
                <p className="text-gray-300">Time to code</p>
              </div>
              <div>
                <p className="text-primary-400 font-bold text-2xl">10 min</p>
                <p className="text-gray-300">Time to deploy</p>
              </div>
              <div>
                <p className="text-primary-400 font-bold text-2xl">∞</p>
                <p className="text-gray-300">Value delivered</p>
              </div>
            </div>
          </div>

          {/* Try It Yourself */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Try It Yourself</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Want to vibe code your own project? Here's the recipe:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6 pl-4">
            <li>Start with <a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">VS Code</a> + <a href="https://github.com/features/copilot" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">GitHub Copilot</a> (choose Sonnet 4.5 for complex projects)</li>
            <li>Write an outcome-focused prompt: "Build me X that does Y"</li>
            <li>Let Copilot make technical choices: Don't over-specify unless you have strong opinions</li>
            <li>Iterate on problems, not solutions: Describe what's wrong, let Copilot fix it</li>
            <li>Ship fast, iterate faster: Get to production quickly, improve based on real use</li>
          </ol>

          {/* Final Quote */}
          <div className="border-l-4 border-primary-500 pl-6 my-8">
            <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-2">
              "I didn't avoid learning. I avoided re-learning things I already know. But why spend an hour doing what AI can do in seconds?"
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">— The Vibe Coding Philosophy</p>
          </div>

          {/* Resources */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 not-prose">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📦 Resources</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> VS Code
              </a>
              <a href="https://github.com/features/copilot" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> GitHub Copilot
              </a>
              <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> Vite
              </a>
              <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> React
              </a>
              <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> TypeScript
              </a>
              <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> Tailwind CSS
              </a>
              <a href="https://recharts.org/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> Recharts
              </a>
              <a href="https://github.com/jamesmontemagno/podstats" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> Full Source Code
              </a>
            </div>
          </div>

          {/* Closing */}
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg italic mt-8">
            Now go build something. And when someone asks how you did it, just say: <br />
            <strong className="text-primary-600 dark:text-primary-400">"I vibed it with Copilot."</strong> 🎵✨
          </p>
        </div>
      </div>
    </div>
  );
}
