import { Heart, Instagram, Moon, Sun } from 'lucide-react';
import { useSiteContent } from '../context/SiteContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { content } = useSiteContent();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Heart className="h-8 w-8 text-emerald-600 dark:text-emerald-500" fill="currentColor" />
            <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">{content.brand?.name || 'LRBPF'}</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#mission" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Our Mission</a>
            <a href="#dashboard" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Fund Dashboard</a>
            <a href="#impact" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Instagram Proof</a>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <a href={content.general.instagramLink} className="text-slate-500 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-500 transition-colors" target="_blank" rel="noopener noreferrer">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </a>
            <a href={content.general.donateLink} className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full font-medium transition-colors shadow-sm inline-flex items-center justify-center">
              Donate to Fund
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
