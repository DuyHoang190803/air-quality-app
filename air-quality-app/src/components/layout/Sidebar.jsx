import React, { forwardRef } from 'react';
import SidebarHeader from './SidebarHeader';
import NavigationMenu from './NavigationMenu';
import styles from './Sidebar.module.css';

/**
 * Sidebar - Main sidebar component
 */
const Sidebar = forwardRef(({ 
  expanded, 
  onToggle, 
  viewMode, 
  onViewModeChange 
}, ref) => {
  return (
    <aside 
      ref={ref} 
      className={`${styles['app-sidebar']} ${expanded ? styles['expanded'] : styles['collapsed']}`}
    >
      <div className={styles['sidebar-content']}>
        <SidebarHeader 
          expanded={expanded}
          onToggle={onToggle}
        />

        <NavigationMenu
          expanded={expanded}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;