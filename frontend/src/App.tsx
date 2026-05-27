import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Chatbot } from './components/common/Chatbot';
import { LoginModal } from './pages/Auth/LoginModal';
import { Home } from './pages/Home/Home';
import { DossierPage } from './pages/Dossier/DossierPage';
import { FeedbackPage } from './pages/Feedback/FeedbackPage';
import { LookupPage } from './pages/Lookup/LookupPage';
import { AdminDashboard } from './pages/Admin/AdminDashboard';

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginDefaultRole, setLoginDefaultRole] = useState<'citizen' | 'official'>('citizen');

  const handleOpenLogin = (role: 'citizen' | 'official') => {
    setLoginDefaultRole(role);
    setLoginModalOpen(true);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream-100 selection:bg-primary-200 selection:text-primary-900">
      
      {/* Header element */}
      <Header 
        onOpenLogin={handleOpenLogin} 
        onNavigate={handleNavigate} 
        currentPage={currentPage} 
      />

      {/* Pages Switch Router */}
      <div className="flex-grow">
        {currentPage === 'home' && (
          <Home onOpenLogin={handleOpenLogin} onNavigate={handleNavigate} />
        )}
        {currentPage === 'dossier' && <DossierPage />}
        {currentPage === 'feedback' && <FeedbackPage />}
        {currentPage === 'lookup' && <LookupPage />}
        {currentPage === 'admin' && <AdminDashboard />}
      </div>

      {/* Footer element */}
      <Footer />

      {/* Float online chatbot */}
      <Chatbot />

      {/* Login modal overlay */}
      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
        defaultRole={loginDefaultRole} 
      />

    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
