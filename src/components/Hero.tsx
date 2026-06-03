import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';
import { useSiteContent } from '../context/SiteContext';
import toast from 'react-hot-toast';

export default function Hero() {
  const { content } = useSiteContent();

  const handleDonateClick = () => {
    toast.success('Redirecting to secure payment gateway...', {
      icon: '🔒',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 pt-16 pb-24 sm:pb-32 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-medium text-sm mb-8">
            <HeartPulse className="h-4 w-4" />
            {content.hero.tagline}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight transition-colors">
            {content.hero.headlinePart1} <br className="hidden md:block" />
            <span className="text-emerald-600 dark:text-emerald-500">{content.hero.headlinePart2}</span>
          </h1>
          <p className="mt-6 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed transition-colors">
            {content.hero.description}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a onClick={handleDonateClick} href={content.general.donateLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              {content.hero.donateButtonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a href={content.general.instagramLink} className="inline-flex items-center justify-center bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-sm">
              {content.hero.proofButtonText}
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <ShieldCheck className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
            <span>100% verified identities. Direct payments to loan accounts.</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
