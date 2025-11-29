import pandas as pd
import numpy as np
from typing import Dict, Any, Optional

class DataCleaner:
    def __init__(self, df: pd.DataFrame):
        self.df = df.copy()
        self.original_shape = df.shape

    def clean(
        self,
        handle_missing: str = "fillMedian",
        remove_duplicates: bool = True,
        handle_outliers: str = "cap",
        outlier_threshold: float = 1.5
    ) -> Dict[str, Any]:

        original_count = len(self.df)

        if handle_missing == "drop":
            self.df = self.df.dropna()
        elif handle_missing in ["fillMean", "fillMedian", "fillMode", "fillZero"]:
            self._fill_missing_values(handle_missing)

        if remove_duplicates:
            self.df = self.df.drop_duplicates()

        if handle_outliers in ["remove", "cap"]:
            self._handle_outliers(handle_outliers, outlier_threshold)

        cleaned_count = len(self.df)

        return {
            "cleaned": self.df.to_dict('records'),
            "originalCount": original_count,
            "cleanedCount": cleaned_count,
            "rowsRemoved": original_count - cleaned_count,
            "stats": self._get_cleaning_stats()
        }

    def _fill_missing_values(self, method: str):
        for col in self.df.columns:
            if self.df[col].isnull().any():
                if pd.api.types.is_numeric_dtype(self.df[col]):
                    if method == "fillMean":
                        self.df[col].fillna(self.df[col].mean(), inplace=True)
                    elif method == "fillMedian":
                        self.df[col].fillna(self.df[col].median(), inplace=True)
                    elif method == "fillZero":
                        self.df[col].fillna(0, inplace=True)
                    elif method == "fillMode":
                        mode_val = self.df[col].mode()
                        if len(mode_val) > 0:
                            self.df[col].fillna(mode_val[0], inplace=True)
                else:
                    mode_val = self.df[col].mode()
                    if len(mode_val) > 0:
                        self.df[col].fillna(mode_val[0], inplace=True)

    def _handle_outliers(self, method: str, threshold: float):
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns

        for col in numeric_cols:
            q1 = self.df[col].quantile(0.25)
            q3 = self.df[col].quantile(0.75)
            iqr = q3 - q1

            lower_bound = q1 - threshold * iqr
            upper_bound = q3 + threshold * iqr

            if method == "remove":
                self.df = self.df[
                    (self.df[col] >= lower_bound) & (self.df[col] <= upper_bound)
                ]
            elif method == "cap":
                self.df[col] = self.df[col].clip(lower=lower_bound, upper=upper_bound)

    def _get_cleaning_stats(self) -> Dict[str, Any]:
        return {
            "missingValues": int(self.df.isnull().sum().sum()),
            "duplicates": int(self.df.duplicated().sum()),
            "columns": len(self.df.columns),
            "dataTypes": self.df.dtypes.value_counts().to_dict()
        }

    def standardize_column_names(self) -> pd.DataFrame:
        self.df.columns = [
            col.lower().replace(' ', '_').replace('-', '_')
            for col in self.df.columns
        ]
        return self.df

    def convert_data_types(self) -> pd.DataFrame:
        for col in self.df.columns:
            if self.df[col].dtype == 'object':
                try:
                    self.df[col] = pd.to_numeric(self.df[col])
                except:
                    try:
                        self.df[col] = pd.to_datetime(self.df[col])
                    except:
                        pass

        return self.df

    def remove_constant_columns(self) -> pd.DataFrame:
        for col in self.df.columns:
            if self.df[col].nunique() == 1:
                self.df.drop(col, axis=1, inplace=True)

        return self.df

    def normalize_numeric_columns(self, method: str = "zscore") -> pd.DataFrame:
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns

        for col in numeric_cols:
            if method == "zscore":
                mean = self.df[col].mean()
                std = self.df[col].std()
                if std != 0:
                    self.df[f"{col}_normalized"] = (self.df[col] - mean) / std
            elif method == "minmax":
                min_val = self.df[col].min()
                max_val = self.df[col].max()
                if max_val != min_val:
                    self.df[f"{col}_normalized"] = (
                        (self.df[col] - min_val) / (max_val - min_val)
                    )

        return self.df
