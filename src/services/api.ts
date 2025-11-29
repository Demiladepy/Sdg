import { MacroSDGData, PredictionRequest, PredictionResponse, DataStats, ModelInfo, HistoricalData } from '../types';
import { createClient } from '@supabase/supabase-js';
import { mockStats, mockModelInfo, mockCountries, generateMockHistoricalData } from './mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const API_BASE_URL = 'http://localhost:8000';
const USE_MOCK_DATA = true;

export const api = {
  async getStats(): Promise<DataStats> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockStats;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    } catch (error) {
      return mockStats;
    }
  },

  async getModelInfo(): Promise<ModelInfo> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockModelInfo;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/model-info`);
      if (!response.ok) throw new Error('Failed to fetch model info');
      return response.json();
    } catch (error) {
      return mockModelInfo;
    }
  },

  async getCountries(): Promise<string[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockCountries;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/countries`);
      if (!response.ok) throw new Error('Failed to fetch countries');
      const data = await response.json();
      return data.countries;
    } catch (error) {
      return mockCountries;
    }
  },

  async getHistoricalData(country: string): Promise<HistoricalData> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return {
        country,
        data: generateMockHistoricalData(country)
      };
    }
    try {
      const response = await fetch(`${API_BASE_URL}/historical/${encodeURIComponent(country)}`);
      if (!response.ok) throw new Error('Failed to fetch historical data');
      return response.json();
    } catch (error) {
      return {
        country,
        data: generateMockHistoricalData(country)
      };
    }
  },

  async makePrediction(data: PredictionRequest): Promise<PredictionResponse> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const basePrediction = 35 + (data.Inflation - 8) * 1.5 - (data.GDP_Growth - 3) * 2;
      const prediction = Math.max(10, Math.min(70, basePrediction + (Math.random() - 0.5) * 5));

      return {
        predicted_poverty_rate: Number(prediction.toFixed(2)),
        country: data.Country,
        year: data.Year,
        model_version: 'v1.0-demo',
        timestamp: new Date().toISOString(),
        feature_importance: {
          'Inflation': 0.28,
          'GDP_Growth': 0.22,
          'HDI_Proxy': 0.18,
          'Unemployment': 0.15,
          'Food_Price_Index': 0.12
        }
      };
    }
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to make prediction');
      return response.json();
    } catch (error) {
      const basePrediction = 35 + (data.Inflation - 8) * 1.5 - (data.GDP_Growth - 3) * 2;
      const prediction = Math.max(10, Math.min(70, basePrediction + (Math.random() - 0.5) * 5));

      return {
        predicted_poverty_rate: Number(prediction.toFixed(2)),
        country: data.Country,
        year: data.Year,
        model_version: 'v1.0-fallback',
        timestamp: new Date().toISOString()
      };
    }
  },

  async getAllData(): Promise<MacroSDGData[]> {
    try {
      const { data, error } = await supabase
        .from('macro_sdg_data')
        .select('*')
        .order('country', { ascending: true })
        .order('year', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return [];
    }
  },

  async savePrediction(prediction: PredictionResponse): Promise<void> {
    try {
      const { error } = await supabase
        .from('predictions')
        .insert({
          country: prediction.country,
          year: prediction.year,
          predicted_poverty_rate: prediction.predicted_poverty_rate,
          model_version: prediction.model_version,
          input_features: prediction.feature_importance || {}
        });

      if (error) console.warn('Could not save prediction to database:', error);
    } catch (error) {
      console.warn('Supabase not available, prediction not saved');
    }
  },

  async getRecentPredictions(limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      return [];
    }
  }
};
