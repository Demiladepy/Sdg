import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
from typing import Dict, Any, List

class DataVisualizer:
    def __init__(self, df: pd.DataFrame):
        self.df = df
        sns.set_style("whitegrid")
        plt.rcParams['figure.figsize'] = (10, 6)

    def generate_charts(self) -> Dict[str, Any]:
        charts = {
            "distributions": [],
            "correlations": None,
            "trends": []
        }

        numeric_cols = self.df.select_dtypes(include=[np.number]).columns.tolist()

        for col in numeric_cols[:4]:
            chart_data = self._create_distribution_chart(col)
            if chart_data:
                charts["distributions"].append(chart_data)

        if len(numeric_cols) >= 2:
            corr_chart = self._create_correlation_heatmap(numeric_cols[:10])
            if corr_chart:
                charts["correlations"] = corr_chart

        for col in numeric_cols[:3]:
            trend_chart = self._create_trend_chart(col)
            if trend_chart:
                charts["trends"].append(trend_chart)

        return charts

    def _create_distribution_chart(self, column: str) -> Dict[str, Any]:
        try:
            fig, ax = plt.subplots(figsize=(10, 6))

            data = self.df[column].dropna()

            ax.hist(data, bins=30, color='#3b82f6', alpha=0.7, edgecolor='black')
            ax.set_xlabel(column, fontsize=12, fontweight='bold')
            ax.set_ylabel('Frequency', fontsize=12, fontweight='bold')
            ax.set_title(f'Distribution of {column}', fontsize=14, fontweight='bold')
            ax.grid(True, alpha=0.3)

            mean_val = data.mean()
            median_val = data.median()
            ax.axvline(mean_val, color='red', linestyle='--', linewidth=2, label=f'Mean: {mean_val:.2f}')
            ax.axvline(median_val, color='green', linestyle='--', linewidth=2, label=f'Median: {median_val:.2f}')
            ax.legend()

            img_base64 = self._fig_to_base64(fig)
            plt.close(fig)

            return {
                "column": column,
                "type": "histogram",
                "image": img_base64,
                "stats": {
                    "mean": float(mean_val),
                    "median": float(median_val),
                    "std": float(data.std()),
                    "min": float(data.min()),
                    "max": float(data.max())
                }
            }

        except Exception as e:
            print(f"Error creating distribution chart for {column}: {e}")
            return None

    def _create_correlation_heatmap(self, columns: List[str]) -> Dict[str, Any]:
        try:
            fig, ax = plt.subplots(figsize=(12, 10))

            corr_matrix = self.df[columns].corr()

            sns.heatmap(
                corr_matrix,
                annot=True,
                fmt='.2f',
                cmap='coolwarm',
                center=0,
                square=True,
                ax=ax,
                cbar_kws={'label': 'Correlation Coefficient'}
            )

            ax.set_title('Correlation Heatmap', fontsize=16, fontweight='bold', pad=20)
            plt.xticks(rotation=45, ha='right')
            plt.yticks(rotation=0)
            plt.tight_layout()

            img_base64 = self._fig_to_base64(fig)
            plt.close(fig)

            return {
                "type": "heatmap",
                "image": img_base64,
                "columns": columns,
                "correlationMatrix": corr_matrix.to_dict()
            }

        except Exception as e:
            print(f"Error creating correlation heatmap: {e}")
            return None

    def _create_trend_chart(self, column: str) -> Dict[str, Any]:
        try:
            fig, ax = plt.subplots(figsize=(12, 6))

            data = self.df[column].dropna()
            x = range(len(data))

            ax.plot(x, data.values, color='#3b82f6', linewidth=2, marker='o', markersize=4)
            ax.set_xlabel('Data Points', fontsize=12, fontweight='bold')
            ax.set_ylabel(column, fontsize=12, fontweight='bold')
            ax.set_title(f'Trend Analysis: {column}', fontsize=14, fontweight='bold')
            ax.grid(True, alpha=0.3)

            z = np.polyfit(x, data.values, 1)
            p = np.poly1d(z)
            ax.plot(x, p(x), "r--", linewidth=2, alpha=0.8, label=f'Trend: {z[0]:.4f}x + {z[1]:.2f}')
            ax.legend()

            img_base64 = self._fig_to_base64(fig)
            plt.close(fig)

            return {
                "column": column,
                "type": "line",
                "image": img_base64,
                "trendSlope": float(z[0]),
                "trendIntercept": float(z[1])
            }

        except Exception as e:
            print(f"Error creating trend chart for {column}: {e}")
            return None

    def _fig_to_base64(self, fig) -> str:
        buf = io.BytesIO()
        fig.savefig(buf, format='png', dpi=100, bbox_inches='tight')
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')
        buf.close()
        return f"data:image/png;base64,{img_base64}"

    def create_box_plots(self, columns: List[str] = None) -> Dict[str, Any]:
        if columns is None:
            columns = self.df.select_dtypes(include=[np.number]).columns.tolist()[:6]

        try:
            fig, axes = plt.subplots(2, 3, figsize=(15, 10))
            axes = axes.flatten()

            for idx, col in enumerate(columns):
                if idx < len(axes):
                    self.df.boxplot(column=col, ax=axes[idx])
                    axes[idx].set_title(f'Box Plot: {col}', fontweight='bold')
                    axes[idx].set_ylabel('Value')

            for idx in range(len(columns), len(axes)):
                fig.delaxes(axes[idx])

            plt.tight_layout()

            img_base64 = self._fig_to_base64(fig)
            plt.close(fig)

            return {
                "type": "boxplot",
                "image": img_base64,
                "columns": columns
            }

        except Exception as e:
            print(f"Error creating box plots: {e}")
            return None

    def create_pairplot(self, columns: List[str] = None, sample_size: int = 1000):
        if columns is None:
            columns = self.df.select_dtypes(include=[np.number]).columns.tolist()[:4]

        try:
            sample_df = self.df[columns].sample(min(sample_size, len(self.df)))

            pairplot = sns.pairplot(sample_df, diag_kind='kde', plot_kws={'alpha': 0.6})
            pairplot.fig.suptitle('Pairwise Relationships', y=1.02, fontsize=16, fontweight='bold')

            img_base64 = self._fig_to_base64(pairplot.fig)
            plt.close(pairplot.fig)

            return {
                "type": "pairplot",
                "image": img_base64,
                "columns": columns
            }

        except Exception as e:
            print(f"Error creating pairplot: {e}")
            return None
