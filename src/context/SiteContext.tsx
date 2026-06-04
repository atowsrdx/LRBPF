import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent, defaultSiteContent } from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

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
    const configPath = 'siteConfig/main';
    const configDoc = doc(db, configPath);
    
    const unsubscribe = onSnapshot(configDoc, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setContent({
          ...defaultSiteContent,
          ...data,
          stories: data.stories || defaultSiteContent.stories,
          process: data.process || defaultSiteContent.process,
        } as SiteContent);
      } else {
        // Document does not exist yet. Using defaults.
        setContent(defaultSiteContent);
      }
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, configPath);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateContent = async (newContent: SiteContent) => {
    const configPath = 'siteConfig/main';
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent)
      });
      if (!response.ok) {
        throw new Error('Failed to save config: Unauthorized or server error');
      }
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
