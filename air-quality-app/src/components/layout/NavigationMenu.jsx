import React from 'react';
import { VIEW_MODES } from '../../constants/constants';
import styles from './NavigationMenu.module.css';

/**
 * NavigationMenu - Navigation menu for sidebar with view switching
 */
const NavigationMenu = ({ expanded, viewMode, onViewModeChange }) => {
  const menuItems = [
    {
      id: VIEW_MODES.MAP,
      icon: '🗺️',
      text: 'Map View',
      active: viewMode === VIEW_MODES.MAP
    },
    {
      id: VIEW_MODES.TABLE,
      icon: '📊',
      text: 'Table View',
      active: viewMode === VIEW_MODES.TABLE
    }
  ];

  return (
    <nav className={styles['sidebar-navigation']}>
      {/* Collapsed state icons */}
      {!expanded && (
        <div className={styles['sidebar-collapsed-menu']}>
          {menuItems.map(item => (
            <div
              key={item.id}
              className={`${styles['collapsed-menu-item']} ${item.active ? styles['active'] : ''}`}
              onClick={() => onViewModeChange(item.id)}
              title={item.text}
            >
              <div className={styles['collapsed-menu-icon']}>{item.icon}</div>
            </div>
          ))}
        </div>
      )}

      {/* Expanded state menu */}
      {expanded && (
        <div className={styles['sidebar-menu']}>
          {menuItems.map(item => (
            <div
              key={item.id}
              className={`${styles['menu-item']} ${item.active ? styles['active'] : ''}`}
              onClick={() => onViewModeChange(item.id)}
            >
              <div className={styles['menu-icon']}>{item.icon}</div>
              <span className={styles['menu-text']}>{item.text}</span>
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default NavigationMenu;