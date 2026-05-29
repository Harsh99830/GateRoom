import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { GATE_BRANCHES } from '../constants';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Question definitions ──────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 'branch',
    title: "Which branch are you preparing for?",
    subtitle: "We'll compare you against rankers from your own branch.",
    type: 'select',
    options: GATE_BRANCHES.map(b => ({ label: `${b.name} (${b.code})`, value: b.code })),
    placeholder: 'Select your branch',
  },
  {
    id: 'targetYear',
    title: "Which GATE year are you targeting?",
    subtitle: "This sets the urgency of your preparation.",
    type: 'select',
    options: [
      { label: 'GATE 2026', value: '2026' },
      { label: 'GATE 2027', value: '2027' },
      { label: 'GATE 2028', value: '2028' },
      { label: 'GATE 2029', value: '2029' },
    ],
    placeholder: 'Select target year',
  },
  {
    id: 'attemptNumber',
    title: "Is this your first GATE attempt?",
    subtitle: "Repeat aspirants have different benchmarks — we account for that.",
    type: 'choice',
    options: [
      { label: '1st attempt', value: '1' },
      { label: '2nd attempt', value: '2' },
      { label: '3rd attempt', value: '3' },
      { label: '4th or more', value: '4' },
    ],
  },
  {
    id: 'collegeType',
    title: "What's your college background?",
    subtitle: "Sets your baseline. No judgment — just calibration.",
    type: 'choice',
    options: [
      { label: 'IIT / IISc', value: 'iit' },
      { label: 'NIT / IIIT', value: 'nit' },
      { label: 'State Government College', value: 'state' },
      { label: 'Private College', value: 'private' },
    ],
  },
  {
    id: 'monthsOfPrep',
    title: "How many months have you been preparing?",
    subtitle: "Count from when you seriously started, not from enrollment.",
    type: 'number',
    placeholder: 'e.g. 4',
    unit: 'months',
    min: 0,
    max: 36,
  },
  {
    id: 'hoursPerDay',
    title: "How many hours do you study per day on average?",
    subtitle: "Be honest — overreporting only hurts your rank prediction.",
    type: 'number',
    placeholder: 'e.g. 6',
    unit: 'hours/day',
    min: 0,
    max: 18,
  },
  {
    id: 'syllabusCoverage',
    title: "How much syllabus have you completed?",
    subtitle: "A rough honest range is enough. You can update details later through daily check-ins.",
    type: 'choice',
    options: [
      { label: 'Not started', value: '0' },
      { label: 'Below 25%', value: '20' },
      { label: '25% - 50%', value: '40' },
      { label: '50% - 75%', value: '65' },
      { label: 'Above 75%', value: '85' },
      { label: 'Full syllabus', value: '100' },
    ],
  },
  {
    id: 'testSeries',
    title: "Which test series are you using?",
    subtitle: "Helps us calibrate your mock score against a common scale.",
    type: 'choice',
    options: [
      { label: 'MADE Easy', value: 'made_easy' },
      { label: 'Gate Academy', value: 'gate_academy' },
      { label: 'Ace Engineering', value: 'ace' },
      { label: 'TestBook / Unacademy', value: 'testbook' },
      { label: 'Self-made / Mixed', value: 'mixed' },
      { label: "Haven't started yet", value: 'none' },
    ],
  },
  {
    id: 'firstMockScore',
    title: "What's your latest mock test score?",
    subtitle: "This is the strongest signal for rank prediction. Skip if you haven't given one.",
    type: 'mock',
    placeholder: 'Score out of 100',
    min: 0,
    max: 100,
  },
];

// ─── Rank prediction logic ────────────────────────────────────────────────
function predictRank(data) {
  const mock = data.noMockYet ? null : Number(data.firstMockScore);
  const hours = Number(data.hoursPerDay) || 0;
  const months = Number(data.monthsOfPrep) || 0;
  const syllabus = Number(data.syllabusCoverage) || 0;
  const totalHours = hours * months * 30;

  // Weight: mock 40%, hours pace 20%, syllabus coverage 15%, prep maturity 15%, context 15%
  let score = 0;

  // Mock score component (0–40 pts)
  if (mock !== null && !isNaN(mock)) {
    if (mock >= 85) score += 40;
    else if (mock >= 75) score += 34;
    else if (mock >= 60) score += 26;
    else if (mock >= 45) score += 18;
    else if (mock >= 25) score += 10;
    else score += 4;
  } else {
    score += 10; // neutral if no mock yet
  }

  // Study hours component (0–20 pts)
  if (hours >= 10) score += 20;
  else if (hours >= 8) score += 17;
  else if (hours >= 6) score += 13;
  else if (hours >= 4) score += 9;
  else if (hours >= 2) score += 5;
  else score += 1;

  // Syllabus coverage component (0-15 pts)
  score += Math.min(15, Math.round(syllabus * 0.15));

  // Total hours accumulated (0-15 pts)
  if (totalHours >= 1800) score += 15;
  else if (totalHours >= 1200) score += 12;
  else if (totalHours >= 700) score += 8;
  else if (totalHours >= 300) score += 4;
  else score += 1;

  // Attempt number — repeat aspirants tend to do better (0–10 pts)
  const attempt = Number(data.attemptNumber) || 1;
  if (attempt === 2) score += 8;
  else if (attempt >= 3) score += 5;
  else score += 4;

  // College type — baseline adjustment (0–5 pts)
  const college = data.collegeType;
  if (college === 'iit') score += 5;
  else if (college === 'nit') score += 4;
  else if (college === 'state') score += 3;
  else score += 2;

  // Score -> rank range mapping
  // Score out of 95 points total
  let low, high;
  if (score >= 80) { low = 1; high = 50; }
  else if (score >= 70) { low = 50; high = 200; }
  else if (score >= 58) { low = 200; high = 700; }
  else if (score >= 46) { low = 700; high = 2000; }
  else if (score >= 34) { low = 2000; high = 6000; }
  else if (score >= 22) { low = 6000; high = 20000; }
  else if (score >= 12) { low = 20000; high = 60000; }
  else { low = 60000; high = 150000; }

  return { low, high, score };
}

