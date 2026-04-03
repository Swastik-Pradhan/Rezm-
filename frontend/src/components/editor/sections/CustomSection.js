'use client';

import { useDispatch, useSelector } from 'react-redux';
import { localUpdateResume } from '@/store/resumeSlice';

export default function CustomSection({ sectionId }) {
  const dispatch = useDispatch();
  const { currentResume } = useSelector((state) => state.resume);
  
  const customSection = (currentResume.customSections || []).find(s => s.id === sectionId);
  
  if (!customSection) return null;

  const updateSection = (field, value) => {
    const updatedCustomSections = currentResume.customSections.map(section => 
      section.id === sectionId ? { ...section, [field]: value } : section
    );
    dispatch(localUpdateResume({ customSections: updatedCustomSections }));
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 text-xs text-surface-500">
        You can use this section for Volunteer Work, Languages, Hobbies, Certifications, etc.
      </div>
      
      <div>
        <label className="label-text">Section Title</label>
        <input
          type="text"
          className="input-field"
          value={customSection.title}
          onChange={(e) => updateSection('title', e.target.value)}
          placeholder="e.g. Certifications"
        />
      </div>

      <div>
        <label className="label-text">Content</label>
        <textarea
          className="input-field h-40 resize-y leading-relaxed"
          value={customSection.content}
          onChange={(e) => updateSection('content', e.target.value)}
          placeholder="List your items or describe your background here..."
        />
      </div>
    </div>
  );
}
