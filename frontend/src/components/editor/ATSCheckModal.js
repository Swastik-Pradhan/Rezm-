'use client';

import { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, Target, Zap } from 'lucide-react';
import api from '@/lib/api';

export default function ATSCheckModal({ isOpen, onClose, currentResume, onAnalysisComplete }) {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;
    setLoading(true);
    setError('');
    
    try {
      const cleanResumeForAnalysis = {
        profile: currentResume.profile,
        experience: currentResume.experience,
        education: currentResume.education,
        skills: currentResume.skills,
        projects: currentResume.projects,
        customSections: currentResume.customSections
      };

      const response = await api.post('/ai/analyze-ats', {
        jobDescription,
        resumeData: cleanResumeForAnalysis
      });
      
      setResult(response.data);
      if (onAnalysisComplete) {
        onAnalysisComplete(response.data.score);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to analyze ATS compatibility. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getColorClass = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBarColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const renderSectionScores = () => {
    if (!result?.sections) return null;
    const sections = result.sections;
    const sectionEntries = Object.entries(sections).filter(([key]) => key !== 'overall');
    
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-surface-800 mb-3 border-b border-surface-200 pb-2">
          Section Breakdown
        </h3>
        {sectionEntries.map(([name, data]) => (
          <div key={name} className="flex items-center gap-3">
            <span className="text-xs font-semibold text-surface-700 capitalize w-20">{name}</span>
            <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${getBarColor(data.score)}`}
                style={{ width: `${data.score}%` }}
              />
            </div>
            <span className={`text-xs font-bold w-8 text-right ${getColorClass(data.score)}`}>{data.score}%</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 bg-surface-50 shrink-0">
          <h2 className="text-xl font-bold text-surface-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-brand" />
            ATS Compatibility Matcher
          </h2>
          <button onClick={onClose} className="p-2 -mr-2 text-surface-400 hover:bg-surface-200 hover:text-surface-700 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {!result ? (
            <div className="space-y-4">
              <p className="text-sm text-surface-600">
                Paste the target Job Description below. Our AI will analyze your resume against the requirements, predicting how well you'd pass an Applicant Tracking System (ATS).
              </p>
              <div>
                <label className="label-text">Target Job Description</label>
                <textarea
                  className="input-field h-64 resize-y leading-relaxed text-sm"
                  placeholder="Paste the target job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex gap-2 items-start">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              {/* Score Display */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className={`text-6xl font-black ${getColorClass(result.score)} tracking-tight mb-2`}>
                  {result.score}%
                </div>
                <div className="text-surface-500 font-medium">ATS Match Score</div>
              </div>

              {/* Section Breakdown */}
              {renderSectionScores()}

              {/* Feedback Block */}
              <div className="bg-brand/5 border border-brand/20 p-5 rounded-xl">
                <h3 className="text-sm font-bold text-brand uppercase tracking-wider flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4" /> Actionable Feedback
                </h3>
                <p className="text-sm text-surface-700 leading-relaxed">
                  {result.feedback}
                </p>
              </div>

              {/* Matched Keywords */}
              {result.matchedKeywords && result.matchedKeywords.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-surface-800 mb-3 border-b border-surface-200 pb-2">
                    ✅ Matched Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.matchedKeywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded-lg text-xs font-bold shadow-sm whitespace-nowrap">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Keywords */}
              {result.missingKeywords && result.missingKeywords.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-surface-800 mb-3 border-b border-surface-200 pb-2">
                    ❌ Missing Keywords to Add
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-100 rounded-lg text-xs font-bold shadow-sm whitespace-nowrap">
                        {kw}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-surface-500 mt-3 italic">
                    Tip: Try incorporating these keywords into your Experience bullets or Skills section contextually.
                  </p>
                </div>
              )}
              
              {(!result.missingKeywords || result.missingKeywords.length === 0) && (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Your resume hits all the critical keywords! Great job.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-50 border-t border-surface-200 flex justify-end gap-3 shrink-0">
          {!result ? (
            <>
              <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-surface-700 hover:bg-surface-200 rounded-lg transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleAnalyze}
                disabled={!jobDescription.trim() || loading}
                className={`btn-primary px-6 py-2 flex items-center gap-2 ${(!jobDescription.trim() || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Target className="w-5 h-5" />}
                {loading ? 'Analyzing...' : 'Analyze Match'}
              </button>
            </>
          ) : (
             <>
              <button onClick={() => setResult(null)} className="px-5 py-2 text-sm font-medium text-surface-700 hover:bg-surface-200 rounded-lg transition-colors">
                Check Another JD
              </button>
              <button 
                onClick={onClose}
                className="btn-primary px-6 py-2 flex items-center gap-2"
              >
                Close & Enhance Resume
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
