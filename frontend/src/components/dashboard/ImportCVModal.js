'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { X, Upload, FileText, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import api from '@/lib/api';
import { createResume, localUpdateResume } from '@/store/resumeSlice';

export default function ImportCVModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [cloneDesign, setCloneDesign] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (uploadedFile) => {
    setError('');
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(uploadedFile.type)) {
      setError('Please upload a PDF, PNG, or JPEG file.');
      setFile(null);
      return;
    }
    if (uploadedFile.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
      setFile(null);
      return;
    }
    setFile(uploadedFile);
  };

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    try {
      // 1. Create a blank resume first
      const title = file.name.replace(/\.[^/.]+$/, "") + ' (Imported)';
      const actionResult = await dispatch(createResume(title));
      
      if (!createResume.fulfilled.match(actionResult)) {
        throw new Error('Failed to create resume stub');
      }
      
      const resumeId = actionResult.payload._id;

      // 2. Upload and Parse file via Gemini API
      const formData = new FormData();
      formData.append('file', file);

      let extractedData;
      let aiHtml = '';

      if (cloneDesign) {
        const importRes = await api.post('/ai/import-template', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        extractedData = importRes.data.extractedData;
        aiHtml = importRes.data.handlebarTemplate;
      } else {
        const importRes = await api.post('/ai/import', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        extractedData = importRes.data;
      }

      // 3. Update the created resume with the extracted data
      const updates = {
        profile: { ...actionResult.payload.profile, ...extractedData.profile },
        experience: extractedData.experience || [],
        education: extractedData.education || [],
        skills: extractedData.skills || [],
        projects: extractedData.projects || [],
        customSections: extractedData.customSections || [],
      };

      // Preserve original section order if AI detected it
      if (extractedData.sectionOrder && extractedData.sectionOrder.length > 0) {
        updates.sectionOrder = extractedData.sectionOrder;
      }

      if (cloneDesign && aiHtml) {
        updates.template = 'custom-ai';
        updates.customTemplateHtml = aiHtml;
      }

      await api.put(`/resumes/${resumeId}`, updates);

      // Redirect to the editor to review the extraction
      router.push(`/editor/${resumeId}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to parse resume. Ensure the file is readable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 bg-surface-50">
          <h2 className="text-xl font-bold text-surface-900 flex items-center gap-2">
            <Upload className="w-5 h-5 text-brand" />
            Import Existing CV
          </h2>
          <button onClick={onClose} className="p-2 -mr-2 text-surface-400 hover:bg-surface-200 hover:text-surface-700 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-surface-600 mb-6">
            Upload your existing resume (PDF or Image). Our AI will extract your profile, experience, and education, allowing you to seamlessly convert it into one of our professional templates.
          </p>

          <div 
            className={`
              relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors
              ${dragActive ? 'border-brand bg-brand/5' : 'border-surface-300 hover:border-brand/40 bg-surface-50/50'}
              ${file ? 'border-brand/50 bg-brand/5' : ''}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-brand" />
                </div>
                <p className="text-sm font-semibold text-surface-900 mb-1">{file.name}</p>
                <p className="text-xs text-surface-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button 
                  onClick={() => setFile(null)}
                  className="text-xs text-red-500 font-medium mt-3 hover:underline"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                  <Upload className="w-5 h-5 text-surface-400" />
                </div>
                <p className="text-sm font-medium text-surface-900 mb-1">Drag and drop your file here</p>
                <p className="text-xs text-surface-500 mb-4">Supports PDF, PNG, or JPEG (Max 10MB)</p>
                <label className="btn-secondary px-4 py-2 cursor-pointer inline-block text-sm">
                  Browse Files
                  <input type="file" className="hidden" accept=".pdf,image/png,image/jpeg" onChange={handleFileChange} />
                </label>
              </>
            )}
          </div>

          <div className="mt-5 p-4 border border-surface-200 rounded-xl bg-surface-50 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-surface-900">AI Clone Design <span className="text-[10px] bg-brand text-white px-2 py-0.5 rounded-full ml-1">BETA</span></h4>
              <p className="text-xs text-surface-500 mt-1 mr-4">Don't just extract text — fully clone the visual layout, colors, and fonts of this exact resume into a custom editable template!</p>
            </div>
            <button
               onClick={() => setCloneDesign(!cloneDesign)}
               className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 border-2 border-transparent ${cloneDesign ? 'bg-brand' : 'bg-surface-300'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${cloneDesign ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex gap-2 items-start">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-50 border-t border-surface-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-surface-700 hover:bg-surface-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleImport}
            disabled={!file || loading}
            className={`btn-primary px-6 py-2 flex items-center gap-2 ${(!file || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? 'Analyzing...' : 'Import Resume'}
          </button>
        </div>
      </div>
    </div>
  );
}
