'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { localUpdateResume } from '@/store/resumeSlice';
import ProfileSection from './sections/ProfileSection';
import ExperienceSection from './sections/ExperienceSection';
import EducationSection from './sections/EducationSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import CustomSection from './sections/CustomSection';
import { motion, AnimatePresence } from 'framer-motion';

export default function CenterPanel() {
  const { currentResume } = useSelector((state) => state.resume);
  const [activeSection, setActiveSection] = useState('profile');

  if (!currentResume) return null;

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'experience':
        return <ExperienceSection />;
      case 'education':
        return <EducationSection />;
      case 'skills':
        return <SkillsSection />;
      case 'projects':
        return <ProjectsSection />;
      default:
        return <ProfileSection />;
    }
  };

  const getSectionTitle = (id) => {
    const titles = {
      profile: 'Personal Info',
      experience: 'Work Experience',
      education: 'Education',
      skills: 'Skills',
      projects: 'Projects',
    };
    if (titles[id]) return titles[id];
    
    // Check custom sections
    const customMatch = (currentResume.customSections || []).find(s => s.id === id);
    return customMatch ? customMatch.title || 'Custom Section' : 'Section';
  };

  return (
    <div className="h-full flex flex-col relative bg-surface-50/50">
      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar scroll-smooth">
        <div className="max-w-2xl mx-auto space-y-12 pb-32">
          
          {/* Loop through sections based on sectionOrder to render all forms stacked */}
          {currentResume.sectionOrder.map((sectionId) => (
            <motion.section 
              key={sectionId}
              id={sectionId}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              className="scroll-mt-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold text-surface-900 border-b-2 border-brand/20 pb-1 pr-4 inline-block">
                  {getSectionTitle(sectionId)}
                </h2>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-surface-200 shadow-sm">
                {(() => {
                  switch (sectionId) {
                    case 'profile': return <ProfileSection />;
                    case 'experience': return <ExperienceSection />;
                    case 'education': return <EducationSection />;
                    case 'skills': return <SkillsSection />;
                    case 'projects': return <ProjectsSection />;
                    default: 
                      // Fallback to custom section
                      return <CustomSection sectionId={sectionId} />;
                  }
                })()}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
      
      {/* Bottom fade gradient for scroll indication */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-surface-50 to-transparent pointer-events-none z-10"></div>
    </div>
  );
}
