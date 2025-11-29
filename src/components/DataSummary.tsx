import { BarChart3, Database, AlertCircle, CheckCircle, Activity } from 'lucide-react';
import { ColumnMeta } from '../types';

interface DataSummaryProps {
  rowCount: number;
  columnCount: number;
  columns: Record<string, ColumnMeta>;
}

export default function DataSummary({ rowCount, columnCount, columns }: DataSummaryProps) {
  const columnArray = Object.entries(columns).map(([name, meta]) => ({ name, ...meta }));
  const totalNulls = columnArray.reduce((sum, col) => sum + col.nullCount, 0);
  const totalOutliers = columnArray.reduce((sum, col) => sum + (col.outlierCount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-8 text-white shadow-xl mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Dataset Overview</h2>
        </div>
        <p className="text-slate-300 text-lg">
          Comprehensive statistical analysis of your fiscal and economic indicators
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Rows</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{rowCount.toLocaleString()}</p>
            </div>
            <Database className="w-10 h-10 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Columns</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{columnCount}</p>
            </div>
            <BarChart3 className="w-10 h-10 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Missing Values</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">{totalNulls.toLocaleString()}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-orange-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Outliers</p>
              <p className="text-3xl font-bold text-red-900 mt-1">{totalOutliers.toLocaleString()}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-red-600 opacity-50" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Detailed Column Analysis</h3>
          <p className="text-sm text-gray-600 mt-1">Statistical breakdown by variable</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Column Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unique Values
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Missing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Outliers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {columnArray.map((col) => (
                <tr key={col.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {col.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        col.dataType === 'numeric'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {col.dataType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {col.uniqueCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {col.nullCount > 0 ? (
                      <span className="text-orange-600 font-medium">
                        {col.nullCount} ({col.nullPercentage}%)
                      </span>
                    ) : (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        None
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {col.outlierCount !== undefined && col.outlierCount > 0 ? (
                      <span className="text-red-600 font-medium">{col.outlierCount}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {col.dataType === 'numeric' && col.mean !== undefined ? (
                      <div className="space-y-1">
                        <div className="flex gap-2">
                          <span className="text-gray-400">Mean:</span>
                          <span className="font-medium">{col.mean.toFixed(2)}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-gray-400">Range:</span>
                          <span className="font-medium">
                            {col.min?.toFixed(2)} - {col.max?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
