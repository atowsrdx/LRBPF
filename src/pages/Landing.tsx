import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Dashboard from '../components/Dashboard';
import Process from '../components/Process';
import Stories from '../components/Stories';
import Footer from '../components/Footer';
import { useSiteContent } from '../context/SiteContext';

export default function Landing() {
  const { content } = useSiteContent();

  useEffect(() => {
    document.title = content.seo?.title || "LRBPF - Public Fund";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', content.seo?.description || "");
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      metaDesc.setAttribute('content', content.seo?.description || "");
      document.head.appendChild(metaDesc);
    }
  }, [content.seo]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 selection:bg-emerald-200 dark:selection:bg-emerald-900/50 selection:text-emerald-900 dark:selection:text-emerald-100 transition-colors">
      <Navbar />
      <main>
        <Hero />
        <Dashboard />
        <Process />
        <Stories />
      </main>
      <Footer />
    </div>
  );
}
