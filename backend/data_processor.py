import pandas as pd
import numpy as np
from scipy import stats
from typing import Dict, Any, List

class DataProcessor:
    def __init__(self, df: pd.DataFrame):
        self.df = df

    def analyze(self) -> Dict[str, Any]:
        analysis = {
            "rowCount": len(self.df),
            "columnCount": len(self.df.columns),
            "columns": {}
        }

        for col in self.df.columns:
            col_analysis = self._analyze_column(col)
            analysis["columns"][col] = col_analysis

        return analysis

    def _analyze_column(self, col: str) -> Dict[str, Any]:
        series = self.df[col]

        null_count = series.isnull().sum() + (series == '').sum()
        null_percentage = (null_count / len(series) * 100)

        unique_count = series.nunique()

        is_numeric = pd.api.types.is_numeric_dtype(series)

        if not is_numeric:
            try:
                numeric_series = pd.to_numeric(series, errors='coerce')
                non_null_numeric = numeric_series.dropna()
                if len(non_null_numeric) / len(series) > 0.5:
                    is_numeric = True
                    series = numeric_series
            except:
                pass

        col_info = {
            "nullCount": int(null_count),
            "nullPercentage": f"{null_percentage:.2f}",
            "uniqueCount": int(unique_count),
            "dataType": "numeric" if is_numeric else "categorical"
        }

        if is_numeric:
            numeric_data = series.dropna()

            if len(numeric_data) > 0:
                col_info.update({
                    "min": float(numeric_data.min()),
                    "max": float(numeric_data.max()),
                    "mean": float(numeric_data.mean()),
                    "median": float(numeric_data.median()),
                    "std": float(numeric_data.std()) if len(numeric_data) > 1 else 0,
                    "q1": float(numeric_data.quantile(0.25)),
                    "q3": float(numeric_data.quantile(0.75)),
                })

                q1 = col_info["q1"]
                q3 = col_info["q3"]
                iqr = q3 - q1
                lower_bound = q1 - 1.5 * iqr
                upper_bound = q3 + 1.5 * iqr

                outliers = numeric_data[(numeric_data < lower_bound) | (numeric_data > upper_bound)]
                col_info["outlierCount"] = len(outliers)

        return col_info

    def get_summary_statistics(self) -> Dict[str, Any]:
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns

        summary = {
            "totalRows": len(self.df),
            "totalColumns": len(self.df.columns),
            "numericColumns": len(numeric_cols),
            "categoricalColumns": len(self.df.columns) - len(numeric_cols),
            "totalMissingValues": int(self.df.isnull().sum().sum()),
            "memoryUsage": f"{self.df.memory_usage(deep=True).sum() / 1024 / 1024:.2f} MB"
        }

        if len(numeric_cols) > 0:
            summary["numericSummary"] = self.df[numeric_cols].describe().to_dict()

        return summary

    def detect_data_quality_issues(self) -> List[Dict[str, Any]]:
        issues = []

        for col in self.df.columns:
            null_pct = (self.df[col].isnull().sum() / len(self.df)) * 100

            if null_pct > 50:
                issues.append({
                    "column": col,
                    "type": "high_missing_rate",
                    "severity": "critical",
                    "message": f"Column has {null_pct:.1f}% missing values"
                })
            elif null_pct > 20:
                issues.append({
                    "column": col,
                    "type": "moderate_missing_rate",
                    "severity": "warning",
                    "message": f"Column has {null_pct:.1f}% missing values"
                })

            if self.df[col].dtype in ['int64', 'float64']:
                if self.df[col].nunique() == len(self.df):
                    issues.append({
                        "column": col,
                        "type": "all_unique_values",
                        "severity": "info",
                        "message": "All values are unique (possible ID column)"
                    })

            if self.df[col].dtype == 'object':
                value_counts = self.df[col].value_counts()
                if len(value_counts) > 0 and value_counts.iloc[0] / len(self.df) > 0.95:
                    issues.append({
                        "column": col,
                        "type": "low_variance",
                        "severity": "warning",
                        "message": f"Column has very low variance (95%+ same value)"
                    })

        duplicate_rows = self.df.duplicated().sum()
        if duplicate_rows > 0:
            issues.append({
                "column": "dataset",
                "type": "duplicate_rows",
                "severity": "warning",
                "message": f"Found {duplicate_rows} duplicate rows"
            })

        return issues
