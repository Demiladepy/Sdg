import pandas as pd
import numpy as np
from typing import Dict, Any, List

class SDGAnalyzer:
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.column_names = [col.lower() for col in df.columns]

    def generate_insights(self) -> Dict[str, Any]:
        insights = []

        insights.extend(self._analyze_poverty_sdg1())
        insights.extend(self._analyze_health_sdg3())
        insights.extend(self._analyze_education_sdg4())
        insights.extend(self._analyze_economic_growth_sdg8())
        insights.extend(self._analyze_infrastructure_sdg9())
        insights.extend(self._analyze_inequality_sdg10())

        return {
            "insights": insights,
            "sdgCount": len(set([i["sdgNumber"] for i in insights])),
            "totalInsights": len(insights),
            "dataQuality": self._assess_data_quality()
        }

    def _find_column(self, keywords: List[str]) -> str:
        for keyword in keywords:
            for i, col_name in enumerate(self.column_names):
                if keyword in col_name:
                    return self.df.columns[i]
        return None

    def _calculate_trend(self, series: pd.Series) -> str:
        series = series.dropna()
        if len(series) < 2:
            return "stable"

        mid_point = len(series) // 2
        first_half_mean = series.iloc[:mid_point].mean()
        second_half_mean = series.iloc[mid_point:].mean()

        change_pct = ((second_half_mean - first_half_mean) / first_half_mean * 100) if first_half_mean != 0 else 0

        if abs(change_pct) < 2:
            return "stable"
        return "increasing" if change_pct > 0 else "decreasing"

    def _analyze_poverty_sdg1(self) -> List[Dict[str, Any]]:
        insights = []

        poverty_col = self._find_column(['poverty', 'poverty_rate', 'headcount'])
        income_col = self._find_column(['income', 'gdp_per_capita', 'gni'])

        if poverty_col:
            poverty_data = pd.to_numeric(self.df[poverty_col], errors='coerce').dropna()

            if len(poverty_data) > 0:
                avg_poverty = poverty_data.mean()
                trend = self._calculate_trend(poverty_data)

                if avg_poverty > 30:
                    status = "critical"
                    severity = "High poverty rates require urgent intervention"
                elif avg_poverty > 15:
                    status = "warning"
                    severity = "Moderate poverty levels need attention"
                else:
                    status = "good"
                    severity = "Poverty rates below international thresholds"

                insights.append({
                    "sdgNumber": 1,
                    "sdgName": "No Poverty",
                    "indicator": poverty_col,
                    "value": round(avg_poverty, 2),
                    "unit": "%",
                    "trend": trend,
                    "status": status,
                    "assessment": severity,
                    "recommendation": self._get_poverty_recommendation(avg_poverty, trend),
                    "benchmark": "World Bank extreme poverty line: <3%, Moderate poverty: <15%"
                })

        return insights

    def _analyze_health_sdg3(self) -> List[Dict[str, Any]]:
        insights = []

        health_exp_col = self._find_column(['health_expenditure', 'health_spending', 'health_budget'])

        if health_exp_col:
            health_data = pd.to_numeric(self.df[health_exp_col], errors='coerce').dropna()

            if len(health_data) > 0:
                avg_health = health_data.mean()
                trend = self._calculate_trend(health_data)

                if avg_health < 5:
                    status = "critical"
                    severity = "Health spending critically below WHO minimum"
                elif avg_health < 8:
                    status = "warning"
                    severity = "Health spending below recommended levels"
                else:
                    status = "good"
                    severity = "Health investment meets international standards"

                insights.append({
                    "sdgNumber": 3,
                    "sdgName": "Good Health and Well-being",
                    "indicator": health_exp_col,
                    "value": round(avg_health, 2),
                    "unit": "% of GDP or Budget",
                    "trend": trend,
                    "status": status,
                    "assessment": severity,
                    "recommendation": self._get_health_recommendation(avg_health, trend),
                    "benchmark": "WHO recommends minimum 5% of GDP, optimal >8%"
                })

        return insights

    def _analyze_education_sdg4(self) -> List[Dict[str, Any]]:
        insights = []

        edu_col = self._find_column(['education_expenditure', 'education_spending', 'education_budget'])

        if edu_col:
            edu_data = pd.to_numeric(self.df[edu_col], errors='coerce').dropna()

            if len(edu_data) > 0:
                avg_edu = edu_data.mean()
                trend = self._calculate_trend(edu_data)

                if avg_edu < 15:
                    status = "critical"
                    severity = "Education funding below UNESCO benchmark"
                elif avg_edu < 20:
                    status = "warning"
                    severity = "Education funding approaching minimum standards"
                else:
                    status = "good"
                    severity = "Education investment meets international standards"

                insights.append({
                    "sdgNumber": 4,
                    "sdgName": "Quality Education",
                    "indicator": edu_col,
                    "value": round(avg_edu, 2),
                    "unit": "% of Budget",
                    "trend": trend,
                    "status": status,
                    "assessment": severity,
                    "recommendation": self._get_education_recommendation(avg_edu, trend),
                    "benchmark": "UNESCO recommends 15-20% of government budget"
                })

        return insights

    def _analyze_economic_growth_sdg8(self) -> List[Dict[str, Any]]:
        insights = []

        gdp_growth_col = self._find_column(['gdp_growth', 'growth_rate', 'economic_growth'])
        unemployment_col = self._find_column(['unemployment', 'unemployment_rate', 'jobless'])

        if gdp_growth_col:
            growth_data = pd.to_numeric(self.df[gdp_growth_col], errors='coerce').dropna()

            if len(growth_data) > 0:
                avg_growth = growth_data.mean()
                trend = self._calculate_trend(growth_data)

                if avg_growth < 3:
                    status = "critical"
                    severity = "Growth insufficient for job creation"
                elif avg_growth < 5:
                    status = "warning"
                    severity = "Moderate growth, more needed for development"
                else:
                    status = "good"
                    severity = "Strong growth supporting economic development"

                insights.append({
                    "sdgNumber": 8,
                    "sdgName": "Decent Work and Economic Growth",
                    "indicator": gdp_growth_col,
                    "value": round(avg_growth, 2),
                    "unit": "%",
                    "trend": trend,
                    "status": status,
                    "assessment": severity,
                    "recommendation": self._get_growth_recommendation(avg_growth, trend),
                    "benchmark": "Developing economies target: 5-7% annual growth"
                })

        return insights

    def _analyze_infrastructure_sdg9(self) -> List[Dict[str, Any]]:
        insights = []

        capital_col = self._find_column(['capital_expenditure', 'infrastructure_spending', 'capex'])

        if capital_col:
            capital_data = pd.to_numeric(self.df[capital_col], errors='coerce').dropna()

            if len(capital_data) > 0:
                avg_capital = capital_data.mean()
                trend = self._calculate_trend(capital_data)

                if avg_capital < 20:
                    status = "critical"
                    severity = "Infrastructure investment critically low"
                elif avg_capital < 30:
                    status = "warning"
                    severity = "Infrastructure spending below optimal levels"
                else:
                    status = "good"
                    severity = "Strong infrastructure investment"

                insights.append({
                    "sdgNumber": 9,
                    "sdgName": "Industry, Innovation and Infrastructure",
                    "indicator": capital_col,
                    "value": round(avg_capital, 2),
                    "unit": "% of Budget",
                    "trend": trend,
                    "status": status,
                    "assessment": severity,
                    "recommendation": self._get_infrastructure_recommendation(avg_capital, trend),
                    "benchmark": "Developing economies need 25-35% for capital expenditure"
                })

        return insights

    def _analyze_inequality_sdg10(self) -> List[Dict[str, Any]]:
        insights = []

        gini_col = self._find_column(['gini', 'gini_index', 'gini_coefficient', 'inequality'])

        if gini_col:
            gini_data = pd.to_numeric(self.df[gini_col], errors='coerce').dropna()

            if len(gini_data) > 0:
                avg_gini = gini_data.mean()
                trend = self._calculate_trend(gini_data)

                if avg_gini > 50:
                    status = "critical"
                    severity = "Severe income inequality"
                elif avg_gini > 40:
                    status = "warning"
                    severity = "High inequality levels"
                else:
                    status = "good"
                    severity = "Moderate inequality"

                insights.append({
                    "sdgNumber": 10,
                    "sdgName": "Reduced Inequalities",
                    "indicator": gini_col,
                    "value": round(avg_gini, 2),
                    "unit": "Index (0-100)",
                    "trend": trend,
                    "status": status,
                    "assessment": severity,
                    "recommendation": self._get_inequality_recommendation(avg_gini, trend),
                    "benchmark": "Gini Index: <30 (low), 30-40 (moderate), >40 (high inequality)"
                })

        return insights

    def _get_poverty_recommendation(self, value: float, trend: str) -> str:
        if value > 30:
            return "Implement cash transfer programs, expand social safety nets, create employment opportunities, and improve access to basic services"
        elif value > 15:
            return "Strengthen targeted poverty reduction programs, improve agricultural productivity, and enhance vocational training"
        else:
            return "Maintain current programs while focusing on preventing poverty relapse through economic diversification"

    def _get_health_recommendation(self, value: float, trend: str) -> str:
        if value < 5:
            return "Urgent increase in health budget allocation, prioritize primary healthcare, preventive services, and maternal/child health"
        elif value < 8:
            return "Gradually increase health spending to WHO recommendations, improve health system efficiency and coverage"
        else:
            return "Optimize health spending efficiency, focus on quality improvement and equitable access"

    def _get_education_recommendation(self, value: float, trend: str) -> str:
        if value < 15:
            return "Increase education budget to minimum 15% of total budget, prioritize teacher training and basic infrastructure"
        else:
            return "Maintain funding levels while improving quality, equity, and relevance of education programs"

    def _get_growth_recommendation(self, value: float, trend: str) -> str:
        if value < 3:
            return "Implement economic reforms, diversify economy, improve business environment, and attract investment"
        elif value < 5:
            return "Support private sector growth, invest in productivity-enhancing infrastructure, and develop human capital"
        else:
            return "Sustain growth through innovation, technology adoption, and inclusive economic policies"

    def _get_infrastructure_recommendation(self, value: float, trend: str) -> str:
        if value < 20:
            return "Significantly increase capital expenditure for roads, energy, water, and digital infrastructure"
        elif value < 30:
            return "Continue infrastructure development with focus on connectivity and economic zones"
        else:
            return "Maintain infrastructure investment while ensuring quality and maintenance"

    def _get_inequality_recommendation(self, value: float, trend: str) -> str:
        if value > 50:
            return "Implement progressive taxation, expand social programs, improve wage policies, and enhance equal opportunities"
        elif value > 40:
            return "Strengthen redistributive policies, improve access to quality education and healthcare for all"
        else:
            return "Maintain inclusive growth policies and monitor inequality trends"

    def _assess_data_quality(self) -> str:
        identified_indicators = 0

        sdg_keywords = [
            'poverty', 'health', 'education', 'growth', 'unemployment',
            'infrastructure', 'capital', 'gini', 'inequality'
        ]

        for keyword in sdg_keywords:
            if any(keyword in col for col in self.column_names):
                identified_indicators += 1

        if identified_indicators >= 5:
            return "Excellent - Multiple SDG indicators detected"
        elif identified_indicators >= 3:
            return "Good - Several SDG indicators available"
        elif identified_indicators >= 1:
            return "Fair - Limited SDG indicators present"
        else:
            return "Limited - Few SDG-relevant indicators found"
