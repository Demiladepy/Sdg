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
    <div
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Processing your data...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
            {isDragging ? (
              <FileText className="w-8 h-8 text-blue-600" />
            ) : (
              <Upload className="w-8 h-8 text-blue-600" />
            )}
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900 mb-1">
              Drop your CSV file here
            </p>
            <p className="text-sm text-gray-500">
              or click to browse
            </p>
          </div>

          <label className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 cursor-pointer transition-colors">
            Choose File
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>

          <p className="text-xs text-gray-400 mt-2">
            Supported format: CSV files only
          </p>
        </div>
      )}
    </div>
  );
}
