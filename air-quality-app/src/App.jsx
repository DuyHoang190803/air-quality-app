import React, { useState, useRef, useEffect } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext.jsx';
import { VIEW_MODES } from './constants/constants';
import MapView from './components/map/MapView';
import TableView from './components/table/TableView';
import Loading from './components/ui/Loading';
import ViewToggle from './components/common/ViewToggle';
import './App.css';

const AppContent = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const sidebarRef = useRef(null);

  const {
    stations,
    loading,
    error,
    viewMode,
    setViewMode,
    selectedStation,
    setSelectedStation
  } = useAppContext();

  // Handle view mode change and close sidebar
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setSidebarExpanded(false);
  };

  // Handle click outside sidebar to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarExpanded && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarExpanded]);

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

  return (
    <div className="app">
      <div className="app-layout">
        <aside ref={sidebarRef} className={`app-sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}>
          <div className="sidebar-content">
            <div className="sidebar-header">
              <button
                className="sidebar-toggle"
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                title={sidebarExpanded ? "Collapse menu" : "Expand menu"}
              >
                <div className="hamburger-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </button>
              {sidebarExpanded && (
                <div className="sidebar-title">
                  <h2>Air Quality Monitor</h2>
                </div>
              )}
            </div>

            {/* Collapsed state icons */}
            {!sidebarExpanded && (
              <div className="sidebar-collapsed-menu">
                <div
                  className={`collapsed-menu-item ${viewMode === VIEW_MODES.MAP ? 'active' : ''}`}
                  onClick={() => handleViewModeChange(VIEW_MODES.MAP)}
                  title="Map View"
                >
                  <div className="collapsed-menu-icon">🗺️</div>
                </div>

                <div
                  className={`collapsed-menu-item ${viewMode === VIEW_MODES.TABLE ? 'active' : ''}`}
                  onClick={() => handleViewModeChange(VIEW_MODES.TABLE)}
                  title="Table View"
                >
                  <div className="collapsed-menu-icon">📊</div>
                </div>
              </div>
            )}

            {sidebarExpanded && (
              <div className="sidebar-menu">
                <div
                  className={`menu-item ${viewMode === VIEW_MODES.MAP ? 'active' : ''}`}
                  onClick={() => handleViewModeChange(VIEW_MODES.MAP)}
                >
                  <div className="menu-icon">🗺️</div>
                  <span className="menu-text">Map View</span>
                </div>

                <div
                  className={`menu-item ${viewMode === VIEW_MODES.TABLE ? 'active' : ''}`}
                  onClick={() => handleViewModeChange(VIEW_MODES.TABLE)}
                >
                  <div className="menu-icon">📊</div>
                  <span className="menu-text">Table View</span>
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className={`app-main ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
          {viewMode === VIEW_MODES.MAP ? (
            <MapView />
          ) : (
            <TableView />
          )}
        </main>

        {/* Mobile Bottom Bar */}
        <div className="mobile-bottom-bar">
          <div
            className={`bottom-bar-item ${viewMode === VIEW_MODES.MAP ? 'active' : ''}`}
            onClick={() => handleViewModeChange(VIEW_MODES.MAP)}
          >
            <div className="bottom-bar-icon">🗺️</div>
          </div>

          <div
            className={`bottom-bar-item ${viewMode === VIEW_MODES.TABLE ? 'active' : ''}`}
            onClick={() => handleViewModeChange(VIEW_MODES.TABLE)}
          >
            <div className="bottom-bar-icon">📊</div>
          </div>
        </div>
      </div>
    </div>
  );
}; const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
