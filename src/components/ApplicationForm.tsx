import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Send, AlertCircle } from 'lucide-react';
import { useSiteContent } from '../context/SiteContext';
import toast from 'react-hot-toast';

export default function ApplicationForm() {
  const { content } = useSiteContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    loanType: '',
    loanAmount: '',
    hardshipReason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const currentApps = JSON.parse(localStorage.getItem('applications') || '[]');
      const newApp = {
        id: Date.now().toString(),
        ...formData,
        status: 'pending',
        createdAt: Date.now()
      };
      currentApps.push(newApp);
      localStorage.setItem('applications', JSON.stringify(currentApps));
      
      toast.success('Your application has been submitted successfully.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        loanType: '',
        loanAmount: '',
        hardshipReason: ''
      });
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id="apply" className="py-24 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-6 border border-emerald-200 dark:border-emerald-800/50">
            <FileText className="h-6 w-6" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            {content.applicationSection?.title || "Apply for Help"}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {content.applicationSection?.description || "If you are trapped in an EMI cycle and facing severe recovery agent harassment, you can apply for verification by the council. Please read the guidelines carefully."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white transition-colors"
                  placeholder="e.g. Ramesh Kumar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white transition-colors"
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white transition-colors"
                  placeholder="+91 "
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Loan Type</label>
                <select
                  name="loanType"
                  required
                  value={formData.loanType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white transition-colors"
                >
                  <option value="" disabled>Select Loan Type</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Two-wheeler Loan">Two-wheeler Loan</option>
                  <option value="Microfinance">Microfinance</option>
                  <option value="Education Loan">Education Loan</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Outstanding Loan Amount</label>
                <input
                  type="text"
                  name="loanAmount"
                  required
                  value={formData.loanAmount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white transition-colors"
                  placeholder="e.g. ₹ 45,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Reason for Default / Hardship</label>
              <textarea
                name="hardshipReason"
                required
                value={formData.hardshipReason}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white transition-colors resize-none"
                placeholder="Briefly describe your situation, medical emergencies, or job loss..."
              />
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 p-4 rounded-xl flex gap-3 text-sm border border-amber-200 dark:border-amber-800/30">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>Applications without genuine proof of hardship (medical bills, etc.) or recovery agent harassment will be automatically rejected by the council.</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Submitting...' : (
                <>Submit Application <Send className="h-5 w-5" /></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
