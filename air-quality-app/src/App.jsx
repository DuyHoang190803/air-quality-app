import React from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext.jsx';
import AppLayout from './components/layout/AppLayout';
import Loading from './components/ui/Loading';
import './App.css';

const AppContent = () => {
  const { loading, error } = useAppContext();

  if (loading) {
    return <Loading message="Loading air quality data..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error: {error}</h2>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return <AppLayout />;
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
