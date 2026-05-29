import React from 'react';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, Cell } from 'recharts';
import { Target, TrendingUp, AlertTriangle, Crosshair, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#111] p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-xl">
        <p className="font-bold mb-2 text-black dark:text-white">{label || 'Metric'}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="text-sm font-medium flex items-center gap-2 mb-1">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: entry.name === 'You' ? '#888' : entry.color }}
            ></span>
            <span className="text-gray-700 dark:text-gray-300">
              {entry.name}: <span className="text-black dark:text-white font-bold">{entry.value}</span>
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const renderLegendText = (value, entry) => {
  return <span className={value === 'You' ? 'text-black dark:text-white' : ''} style={value !== 'You' ? { color: entry.color } : {}}>{value}</span>;
};

const Analytics = () => {
  const navigate = useNavigate();
  const gateProfile = JSON.parse(localStorage.getItem('gateProfile') || '{}');
  const userHours = Number(gateProfile.hoursPerDay) || 0;
  const userMock = Number(gateProfile.mockScore) || 0;
  
  // AIR 1 Averages for comparison
  const AIR1_HOURS = 10;
  const AIR1_MOCK = 85;

  const comparisonData = [
    { name: 'Daily Hours', You: userHours, 'AIR 1': AIR1_HOURS },
    { name: 'Mock Score', You: userMock, 'AIR 1': AIR1_MOCK },
  ];

  const isProfileEmpty = !gateProfile.hoursPerDay;

  // Dynamic analysis for text fields
  const h = Number(gateProfile.hoursPerDay) || 0;
  const d = Number(gateProfile.daysPerWeek) || 0;
  const m = Number(gateProfile.monthsStudying) || 0;
  const totalHours = h * d * 4 * m;
  
  const completedText = gateProfile.completedSubjects || '';
  const weakText = gateProfile.weakSubjects || '';
  
  // Base syllabus score
  const completedCount = completedText.trim() === '' ? 0 : completedText.split(',').length;
  let syllabusScore = Math.min(completedCount * 15, 100);
  
  // Brutal reality cap: You can't fake syllabus completion if your total hours are low.
  if (totalHours < 50) syllabusScore = Math.min(syllabusScore, 5);
  else if (totalHours < 200) syllabusScore = Math.min(syllabusScore, 20);
  else if (totalHours < 500) syllabusScore = Math.min(syllabusScore, 50);

  // Revision score logic
  const weakCount = weakText.trim() === '' ? 5 : weakText.split(',').length;
  let revisionScore = Math.max(100 - (weakCount * 15), 10);
  
  // Brutal reality cap for revision
  if (totalHours < 100) revisionScore = Math.min(revisionScore, 10);
  else if (m < 3) revisionScore = Math.min(revisionScore, 30);
  else if (h < 3) revisionScore = Math.min(revisionScore, 40);

  if (isProfileEmpty) {
    syllabusScore = 0;
    revisionScore = 0;
  }

  const radarData = [
    { subject: 'Consistency', You: Math.min(userHours * 10, 100), AIR_1: 100, fullMark: 100 },
    { subject: 'Mock Tests', You: userMock, AIR_1: 90, fullMark: 100 },
    { subject: 'Syllabus', You: syllabusScore, AIR_1: 100, fullMark: 100 },
    { subject: 'Revision', You: revisionScore, AIR_1: 100, fullMark: 100 },
    { subject: 'Accuracy', You: userMock > 0 ? Math.min(userMock + 15, 100) : (isProfileEmpty ? 0 : 10), AIR_1: 95, fullMark: 100 },
  ];

  // Calculate Bar Chart Insights
  const hourDiff = AIR1_HOURS - userHours;
  const mockDiff = AIR1_MOCK - userMock;
  let barInsight = "";
  if (hourDiff > 0 && mockDiff > 0) {
    barInsight = `You are studying ${hourDiff} hours less and scoring ${mockDiff} marks below an AIR 1 topper.`;
  } else if (hourDiff <= 0 && mockDiff > 0) {
    barInsight = `Your study hours are great, but your mock score is ${mockDiff} marks below the target. Focus on accuracy!`;
  } else if (hourDiff > 0 && mockDiff <= 0) {
    barInsight = `Your mock scores are phenomenal, but try to increase study time by ${hourDiff} hours to maintain consistency.`;
  } else {
    barInsight = `You are performing at or above AIR 1 levels across core metrics. Outstanding!`;
  }

  // Calculate Radar Chart Insights (finding weakest subject)
  const radarDeficits = radarData.map(item => ({ subject: item.subject, deficit: item.AIR_1 - item.You }));
  radarDeficits.sort((a, b) => b.deficit - a.deficit);
  const weakestArea = radarDeficits[0].subject;
  let radarInsight = `Your weakest area right now is ${weakestArea}. Focus more on this to achieve a perfect AIR 1 shape.`;
  if (radarDeficits[0].deficit <= 10) {
    radarInsight = "Your competency shape is incredibly well-rounded. Keep it up!";
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-black text-black dark:text-white flex w-full">
      <Sidebar />
      
      <main className="flex-1 min-w-0">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 min-h-screen">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1">Performance Analytics</h2>
              <p className="text-gray-500">See how you stack up against an AIR 1 Topper.</p>
            </div>
            {isProfileEmpty && (
              <button 
                onClick={() => navigate('/onboarding')}
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium"
              >
                Update Stats to see Analytics
              </button>
            )}
          </div>

          {!isProfileEmpty ? (
            <div className="space-y-6">
              {/* Alert Section */}
              <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-5 flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-orange-700 dark:text-orange-400 mb-1">Reality Check: You are behind.</h4>
                  <p className="text-sm text-orange-600 dark:text-orange-300">
                    Toppers in your branch study an average of <strong>10 hours/day</strong> and score consistently above <strong>85 marks</strong>. 
                    You need to increase your output to bridge this gap.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Bar Chart Comparison */}
                <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
                  <h3 className="font-bold flex items-center gap-2 mb-6"><Crosshair className="w-5 h-5 text-blue-500" /> Core Metrics vs AIR 1</h3>
                  <div className="h-64 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
                        <Legend formatter={renderLegendText} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                        <Bar dataKey="You" fill="#000000" radius={[4, 4, 0, 0]} className="dark:fill-white" />
                        <Bar dataKey="AIR 1" fill="#FFB800" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-bold text-black dark:text-white mr-2">Insight:</span>
                    {barInsight}
                  </div>
                </div>

                {/* Radar Chart Metrics */}
                <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
                  <h3 className="font-bold flex items-center gap-2 mb-2"><Target className="w-5 h-5 text-red-500" /> Competency Radar</h3>
                  <div className="h-64 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#333" strokeDasharray="3 3" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Radar name="You" dataKey="You" stroke="#000000" fill="#000000" fillOpacity={0.3} className="dark:stroke-white dark:fill-white" />
                        <Radar name="AIR 1" dataKey="AIR_1" stroke="#FFB800" fill="#FFB800" fillOpacity={0.5} />
                        <Legend formatter={renderLegendText} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-bold text-black dark:text-white mr-2">Insight:</span>
                    {radarInsight}
                  </div>
                </div>

              </div>

              {/* Simple User Performance Footer */}
              <div className="text-center mt-12 mb-4">
                <p className="text-gray-500 font-bold tracking-widest uppercase text-xs mb-3">User Performance Report</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 max-w-2xl mx-auto italic">
                  "Success in GATE is not just about hard work; it's about identifying your weaknesses and systematically eliminating them. Let these insights guide your next study session."
                </p>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] border border-dashed border-gray-300 dark:border-white/20 rounded-3xl">
              <TrendingUp className="w-16 h-16 text-gray-300 dark:text-white/20 mb-4" />
              <h3 className="text-xl font-bold mb-2">No Data Available</h3>
              <p className="text-gray-500 mb-6">Complete your profile setup to unlock analytics.</p>
              <button 
                onClick={() => navigate('/onboarding')}
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Start Setup
              </button>
            </div>
          )}

        </div>
      </main>

      <RightSidebar />
    </div>
  );
};

export default Analytics;
