# Python Backend - SDG Policy Intelligence API

Professional Python backend for advanced data analysis, cleaning, and SDG insights generation.

## Features

### 1. Data Processing (`data_processor.py`)
- Comprehensive statistical analysis
- Column-level insights (mean, median, quartiles, outliers)
- Data quality assessment
- Automatic data type detection

### 2. Data Cleaning (`data_cleaner.py`)
- Multiple missing value strategies (mean, median, mode, drop)
- Duplicate removal
- Outlier detection and handling (IQR method)
- Data normalization (Z-score, Min-Max)
- Column name standardization

### 3. SDG Analysis (`sdg_analyzer.py`)
- Automatic SDG indicator detection
- Analysis for 6 SDGs:
  - SDG 1: No Poverty
  - SDG 3: Good Health and Well-being
  - SDG 4: Quality Education
  - SDG 8: Decent Work and Economic Growth
  - SDG 9: Industry, Innovation and Infrastructure
  - SDG 10: Reduced Inequalities
- Trend analysis and status assessment
- Evidence-based policy recommendations
- International benchmark comparisons

### 4. Data Visualization (`visualizer.py`)
- Distribution histograms
- Correlation heatmaps
- Trend analysis with regression lines
- Box plots for outlier detection
- Pairwise relationship plots

## API Endpoints

### Core Endpoints

#### `GET /health`
Health check endpoint
```bash
curl http://localhost:8000/health
```

#### `POST /api/analyze`
Analyze dataset and get comprehensive statistics
```json
{
  "data": [
    {"country": "Nigeria", "gdp_growth": 2.5, "poverty_rate": 40.1}
  ]
}
```

#### `POST /api/clean`
Clean dataset with specified options
```json
{
  "data": [...],
  "options": {
    "handleMissing": "fillMedian",
    "removeDuplicates": true,
    "handleOutliers": "cap",
    "outlierThreshold": 1.5
  }
}
```

#### `POST /api/sdg-insights`
Generate SDG-aligned policy insights
```json
{
  "data": [...]
}
```

#### `POST /api/visualize`
Generate statistical visualizations
```json
{
  "data": [...]
}
```

#### `POST /api/upload-csv`
Upload and analyze CSV file
```bash
curl -X POST -F "file=@data.csv" http://localhost:8000/api/upload-csv
```

#### `POST /api/correlation-matrix`
Calculate correlation matrix for numeric columns
```json
{
  "data": [...]
}
```

## Installation

### Prerequisites
- Python 3.9 or higher
- pip package manager

### Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment (recommended):
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

### Development Mode
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

The API will be available at:
- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Technology Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **Pandas**: Data manipulation and analysis
- **NumPy**: Numerical computing
- **Scikit-learn**: Machine learning utilities
- **SciPy**: Scientific computing and statistics
- **Matplotlib**: Data visualization
- **Seaborn**: Statistical data visualization
- **Uvicorn**: ASGI server

## Project Structure

```
backend/
├── main.py                 # FastAPI application and routes
├── data_processor.py       # Statistical analysis module
├── data_cleaner.py         # Data cleaning and preprocessing
├── sdg_analyzer.py         # SDG insights generation
├── visualizer.py           # Chart and graph generation
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## Usage Examples

### Example 1: Analyze Dataset
```python
import requests

data = {
    "data": [
        {"country": "Kenya", "gdp_growth": 5.2, "poverty_rate": 36.8, "health_expenditure": 6.5},
        {"country": "Ghana", "gdp_growth": 6.1, "poverty_rate": 23.4, "health_expenditure": 5.2}
    ]
}

response = requests.post("http://localhost:8000/api/analyze", json=data)
print(response.json())
```

### Example 2: Get SDG Insights
```python
response = requests.post("http://localhost:8000/api/sdg-insights", json=data)
insights = response.json()

for insight in insights["insights"]:
    print(f"SDG {insight['sdgNumber']}: {insight['sdgName']}")
    print(f"Status: {insight['status']}")
    print(f"Recommendation: {insight['recommendation']}\n")
```

### Example 3: Clean Data
```python
clean_request = {
    "data": [...],
    "options": {
        "handleMissing": "fillMedian",
        "removeDuplicates": True,
        "handleOutliers": "cap",
        "outlierThreshold": 1.5
    }
}

response = requests.post("http://localhost:8000/api/clean", json=clean_request)
cleaned_data = response.json()["cleaned"]
```

## Integration with Frontend

The Python backend is designed to work seamlessly with the React frontend. The frontend can switch between using:

1. **Supabase Edge Functions** (TypeScript/Deno) - Already deployed and working
2. **Python Backend** (This implementation) - For advanced analytics

To use the Python backend from the frontend, update the API endpoint URLs in the React app to point to `http://localhost:8000/api/...`

## Development

### Adding New SDG Analyzers
Add analysis functions in `sdg_analyzer.py`:

```python
def _analyze_custom_sdg(self) -> List[Dict[str, Any]]:
    insights = []
    # Your analysis logic
    return insights
```

### Adding New Cleaning Methods
Extend `data_cleaner.py`:

```python
def custom_cleaning_method(self):
    # Your cleaning logic
    return self.df
```

## Testing

Test the API using the interactive documentation:
1. Start the server
2. Visit http://localhost:8000/docs
3. Try out different endpoints with sample data

## Deployment

### Docker (Recommended)
Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t sdg-api .
docker run -p 8000:8000 sdg-api
```

### Cloud Platforms
- **Render**: Connect GitHub repo, select Python environment
- **Railway**: Deploy with `railway up`
- **Heroku**: Use `Procfile` with `web: uvicorn main:app --host 0.0.0.0 --port $PORT`

## License

Part of the SDG Policy Intelligence Dashboard project for sustainable development and evidence-based policymaking.
