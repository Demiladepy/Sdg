import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CleaningOptions {
  handleMissing?: 'drop' | 'fillMean' | 'fillMedian' | 'fillMode' | 'fillZero';
  removeDuplicates?: boolean;
  handleOutliers?: 'remove' | 'cap' | 'none';
  outlierThreshold?: number;
}

function calculateStats(values: number[]) {
  const sorted = values.slice().sort((a, b) => a - b);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  
  return { mean, median, q1, q3, iqr };
}

function isNumeric(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

function cleanData(data: any[], options: CleaningOptions) {
  let cleaned = [...data];
  const columnNames = Object.keys(data[0] || {});
  const stats: any = {};
  
  columnNames.forEach(col => {
    const numericValues = cleaned
      .map(row => row[col])
      .filter(val => val !== null && val !== undefined && val !== '' && isNumeric(val))
      .map(val => parseFloat(val));
    
    if (numericValues.length > 0) {
      stats[col] = calculateStats(numericValues);
    }
  });
  
  if (options.handleMissing && options.handleMissing !== 'drop') {
    cleaned = cleaned.map(row => {
      const newRow = { ...row };
      columnNames.forEach(col => {
        if (row[col] === null || row[col] === undefined || row[col] === '') {
          if (stats[col]) {
            switch (options.handleMissing) {
              case 'fillMean':
                newRow[col] = stats[col].mean;
                break;
              case 'fillMedian':
                newRow[col] = stats[col].median;
                break;
              case 'fillZero':
                newRow[col] = 0;
                break;
              case 'fillMode':
                newRow[col] = stats[col].median;
                break;
            }
          }
        }
      });
      return newRow;
    });
  } else if (options.handleMissing === 'drop') {
    cleaned = cleaned.filter(row => {
      return columnNames.every(col => row[col] !== null && row[col] !== undefined && row[col] !== '');
    });
  }
  
  if (options.removeDuplicates) {
    const seen = new Set();
    cleaned = cleaned.filter(row => {
      const key = JSON.stringify(row);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  
  if (options.handleOutliers && options.handleOutliers !== 'none') {
    const threshold = options.outlierThreshold || 1.5;
    
    cleaned = cleaned.filter(row => {
      return columnNames.every(col => {
        const value = row[col];
        if (!isNumeric(value) || !stats[col]) return true;
        
        const numVal = parseFloat(value);
        const { q1, q3, iqr } = stats[col];
        const lowerBound = q1 - threshold * iqr;
        const upperBound = q3 + threshold * iqr;
        
        if (options.handleOutliers === 'remove') {
          return numVal >= lowerBound && numVal <= upperBound;
        } else if (options.handleOutliers === 'cap') {
          if (numVal < lowerBound) row[col] = lowerBound;
          if (numVal > upperBound) row[col] = upperBound;
          return true;
        }
        return true;
      });
    });
  }
  
  return { cleaned, stats, originalCount: data.length, cleanedCount: cleaned.length };
}

function analyzeData(data: any[]) {
  if (!data || data.length === 0) {
    return { error: 'No data provided' };
  }
  
  const columnNames = Object.keys(data[0]);
  const analysis: any = {
    rowCount: data.length,
    columnCount: columnNames.length,
    columns: {},
  };
  
  columnNames.forEach(col => {
    const values = data.map(row => row[col]);
    const nullCount = values.filter(v => v === null || v === undefined || v === '').length;
    const uniqueValues = new Set(values.filter(v => v !== null && v !== undefined && v !== ''));
    
    const numericValues = values
      .filter(v => v !== null && v !== undefined && v !== '' && isNumeric(v))
      .map(v => parseFloat(v));
    
    const columnInfo: any = {
      nullCount,
      nullPercentage: (nullCount / data.length * 100).toFixed(2),
      uniqueCount: uniqueValues.size,
      dataType: numericValues.length > data.length * 0.5 ? 'numeric' : 'categorical',
    };
    
    if (columnInfo.dataType === 'numeric' && numericValues.length > 0) {
      const stats = calculateStats(numericValues);
      columnInfo.min = Math.min(...numericValues);
      columnInfo.max = Math.max(...numericValues);
      columnInfo.mean = stats.mean;
      columnInfo.median = stats.median;
      columnInfo.q1 = stats.q1;
      columnInfo.q3 = stats.q3;
      
      const potentialOutliers = numericValues.filter(v => {
        const lowerBound = stats.q1 - 1.5 * stats.iqr;
        const upperBound = stats.q3 + 1.5 * stats.iqr;
        return v < lowerBound || v > upperBound;
      });
      columnInfo.outlierCount = potentialOutliers.length;
    }
    
    analysis.columns[col] = columnInfo;
  });
  
  return analysis;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'analyze';
    const body = await req.json();
    
    let result;
    
    if (action === 'analyze') {
      result = analyzeData(body.data);
    } else if (action === 'clean') {
      result = cleanData(body.data, body.options || {});
    } else {
      throw new Error(`Unknown action: ${action}`);
    }
    
    return new Response(
      JSON.stringify(result),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});