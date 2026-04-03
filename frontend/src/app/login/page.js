'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Hexagon } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(login(formData));
    if (login.fulfilled.match(resultAction)) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-50 p-4 lg:p-0">
      <div className="w-full max-w-5xl mx-auto flex bg-white rounded-2xl shadow-xl overflow-hidden my-auto lg:my-16 lg:h-[600px]">
        {/* Left Panel - Branding (Purple) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex lg:w-1/2 bg-brand text-white flex-col justify-between p-12 relative overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-dark opacity-50 rounded-full translate-y-1/3 -translate-x-1/4"></div>
          
          <div className="z-10">
            <div className="flex items-center gap-2 mb-16">
              <Hexagon className="w-6 h-6 text-white fill-white/20" />
              <span className="text-lg font-bold tracking-tight text-white/90">Rezmé</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Design your career <br />with precision.
            </h1>
            <p className="text-brand-light text-lg mb-8 max-w-sm">
              Leverage our AI-driven editorial engine to build resumes that command attention and reflect your professional journey.
            </p>
          </div>

          <div className="mt-auto flex items-center gap-4 z-10 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
              <Hexagon className="w-5 h-5 text-brand fill-brand" />
            </div>
            <div>
              <p className="font-semibold text-sm text-white">AI Writing Assistant</p>
              <p className="text-xs text-brand-light">Smart suggestions for every section.</p>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Login Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16"
        >
          <div className="w-full max-w-md">
            {/* Mobile display logo */}
            <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
              <Hexagon className="w-8 h-8 text-brand fill-brand" />
              <span className="text-xl font-bold tracking-tight text-surface-900">Rezmé</span>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-surface-900 mb-2">Welcome Back</h2>
              <p className="text-surface-500 text-sm">Please enter your details to sign in.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                {error}
              </div>
            )}


            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-text">Email Address</label>
                <input
                  type="email"
                  className="input-field py-2.5"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="label-text mb-0">Password</label>
                  <Link href="#" className="text-xs text-brand hover:underline font-medium">Forgot password?</Link>
                </div>
                <input
                  type="password"
                  className="input-field py-2.5 tracking-widest"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center pt-2">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-brand focus:ring-brand border-surface-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-surface-600">
                  Remember me for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-2.5 mt-2 flex justify-center items-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-surface-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-brand font-medium hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
