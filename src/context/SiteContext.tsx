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
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (Object.keys(data).length > 0) {
          setContent({
            ...defaultSiteContent,
            ...data,
            stories: data.stories || defaultSiteContent.stories,
            process: data.process || defaultSiteContent.process,
          } as SiteContent);
        } else {
          setContent(defaultSiteContent);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch initial config", error);
        setContent(defaultSiteContent);
        setIsLoading(false);
      });
  }, []);

  const updateContent = async (newContent: SiteContent) => {
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent)
      });
      if (!response.ok) {
        throw new Error('Failed to save config: Unauthorized or server error');
      }
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
