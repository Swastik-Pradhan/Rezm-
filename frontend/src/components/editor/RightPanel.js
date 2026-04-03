'use client';

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CheckCircle2, Download } from 'lucide-react';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import BoldTemplate from './templates/BoldTemplate';
import CustomAITemplate from './templates/CustomAITemplate';
import ATSCheckModal from './ATSCheckModal';

export default function RightPanel() {
  const { currentResume } = useSelector((state) => state.resume);
  const resumeRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isATSModalOpen, setIsATSModalOpen] = useState(false);
  const [atsScore, setAtsScore] = useState(0);

  useEffect(() => {
    const handleExport = async () => {
      if (!resumeRef.current) return;
      setExporting(true);
      
      try {
        const canvas = await html2canvas(resumeRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          windowWidth: 800
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${currentResume?.title || 'resume'}.pdf`);
        
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
      } catch (err) {
        console.error('PDF generation failed:', err);
        alert('Failed to generate PDF. Please try again.');
      } finally {
        setExporting(false);
      }
    };

    window.addEventListener('export-pdf', handleExport);
    return () => window.removeEventListener('export-pdf', handleExport);
  }, [currentResume]);

  // Proper ATS scoring based on resume content quality
  useEffect(() => {
    if (!currentResume || atsScore !== 0) return;

    const content = JSON.stringify(currentResume).toLowerCase();
    let score = 0;
    let checks = 0;
    const totalChecks = 10;

    // 1. Has a professional summary (10%)
    checks++;
    if (currentResume.profile?.summary && currentResume.profile.summary.length > 50) score += 10;

    // 2. Has contact info complete (10%)
    checks++;
    const contactFields = [currentResume.profile?.email, currentResume.profile?.phone, currentResume.profile?.fullName];
    const filledContacts = contactFields.filter(f => f && f.trim().length > 0).length;
    score += Math.round((filledContacts / 3) * 10);

    // 3. Has experience with bullet points (15%)
    checks++;
    const expWithBullets = (currentResume.experience || []).filter(e => e.bullets && e.bullets.length > 0);
    if (expWithBullets.length > 0) score += 15;

    // 4. Bullets use action verbs (15%)
    checks++;
    const actionVerbs = ['led', 'managed', 'developed', 'created', 'designed', 'implemented', 'built', 'improved', 'increased', 'reduced', 'achieved', 'delivered', 'launched', 'optimized', 'established', 'spearheaded', 'orchestrated', 'streamlined'];
    const allBullets = (currentResume.experience || []).flatMap(e => e.bullets || []).join(' ').toLowerCase();
    const actionVerbCount = actionVerbs.filter(v => allBullets.includes(v)).length;
    score += Math.min(Math.round((actionVerbCount / 5) * 15), 15);

    // 5. Has quantified metrics in bullets (10%)
    checks++;
    const hasNumbers = /\d+%|\$\d+|\d+\+|\d+ (users|clients|projects|team|people|months|years)/i.test(allBullets);
    if (hasNumbers) score += 10;

    // 6. Has skills section (10%)
    checks++;
    if (currentResume.skills && currentResume.skills.length >= 3) score += 10;

    // 7. Has education (10%)
    checks++;
    if (currentResume.education && currentResume.education.length > 0) score += 10;

    // 8. Has projects or certifications (5%)
    checks++;
    if ((currentResume.projects && currentResume.projects.length > 0) || 
        (currentResume.customSections && currentResume.customSections.length > 0)) score += 5;

    // 9. All experience entries have dates (10%)
    checks++;
    const expWithDates = (currentResume.experience || []).filter(e => e.startDate && e.endDate);
    if (currentResume.experience?.length > 0 && expWithDates.length === currentResume.experience.length) score += 10;

    // 10. Job title is set (5%)
    checks++;
    if (currentResume.profile?.jobTitle && currentResume.profile.jobTitle.trim().length > 0) score += 5;

    setAtsScore(Math.min(score, 100));
  }, [currentResume, atsScore]);

  if (!currentResume) return null;

  const renderTemplateView = () => {
    switch(currentResume.template) {
      case 'modern': return <ModernTemplate resume={currentResume} />;
      case 'classic': return <ClassicTemplate resume={currentResume} />;
      case 'minimal': return <MinimalTemplate resume={currentResume} />;
      case 'bold': return <BoldTemplate resume={currentResume} />;
      case 'professional': return <ProfessionalTemplate resume={currentResume} />;
      case 'creative': return <CreativeTemplate resume={currentResume} />;
      case 'custom-ai': return <CustomAITemplate resume={currentResume} />;
      default: return <ModernTemplate resume={currentResume} />;
    }
  };

  return (
    <div className="h-full flex flex-col relative w-full bg-[#E5E7EB]">
      {/* ATS Meter Header */}
      <div 
        className="h-14 bg-white border-b border-surface-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm cursor-pointer hover:bg-surface-50 transition-colors group"
        onClick={() => setIsATSModalOpen(true)}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-surface-200"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`transition-all duration-1000 ${atsScore >= 80 ? 'text-green-500' : atsScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`}
                strokeDasharray={`${atsScore}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-surface-900">{atsScore}</span>
          </div>
          <div>
            <div className="text-xs font-bold text-surface-900 tracking-wider flex items-center gap-2 group-hover:text-brand transition-colors">
              ATS SCORE <span className="text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded font-bold uppercase tracking-widest hidden group-hover:inline-block">Analyze against JD</span>
            </div>
            <div className="text-[10px] text-surface-500">Based on content quality analysis</div>
          </div>
        </div>
      </div>

      {/* PDF Export Overlay */}
      {exporting && (
        <div className="absolute inset-x-0 inset-y-14 bg-white/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-brand border-t-white rounded-full animate-spin mb-4 shadow-lg"></div>
          <p className="text-brand font-semibold shadow-sm px-4 py-1 bg-white rounded-full">Generating PDF...</p>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="absolute inset-x-0 inset-y-14 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white p-6 rounded-2xl shadow-2xl border border-surface-200 flex flex-col items-center animate-in zoom-in duration-300 pointer-events-auto">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-surface-900 mb-1">PDF Generated Successfully!</h3>
            <p className="text-sm text-surface-500 mb-6">Your professional resume is ready.</p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="px-6 py-2 bg-brand text-white text-sm font-medium rounded-md hover:bg-brand-light transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ATS Modal */}
      <ATSCheckModal 
        isOpen={isATSModalOpen} 
        onClose={() => setIsATSModalOpen(false)} 
        currentResume={currentResume}
        onAnalysisComplete={(realScore) => setAtsScore(realScore)}
      />

      {/* Canvas Area (Scrollable Background) */}
      <div className="flex-1 overflow-auto p-8 flex justify-center w-full custom-scrollbar items-start">
        {/* A4 Page Container */}
        <div 
          ref={resumeRef}
          className="bg-white shadow-lg overflow-hidden shrink-0 origin-top"
          style={{ 
            width: '800px', 
            minHeight: '1056px',
            transform: 'scale(0.85)',
            transformOrigin: 'top center',
            marginBottom: '-15%' 
          }}
        >
          {renderTemplateView()}
        </div>
      </div>
    </div>
  );
}
