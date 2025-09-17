import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext.jsx';
import { VIEW_MODES } from '../../constants/constants';
import MapView from '../features/map/MapView';
import TableView from '../features/table/TableView';
import Sidebar from './Sidebar';
import MobileBottomBar from './MobileBottomBar';
import styles from './AppLayout.module.css';

/**
 * AppLayout - Main layout component that manages the overall app structure
 */
const AppLayout = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const sidebarRef = useRef(null);

    const {
        viewMode,
        setViewMode,
    } = useAppContext();

    // Handle responsive changes
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);

            // Force close sidebar when switching to mobile
            if (mobile && sidebarExpanded) {
                setSidebarExpanded(false);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [sidebarExpanded]);

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

    return (
        <div className={styles['app']}>
            <div className={styles['app-layout']}>
                {!isMobile && (
                    <Sidebar
                        ref={sidebarRef}
                        expanded={sidebarExpanded}
                        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
                        viewMode={viewMode}
                        onViewModeChange={handleViewModeChange}
                    />
                )}

                <main className={`${styles['app-main']} ${!isMobile ? (sidebarExpanded ? styles['sidebar-expanded'] : styles['sidebar-collapsed']) : ''}`}>
                    {viewMode === VIEW_MODES.MAP ? (
                        <MapView />
                    ) : (
                        <TableView />
                    )}
                </main>

                {isMobile && (
                    <MobileBottomBar
                        viewMode={viewMode}
                        onViewModeChange={handleViewModeChange}
                    />
                )}
            </div>
        </div>
    );
};

export default AppLayout;