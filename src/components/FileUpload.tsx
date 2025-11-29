import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import Papa from 'papaparse';
import { DataRow } from '../types';

interface FileUploadProps {
  onDataLoaded: (data: DataRow[], filename: string) => void;
}

export default function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    setIsProcessing(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        onDataLoaded(results.data as DataRow[], file.name);
        setIsProcessing(false);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file');
        setIsProcessing(false);
      },
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Getting Started</h3>
        <p className="text-gray-700 mb-4">
          Upload your fiscal, economic, or demographic dataset (CSV format) to begin analysis.
          The system will automatically detect indicators relevant to SDG goals.
        </p>
        <div className="grid md:grid-cols-3 gap-3 text-sm">
          <div className="bg-white/80 rounded-lg p-3">
            <p className="font-semibold text-blue-900">Example Columns</p>
            <p className="text-gray-600 text-xs mt-1">GDP, Inflation, Poverty_Rate, Health_Expenditure</p>
          </div>
          <div className="bg-white/80 rounded-lg p-3">
            <p className="font-semibold text-blue-900">Supported Format</p>
            <p className="text-gray-600 text-xs mt-1">CSV files with headers</p>
          </div>
          <div className="bg-white/80 rounded-lg p-3">
            <p className="font-semibold text-blue-900">Max File Size</p>
            <p className="text-gray-600 text-xs mt-1">Up to 10MB</p>
          </div>
        </div>
      </div>

      <div
        className={`border-3 border-dashed rounded-xl p-16 text-center transition-all shadow-lg ${
          isDragging
            ? 'border-blue-500 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
        {isProcessing ? (
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <p className="text-lg font-semibold text-gray-700">Analyzing your dataset...</p>
            <p className="text-sm text-gray-500">This may take a moment</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              {isDragging ? (
                <FileText className="w-12 h-12 text-white" />
              ) : (
                <Upload className="w-12 h-12 text-white" />
              )}
          </div>

            <div>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                Drop your dataset here
              </p>
              <p className="text-gray-600">
                or click the button below to browse files
              </p>
            </div>

            <label className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 cursor-pointer transition-all shadow-lg hover:shadow-xl">
            Choose File
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
            />
            </label>

            <p className="text-sm text-gray-500">
              Supported format: CSV files with column headers
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
