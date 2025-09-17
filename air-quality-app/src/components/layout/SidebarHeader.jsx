import React from 'react';
import styles from './SidebarHeader.module.css';

/**
 * SidebarHeader - Header section of the sidebar with toggle button and title
 */
const SidebarHeader = ({ expanded, onToggle }) => {
  return (
    <div className={styles['sidebar-header']}>
      <button
        type="button"
        className={styles['sidebar-toggle']}
        onClick={onToggle}
        title={expanded ? "Collapse menu" : "Expand menu"}
        aria-label={expanded ? "Collapse menu" : "Expand menu"}
        aria-expanded={expanded}
        aria-controls="sidebar-menu"
      >
        <div className={styles['hamburger-icon']}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      
      {expanded && (
        <div className={styles['sidebar-title']}>
          <h2>Air Quality Monitor</h2>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;