// ─── Component ────────────────────────────────────────────────────────────
export default function Onboarding() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [noMockYet, setNoMockYet] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [predictedRank, setPredictedRank] = useState(null);
  const [error, setError] = useState('');

  const question = QUESTIONS[currentQ];
  const progress = Math.round(((currentQ + 1) / QUESTIONS.length) * 100);
  const currentAnswer = answers[question.id];

  const isAnswered = () => {
    if (question.type === 'mock') return noMockYet || (currentAnswer !== undefined && currentAnswer !== '');
    return currentAnswer !== undefined && currentAnswer !== '';
  };

  const handleSelect = (value) => {
    setAnswers(prev => ({ ...prev, [question.id]: value }));
  };

  const handleNext = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQ > 0) setCurrentQ(q => q - 1);
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError('');

    const rank = predictRank({ ...answers, noMockYet });

    const payload = {
      branch: answers.branch,
      targetYear: answers.targetYear,
      attemptNumber: Number(answers.attemptNumber) || 1,
      collegeType: answers.collegeType,
      monthsOfPrep: Number(answers.monthsOfPrep) || 0,
      hoursPerDay: Number(answers.hoursPerDay) || 0,
      syllabusCoverage: Number(answers.syllabusCoverage) || 0,
      testSeries: answers.testSeries || null,
      firstMockScore: noMockYet ? null : (Number(answers.firstMockScore) || null),
      noMockYet,
      predictedRankLow: rank.low,
      predictedRankHigh: rank.high,
    };

    try {
      const res = await fetch(`${API_URL}/api/auth/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to save');

      localStorage.setItem('gateProfile', JSON.stringify(data.gateProfile || {
        ...payload,
        mockScore: payload.firstMockScore,
        air: rank.low,
      }));
      setPredictedRank(rank);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Result screen ────────────────────────────────────────────────────────
  if (done && predictedRank) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-black flex items-center justify-center p-4 transition-colors duration-500">
        <div className="max-w-md w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-black dark:text-white" />
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-2">Based on your prep</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">You're currently on track for</p>
            <div className="text-5xl font-extrabold tracking-tighter text-black dark:text-white my-3">
              AIR {predictedRank.low.toLocaleString()} – {predictedRank.high.toLocaleString()}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              {noMockYet
                ? "Give your first mock test to sharpen this estimate significantly."
                : "Mock score is your strongest signal — keep improving it."}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 mb-8 text-sm text-gray-600 dark:text-gray-400">
            This is a starting baseline. As you log daily check-ins, your predicted rank will update in real time based on your actual progress vs AIR rankers.
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            Go to Dashboard <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // ── Question screen ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-black text-black dark:text-white flex flex-col transition-colors duration-500">

      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200 dark:bg-white/10">
        <div
          className="h-full bg-black dark:bg-white transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="GateRoom" className="w-6 h-6 invert dark:invert-0" />
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {currentQ + 1} of {QUESTIONS.length}
          </span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-gray-400 hover:text-black dark:hover:text-white transition-colors"
        >
          Skip for now
        </button>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-lg">

          {/* Question text */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              {question.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              {question.subtitle}
            </p>
          </div>

          {/* Answer input */}
          <div className="mb-8">

            {/* Select dropdown */}
            {question.type === 'select' && (
              <div className="space-y-2">
                {question.options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                      currentAnswer === opt.value
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                        : 'bg-white dark:bg-[#111] border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Choice chips */}
            {question.type === 'choice' && (
              <div className="grid grid-cols-2 gap-3">
                {question.options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`px-4 py-3 rounded-xl border transition-all text-sm font-medium text-center ${
                      currentAnswer === opt.value
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                        : 'bg-white dark:bg-[#111] border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Number input */}
            {question.type === 'number' && (
              <div className="relative">
                <input
                  type="number"
                  min={question.min}
                  max={question.max}
                  value={currentAnswer || ''}
                  onChange={e => handleSelect(e.target.value)}
                  placeholder={question.placeholder}
                  className="w-full px-4 py-4 text-2xl font-bold rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                  autoFocus
                />
                {question.unit && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                    {question.unit}
                  </span>
                )}
              </div>
            )}

            {/* Mock score input */}
            {question.type === 'mock' && (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={noMockYet ? '' : (currentAnswer || '')}
                    onChange={e => handleSelect(e.target.value)}
                    disabled={noMockYet}
                    placeholder={question.placeholder}
                    className={`w-full px-4 py-4 text-2xl font-bold rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all ${noMockYet ? 'opacity-40 cursor-not-allowed' : ''}`}
                    autoFocus={!noMockYet}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                    / 100
                  </span>
                </div>
                <label className="flex items-center gap-3 cursor-pointer w-fit">
                  <div
                    onClick={() => setNoMockYet(v => !v)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      noMockYet
                        ? 'bg-black dark:bg-white border-black dark:border-white'
                        : 'border-gray-300 dark:border-white/30'
                    }`}
                  >
                    {noMockYet && (
                      <svg className="w-3 h-3 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Haven't given any mock yet
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {currentQ > 0 && (
              <button
                onClick={handleBack}
                className="p-3 rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!isAnswered() || saving}
              className="flex-1 py-3.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {saving ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
              ) : currentQ === QUESTIONS.length - 1 ? (
                <>Get My Rank <CheckCircle2 className="w-5 h-5" /></>
              ) : (
                <>Next <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
