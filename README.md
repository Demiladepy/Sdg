# SDG Policy Intelligence Dashboard

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.9+-blue.svg)
![React](https://img.shields.io/badge/react-18.3+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)

**AI-Powered Data Analysis Platform for Sustainable Development and Evidence-Based Policymaking**

Transform fragmented macroeconomic, fiscal, and demographic indicators into actionable intelligence aligned with the United Nations Sustainable Development Goals.

---

## Problem Statement

Across many developing economies — including Nigeria and other African countries — fiscal, economic, and demographic data remain **under-utilized in policymaking**, leading to:

- ❌ Inefficient public spending
- ❌ Weak revenue mobilization
- ❌ Rising inflation and unemployment
- ❌ Widening inequality

Although governments collect vast amounts of information on budgets, GDP, trade, taxation, health, and population dynamics, these datasets are **rarely integrated, analyzed, or translated into actionable insights** that support sustainable development.

## Solution

This dashboard uses **AI, data science, and analytical modeling** to transform fragmented indicators into meaningful intelligence that:

✅ **Strengthens governance** through data-driven decisions
✅ **Supports inclusive growth** via evidence-based policies
✅ **Advances SDG goals** with automated analysis and recommendations

---

## Key Features

### 🎯 SDG-Aligned Insights
Automatically detects relevant indicators and maps them to 7 Sustainable Development Goals:
- **SDG 1**: No Poverty
- **SDG 3**: Good Health and Well-being
- **SDG 4**: Quality Education
- **SDG 8**: Decent Work and Economic Growth
- **SDG 9**: Industry, Innovation and Infrastructure
- **SDG 10**: Reduced Inequalities
- **SDG 16**: Peace, Justice and Strong Institutions

### 📊 Advanced Analytics
- Comprehensive statistical analysis
- Outlier detection using IQR method
- Trend analysis and forecasting
- Correlation matrices
- Data quality assessment

### 🧹 Intelligent Data Cleaning
- Multiple missing value strategies (mean, median, mode, drop)
- Duplicate removal
- Outlier handling (remove or cap)
- Data normalization and standardization

### 📈 Interactive Visualizations
- Distribution histograms
- Correlation heatmaps
- Trend lines with regression
- Box plots and pairwise relationships
- Category distributions

### 💡 Policy Recommendations
- Evidence-based insights for each SDG
- Benchmark comparisons with international standards
- Status assessment (critical, warning, good)
- Actionable policy recommendations

---

## Technology Stack

### Frontend
- **React 18.3** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Interactive data visualizations
- **Vite** - Lightning-fast build tool

### Backend (Dual Implementation)

#### Option 1: Supabase Edge Functions (Deployed)
- **Deno/TypeScript** runtime
- Serverless functions
- Auto-scaling

#### Option 2: Python Backend (Advanced Analytics)
- **FastAPI** - Modern Python web framework
- **Pandas** - Data manipulation and analysis
- **NumPy** - Numerical computing
- **Scikit-learn** - Machine learning utilities
- **Matplotlib/Seaborn** - Data visualization
- **SciPy** - Statistical analysis

### Database
- **Supabase (PostgreSQL)** - Data storage and authentication
- Row Level Security (RLS)
- Real-time subscriptions

---

## Quick Start

### Frontend Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

3. **Start development server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
```

Visit `http://localhost:5173`

### Python Backend Setup

See **[PYTHON_QUICKSTART.md](PYTHON_QUICKSTART.md)** for detailed instructions.

**Quick version:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Visit `http://localhost:8000/docs` for API documentation.

---

## Usage Workflow

### 1. Upload Data
- Drag and drop CSV files with fiscal/economic indicators
- Automatic column detection and type inference
- Support for multiple data formats

### 2. Overview & Analysis
- View comprehensive statistical summaries
- Identify data quality issues
- See missing values and outliers

### 3. SDG Insights
- Get automated SDG alignment analysis
- View status assessments and trends
- Read evidence-based policy recommendations

### 4. Clean Data
- Choose cleaning strategies
- Handle missing values and outliers
- Remove duplicates

### 5. Visualize
- Explore distributions and trends
- Analyze correlations
- Identify patterns

### 6. Export
- Download cleaned datasets
- Export analysis results
- Generate reports

---

## Project Structure

```
project/
├── src/                          # React frontend
│   ├── components/              # UI components
│   │   ├── Hero.tsx            # Landing section
│   │   ├── FileUpload.tsx      # CSV upload
│   │   ├── DataSummary.tsx     # Statistics overview
│   │   ├── SDGInsights.tsx     # SDG analysis
│   │   ├── DataCleaning.tsx    # Cleaning interface
│   │   ├── DataVisualization.tsx # Charts
│   │   └── DataTable.tsx       # Data preview
│   ├── lib/                    # Utilities
│   │   └── supabase.ts         # Database client
│   ├── types/                  # TypeScript types
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # Entry point
│
├── backend/                     # Python backend
│   ├── main.py                 # FastAPI app
│   ├── data_processor.py       # Statistical analysis
│   ├── data_cleaner.py         # Cleaning algorithms
│   ├── sdg_analyzer.py         # SDG insights
│   ├── visualizer.py           # Chart generation
│   ├── test_api.py             # API tests
│   ├── requirements.txt        # Python dependencies
│   └── README.md               # Backend docs
│
├── supabase/                    # Database
│   ├── migrations/             # SQL migrations
│   └── functions/              # Edge functions
│       └── data-processor/     # Data processing
│
└── dist/                        # Production build
```

---

## API Endpoints (Python Backend)

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/analyze` | Analyze dataset |
| POST | `/api/clean` | Clean dataset |
| POST | `/api/sdg-insights` | Generate SDG insights |
| POST | `/api/visualize` | Create visualizations |
| POST | `/api/upload-csv` | Upload CSV file |
| POST | `/api/correlation-matrix` | Calculate correlations |

See [backend/README.md](backend/README.md) for detailed API documentation.

---

## SDG Analysis Examples

### Poverty Analysis (SDG 1)
```json
{
  "sdgNumber": 1,
  "sdgName": "No Poverty",
  "value": 38.5,
  "status": "warning",
  "trend": "decreasing",
  "recommendation": "Strengthen targeted poverty reduction programs..."
}
```

### Health Analysis (SDG 3)
```json
{
  "sdgNumber": 3,
  "sdgName": "Good Health and Well-being",
  "value": 5.2,
  "status": "warning",
  "recommendation": "Gradually increase health spending to WHO recommendations..."
}
```

---

## Contributing

We welcome contributions! Areas for improvement:

- [ ] Add more SDG analyzers
- [ ] Implement time-series forecasting
- [ ] Add more visualization types
- [ ] Improve mobile responsiveness
- [ ] Add user authentication
- [ ] Multi-language support

---

## Deployment

### Frontend
- Deploy to **Netlify**, **Vercel**, or **Render**
- Connect GitHub repository
- Set environment variables

### Python Backend
- Deploy to **Render**, **Railway**, or **Heroku**
- Use Docker for containerization
- Set up HTTPS/SSL

See deployment guides in respective directories.

---

## Hackathon Submission

This project demonstrates:

✅ **Full-Stack Development**: React + Python + PostgreSQL
✅ **AI/ML Integration**: Automated analysis and insights
✅ **Real-World Impact**: Addresses SDG goals directly
✅ **Data Science**: Statistical analysis, cleaning, visualization
✅ **Modern Architecture**: Serverless, API-first, scalable
✅ **Production-Ready**: Documentation, testing, deployment

---

## License

MIT License - See LICENSE file for details

---

## Acknowledgments

Built for the SDG Data for Governance Hackathon to empower evidence-based policymaking across Africa.

**Technologies**: React, Python, FastAPI, Supabase, Pandas, NumPy, Scikit-learn, Matplotlib, Tailwind CSS

---

## Contact & Support

For questions, issues, or contributions:
- Open an issue on GitHub
- See documentation in `backend/README.md`
- Review API docs at `/docs` endpoint

---

**Making Data Work for Development** 🌍
