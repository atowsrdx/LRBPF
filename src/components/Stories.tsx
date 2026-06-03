import { motion } from 'motion/react';
import { Instagram, MessageCircle, Play, Heart, MessageSquare } from 'lucide-react';
import { useSiteContent } from '../context/SiteContext';

export default function Stories() {
  const { content } = useSiteContent();

  return (
    <section id="impact" className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl flex items-center gap-3">
              <Instagram className="h-8 w-8 text-pink-500" />
              {content.storiesSection?.title || 'Proof on Instagram'}
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              {content.storiesSection?.description || 'We document the stories that matter. Watch the real conversations, view the EMI receipts, and see exactly whose life the fund changed.'}
            </p>
          </div>
          <a href={content.general.instagramLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white px-6 py-3.5 rounded-full font-bold transition-all shadow-md hover:shadow-xl whitespace-nowrap gap-2">
            <Instagram className="h-5 w-5" />
            Follow @LRBPF_Official
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(content.stories || []).map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-950 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow group flex flex-col"
            >
              <div className="aspect-[4/5] bg-slate-200 dark:bg-slate-800 relative cursor-pointer flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/40 group-hover:bg-slate-900/30 dark:group-hover:bg-slate-900/60 transition-colors z-10" />
                <Play className="h-16 w-16 text-white/90 z-20 drop-shadow-lg group-hover:scale-110 transition-transform" />
                <img 
                  src={story.imageUrl || `https://placehold.co/600x750/e2e8f0/64748b?text=Video+Proof:+${story.name.replace(/\s+/g, '+')}`} 
                  alt="Video Placeholder" 
                  className="absolute inset-0 w-full h-full object-cover dark:opacity-80" 
                />
                <div className="absolute top-4 left-4 z-20 bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white tracking-wide">
                  {story.type}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow text-slate-900 dark:text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl">{story.name}</h3>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">Cleared: {story.amount}</p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed flex-grow">
                  {story.content}
                </p>
                <div className="flex justify-between items-center text-sm font-semibold text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 hover:text-pink-600 dark:hover:text-pink-500 cursor-pointer transition-colors"><Heart className="h-5 w-5" /> {story.likes}</span>
                    <span className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"><MessageSquare className="h-5 w-5" /> {story.comments}</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer"><MessageCircle className="h-4 w-4" /> View Chat Proof</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
