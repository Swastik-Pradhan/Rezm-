'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { localUpdateResume } from '@/store/resumeSlice';
import { X, Search } from 'lucide-react';

export default function SkillsSection() {
  const dispatch = useDispatch();
  const { currentResume } = useSelector((state) => state.resume);
  const skills = currentResume.skills || [];
  const [inputValue, setInputValue] = useState('');

  const updateSkills = (newSkills) => {
    dispatch(localUpdateResume({ skills: newSkills }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const addSkill = () => {
    const trimmed = inputValue.trim().replace(/,/g, '');
    if (trimmed && !skills.includes(trimmed)) {
      updateSkills([...skills, trimmed]);
      setInputValue('');
    }
  };

  const removeSkill = (indexToRemove) => {
    updateSkills(skills.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <p className="text-surface-500 text-sm mb-6">Add 5-10 core skills related to the job. Include technical and soft skills.</p>
      
      <div className="relative mb-6 flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-surface-400" />
          </div>
          <input
            type="text"
            className="input-field pl-9 py-2.5"
            placeholder="Type a skill and press Enter (e.g. React, Docker, Project Management)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button 
          onClick={addSkill}
          className="btn-secondary whitespace-nowrap"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div 
            key={index}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-100 border border-surface-200 text-surface-800 rounded-full text-sm font-medium animate-in fade-in zoom-in duration-200"
          >
            {skill}
            <button 
              onClick={() => removeSkill(index)}
              className="text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      
      {skills.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-surface-200 rounded-xl text-surface-400">
          No skills added yet
        </div>
      )}
    </div>
  );
}
