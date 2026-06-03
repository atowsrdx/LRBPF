export interface ProcessStep {
  id: string;
  title: string;
  description: string;
}

export interface StoryContent {
  id: string;
  name: string;
  amount: string;
  type: string;
  content: string;
  likes: string;
  comments: string;
  imageUrl?: string;
}

export interface SiteContent {
  brand: {
    name: string;
  };
  seo: {
    title: string;
    description: string;
  };
  general: {
    instagramLink: string;
    donateLink: string;
    emailLink: string;
  };
  hero: {
    tagline: string;
    headlinePart1: string;
    headlinePart2: string;
    description: string;
    donateButtonText: string;
    proofButtonText: string;
  };
  statsSection: {
    title: string;
    description: string;
  };
  stats: {
    totalFunds: string;
    familiesRelieved: string;
    activeVerifications: string;
    totalContributors: string;
    goalAmount: string;
  };
  processSection: {
    title: string;
    description: string;
  };
  process: ProcessStep[];
  storiesSection: {
    title: string;
    description: string;
  };
  stories: StoryContent[];
  footer: {
    aboutText: string;
    copyrightText: string;
  };
}

export const defaultSiteContent: SiteContent = {
  brand: {
    name: "LRBPF"
  },
  seo: {
    title: "LRBPF - Public Fund",
    description: "Loan Repayment By Public Fund. Crowdsourcing to prevent EMI default harassment."
  },
  general: {
    instagramLink: "https://instagram.com",
    donateLink: "#",
    emailLink: "mailto:support@lrbpf.org"
  },
  hero: {
    tagline: "Public Funding for the People",
    headlinePart1: "Break Free From EMI Burdens",
    headlinePart2: "With Public Support",
    description: "Loan Repayment By Public Fund (LRBPF) crowdsources donations to help people trapped in financial emergencies. Total transparency directly to the public.",
    donateButtonText: "Fund Someone Today",
    proofButtonText: "See Proof on Instagram",
  },
  statsSection: {
    title: "Transparency Dashboard",
    description: "Every rupee from the public is strictly accounted for. Track our collective impact and active interventions in real-time."
  },
  stats: {
    totalFunds: "₹ 12,45,000",
    goalAmount: "₹ 20,00,000",
    familiesRelieved: "42",
    activeVerifications: "15",
    totalContributors: "2,104",
  },
  processSection: {
    title: "Trust is our currency",
    description: "Our process prevents fraud and ensures your donations reach legitimate people facing extreme harassment."
  },
  process: [
    {
      id: "1",
      title: "1. Intake & Application",
      description: "Individuals submit their loan statements alongside detailed hardship documentation (medical bills, foreclosure notices)."
    },
    {
      id: "2",
      title: "2. Identity Verification",
      description: "We strictly enforce KYC by cross-checking Aadhar, Pan, and conducting background fraud analysis."
    },
    {
      id: "3",
      title: "3. Harassment Check",
      description: "We record evidence of recovery agent harassment and coordinate with the borrower to issue formal notices."
    },
    {
      id: "4",
      title: "4. Case Review Council",
      description: "Our volunteer council analyzes the financial viability to ensure our intervention resolves the hardship completely."
    },
    {
      id: "5",
      title: "5. Negotiated Settlement",
      description: "We communicate directly with the lender to waive penalty charges and negotiate a complete settlement."
    },
    {
      id: "6",
      title: "6. Direct Payment",
      description: "Funds crowd-sourced from the public are disbursed directly into the loan account. Cash is strictly never handed out."
    },
    {
      id: "7",
      title: "7. Public Proof & Documentation",
      description: "All bank receipts, NOCs, and anonymized verification chats are posted onto our Instagram as public transparent proof."
    }
  ],
  storiesSection: {
    title: "Proof on Instagram",
    description: "We document the stories that matter. Watch the real conversations, view the EMI receipts, and see whose life the fund changed."
  },
  stories: [
    {
      id: "1",
      name: 'Rajesh K.',
      amount: '₹ 12,500',
      type: 'Two-Wheeler Loan',
      content: 'Rajesh lost his daily wage job and defaulted on his bike EMI. Recovery agents harassed his family. We verified his hospital bills and cleared his dues directly.',
      likes: '8.2k',
      comments: '402',
      imageUrl: '',
    },
    {
      id: "2",
      name: 'Sunita M.',
      amount: '₹ 8,400',
      type: 'Micro-Finance',
      content: 'A medical emergency forced Sunita to miss two EMIs for her sewing setup. Your public donations helped her instantly get back on track.',
      likes: '12.5k',
      comments: '891',
      imageUrl: '',
    },
    {
      id: "3",
      name: 'Aman D.',
      amount: '₹ 22,000',
      type: 'Business Stock Loan',
      content: 'Aman faced massive penalty charges on his shop loan. We verified his inventory loss via photos and cleared the overdue penalty.',
      likes: '15.1k',
      comments: '1.2k',
      imageUrl: '',
    },
    {
      id: "4",
      name: 'Krishna V.',
      amount: '₹ 31,000',
      type: 'Medical Emergency Loan',
      content: 'Krishna took a heavy-interest loan for his daughter’s surgery and faced massive defaults. The public fund stepped in and negotiated a principal clearance.',
      likes: '19.4k',
      comments: '2k',
      imageUrl: '',
    },
    {
      id: "5",
      name: 'Priya S.',
      amount: '₹ 5,500',
      type: 'Education EMI',
      content: 'Priya was short of funds for her laptop EMI needed for college. A quick verification and we cleared her remaining three EMIs instantly.',
      likes: '4.8k',
      comments: '210',
      imageUrl: '',
    },
    {
      id: "6",
      name: 'Karan J.',
      amount: '₹ 45,000',
      type: 'Personal Loan Default',
      content: 'Severely harassed by aggressive agents, Karan was on the verge of breaking. The council mediated and cleared the core outstanding amount.',
      likes: '22k',
      comments: '3.4k',
      imageUrl: '',
    },
    {
      id: "7",
      name: 'Gita R.',
      amount: '₹ 10,200',
      type: 'Agriculture Setup',
      content: 'Crop failure left Gita unable to pay the local micro-finance lender. We covered the gap and helped secure her equipment.',
      likes: '14.3k',
      comments: '1.1k',
      imageUrl: '',
    }
  ],
  footer: {
    aboutText: "Loan Repayment By Public Fund. Breaking the cycle of systemic poverty and preventing harassment through highly-transparent public crowd-funding.",
    copyrightText: "© 2026 LRBPF Organization. Empowering people out of debt traps."
  }
};
