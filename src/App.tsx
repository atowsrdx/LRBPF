import { HashRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Admin from './pages/Admin';
import AdminApplications from './pages/AdminApplications';
import { SiteProvider } from './context/SiteContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <ThemeProvider>
      <SiteProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
          </Routes>
        </HashRouter>
        <Toaster position="bottom-right" />
      </SiteProvider>
    </ThemeProvider>
  );
}
