import { TrendingUp, Users, Heart, GraduationCap, Building2, Scale, Shield } from 'lucide-react';

export default function Hero() {
  const sdgs = [
    { icon: Users, label: 'No Poverty', color: 'text-red-600', bg: 'bg-red-50' },
    { icon: Heart, label: 'Good Health', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: GraduationCap, label: 'Quality Education', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: TrendingUp, label: 'Economic Growth', color: 'text-orange-600', bg: 'bg-orange-50' },
    { icon: Building2, label: 'Infrastructure', color: 'text-gray-600', bg: 'bg-gray-50' },
    { icon: Scale, label: 'Reduced Inequality', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Shield, label: 'Strong Institutions', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-200">AI-Powered Policy Intelligence</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            Transforming Data into
            <br />
            Sustainable Development
          </h1>

          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Empowering evidence-based policymaking across Africa through integrated analysis of fiscal,
            economic, and demographic data for sustainable governance and inclusive growth
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {sdgs.map((sdg, idx) => {
            const Icon = sdg.icon;
            return (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer group"
              >
                <div className={`w-10 h-10 ${sdg.bg} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${sdg.color}`} />
                </div>
                <p className="text-xs font-medium text-white/90 leading-tight">{sdg.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Integrated Analytics</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Connect fragmented macroeconomic indicators to reveal patterns in poverty, health, education, and governance
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Policy Intelligence</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Generate actionable insights from budget data, trade flows, and demographic trends for better decision-making
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-purple-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">SDG Alignment</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Direct impact on 7 Sustainable Development Goals through transparent, data-driven resource allocation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
