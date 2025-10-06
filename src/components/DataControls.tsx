import { useState, useRef } from 'react';
import { Upload, RotateCcw, AlertCircle, CheckCircle, Info } from 'lucide-react';
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
                  className="btn flex items-center space-x-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            <Info className="w-3 h-3 inline mr-1" />
            Maximum file size: {maxSizeMB} MB. Format: Slug, Title, Published, Day 1, Day 7, Day 14, Day 30, Day 90, Spotify, All Time
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
    </div>
  );
}
