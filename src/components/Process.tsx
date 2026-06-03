import { motion } from 'motion/react';
import { FileSearch, Landmark, Instagram, CheckCircle2, ShieldCheck, FileCheck, Banknote } from 'lucide-react';
import { useSiteContent } from '../context/SiteContext';

const defaultIcons = [FileSearch, CheckCircle2, Landmark, Instagram, ShieldCheck, FileCheck, Banknote];

export default function Process() {
  const { content } = useSiteContent();
  const steps = content.process || [];

  return (
    <section id="mission" className="py-24 bg-slate-900 dark:bg-slate-950 text-white overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-700 dark:via-slate-800 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 md:flex md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{content.processSection?.title || 'Trust is our currency'}</h2>
            <p className="mt-4 text-lg text-slate-400">{content.processSection?.description || 'Our process prevents fraud and ensures your donations reach legitimate people facing extreme harassment.'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = defaultIcons[index % defaultIcons.length];
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-slate-800/50 dark:bg-slate-900/50 p-8 rounded-3xl h-full border border-slate-700 dark:border-slate-800 hover:border-emerald-500/50 transition-colors">
                  <div className="bg-slate-700/50 dark:bg-slate-800/50 p-4 rounded-xl inline-block mb-6">
                    <Icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
