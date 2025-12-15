import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

type PageType = 'home' | 'dashboard' | 'admin';

const AppRouter: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    const hash = window.location.hash;
    const pathname = window.location.pathname;
    
    if (hash === '#admin' || pathname.includes('admin')) return 'admin';
    if (hash === '#dashboard' || pathname.includes('dashboard')) return 'dashboard';
    return 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      
      if (hash === '#admin' || pathname.includes('admin')) {
        setCurrentPage('admin');
      } else if (hash === '#dashboard' || pathname.includes('dashboard')) {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'admin':
        return <AdminPanel />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <App />;
    }
  };

  return <React.StrictMode>{renderPage()}</React.StrictMode>;
};

const root = ReactDOM.createRoot(rootElement);
root.render(<AppRouter />);
