import { FileText } from 'lucide-react';

export default function BlogPost() {
  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Complete Beginner's Guide to Vibe Coding an App in 5 Minutes
          </h1>
        </div>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-gray-600 dark:text-gray-400 italic mb-8">
            How I built a full-featured podcast analytics dashboard with GitHub Copilot without writing a single line of code myself
          </p>

          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🔗 Quick Links:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li><a href="https://jamesmontemagno.github.io/podstats/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">📊 Live Demo</a></li>
              <li><a href="https://github.com/jamesmontemagno/podstats" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">💻 Source Code</a></li>
              <li><a href="https://www.mergeconflict.fm/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">🎙️ Merge Conflict Podcast</a></li>
              <li><a href="https://github.com/features/copilot" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">🤖 GitHub Copilot</a></li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 mb-8">
            <p className="text-gray-700 dark:text-gray-300">
              📖 <strong>Full blog post available:</strong> Check out the complete{' '}
              <a 
                href="https://github.com/jamesmontemagno/podstats/blob/main/BLOG_POST.md" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
              >
                detailed write-up on GitHub
              </a>
              {' '}for the full story of how this was built, including code examples, architectural decisions, and lessons learned.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">The Story</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Picture this: It's September 30th, 2025, and I'm staring at a CSV file containing metrics from 492 episodes of my podcast, Merge Conflict. Years of data—listen counts, retention rates, performance metrics—all sitting there, waiting to tell a story.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            So I fired up VS Code with GitHub Copilot (using Sonnet 4.5 as my reasoning model) and decided to vibe code my way to a beautiful analytics platform.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            <strong>Time from prompt to running dashboard: 5 minutes.</strong>
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">What Got Built</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
            <li><strong>Dashboard:</strong> Key metrics, performance timeline, top episodes</li>
            <li><strong>Episode Search:</strong> Full-text search with filtering by performance metrics</li>
            <li><strong>Topic Analysis:</strong> AI-extracted topics from episode titles with performance tracking</li>
            <li><strong>Advanced Analytics:</strong> Retention curves, correlation charts, growth trends</li>
            <li><strong>Episode Details:</strong> Deep dive into individual episode performance</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">The Tech Stack</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            GitHub Copilot chose the entire stack based on my outcome-focused prompt:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
            <li>React + TypeScript for type-safe UI development</li>
            <li>Vite for lightning-fast builds</li>
            <li>Tailwind CSS for rapid styling</li>
            <li>Recharts for beautiful data visualization</li>
            <li>GitHub Actions for automated deployment to GitHub Pages</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Why Sonnet 4.5?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            I chose Sonnet 4.5 as my reasoning model in GitHub Copilot because this wasn't just about code completion—I needed deep architectural reasoning. Sonnet 4.5 excels at:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
            <li>Understanding complex requirements from natural language</li>
            <li>Making smart technology choices based on context</li>
            <li>Architecting entire systems, not just functions</li>
            <li>Anticipating edge cases (like CSV parsing challenges)</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Key Takeaways</h2>
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg p-6 mb-6">
            <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
              <li><strong>Outcome-focused prompts work best:</strong> Tell the AI what you want, not how to build it</li>
              <li><strong>Let AI make technical decisions:</strong> Trust the reasoning model to choose appropriate tools</li>
              <li><strong>Iterate on problems, not solutions:</strong> Describe symptoms, let AI find fixes</li>
              <li><strong>Ship fast, iterate faster:</strong> Get to production quickly, improve based on real use</li>
            </ol>
          </div>

          <div className="bg-gray-900 dark:bg-gray-800 text-white rounded-lg p-8 text-center mb-8">
            <p className="text-2xl font-bold mb-2">Time to code: 5 minutes</p>
            <p className="text-lg mb-2">Time to deploy: 10 minutes</p>
            <p className="text-xl font-semibold text-primary-400">Value delivered: Immeasurable</p>
          </div>

          <p className="text-center text-gray-600 dark:text-gray-400 text-lg italic">
            Now go build something. And when someone asks how you did it, just say: <strong>"I vibed it with Copilot."</strong> 🎵✨
          </p>
        </div>
      </div>
    </div>
  );
}
