# Merge Conflict Podcast Analytics

A beautiful, interactive analytics dashboard for the Merge Conflict podcast, showcasing episode performance metrics, trends, and insights.

## 🎯 Features

### 📊 Dashboard
- **Key Metrics Overview**: Total episodes, total listens, averages, and growth rates
- **Performance Timeline**: Visual representation of recent episode performance
- **Top Episodes**: Ranked list of best-performing episodes
- **Best Episode Highlight**: Detailed view of the highest-performing episode
- **CSV Upload**: Upload your own podcast metrics CSV to analyze custom data (persists in browser storage)

### 🔍 Episode Search & Filter
- **Full-text Search**: Find episodes by title or slug
- **Performance Filters**: Filter by minimum/maximum listens
- **Multiple Sort Options**: Sort by date, all-time listens, day 1, day 7, etc.
- **Performance Badges**: Visual indicators for episode performance (excellent, good, average, below-average)

### 🏷️ Topic Analysis
- **Automatic Topic Extraction**: Identifies topics from episode titles
- **Interactive Topic Cloud**: Visual representation of topic frequency
- **Topic Rankings**: See which topics perform best
- **Topic Deep Dive**: Click any topic to see related episodes and metrics

### 📈 Advanced Analytics
- **Monthly Performance Trends**: Track performance over time
- **Performance Distribution**: See how episodes are distributed across performance ranges
- **Retention Analysis**: Understand listening patterns (Day 1, 7, 30 retention)
- **Correlation Charts**: Day 1 vs All-Time performance correlation
- **Growth Trends**: Recent 100 episodes performance tracking

### 📱 Episode Details
- **Individual Episode View**: Detailed metrics for any episode
- **Performance Timeline**: Visual breakdown of listening growth
- **Retention Metrics**: Percentage of all-time listens at different milestones
- **Comparison**: See how an episode compares to nearby episodes
- **Ranking**: Know exactly where each episode ranks

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/podstats.git
cd podstats
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## 📦 Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🌐 Deploying to GitHub Pages

1. Update the `base` path in `vite.config.ts` to match your repository name:
```typescript
export default defineConfig({
  base: '/your-repo-name/',
})
```

2. Deploy:
```bash
npm run deploy
```

This will build the project and push to the `gh-pages` branch.

3. Enable GitHub Pages in your repository settings:
   - Go to Settings > Pages
   - Source: Deploy from a branch
   - Branch: gh-pages / root

## 🛠️ Technologies Used

- **React 18**: Modern UI framework
- **TypeScript**: Type-safe development
- **Vite**: Lightning-fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Beautiful, composable charting library
- **Lucide React**: Clean, consistent icon set
- **date-fns**: Modern JavaScript date utility library

## 📊 Data Format

The application expects a CSV file with the following columns:
- `Slug`: Episode identifier
- `Title`: Episode title
- `Published`: Publication date (YYYY-MM-DD)
- `Day 1` (or `1 Day`), `Day 7` (or `7 Days`), `Day 14` (or `14 Days`), `Day 30` (or `30 Days`), `Day 90` (or `90 Days`): Listen counts at various intervals
- `Spotify`: Spotify-specific listens
- `All Time`: Total listens

### Uploading Custom Data

You can upload your own CSV file directly in the dashboard:

1. Click the **Dashboard** tab
2. In the **Data Controls** section at the top, click **Choose File**
3. Select your CSV file (max 5 MB)
4. Click **Import**

Your uploaded data will be saved in your browser's local storage and persist across page reloads. Click **Reset** to restore the default dataset.

## 🎨 Key Features for Podcast Creators

1. **Performance Tracking**: Understand which episodes resonate with your audience
2. **Topic Insights**: Discover which topics generate the most interest
3. **Growth Monitoring**: Track your podcast's growth over time
4. **Retention Analysis**: Understand listener behavior patterns
5. **Custom Data Analysis**: Upload your own podcast metrics for personalized insights
5. **Comparative Analysis**: See how episodes perform relative to each other
6. **Search & Filter**: Quickly find specific episodes or performance ranges
7. **Visual Analytics**: Beautiful charts and graphs for presentations

## 📝 License

MIT License - feel free to use this for your own podcast analytics!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 💡 Ideas for Future Enhancements

- Export data to CSV/PDF
- Social media sharing of episode stats
- A/B testing insights
- Seasonal trend analysis
- Guest appearance tracking
- Episode length correlation analysis
- Listener demographics (if data available)
- Predicted performance for new episodes
- Integration with podcast hosting platforms

---

Built with ❤️ for podcast creators
