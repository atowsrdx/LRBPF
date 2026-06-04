import { useState } from 'react';
import { Heart, Instagram, Moon, Sun, Menu, X } from 'lucide-react';
import { useSiteContent } from '../context/SiteContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { content } = useSiteContent();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <div className="hidden md:flex items-center gap-4">
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
              Donate via Cosmofeed
            </a>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="px-4 pt-2 pb-6 space-y-4 shadow-lg">
            <a href="#mission" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800">Our Mission</a>
            <a href="#dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800">Fund Dashboard</a>
            <a href="#impact" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800">Instagram Proof</a>
            <div className="mt-4 flex flex-col gap-3 px-3">
              <a href={content.general.donateLink} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-medium text-center shadow-sm">
                Donate via Cosmofeed
              </a>
              <a href={content.general.instagramLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 px-5 py-3 rounded-xl font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900">
                <Instagram className="h-5 w-5 text-pink-600 dark:text-pink-500" />
                Follow on Instagram
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
