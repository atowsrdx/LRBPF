import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent, defaultSiteContent } from '../types';

interface SiteContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('lrbpf_content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultSiteContent,
          ...parsed,
          stories: parsed.stories || defaultSiteContent.stories,
          process: parsed.process || defaultSiteContent.process,
        };
      } catch (e) {
        return defaultSiteContent;
      }
    }
    return defaultSiteContent;
  });

  useEffect(() => {
    localStorage.setItem('lrbpf_content', JSON.stringify(content));
  }, [content]);

  const updateContent = (newContent: SiteContent) => {
    setContent(newContent);
  };

  return (
    <SiteContext.Provider value={{ content, updateContent }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSiteContent must be used within a SiteProvider');
  }
  return context;
};
