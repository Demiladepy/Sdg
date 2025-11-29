import { DataRow, ColumnMeta } from '../types';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Users, Heart, GraduationCap, Building2 } from 'lucide-react';

interface SDGInsightsProps {
  data: DataRow[];
  columns: Record<string, ColumnMeta>;
}

export default function SDGInsights({ data, columns }: SDGInsightsProps) {
  const calculateAverage = (columnName: string): number => {
    const values = data
      .map(row => parseFloat(row[columnName]))
      .filter(v => !isNaN(v));
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  };

  const calculateTrend = (columnName: string): 'up' | 'down' | 'stable' => {
    const values = data
      .map(row => parseFloat(row[columnName]))
      .filter(v => !isNaN(v));

    if (values.length < 2) return 'stable';

    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const change = ((avgSecond - avgFirst) / avgFirst) * 100;

    if (Math.abs(change) < 2) return 'stable';
    return change > 0 ? 'up' : 'down';
  };

  const getSDGInsights = () => {
    const insights = [];
    const columnNames = Object.keys(columns);

    if (columnNames.some(c => c.toLowerCase().includes('poverty') || c.toLowerCase().includes('income'))) {
      const povertyCol = columnNames.find(c => c.toLowerCase().includes('poverty')) || columnNames[0];
      const avgPoverty = calculateAverage(povertyCol);
      const trend = calculateTrend(povertyCol);

      insights.push({
        sdg: 'SDG 1: No Poverty',
        icon: Users,
        color: 'red',
        status: avgPoverty > 30 ? 'critical' : avgPoverty > 15 ? 'warning' : 'good',
        metric: `${avgPoverty.toFixed(1)}%`,
        label: 'Average Poverty Rate',
        trend,
        insight: trend === 'down'
          ? 'Positive trend: Poverty rates declining'
          : 'Action needed: Poverty rates remain high or increasing',
        recommendation: 'Focus on employment programs, social safety nets, and progressive taxation'
      });
    }

    if (columnNames.some(c => c.toLowerCase().includes('health') || c.toLowerCase().includes('expenditure'))) {
      const healthCol = columnNames.find(c => c.toLowerCase().includes('health')) || columnNames[0];
      const avgHealth = calculateAverage(healthCol);
      const trend = calculateTrend(healthCol);

      insights.push({
        sdg: 'SDG 3: Good Health',
        icon: Heart,
        color: 'green',
        status: avgHealth < 5 ? 'critical' : avgHealth < 8 ? 'warning' : 'good',
        metric: `${avgHealth.toFixed(1)}%`,
        label: 'Health Expenditure',
        trend,
        insight: avgHealth < 5
          ? 'Critical: Health spending below WHO minimum'
          : 'Health investment approaching target levels',
        recommendation: 'Increase allocation to primary healthcare and preventive services'
      });
    }

    if (columnNames.some(c => c.toLowerCase().includes('education'))) {
      const eduCol = columnNames.find(c => c.toLowerCase().includes('education')) || columnNames[0];
      const avgEdu = calculateAverage(eduCol);
      const trend = calculateTrend(eduCol);

      insights.push({
        sdg: 'SDG 4: Quality Education',
        icon: GraduationCap,
        color: 'blue',
        status: avgEdu < 15 ? 'critical' : avgEdu < 20 ? 'warning' : 'good',
        metric: `${avgEdu.toFixed(1)}%`,
        label: 'Education Expenditure',
        trend,
        insight: avgEdu < 15
          ? 'Below UNESCO benchmark of 15-20% of budget'
          : 'Education funding meets international standards',
        recommendation: 'Prioritize teacher training, infrastructure, and inclusive access'
      });
    }

    if (columnNames.some(c => c.toLowerCase().includes('gdp') || c.toLowerCase().includes('growth'))) {
      const gdpCol = columnNames.find(c => c.toLowerCase().includes('growth')) || columnNames.find(c => c.toLowerCase().includes('gdp')) || columnNames[0];
      const avgGrowth = calculateAverage(gdpCol);
      const trend = calculateTrend(gdpCol);

      insights.push({
        sdg: 'SDG 8: Economic Growth',
        icon: TrendingUp,
        color: 'orange',
        status: avgGrowth < 3 ? 'critical' : avgGrowth < 5 ? 'warning' : 'good',
        metric: `${avgGrowth.toFixed(1)}%`,
        label: 'Average GDP Growth',
        trend,
        insight: avgGrowth >= 5
          ? 'Strong growth supporting job creation'
          : 'Growth insufficient to reduce unemployment',
        recommendation: 'Diversify economy, support SMEs, and invest in productive sectors'
      });
    }

    if (columnNames.some(c => c.toLowerCase().includes('capital') || c.toLowerCase().includes('infrastructure'))) {
      const capCol = columnNames.find(c => c.toLowerCase().includes('capital')) || columnNames[0];
      const avgCap = calculateAverage(capCol);
      const trend = calculateTrend(capCol);

      insights.push({
        sdg: 'SDG 9: Infrastructure',
        icon: Building2,
        color: 'gray',
        status: avgCap < 20 ? 'critical' : avgCap < 30 ? 'warning' : 'good',
        metric: `${avgCap.toFixed(1)}%`,
        label: 'Capital Expenditure',
        trend,
        insight: avgCap >= 30
          ? 'Strong infrastructure investment'
          : 'Infrastructure gap limiting growth potential',
        recommendation: 'Increase capital budget for roads, energy, and digital infrastructure'
      });
    }

    return insights;
  };

  const insights = getSDGInsights();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'red';
      case 'warning': return 'orange';
      case 'good': return 'green';
      default: return 'gray';
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, any> = {
      red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-600', badge: 'bg-red-100 text-red-700' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-600', badge: 'bg-orange-100 text-orange-700' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-600', badge: 'bg-green-100 text-green-700' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
      gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: 'text-gray-600', badge: 'bg-gray-100 text-gray-700' },
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">SDG Impact Analysis</h2>
            <p className="text-blue-100 text-lg">
              Evidence-based insights aligned with Sustainable Development Goals
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
            <p className="text-sm font-medium">Based on {data.length} records</p>
          </div>
        </div>
      </div>

      {insights.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">Limited SDG Insights Available</h3>
          <p className="text-yellow-700">
            Upload datasets with columns like poverty_rate, health_expenditure, education_expenditure,
            gdp_growth, or capital_expenditure to see SDG-aligned policy insights.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {insights.map((insight, idx) => {
            const Icon = insight.icon;
            const statusColor = getStatusColor(insight.status);
            const statusColors = getColorClasses(statusColor);
            const colors = getColorClasses(insight.color);

            return (
              <div
                key={idx}
                className={`${colors.bg} border ${colors.border} rounded-xl p-6 hover:shadow-lg transition-all`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 ${colors.badge} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-7 h-7 ${colors.icon}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className={`text-xl font-bold ${colors.text} mb-1`}>{insight.sdg}</h3>
                        <p className="text-sm text-gray-600">{insight.label}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${colors.text} mb-1`}>{insight.metric}</div>
                        <div className="flex items-center gap-1 justify-end">
                          {insight.trend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : insight.trend === 'down' ? (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          ) : null}
                          <span className="text-xs text-gray-500 capitalize">{insight.trend}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className={`${statusColors.bg} border ${statusColors.border} rounded-lg p-3`}>
                        <div className="flex items-start gap-2">
                          {insight.status === 'good' ? (
                            <CheckCircle className={`w-5 h-5 ${statusColors.icon} flex-shrink-0 mt-0.5`} />
                          ) : (
                            <AlertCircle className={`w-5 h-5 ${statusColors.icon} flex-shrink-0 mt-0.5`} />
                          )}
                          <div>
                            <p className={`font-semibold ${statusColors.text} mb-1`}>Insight</p>
                            <p className="text-sm text-gray-700">{insight.insight}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/50 rounded-lg p-3">
                        <p className="font-semibold text-gray-900 mb-1 text-sm">Policy Recommendation</p>
                        <p className="text-sm text-gray-700">{insight.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Methodology</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
          <div>
            <p className="font-semibold mb-2">Data Analysis</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Automated detection of relevant indicators</li>
              <li>Trend analysis across time periods</li>
              <li>Benchmark comparison with international standards</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">SDG Alignment</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Direct mapping to 7 development goals</li>
              <li>Evidence-based policy recommendations</li>
              <li>Actionable insights for decision-makers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
