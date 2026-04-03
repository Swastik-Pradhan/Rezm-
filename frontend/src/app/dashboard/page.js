'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResumes, createResume, deleteResume } from '@/store/resumeSlice';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  FileText, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Clock,
  Hexagon,
  LogOut,
  Sparkles,
  Upload
} from 'lucide-react';
import { logout } from '@/store/authSlice';
import ImportCVModal from '@/components/dashboard/ImportCVModal';

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { resumes, loading } = useSelector((state) => state.resume);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isImportOpen, setIsImportOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchResumes());
    
    // Close dropdowns when clicking outside
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dispatch]);

  const handleCreateNew = async () => {
    const actionResult = await dispatch(createResume('Untitled Resume'));
    if (createResume.fulfilled.match(actionResult)) {
      router.push(`/editor/${actionResult.payload._id}`);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this resume?')) {
      dispatch(deleteResume(id));
      setActiveMenuId(null);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-surface-50">
        {/* Navbar */}
        <nav className="bg-white border-b border-surface-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <Hexagon className="w-8 h-8 text-brand fill-brand" />
                <span className="text-xl font-bold tracking-tight text-surface-900">Rezmé</span>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="hidden sm:block text-sm">
                  <span className="text-surface-500">Welcome back, </span>
                  <span className="font-medium text-surface-900">{user?.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-full transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-surface-900 flex items-center gap-3"
              >
                My Resumes
                <span className="px-2.5 py-0.5 rounded-full bg-brand/10 text-brand text-xs font-semibold">
                  {resumes.length}
                </span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-surface-500 mt-2"
              >
                Create, edit, and manage your AI-enhanced professional profiles.
              </motion.p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                onClick={() => setIsImportOpen(true)}
                className="btn-secondary flex items-center justify-center gap-2 px-5 py-3 shadow-sm hover:shadow flex-1 sm:flex-none"
              >
                <Upload className="w-5 h-5" />
                <span>Import CV</span>
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                onClick={handleCreateNew}
                className="btn-primary flex items-center justify-center gap-2 px-6 py-3 shadow-sm hover:shadow group flex-1 sm:flex-none"
              >
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                <span>Create New</span>
              </motion.button>
            </div>
          </div>

          {loading && resumes.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="card h-72 animate-pulse bg-white border border-surface-200">
                  <div className="h-48 bg-surface-100 border-b border-surface-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                    <div className="h-3 bg-surface-100 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : resumes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 text-center max-w-md mx-auto"
            >
              <div className="w-24 h-24 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold text-surface-900 mb-2">No resumes yet</h3>
              <p className="text-surface-500 mb-8 leading-relaxed">
                You haven't created any resumes. Start building your professional profile to land your next dream job.
              </p>
              <button
                onClick={handleCreateNew}
                className="btn-primary flex items-center justify-center gap-2 w-full mx-auto max-w-xs"
              >
                <Plus className="w-5 h-5" />
                Build My First Resume
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {resumes.map((resume, index) => (
                  <motion.div
                    key={resume._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: Math.min(index * 0.05, 0.3) }}
                    className="card group hover:shadow-md hover:border-brand/30 transition-all cursor-pointer relative flex flex-col h-72"
                    onClick={() => router.push(`/editor/${resume._id}`)}
                  >
                    {/* Preview Thumbnail Area */}
                    <div className="h-48 bg-surface-100 border-b border-surface-200 relative overflow-hidden flex-shrink-0">
                      {/* Abstract Resume Representation */}
                      <div className="absolute inset-4 bg-white shadow-sm rounded border border-surface-200 flex flex-col p-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        <div className="w-1/3 h-2 bg-brand/80 rounded mb-4"></div>
                        <div className="w-1/4 h-1.5 bg-surface-300 rounded mb-6"></div>
                        
                        <div className="space-y-3">
                          <div className="w-full justify-between flex items-center">
                            <div className="w-1/2 h-1.5 bg-surface-300 rounded"></div>
                            <div className="w-16 h-1.5 bg-brand/30 rounded"></div>
                          </div>
                          <div className="w-full h-1 bg-surface-200 rounded"></div>
                          <div className="w-5/6 h-1 bg-surface-200 rounded"></div>
                          
                          <div className="w-full justify-between flex items-center mt-4">
                            <div className="w-1/3 h-1.5 bg-surface-300 rounded"></div>
                            <div className="w-16 h-1.5 bg-brand/30 rounded"></div>
                          </div>
                          <div className="w-full h-1 bg-surface-200 rounded"></div>
                          <div className="w-4/5 h-1 bg-surface-200 rounded"></div>
                        </div>
                      </div>
                      
                      {/* Template Badge */}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur border border-surface-200 text-xs font-medium px-2 py-1 rounded shadow-sm capitalize text-surface-600">
                        {resume.template}
                      </div>

                      {/* Dropdown Menu */}
                      <div className="absolute top-3 right-3">
                        <button 
                          onClick={(e) => toggleMenu(e, resume._id)}
                          className="p-1.5 bg-white/90 backdrop-blur rounded shadow-sm text-surface-500 hover:text-brand hover:bg-white transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        <AnimatePresence>
                          {activeMenuId === resume._id && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-surface-200 py-1 z-20"
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/editor/${resume._id}`);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 flex items-center gap-2"
                              >
                                <Edit2 className="w-4 h-4" /> Edit Resume
                              </button>
                              <button
                                onClick={(e) => handleDelete(e, resume._id)}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Card Footer - Details */}
                    <div className="p-4 flex flex-col justify-between flex-grow">
                      <div>
                        <h3 className="font-semibold text-surface-900 group-hover:text-brand transition-colors truncate">
                          {resume.title}
                        </h3>
                        <p className="text-sm text-surface-500 truncate mt-0.5">
                          {resume.profile?.jobTitle || 'No title set'}
                        </p>
                      </div>
                      
                      <div className="flex items-center text-xs text-surface-400 mt-2 gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Edited {formatDate(resume.updatedAt)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Quick Stats / Tips Section (if they have resumes) */}
          {resumes.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16 pt-10 border-t border-surface-200"
            >
              <div className="bg-gradient-to-r from-brand/5 to-surface-50 rounded-2xl p-8 border border-brand/10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 text-brand">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-surface-900 mb-2">AI Optimization Tips</h3>
                    <ul className="text-surface-600 space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>
                        Use our AI Assistant inside the editor to generate ATS-friendly bullet points for your experience.
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>
                        Keep your summary concise - aim for 3-4 impactful sentences. Let the AI optimize it for your target role.
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>
                        Regularly update your skills section. The ATS scanner looks heavily at these keywords.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {/* Import CV Modal */}
          <ImportCVModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
        </main>
      </div>
    </ProtectedRoute>
  );
}
