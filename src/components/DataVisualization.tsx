import { BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { DataRow, ColumnMeta } from '../types';

interface DataVisualizationProps {
  data: DataRow[];
  columns: Record<string, ColumnMeta>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function DataVisualization({ data, columns }: DataVisualizationProps) {
  const numericColumns = Object.entries(columns)
    .filter(([_, meta]) => meta.dataType === 'numeric')
    .map(([name]) => name);

  const categoricalColumns = Object.entries(columns)
    .filter(([_, meta]) => meta.dataType === 'categorical')
    .map(([name]) => name);

  const sampleData = data.slice(0, 100);

  const getDistributionData = (columnName: string) => {
    const values = data
      .map(row => parseFloat(row[columnName]))
      .filter(v => !isNaN(v))
      .sort((a, b) => a - b);

    const bins = 20;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binSize = (max - min) / bins;

    const distribution = Array.from({ length: bins }, (_, i) => {
      const binStart = min + i * binSize;
      const binEnd = binStart + binSize;
      const count = values.filter(v => v >= binStart && v < binEnd).length;
      return {
        range: `${binStart.toFixed(1)}`,
        count,
      };
    });

    return distribution;
  };

  const getCategoryDistribution = (columnName: string) => {
    const counts: Record<string, number> = {};
    data.forEach(row => {
      const value = row[columnName];
      if (value !== null && value !== undefined && value !== '') {
        counts[value] = (counts[value] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));
  };

  const getCorrelationData = () => {
    if (numericColumns.length < 2) return [];

    const col1 = numericColumns[0];
    const col2 = numericColumns[1];

    return sampleData
      .map(row => ({
        x: parseFloat(row[col1]),
        y: parseFloat(row[col2]),
      }))
      .filter(point => !isNaN(point.x) && !isNaN(point.y));
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Data Visualizations</h2>
        <p className="text-green-100">
          Interactive charts to explore your data patterns and distributions
        </p>
      </div>

      {numericColumns.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Numeric Distributions</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {numericColumns.slice(0, 4).map((col) => (
              <div key={col} className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">{col}</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={getDistributionData(col)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>
      )}

      {categoricalColumns.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Categorical Distributions</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {categoricalColumns.slice(0, 4).map((col) => (
              <div key={col} className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">{col} (Top 10)</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={getCategoryDistribution(col)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value">
                      {getCategoryDistribution(col).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>
      )}

      {numericColumns.length >= 2 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Correlation Analysis</h3>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              {numericColumns[0]} vs {numericColumns[1]}
            </h4>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" name={numericColumns[0]} />
                <YAxis dataKey="y" name={numericColumns[1]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={getCorrelationData()} fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {numericColumns.length > 0 && data.length > 1 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Trend Analysis</h3>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              {numericColumns[0]} Over Time
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sampleData.map((row, idx) => ({ index: idx, value: parseFloat(row[numericColumns[0]]) }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
