import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { CleaningOptions, DataRow } from '../types';

interface DataCleaningProps {
  onClean: (options: CleaningOptions) => Promise<void>;
  isProcessing: boolean;
  originalCount: number;
  cleanedCount?: number;
}

export default function DataCleaning({
  onClean,
  isProcessing,
  originalCount,
  cleanedCount,
}: DataCleaningProps) {
  const [options, setOptions] = useState<CleaningOptions>({
    handleMissing: 'fillMedian',
    removeDuplicates: true,
    handleOutliers: 'cap',
    outlierThreshold: 1.5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClean(options);
  };

  const rowsRemoved = cleanedCount !== undefined ? originalCount - cleanedCount : 0;
  const removalPercentage =
    cleanedCount !== undefined ? ((rowsRemoved / originalCount) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Data Quality Enhancement</h2>
        </div>
        <p className="text-purple-100 text-lg">
          Configure intelligent cleaning strategies to ensure data integrity and reliability
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8 space-y-8 shadow-lg">
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-4">
            Missing Value Strategy
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: 'drop', label: 'Drop Rows', desc: 'Remove rows with missing values' },
              { value: 'fillMean', label: 'Fill with Mean', desc: 'For numeric columns' },
              { value: 'fillMedian', label: 'Fill with Median', desc: 'Recommended for skewed data' },
              { value: 'fillMode', label: 'Fill with Mode', desc: 'Most frequent value' },
              { value: 'fillZero', label: 'Fill with Zero', desc: 'Replace with 0' },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  options.handleMissing === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="handleMissing"
                  value={option.value}
                  checked={options.handleMissing === option.value}
                  onChange={(e) =>
                    setOptions({ ...options, handleMissing: e.target.value as any })
                  }
                  className="mt-1"
                />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{option.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{option.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={options.removeDuplicates}
              onChange={(e) =>
                setOptions({ ...options, removeDuplicates: e.target.checked })
              }
              className="w-5 h-5"
            />
            <div>
              <p className="font-medium text-gray-900">Remove Duplicate Rows</p>
              <p className="text-sm text-gray-500">Keep only unique records</p>
            </div>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Handle Outliers
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: 'none', label: 'Keep All', desc: 'No outlier handling' },
              { value: 'cap', label: 'Cap Values', desc: 'Limit to bounds' },
              { value: 'remove', label: 'Remove Rows', desc: 'Drop outlier rows' },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  options.handleOutliers === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="handleOutliers"
                  value={option.value}
                  checked={options.handleOutliers === option.value}
                  onChange={(e) =>
                    setOptions({ ...options, handleOutliers: e.target.value as any })
                  }
                  className="mt-1"
                />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{option.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{option.desc}</p>
                </div>
              </label>
            ))}
          </div>

          {options.handleOutliers !== 'none' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IQR Multiplier: {options.outlierThreshold}
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={options.outlierThreshold}
                onChange={(e) =>
                  setOptions({ ...options, outlierThreshold: parseFloat(e.target.value) })
                }
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Higher values = more lenient outlier detection
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-4 px-6 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Cleaning Data...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Clean Data
            </>
          )}
        </button>
      </form>

      {cleanedCount !== undefined && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-green-900 mb-6">Cleaning Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-green-700 mb-1">Original Rows</p>
              <p className="text-2xl font-bold text-green-900">{originalCount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-green-700 mb-1">Cleaned Rows</p>
              <p className="text-2xl font-bold text-green-900">{cleanedCount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-green-700 mb-1">Rows Removed</p>
              <p className="text-2xl font-bold text-green-900">
                {rowsRemoved.toLocaleString()} ({removalPercentage}%)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
