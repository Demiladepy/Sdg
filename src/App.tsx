import { useState } from 'react';
import { Sparkles, BarChart3, Database, Download } from 'lucide-react';
import FileUpload from './components/FileUpload';
import DataSummary from './components/DataSummary';
import DataCleaning from './components/DataCleaning';
import DataVisualization from './components/DataVisualization';
import DataTable from './components/DataTable';
import { supabase } from './lib/supabase';
import { DataRow, CleaningOptions, ColumnMeta } from './types';

type Tab = 'upload' | 'summary' | 'clean' | 'visualize' | 'preview';

function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('upload');
  const [originalData, setOriginalData] = useState<DataRow[]>([]);
  const [cleanedData, setCleanedData] = useState<DataRow[] | null>(null);
  const [filename, setFilename] = useState<string>('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDataLoaded = async (data: DataRow[], fname: string) => {
    setOriginalData(data);
    setFilename(fname);
    setCleanedData(null);
    setIsProcessing(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(
        `${supabaseUrl}/functions/v1/data-processor?action=analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ data }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to analyze data');
      }

      const analysisResult = await response.json();
      setAnalysis(analysisResult);

      const { error } = await supabase.from('datasets').insert({
        name: fname.replace('.csv', ''),
        filename: fname,
        row_count: analysisResult.rowCount,
        column_count: analysisResult.columnCount,
        columns_meta: analysisResult.columns,
      });

      if (error) {
        console.error('Error saving dataset:', error);
      }

      setCurrentTab('summary');
    } catch (error) {
      console.error('Error processing data:', error);
      alert('Error processing data. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClean = async (options: CleaningOptions) => {
    setIsProcessing(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(
        `${supabaseUrl}/functions/v1/data-processor?action=clean`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ data: originalData, options }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to clean data');
      }

      const result = await response.json();
      setCleanedData(result.cleaned);

      const analysisResponse = await fetch(
        `${supabaseUrl}/functions/v1/data-processor?action=analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ data: result.cleaned }),
        }
      );

      if (analysisResponse.ok) {
        const newAnalysis = await analysisResponse.json();
        setAnalysis(newAnalysis);
      }
    } catch (error) {
      console.error('Error cleaning data:', error);
      alert('Error cleaning data. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const currentData = cleanedData || originalData;
  const hasData = originalData.length > 0;

  const tabs = [
    { id: 'upload' as Tab, label: 'Upload', icon: Database, disabled: false },
    { id: 'summary' as Tab, label: 'Summary', icon: BarChart3, disabled: !hasData },
    { id: 'clean' as Tab, label: 'Clean Data', icon: Sparkles, disabled: !hasData },
    { id: 'visualize' as Tab, label: 'Visualize', icon: BarChart3, disabled: !hasData },
    { id: 'preview' as Tab, label: 'Preview & Export', icon: Download, disabled: !hasData },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Data Analysis Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Upload, clean, visualize, and export your datasets with professional tools
          </p>
          {filename && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <Database className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">{filename}</span>
              <span className="text-blue-600">
                ({originalData.length.toLocaleString()} rows)
              </span>
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setCurrentTab(tab.id)}
                  disabled={tab.disabled}
                  className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-all whitespace-nowrap ${
                    currentTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : tab.disabled
                      ? 'border-transparent text-gray-400 cursor-not-allowed'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          {currentTab === 'upload' && (
            <FileUpload onDataLoaded={handleDataLoaded} />
          )}

          {currentTab === 'summary' && analysis && (
            <DataSummary
              rowCount={analysis.rowCount}
              columnCount={analysis.columnCount}
              columns={analysis.columns}
            />
          )}

          {currentTab === 'clean' && (
            <DataCleaning
              onClean={handleClean}
              isProcessing={isProcessing}
              originalCount={originalData.length}
              cleanedCount={cleanedData?.length}
            />
          )}

          {currentTab === 'visualize' && analysis && (
            <DataVisualization data={currentData} columns={analysis.columns} />
          )}

          {currentTab === 'preview' && (
            <div className="space-y-6">
              {cleanedData && (
                <DataTable data={cleanedData} title="Cleaned Data" />
              )}
              <DataTable data={originalData} title="Original Data" />
            </div>
          )}
        </div>

        {isProcessing && currentTab !== 'clean' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
              <p className="text-lg font-medium text-gray-900">Processing your data...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
