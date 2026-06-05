import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Application } from '../types';
import toast from 'react-hot-toast';
import { ArrowLeft, Lock, ArrowRight, User as UserIcon, Phone, FileText, CheckCircle, XCircle, Clock, Trash2, Mail } from 'lucide-react';

export default function AdminApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [password, setPassword] = useState('');

  useEffect(() => {
    // Check if simple session storage auth is set instead of Firebase auth
    if (sessionStorage.getItem('adminAuth') === 'true') {
      setIsAuthenticated(true);
    }
    setIsAuthChecking(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchApps = () => {
      const stored = localStorage.getItem('applications');
      if (stored) {
        const apps = JSON.parse(stored);
        setApplications(apps.sort((a: any, b: any) => b.createdAt - a.createdAt));
      }
    };
    
    fetchApps();
    // poll every 10 seconds for updates within the browser localstorage
    const interval = setInterval(fetchApps, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleStatusChange = (id: string, newStatus: Application['status']) => {
    const stored = JSON.parse(localStorage.getItem('applications') || '[]');
    const updated = stored.map((app: any) => app.id === id ? { ...app, status: newStatus } : app);
    localStorage.setItem('applications', JSON.stringify(updated));
    setApplications(updated.sort((a: any, b: any) => b.createdAt - a.createdAt));
    toast.success(`Application marked as ${newStatus}`);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    const stored = JSON.parse(localStorage.getItem('applications') || '[]');
    const updated = stored.filter((app: any) => app.id !== id);
    localStorage.setItem('applications', JSON.stringify(updated));
    setApplications(updated.sort((a: any, b: any) => b.createdAt - a.createdAt));
    toast.success('Application deleted');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    toast('Logged out', { icon: '👋' });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    if (password === correctPassword) {
      sessionStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      toast.success('Logged in successfully!');
    } else {
      toast.error('Invalid password');
    }
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 transition-colors">
        <p className="text-slate-500">Checking auth state...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 transition-colors">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-xl max-w-md w-full">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Lock className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">Admin Access</h1>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-8">Sign in with an authorized Google account to view applications.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
              />
              <p className="text-xs text-slate-400 mt-2">Default is 'admin123' if not set in environment.</p>
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2">
              Login to Admin <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'reviewing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'approved': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'rejected': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link to="/admin" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Form Submissions</h1>
            </div>
            <p className="mt-1 text-slate-600 dark:text-slate-400 pl-10">Review incoming applications for financial relief.</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleLogout} className="text-sm font-medium text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          {applications.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <FileText className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Applications Yet</h3>
              <p className="text-slate-500 dark:text-slate-400">When people submit the apply form, their applications will appear here.</p>
            </div>
          ) : (
            applications.map(app => (
              <motion.div 
                key={app.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                      <span className="text-slate-400 text-sm">
                        {new Date(app.createdAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{app.name}</h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4 mb-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" /> {app.phone}
                        </div>
                        {app.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" /> {app.email}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" /> {app.loanType} - <span className="font-bold text-slate-900 dark:text-white">{app.loanAmount}</span>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-4">
                      <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                        {app.hardshipReason}
                      </p>
                    </div>

                    {app.email && (
                      <a 
                        href={`mailto:${app.email}?subject=Update on your LRBPF Application&body=${encodeURIComponent(`Dear ${app.name},\n\nYour application status for the ${app.loanType} (${app.loanAmount}) has been updated to: ${app.status.toUpperCase()}.\n\nThank you,\nLRBPF Council`)}`}
                        className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Mail className="h-4 w-4" /> Email Applicant Status
                      </a>
                    )}
                  </div>
                  
                  <div className="flex md:flex-col gap-2 justify-start border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 min-w-[160px]">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 hidden md:block">Actions</p>
                    {app.status !== 'pending' && (
                      <button onClick={() => handleStatusChange(app.id!, 'pending')} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
                        <Clock className="h-4 w-4" /> Mark Pending
                      </button>
                    )}
                    {app.status !== 'reviewing' && (
                      <button onClick={() => handleStatusChange(app.id!, 'reviewing')} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors">
                        <UserIcon className="h-4 w-4" /> Start Review
                      </button>
                    )}
                    {app.status !== 'approved' && (
                      <button onClick={() => handleStatusChange(app.id!, 'approved')} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 transition-colors">
                        <CheckCircle className="h-4 w-4" /> Approve
                      </button>
                    )}
                    {app.status !== 'rejected' && (
                      <button onClick={() => handleStatusChange(app.id!, 'rejected')} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 transition-colors">
                        <XCircle className="h-4 w-4" /> Reject
                      </button>
                    )}
                    
                    <div className="my-2 border-b border-slate-100 dark:border-slate-800 hidden md:block"></div>
                    
                    <button onClick={() => handleDelete(app.id!)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors ml-auto md:ml-0 mt-auto md:mt-2">
                       <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
