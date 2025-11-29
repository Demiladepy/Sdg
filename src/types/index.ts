export interface Dataset {
  id: string;
  name: string;
  filename: string;
  row_count: number;
  column_count: number;
  columns_meta: ColumnMeta[];
  created_at: string;
  updated_at: string;
}

export interface ColumnMeta {
  name: string;
  dataType: 'numeric' | 'categorical';
  nullCount: number;
  nullPercentage: string;
  uniqueCount: number;
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  q1?: number;
  q3?: number;
  outlierCount?: number;
}

export interface DataRow {
  [key: string]: any;
}

export interface CleaningOptions {
  handleMissing?: 'drop' | 'fillMean' | 'fillMedian' | 'fillMode' | 'fillZero';
  removeDuplicates?: boolean;
  handleOutliers?: 'remove' | 'cap' | 'none';
  outlierThreshold?: number;
}

export interface CleaningResult {
  cleaned: DataRow[];
  stats: any;
  originalCount: number;
  cleanedCount: number;
}
