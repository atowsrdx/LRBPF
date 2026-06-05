import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent, defaultSiteContent } from '../types';

interface SiteContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => Promise<void>;
  isLoading: boolean;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('siteConfig');
      if (stored) {
        const data = JSON.parse(stored);
        setContent({
          ...defaultSiteContent,
          ...data,
          stories: data.stories || defaultSiteContent.stories,
          process: data.process || defaultSiteContent.process,
        } as SiteContent);
      } else {
        setContent(defaultSiteContent);
      }
    } catch(err) {
      setContent(defaultSiteContent);
    }
    setIsLoading(false);
  }, []);

  const updateContent = async (newContent: SiteContent) => {
    try {
      localStorage.setItem('siteConfig', JSON.stringify(newContent));
      setContent(newContent);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <SiteContext.Provider value={{ content, updateContent, isLoading }}>
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
