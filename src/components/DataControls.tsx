import { useState, useRef } from 'react';
import { Upload, RotateCcw, AlertCircle, CheckCircle, Info, HelpCircle, X } from 'lucide-react';
import { validateFileSize, getMaxFileSizeMB } from '../utils';
import { EpisodesState } from '../types';

interface DataControlsProps {
  episodesState: EpisodesState;
  onImport: (file: File) => Promise<void>;
  onReset: () => void;
}

export default function DataControls({ episodesState, onImport, onReset }: DataControlsProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate file type by extension and MIME type
    const isCSV = file.name.toLowerCase().endsWith('.csv') || 
                  file.type === 'text/csv' || 
                  file.type === 'application/csv' ||
                  file.type === 'text/plain';
    
    if (!isCSV) {
      setError('Please select a CSV file');
      setSelectedFile(null);
      return;
    }

    if (!validateFileSize(file)) {
      setError(`File size exceeds ${getMaxFileSizeMB()} MB limit`);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      await onImport(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onReset();
  };

  const isDefaultDataset = episodesState.sourceLabel === 'Default Dataset';
  const maxSizeMB = getMaxFileSizeMB();

  return (
    <div className="card mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Data Controls</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Upload your own CSV file to analyze custom podcast metrics
          </p>
        </div>
        <button
          onClick={() => setShowFaq(true)}
          className="flex items-center space-x-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
        >
          <HelpCircle className="w-4 h-4" />
          <span>CSV Format</span>
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Dataset</div>
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate" title={episodesState.sourceLabel}>
            {episodesState.sourceLabel}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Episodes Loaded</div>
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {episodesState.episodes.length.toLocaleString()}
          </div>
        </div>
        {episodesState.lastImportTimestamp && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Import</div>
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {new Date(episodesState.lastImportTimestamp).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Warnings */}
      {episodesState.warnings.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                Import Warnings
              </div>
              <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                {episodesState.warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700 dark:text-red-400">{error}</div>
          </div>
        </div>
      )}

      {/* File Input and Actions */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload CSV File
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={isProcessing}
                className="block w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900 dark:file:text-primary-300 dark:hover:file:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleImport}
                disabled={!selectedFile || isProcessing}
                className="btn btn-primary flex items-center space-x-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4" />
                <span>{isProcessing ? 'Importing...' : 'Import'}</span>
              </button>
              {!isDefaultDataset && (
                <button
                  onClick={handleReset}
                  disabled={isProcessing}
                  className="btn btn-secondary flex items-center space-x-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            <Info className="w-3 h-3 inline mr-1" />
            Maximum file size: {maxSizeMB} MB. Default format from fireside.fm. <button
              onClick={() => setShowFaq(true)}
              className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              See format details
            </button>
          </p>
        </div>

        {/* Success Message for Selected File */}
        {selectedFile && !error && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-700 dark:text-green-400">
                File selected: <span className="font-medium">{selectedFile.name}</span> ({(selectedFile.size / 1024).toFixed(1)} KB)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FAQ Modal */}
      {showFaq && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">CSV Format Guide</h3>
              <button
                onClick={() => setShowFaq(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Default Format (fireside.fm)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  This tool uses the standard CSV export format from fireside.fm podcast hosting. The expected columns are:
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-sm font-mono overflow-x-auto">
                  <div className="text-gray-800 dark:text-gray-200">
                    Slug, Title, Published, Day 1, Day 7, Day 14, Day 30, Day 90, Spotify, All Time
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Column Descriptions</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><strong>Slug:</strong> Episode identifier (e.g., "episode-123")</li>
                  <li><strong>Title:</strong> Episode title</li>
                  <li><strong>Published:</strong> Publication date (YYYY-MM-DD format)</li>
                  <li><strong>Day 1:</strong> Downloads in first 24 hours</li>
                  <li><strong>Day 7:</strong> Downloads in first 7 days</li>
                  <li><strong>Day 14:</strong> Downloads in first 14 days</li>
                  <li><strong>Day 30:</strong> Downloads in first 30 days</li>
                  <li><strong>Day 90:</strong> Downloads in first 90 days</li>
                  <li><strong>Spotify:</strong> Spotify-specific downloads</li>
                  <li><strong>All Time:</strong> Total downloads to date</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Alternative Formats</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The parser also accepts alternative column names like "1 Day" instead of "Day 1", and will ignore extra columns. Missing columns will be filled with zeros.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">File Requirements</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• File must be in CSV format (.csv extension)</li>
                  <li>• Maximum file size: {maxSizeMB} MB</li>
                  <li>• First row should contain column headers</li>
                  <li>• Numeric columns should contain numbers only (commas will be stripped)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
