import { motion } from 'motion/react';
import { IndianRupee, Users, TrendingUp, HandHeart, Target } from 'lucide-react';
import { useSiteContent } from '../context/SiteContext';

export default function Dashboard() {
  const { content } = useSiteContent();

  const stats = [
    { id: 1, name: 'Total Funds Raised', value: content.stats.totalFunds, icon: IndianRupee },
    { id: 2, name: 'Families Relieved', value: content.stats.familiesRelieved, icon: Users },
    { id: 3, name: 'Active Verifications', value: content.stats.activeVerifications, icon: TrendingUp },
    { id: 4, name: 'Total Contributors', value: content.stats.totalContributors, icon: HandHeart },
  ];

  // Calculate Progress
  const totalFundsValue = parseInt(content.stats.totalFunds.replace(/\D/g, '')) || 0;
  const goalAmountValue = parseInt(content.stats.goalAmount?.replace(/\D/g, '') || '0') || 1; // Default to 1 to avoid division by zero
  const progressPercentage = Math.min(100, Math.round((totalFundsValue / goalAmountValue) * 100));

  return (
    <section id="dashboard" className="py-24 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl text-center">{content.statsSection?.title || 'Transparency Dashboard'}</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {content.statsSection?.description || 'Every rupee from the public is strictly accounted for. Track our collective impact and active interventions in real-time.'}
          </p>
        </div>

        {content.stats.goalAmount && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4">
               <div>
                 <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Funding Goal Progress</h3>
                 </div>
                 <p className="text-sm text-slate-500 dark:text-slate-400">Help us reach our target to clear pending distress cases.</p>
               </div>
               <div className="text-right">
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{content.stats.totalFunds}</p>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">raised of <span className="font-semibold text-slate-900 dark:text-white">{content.stats.goalAmount}</span> goal</p>
               </div>
            </div>
            <div className="relative h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${progressPercentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full"
              />
            </div>
            <div className="mt-2 text-right">
               <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{progressPercentage}% Funded</span>
            </div>
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors"
              >
                <div className="bg-emerald-100/50 dark:bg-emerald-900/30 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <div className="absolute -right-6 -bottom-6 opacity-[0.03] dark:opacity-[0.02] group-hover:opacity-[0.05] dark:group-hover:opacity-[0.04] transition-opacity dark:text-white">
                  <Icon className="h-40 w-40" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
