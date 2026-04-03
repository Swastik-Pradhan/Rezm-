'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { localUpdateResume } from '@/store/resumeSlice';
import api from '@/lib/api';
import { Upload, User, Mail, Phone, MapPin, Briefcase, Link as LinkIcon, Sparkles } from 'lucide-react';

export default function ProfileSection() {
  const dispatch = useDispatch();
  const { currentResume } = useSelector((state) => state.resume);
  const profile = currentResume.profile;
  const [uploading, setUploading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);

  const updateProfile = (field, value) => {
    dispatch(localUpdateResume({
      profile: { ...profile, [field]: value }
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    setUploading(true);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Prepend API URL since images are hosted on backend
      const photoUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${res.data.photoUrl}`;
      updateProfile('photoUrl', photoUrl);
    } catch (err) {
      console.error('Upload failed', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleAIEnhance = async () => {
    if (!profile.summary || profile.summary.trim().length < 10) {
      alert('Please write at least a basic summary before enhancing with AI.');
      return;
    }

    setEnhancing(true);
    try {
      const res = await api.post('/ai/enhance', {
        text: profile.summary,
        jobTitle: profile.jobTitle,
        section: 'summary'
      });
      
      updateProfile('summary', res.data.enhanced);
    } catch (error) {
      console.error('AI Error:', error);
      alert('Failed to enhance summary. Please try again.');
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Photo Upload */}
        <div className="flex-shrink-0">
          <div className="relative group cursor-pointer">
            <input 
              type="file" 
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={uploading}
            />
            <div className={`w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-colors ${
              profile.photoUrl ? 'border-brand' : 'border-surface-300 group-hover:border-brand/50 bg-surface-50 group-hover:bg-brand/5'
            }`}>
              {uploading ? (
                <div className="w-5 h-5 border-2 border-brand/30 border-t-brand rounded-full animate-spin"></div>
              ) : profile.photoUrl ? (
                <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-surface-400 group-hover:text-brand mb-1" />
                  <span className="text-[10px] text-surface-500 font-medium">Add Photo</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="col-span-1 sm:col-span-2">
            <label className="label-text flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full Name</label>
            <input
              type="text"
              className="input-field py-2"
              placeholder="e.g. Alex Rivera"
              value={profile.fullName}
              onChange={(e) => updateProfile('fullName', e.target.value)}
            />
          </div>
          <div className="col-span-1 sm:col-span-2 border-b border-surface-100 pb-2 mb-2"></div>
          <div>
            <label className="label-text flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Job Title</label>
            <input
              type="text"
              className="input-field py-2"
              placeholder="e.g. Senior Product Designer"
              value={profile.jobTitle}
              onChange={(e) => updateProfile('jobTitle', e.target.value)}
            />
          </div>
          <div>
            <label className="label-text flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</label>
            <input
              type="email"
              className="input-field py-2"
              placeholder="alex@example.com"
              value={profile.email}
              onChange={(e) => updateProfile('email', e.target.value)}
            />
          </div>
          <div>
            <label className="label-text flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone</label>
            <input
              type="tel"
              className="input-field py-2"
              placeholder="+1 (555) 123-4567"
              value={profile.phone}
              onChange={(e) => updateProfile('phone', e.target.value)}
            />
          </div>
          <div>
            <label className="label-text flex items-center gap-1.5"><LinkIcon className="w-3.5 h-3.5" /> LinkedIn</label>
            <input
              type="text"
              className="input-field py-2"
              placeholder="linkedin.com/in/alex"
              value={profile.linkedin}
              onChange={(e) => updateProfile('linkedin', e.target.value)}
            />
          </div>
          <div>
            <label className="label-text flex items-center gap-1.5"><LinkIcon className="w-3.5 h-3.5" /> GitHub</label>
            <input
              type="text"
              className="input-field py-2"
              placeholder="github.com/alex"
              value={profile.github}
              onChange={(e) => updateProfile('github', e.target.value)}
            />
          </div>
          <div className="col-span-1 sm:col-span-2 border-b border-surface-100 pb-2 mt-2"></div>
        </div>
      </div>

      {/* Professional Summary + AI Enhance */}
      <div>
        <div className="flex justify-between items-end mb-2">
          <label className="label-text !mb-0 text-base font-semibold text-surface-800">Professional Summary</label>
          <button
            onClick={handleAIEnhance}
            disabled={enhancing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
              ${enhancing 
                ? 'bg-surface-100 text-surface-400 cursor-not-allowed' 
                : 'bg-brand/10 text-brand hover:bg-brand/20 transition-colors'
              }`}
          >
            {enhancing ? (
               <div className="w-3 h-3 border-2 border-brand/30 border-t-brand rounded-full animate-spin"></div>
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            Enhance with AI
          </button>
        </div>
        <p className="text-xs text-surface-500 mb-3">Detail your professional journey concisely.</p>
        <textarea
          className="input-field h-32 py-3 leading-relaxed resize-y"
          placeholder="Briefly describe your professional background, key achievements, and what you bring to the table..."
          value={profile.summary}
          onChange={(e) => updateProfile('summary', e.target.value)}
        />
      </div>
    </div>
  );
}
