'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResumeById, updateResume } from '@/store/resumeSlice';
import ProtectedRoute from '@/components/ProtectedRoute';
import LeftPanel from '@/components/editor/LeftPanel';
import CenterPanel from '@/components/editor/CenterPanel';
import RightPanel from '@/components/editor/RightPanel';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Editor({ params }) {
  const { id } = params;
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentResume, loading, saveStatus } = useSelector((state) => state.resume);

  // Debounced save
  useEffect(() => {
    let timeoutId;
    if (saveStatus === 'saving' && currentResume) {
      timeoutId = setTimeout(() => {
        dispatch(updateResume({ id, updates: currentResume }));
      }, 500); // 500ms debounce
    }
    return () => clearTimeout(timeoutId);
  }, [currentResume, saveStatus, dispatch, id]);

  useEffect(() => {
    dispatch(fetchResumeById(id));
  }, [dispatch, id]);

  if (loading && !currentResume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentResume) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50">
        <h2 className="text-xl font-bold mb-4">Resume not found</h2>
        <button onClick={() => router.push('/dashboard')} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleExportPDF = () => {
    // This will trigger the right panel's internal PDF export logic via state/event
    const event = new CustomEvent('export-pdf');
    window.dispatchEvent(event);
  };

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col bg-surface-50 overflow-hidden">
        {/* Editor Navbar */}
        <nav className="h-14 bg-white border-b border-surface-200 flex-shrink-0 z-30">
          <div className="h-full px-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="p-1.5 text-surface-500 hover:bg-surface-100 rounded-md transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="h-4 w-px bg-surface-300"></div>
              <input
                type="text"
                value={currentResume.title}
                onChange={(e) => dispatch({ 
                  type: 'resume/localUpdateResume', 
                  payload: { title: e.target.value } 
                })}
                className="font-semibold text-surface-900 bg-transparent border-none focus:ring-0 focus:outline-none placeholder-surface-400 p-0 text-lg w-64 hover:bg-surface-50 focus:bg-white rounded transition-colors"
                placeholder="Untitled Resume"
              />
            </div>

            <div className="flex flex-1 justify-center space-x-12 px-6">
                {/* Save status indicator */}
                <div className="flex items-center gap-2 text-sm text-surface-500 font-medium whitespace-nowrap hidden md:flex">
                  {saveStatus === 'saving' && (
                    <>
                      <div className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin"></div>
                      Saving changes...
                    </>
                  )}
                  {saveStatus === 'saved' && (
                    <>
                      <Save className="w-4 h-4 text-green-500" />
                      All changes saved
                    </>
                  )}
                </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleExportPDF}
                className="btn-primary flex items-center justify-center gap-2 px-4 py-1.5 shadow-sm hover:shadow text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </nav>

        {/* 3-Panel Layout */}
        <main className="flex-1 flex overflow-hidden">
          {/* Left Panel - Templates & Sections order (15% width, max 300px) */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-[280px] flex-shrink-0 bg-white border-r border-surface-200 z-20 flex flex-col"
          >
            <LeftPanel />
          </motion.div>

          {/* Center Panel - Form Editor (40% width) */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex-1 min-w-[400px] border-r border-surface-200 bg-surface-50 z-10 flex flex-col shadow-inner"
          >
            <CenterPanel />
          </motion.div>

          {/* Right Panel - Live Preview (45% width) */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex-1 min-w-[500px] max-w-[55%] bg-surface-100 flex flex-col overflow-hidden relative"
          >
            <RightPanel />
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
