import { Heart, Instagram, Mail, Info } from 'lucide-react';
import { useSiteContent } from '../context/SiteContext';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { content } = useSiteContent();

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Heart className="h-7 w-7 text-emerald-600 dark:text-emerald-500" fill="currentColor" />
              <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">{content.brand?.name || 'LRBPF'}</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6 font-medium leading-relaxed">
              {content.footer?.aboutText || "Loan Repayment By Public Fund. Breaking the cycle of systemic poverty and preventing harassment through highly-transparent public crowd-funding."}
            </p>
            <div className="flex gap-4">
              <a href={content.general.instagramLink} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a href={content.general.emailLink || "#"} className="p-2.5 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <span className="sr-only">Email</span>
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Explore</h3>
            <ul className="space-y-4 font-medium text-slate-500 dark:text-slate-400">
              <li><a href="#mission" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">How we verify</a></li>
              <li><a href="#dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Live Dashboard</a></li>
              <li><a href="#impact" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Instagram Proofs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Get Support</h3>
            <ul className="space-y-4 font-medium text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Submit EMI Proof</a></li>
              <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Contact our Team</a></li>
              <li className="flex items-center gap-2 mt-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm">
                 <Info className="h-4 w-4 text-emerald-600 dark:text-emerald-500 shrink-0" />
                 <span>We never ask for cash directly. Avoid scams.</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-medium">
          <p className="text-sm text-slate-400 dark:text-slate-500 tracking-wide">
             {content.footer?.copyrightText || "2026 LRBPF Organization. Built for free static deployment."}
          </p>
          <div className="flex gap-6 justify-center text-sm text-slate-400 dark:text-slate-500">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Verification</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
