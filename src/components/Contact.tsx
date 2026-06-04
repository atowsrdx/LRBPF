import { motion } from 'motion/react';
import { Mail, MessageCircle, AlertCircle, PhoneCall } from 'lucide-react';
import { useSiteContent } from '../context/SiteContext';

export default function Contact() {
  const { content } = useSiteContent();

  return (
    <section id="contact" className="py-24 bg-emerald-50 dark:bg-emerald-950/20 border-t border-emerald-100 dark:border-emerald-900/30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            Need Help or Facing Harassment?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            If you are trapped in an EMI cycle and facing severe recovery agent harassment, you can apply for verification by the council. Please read the guidelines carefully.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800"
          >
            <div className="h-12 w-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center mb-6">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Application Criteria
            </h3>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <span className="shrink-0 text-emerald-500 font-bold">•</span>
                Must be an individual experiencing genuine financial hardship (medical, job loss).
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0 text-emerald-500 font-bold">•</span>
                Proof of recovery agent harassment or foreclosure notices is required.
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0 text-emerald-500 font-bold">•</span>
                Bank statements matching the defaulted loan details must be submitted.
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-6">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Reach Out Directly
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Send your applications directly via Email or Instagram DM. We review cases in weekly batches.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <a href={content.general.emailLink} className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white p-4 rounded-xl transition-colors font-medium border border-slate-100 dark:border-slate-700">
                <Mail className="h-5 w-5 text-slate-500" />
                Email Application
              </a>
              <a href={content.general.instagramLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white p-4 rounded-xl transition-colors font-medium border border-slate-100 dark:border-slate-700">
                <MessageCircle className="h-5 w-5 text-slate-500" />
                Message on Instagram
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
