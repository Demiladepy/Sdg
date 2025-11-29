import { DataStats, ModelInfo, MacroSDGData } from '../types';

export const mockStats: DataStats = {
  total_records: 200,
  countries: 20,
  years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
  poverty_rate_stats: {
    mean: 38.5,
    median: 36.2,
    min: 12.3,
    max: 68.9,
    std: 12.4
  },
  gdp_growth_stats: {
    mean: 3.8,
    median: 4.1
  },
  inflation_stats: {
    mean: 8.2,
    median: 7.5
  }
};

export const mockModelInfo: ModelInfo = {
  model_type: 'rf',
  target: 'Poverty_Rate',
  cv_mae_mean: 3.52,
  cv_mae_std: 0.84,
  numeric_features: [
    'GDP_Nominal_Billion', 'GDP_Real_Billion', 'GDP_Growth', 'Inflation',
    'Unemployment', 'Government_Revenue', 'Government_Expenditure',
    'Health_Expenditure', 'Education_Expenditure', 'Population'
  ],
  categorical_features: ['Country'],
  n_samples: 160
};

export const mockCountries = [
  'Nigeria', 'South Africa', 'Kenya', 'Ghana', 'Ethiopia',
  'Tanzania', 'Uganda', 'Rwanda', 'Senegal', 'Mozambique',
  'Zambia', 'Zimbabwe', 'Cameroon', 'Ivory Coast', 'Mali',
  'Burkina Faso', 'Malawi', 'Madagascar', 'Botswana', 'Namibia'
];

export const mockHistoricalData: Record<string, MacroSDGData[]> = {
  'Nigeria': [
    {
      Country: 'Nigeria',
      Year: 2020,
      GDP_Nominal_Billion: 432.3,
      GDP_Real_Billion: 389.2,
      GDP_Growth: 2.5,
      Inflation: 13.2,
      Unemployment: 9.8,
      Poverty_Rate: 40.1,
      Government_Revenue: 85000000000,
      Government_Expenditure: 95000000000,
      Budget_Balance: -10000000000,
      Health_Expenditure: 14250000000,
      Education_Expenditure: 19000000000,
      Capital_Expenditure: 23750000000,
      Population: 206000000,
      Imports: 130000000000,
      Exports: 88000000000,
      Trade_Balance: -42000000000,
      Government_Debt: 259200000000,
      Gini_Index: 43.5,
      Food_Price_Index: 128.3,
      HDI_Proxy: 0.539
    },
    {
      Country: 'Nigeria',
      Year: 2021,
      GDP_Nominal_Billion: 440.8,
      GDP_Real_Billion: 395.1,
      GDP_Growth: 3.1,
      Inflation: 16.9,
      Unemployment: 10.2,
      Poverty_Rate: 42.3,
      Government_Revenue: 88000000000,
      Government_Expenditure: 99000000000,
      Budget_Balance: -11000000000,
      Health_Expenditure: 14850000000,
      Education_Expenditure: 19800000000,
      Capital_Expenditure: 24750000000,
      Population: 210000000,
      Imports: 135000000000,
      Exports: 90000000000,
      Trade_Balance: -45000000000,
      Government_Debt: 270400000000,
      Gini_Index: 43.8,
      Food_Price_Index: 135.7,
      HDI_Proxy: 0.541
    },
    {
      Country: 'Nigeria',
      Year: 2022,
      GDP_Nominal_Billion: 455.2,
      GDP_Real_Billion: 402.8,
      GDP_Growth: 3.5,
      Inflation: 18.8,
      Unemployment: 9.5,
      Poverty_Rate: 41.8,
      Government_Revenue: 91000000000,
      Government_Expenditure: 103000000000,
      Budget_Balance: -12000000000,
      Health_Expenditure: 15450000000,
      Education_Expenditure: 20600000000,
      Capital_Expenditure: 25750000000,
      Population: 215000000,
      Imports: 140000000000,
      Exports: 95000000000,
      Trade_Balance: -45000000000,
      Government_Debt: 282000000000,
      Gini_Index: 44.1,
      Food_Price_Index: 145.2,
      HDI_Proxy: 0.543
    },
    {
      Country: 'Nigeria',
      Year: 2023,
      GDP_Nominal_Billion: 472.5,
      GDP_Real_Billion: 415.3,
      GDP_Growth: 3.8,
      Inflation: 24.5,
      Unemployment: 8.9,
      Poverty_Rate: 43.5,
      Government_Revenue: 94500000000,
      Government_Expenditure: 107000000000,
      Budget_Balance: -12500000000,
      Health_Expenditure: 16050000000,
      Education_Expenditure: 21400000000,
      Capital_Expenditure: 26750000000,
      Population: 220000000,
      Imports: 145000000000,
      Exports: 100000000000,
      Trade_Balance: -45000000000,
      Government_Debt: 295000000000,
      Gini_Index: 44.3,
      Food_Price_Index: 158.9,
      HDI_Proxy: 0.545
    },
    {
      Country: 'Nigeria',
      Year: 2024,
      GDP_Nominal_Billion: 485.1,
      GDP_Real_Billion: 423.7,
      GDP_Growth: 3.2,
      Inflation: 28.2,
      Unemployment: 8.5,
      Poverty_Rate: 44.8,
      Government_Revenue: 97000000000,
      Government_Expenditure: 110000000000,
      Budget_Balance: -13000000000,
      Health_Expenditure: 16500000000,
      Education_Expenditure: 22000000000,
      Capital_Expenditure: 27500000000,
      Population: 224000000,
      Imports: 148000000000,
      Exports: 102000000000,
      Trade_Balance: -46000000000,
      Government_Debt: 303500000000,
      Gini_Index: 44.5,
      Food_Price_Index: 168.5,
      HDI_Proxy: 0.547
    }
  ]
};

