from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
import io
import json

from data_processor import DataProcessor
from sdg_analyzer import SDGAnalyzer
from data_cleaner import DataCleaner
from visualizer import DataVisualizer

app = FastAPI(
    title="SDG Policy Intelligence API",
    description="Python backend for data analysis and SDG insights",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DatasetRequest(BaseModel):
    data: List[Dict[str, Any]]

class CleaningOptions(BaseModel):
    handleMissing: Optional[str] = "fillMedian"
    removeDuplicates: Optional[bool] = True
    handleOutliers: Optional[str] = "cap"
    outlierThreshold: Optional[float] = 1.5

class CleaningRequest(BaseModel):
    data: List[Dict[str, Any]]
    options: CleaningOptions

@app.get("/")
async def root():
    return {
        "message": "SDG Policy Intelligence API",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "python-backend"}

@app.post("/api/analyze")
async def analyze_dataset(request: DatasetRequest):
    try:
        df = pd.DataFrame(request.data)

        if df.empty:
            raise HTTPException(status_code=400, detail="Empty dataset")

        processor = DataProcessor(df)
        analysis = processor.analyze()

        return analysis

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/clean")
async def clean_dataset(request: CleaningRequest):
    try:
        df = pd.DataFrame(request.data)

        if df.empty:
            raise HTTPException(status_code=400, detail="Empty dataset")

        cleaner = DataCleaner(df)
        result = cleaner.clean(
            handle_missing=request.options.handleMissing,
            remove_duplicates=request.options.removeDuplicates,
            handle_outliers=request.options.handleOutliers,
            outlier_threshold=request.options.outlierThreshold
        )

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/sdg-insights")
async def get_sdg_insights(request: DatasetRequest):
    try:
        df = pd.DataFrame(request.data)

        if df.empty:
            raise HTTPException(status_code=400, detail="Empty dataset")

        analyzer = SDGAnalyzer(df)
        insights = analyzer.generate_insights()

        return insights

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/visualize")
async def generate_visualizations(request: DatasetRequest):
    try:
        df = pd.DataFrame(request.data)

        if df.empty:
            raise HTTPException(status_code=400, detail="Empty dataset")

        visualizer = DataVisualizer(df)
        charts = visualizer.generate_charts()

        return charts

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Only CSV files are supported")

        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))

        processor = DataProcessor(df)
        analysis = processor.analyze()

        return {
            "filename": file.filename,
            "analysis": analysis,
            "preview": df.head(10).to_dict('records')
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/correlation-matrix")
async def get_correlation_matrix(request: DatasetRequest):
    try:
        df = pd.DataFrame(request.data)
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

        if len(numeric_cols) < 2:
            raise HTTPException(status_code=400, detail="Need at least 2 numeric columns")

        correlation = df[numeric_cols].corr().round(3).to_dict()

        return {
            "columns": numeric_cols,
            "correlation": correlation
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
