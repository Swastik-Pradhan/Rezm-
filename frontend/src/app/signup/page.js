'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Hexagon, CheckCircle2 } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(signup(formData));
    if (signup.fulfilled.match(resultAction)) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-50">
      {/* Left Panel - Branding */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 bg-surface-100 flex-col justify-center items-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-surface-100 to-surface-200 opacity-50 z-0"></div>
        <div className="z-10 px-16 max-w-lg">
          <div className="flex items-center gap-2 mb-8">
            <Hexagon className="w-8 h-8 text-brand fill-brand" />
            <span className="text-xl font-bold tracking-tight text-surface-900">Rezmé</span>
          </div>
          <h1 className="text-4xl font-bold text-surface-900 mb-6 leading-tight">
            The blueprint for your <br />
            <span className="text-brand">dream career.</span>
          </h1>
          <p className="text-surface-600 mb-12">
            Join 50,000+ professionals using AI to build high-converting resumes that get noticed by top-tier recruiters.
          </p>
          
          <div className="flex gap-8">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-surface-900 text-sm">AI Rewriting</h3>
                <p className="text-surface-500 text-xs mt-1 leading-relaxed">Instant professional optimization.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-surface-900 text-sm">ATS Score</h3>
                <p className="text-surface-500 text-xs mt-1 leading-relaxed">Real-time keyword analysis.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Panel - Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white"
      >
        <div className="w-full max-w-md">
          {/* Mobile display logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <Hexagon className="w-8 h-8 text-brand fill-brand" />
            <span className="text-xl font-bold tracking-tight text-surface-900">Rezmé</span>
          </div>

          <h2 className="text-2xl font-bold text-surface-900 mb-2">Create account</h2>
          <p className="text-surface-500 text-sm mb-8">Start building your professional profile.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-text">Full Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label-text">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label-text">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
              <div className="flex justify-between text-xs text-surface-400 mt-2">
                <span>6+ characters</span>
                <span>1 special character</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-surface-600">
            Already have an account?{' '}
            <Link href="/login" className="text-brand font-medium hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