export const generateMockHistoricalData = (country: string): MacroSDGData[] => {
  const years = [2020, 2021, 2022, 2023, 2024];
  const baseGDP = 50 + Math.random() * 350;
  const basePoverty = 20 + Math.random() * 40;

  return years.map((year, i) => ({
    Country: country,
    Year: year,
    GDP_Nominal_Billion: Number((baseGDP * (1 + 0.03 * i)).toFixed(2)),
    GDP_Real_Billion: Number((baseGDP * 0.9 * (1 + 0.03 * i)).toFixed(2)),
    GDP_Growth: Number((2 + Math.random() * 4).toFixed(1)),
    Inflation: Number((5 + Math.random() * 10).toFixed(1)),
    Unemployment: Number((5 + Math.random() * 15).toFixed(1)),
    Poverty_Rate: Number((basePoverty + i * (Math.random() - 0.5) * 3).toFixed(1)),
    Government_Revenue: Math.round(baseGDP * 1e9 * 0.2),
    Government_Expenditure: Math.round(baseGDP * 1e9 * 0.22),
    Budget_Balance: Math.round(baseGDP * 1e9 * -0.02),
    Health_Expenditure: Math.round(baseGDP * 1e9 * 0.03),
    Education_Expenditure: Math.round(baseGDP * 1e9 * 0.04),
    Capital_Expenditure: Math.round(baseGDP * 1e9 * 0.05),
    Population: Math.round((20 + Math.random() * 180) * 1e6),
    Imports: Math.round(baseGDP * 1e9 * 0.3),
    Exports: Math.round(baseGDP * 1e9 * 0.2),
    Trade_Balance: Math.round(baseGDP * 1e9 * -0.1),
    Government_Debt: Math.round(baseGDP * 1e9 * 0.6),
    Gini_Index: Number((35 + Math.random() * 30).toFixed(1)),
    Food_Price_Index: Number((100 + i * 10 + Math.random() * 5).toFixed(1)),
    HDI_Proxy: Number((0.4 + Math.random() * 0.3).toFixed(3))
  }));
};
