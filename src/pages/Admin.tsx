import React, { useState, useEffect } from 'react';
import { useSiteContent } from '../context/SiteContext';
import { motion } from 'motion/react';
import { Save, ExternalLink, Plus, Trash2, Lock, ArrowRight, Image as ImageIcon, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProcessStep, StoryContent } from '../types';
import toast from 'react-hot-toast';

export default function Admin() {
  const { content, updateContent } = useSiteContent();
  const [formData, setFormData] = useState(content);
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
    // When content changes, update the form data
    setFormData(content);
  }, [content]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      if (response.ok) {
        sessionStorage.setItem('adminAuth', 'true');
        setIsAuthenticated(true);
        toast.success('Logged in successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Invalid password');
      }
    } catch (error) {
      toast.error('Network error during login');
    }
  };

  const handleChange = (section: keyof typeof formData, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as any],
        [field]: value,
      },
    }));
  };

  const handleProcessChange = (id: string, field: keyof ProcessStep, value: string) => {
    setFormData((prev) => ({
      ...prev,
      process: (prev.process || []).map((step) =>
        step.id === id ? { ...step, [field]: value } : step
      ),
    }));
  };

  const handleAddProcessStep = () => {
    const newStep: ProcessStep = {
      id: Date.now().toString(),
      title: 'New Verification Step',
      description: 'Describe the verification process here.'
    };
    setFormData((prev) => ({
      ...prev,
      process: [...(prev.process || []), newStep],
    }));
  };

  const handleRemoveProcessStep = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      process: (prev.process || []).filter((step) => step.id !== id),
    }));
  };

  const handleStoryChange = (id: string, field: keyof StoryContent, value: string) => {
    setFormData((prev) => ({
      ...prev,
      stories: prev.stories.map((story) =>
        story.id === id ? { ...story, [field]: value } : story
      ),
    }));
  };

  const handleAddStory = () => {
    const newStory: StoryContent = {
      id: Date.now().toString(),
      name: 'New Story',
      amount: '₹ 0',
      type: 'Loan Type',
      content: 'Story content goes here.',
      likes: '0',
      comments: '0',
    };
    setFormData((prev) => ({
      ...prev,
      stories: [...(prev.stories || []), newStory],
    }));
  };

  const handleRemoveStory = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      stories: (prev.stories || []).filter((story) => story.id !== id),
    }));
  };

  const handleSave = async () => {
    try {
      await updateContent(formData);
      toast.success('Changes published successfully!', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } catch (error: any) {
      toast.error('Failed to publish changes: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    toast('Logged out', { icon: '👋' });
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
          <p className="text-slate-500 dark:text-slate-400 text-center mb-8">Sign in with an authorized Google account to manage the platform.</p>
          
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
          <div className="mt-6 text-center">
             <Link to="/" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">
               &larr; Back to Live Site
             </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Update landing page content, links, and stories</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/admin/applications" className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 font-medium shadow-sm transition-all">
              <FileText className="h-4 w-4" /> View Applications
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium shadow-sm transition-all">
              View Live Site <ExternalLink className="h-4 w-4" />
            </Link>
            <button onClick={handleLogout} className="text-sm font-medium text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Logout
            </button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8 pb-32"
        >
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Brand & SEO</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Brand Identifier / Logo Text</label>
                <input
                  type="text"
                  value={formData.brand?.name || ''}
                  onChange={(e) => handleChange('brand', 'name', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Browser Window Title</label>
                  <input
                    type="text"
                    value={formData.seo?.title || ''}
                    onChange={(e) => handleChange('seo', 'title', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Search Engine Description</label>
                  <input
                    type="text"
                    value={formData.seo?.description || ''}
                    onChange={(e) => handleChange('seo', 'description', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* General Links */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">General Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Instagram Component Link</label>
                <input
                  type="text"
                  value={formData.general.instagramLink}
                  onChange={(e) => handleChange('general', 'instagramLink', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Cosmofeed Payment Link</label>
                <input
                  type="text"
                  value={formData.general.donateLink}
                  onChange={(e) => handleChange('general', 'donateLink', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Support Email Address</label>
                <input
                  type="text"
                  value={formData.general.emailLink || ''}
                  onChange={(e) => handleChange('general', 'emailLink', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>
          </motion.section>

          {/* Hero Content */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Hero Section</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tagline (above headline)</label>
                <input
                  type="text"
                  value={formData.hero.tagline}
                  onChange={(e) => handleChange('hero', 'tagline', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Headline Part 1</label>
                  <input
                    type="text"
                    value={formData.hero.headlinePart1}
                    onChange={(e) => handleChange('hero', 'headlinePart1', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Headline Part 2 (Colored)</label>
                  <input
                    type="text"
                    value={formData.hero.headlinePart2}
                    onChange={(e) => handleChange('hero', 'headlinePart2', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                <textarea
                  value={formData.hero.description}
                  onChange={(e) => handleChange('hero', 'description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>
          </motion.section>

          {/* Statistics Dashboard */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Dashboard Section</h2>
            <div className="space-y-6 mb-8 border-b border-slate-200 dark:border-slate-800 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Section Heading Name</label>
                   <input
                     type="text"
                     value={formData.statsSection?.title || ''}
                     onChange={(e) => handleChange('statsSection', 'title', e.target.value)}
                     className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Section Subtitle Description</label>
                   <input
                     type="text"
                     value={formData.statsSection?.description || ''}
                     onChange={(e) => handleChange('statsSection', 'description', e.target.value)}
                     className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                   />
                 </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Total Funds Raised</label>
                <input
                  type="text"
                  value={formData.stats.totalFunds}
                  onChange={(e) => handleChange('stats', 'totalFunds', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Funding Goal</label>
                <input
                  type="text"
                  value={formData.stats.goalAmount || ''}
                  onChange={(e) => handleChange('stats', 'goalAmount', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Families Relieved</label>
                <input
                  type="text"
                  value={formData.stats.familiesRelieved}
                  onChange={(e) => handleChange('stats', 'familiesRelieved', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Active Verifications</label>
                <input
                  type="text"
                  value={formData.stats.activeVerifications}
                  onChange={(e) => handleChange('stats', 'activeVerifications', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Total Contributors</label>
                <input
                  type="text"
                  value={formData.stats.totalContributors}
                  onChange={(e) => handleChange('stats', 'totalContributors', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>
          </motion.section>

          {/* Process / Verification Steps */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Verification Steps Section</h2>
              <button
                onClick={handleAddProcessStep}
                className="bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
              >
                <Plus className="h-4 w-4" /> Add Step
              </button>
            </div>
            
            <div className="space-y-6 mb-8 border-b border-slate-200 dark:border-slate-800 pb-8 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Section Heading Name</label>
                   <input
                     type="text"
                     value={formData.processSection?.title || ''}
                     onChange={(e) => handleChange('processSection', 'title', e.target.value)}
                     className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Section Subtitle Description</label>
                   <input
                     type="text"
                     value={formData.processSection?.description || ''}
                     onChange={(e) => handleChange('processSection', 'description', e.target.value)}
                     className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                   />
                 </div>
              </div>
            </div>

            <div className="space-y-4">
              {(formData.process || []).map((step, index) => (
                <div key={step.id} className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 relative dark:bg-slate-950 group">
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => handleRemoveProcessStep(step.id)}
                      className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove Step"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="mb-4 pr-12">
                     <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Step Title</label>
                     <input
                        type="text"
                        value={step.title}
                        onChange={(e) => handleProcessChange(step.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white font-bold"
                      />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Step Description</label>
                    <textarea
                      value={step.description}
                      onChange={(e) => handleProcessChange(step.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
              ))}
              {(formData.process || []).length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <p className="text-slate-500 dark:text-slate-400">No verification steps defined.</p>
                </div>
              )}
            </div>
          </motion.section>

          {/* Application Form Section Details */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Apply Form Section</h2>
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Section Heading Name</label>
                   <input
                     type="text"
                     value={formData.applicationSection?.title || ''}
                     onChange={(e) => handleChange('applicationSection', 'title', e.target.value)}
                     className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Section Subtitle Description</label>
                   <input
                     type="text"
                     value={formData.applicationSection?.description || ''}
                     onChange={(e) => handleChange('applicationSection', 'description', e.target.value)}
                     className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                   />
                 </div>
              </div>
            </div>
          </motion.section>

          {/* Stories Management */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Instagram Stories Section</h2>
              <button
                onClick={handleAddStory}
                className="bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
              >
                <Plus className="h-4 w-4" /> Add Story
              </button>
            </div>

            <div className="space-y-6 mb-8 border-b border-slate-200 dark:border-slate-800 pb-8 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Section Heading Name</label>
                   <input
                     type="text"
                     value={formData.storiesSection?.title || ''}
                     onChange={(e) => handleChange('storiesSection', 'title', e.target.value)}
                     className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Section Subtitle Description</label>
                   <input
                     type="text"
                     value={formData.storiesSection?.description || ''}
                     onChange={(e) => handleChange('storiesSection', 'description', e.target.value)}
                     className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                   />
                 </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {(formData.stories || []).map((story, index) => (
                <div key={story.id} className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 relative dark:bg-slate-950 group">
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => handleRemoveStory(story.id)}
                      className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove Story"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="mb-4">
                     <span className="inline-flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold w-8 h-8 rounded-full text-sm">
                       {index + 1}
                     </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                       <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider flex items-center gap-1"><ImageIcon className="h-4 w-4" /> Custom Cover Image URL</label>
                       <input
                         type="text"
                         placeholder="Optional: e.g. https://example.com/image.jpg"
                         value={story.imageUrl || ''}
                         onChange={(e) => handleStoryChange(story.id, 'imageUrl', e.target.value)}
                         className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white text-sm"
                       />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Name</label>
                      <input
                        type="text"
                        value={story.name}
                        onChange={(e) => handleStoryChange(story.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Amount Cleared</label>
                      <input
                        type="text"
                        value={story.amount}
                        onChange={(e) => handleStoryChange(story.id, 'amount', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Loan Type</label>
                      <input
                        type="text"
                        value={story.type}
                        onChange={(e) => handleStoryChange(story.id, 'type', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Story Context</label>
                    <textarea
                      value={story.content}
                      onChange={(e) => handleStoryChange(story.id, 'content', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Instagram Likes</label>
                      <input
                        type="text"
                        value={story.likes}
                        onChange={(e) => handleStoryChange(story.id, 'likes', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Instagram Comments</label>
                      <input
                        type="text"
                        value={story.comments}
                        onChange={(e) => handleStoryChange(story.id, 'comments', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {(formData.stories || []).length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <p className="text-slate-500 dark:text-slate-400">No stories added yet. Add one to show proof on the landing page!</p>
                </div>
              )}
            </div>
          </motion.section>

          {/* Footer Control */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Footer Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">About The Organization</label>
                <textarea
                  value={formData.footer?.aboutText || ''}
                  onChange={(e) => handleChange('footer', 'aboutText', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Copyright Line</label>
                <input
                  type="text"
                  value={formData.footer?.copyrightText || ''}
                  onChange={(e) => handleChange('footer', 'copyrightText', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>
          </motion.section>
        </motion.div>

        {/* Global Save Action Bar */}
        <div className="fixed bottom-0 inset-x-0 p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-end">
            <button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2 text-lg"
            >
              <Save className="h-6 w-6" /> Publish Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
