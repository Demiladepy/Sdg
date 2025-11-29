# Python Backend Quick Start Guide

This guide will help you get the Python backend running in minutes.

## Prerequisites

- Python 3.9+ installed
- pip package manager

## Step-by-Step Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment (Recommended)

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- FastAPI - Web framework
- Pandas - Data analysis
- NumPy - Numerical computing
- Scikit-learn - Machine learning
- Matplotlib & Seaborn - Visualizations
- And more...

### 4. Start the Server

```bash
python main.py
```

Or using uvicorn:
```bash
uvicorn main:app --reload
```

You should see:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 5. Test the API

Open your browser and visit:
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

Or run the test script:
```bash
python test_api.py
```

## What You Can Do

### 1. Analyze Data
```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"country": "Nigeria", "gdp_growth": 2.5, "poverty_rate": 40.1}
    ]
  }'
```

### 2. Get SDG Insights
```bash
curl -X POST http://localhost:8000/api/sdg-insights \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {
        "country": "Kenya",
        "poverty_rate": 36.8,
        "health_expenditure": 5.2,
        "education_expenditure": 18.5,
        "gdp_growth": 5.4
      }
    ]
  }'
```

### 3. Clean Data
```bash
curl -X POST http://localhost:8000/api/clean \
  -H "Content-Type: application/json" \
  -d '{
    "data": [...],
    "options": {
      "handleMissing": "fillMedian",
      "removeDuplicates": true,
      "handleOutliers": "cap"
    }
  }'
```

### 4. Upload CSV File
```bash
curl -X POST http://localhost:8000/api/upload-csv \
  -F "file=@your_data.csv"
```

## Architecture

### Python Backend Components

```
backend/
├── main.py              # FastAPI app & routes
├── data_processor.py    # Statistical analysis
├── data_cleaner.py      # Data cleaning algorithms
├── sdg_analyzer.py      # SDG insights generation
└── visualizer.py        # Chart generation
```

### Key Features

**Data Processing**
- Automatic column type detection
- Statistical summaries (mean, median, quartiles)
- Outlier detection using IQR method
- Data quality assessment

**Data Cleaning**
- Missing value strategies (mean, median, mode, drop)
- Duplicate removal
- Outlier handling (remove or cap)
- Data normalization

**SDG Analysis**
- Detects 6 SDG indicators automatically
- Calculates trends and status
- Provides evidence-based recommendations
- Benchmarks against international standards

**Visualization**
- Distribution histograms
- Correlation heatmaps
- Trend lines with regression
- Box plots for outlier detection

## Integration Options

### Option 1: Use with React Frontend (Current Setup)

The React frontend currently uses Supabase Edge Functions. To use Python backend instead:

1. Start Python backend: `python main.py`
2. Update frontend API calls to point to `http://localhost:8000/api/...`

### Option 2: Standalone API

Use the Python backend as a standalone API for:
- Jupyter notebooks
- Data science pipelines
- Other applications

### Option 3: Hybrid Approach

Keep both backends:
- Supabase Edge Functions for deployed app
- Python backend for advanced local analysis

## Example Use Case

Imagine you have fiscal data from 20 African countries:

1. **Upload** your CSV file via API
2. **Analyze** to get comprehensive statistics
3. **Get SDG Insights** to see policy recommendations
4. **Clean** the data to handle missing values and outliers
5. **Visualize** trends and correlations
6. **Export** cleaned data for further analysis

## Troubleshooting

### "Module not found" errors
```bash
pip install -r requirements.txt
```

### Port 8000 already in use
```bash
uvicorn main:app --reload --port 8001
```

### CORS errors from frontend
Update `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Add your frontend URL
    ...
)
```

## Next Steps

1. ✅ Start the Python backend
2. ✅ Test with `test_api.py`
3. ✅ Try the interactive docs at `/docs`
4. ✅ Upload your own dataset
5. ✅ Get SDG insights for your data

## Production Deployment

For deployment to cloud platforms, see `backend/README.md` for:
- Docker containerization
- Deployment to Render, Railway, or Heroku
- Environment variable configuration
- SSL/HTTPS setup

## Support

For more details, see:
- `backend/README.md` - Comprehensive documentation
- `test_api.py` - Working examples
- `/docs` endpoint - Interactive API documentation
