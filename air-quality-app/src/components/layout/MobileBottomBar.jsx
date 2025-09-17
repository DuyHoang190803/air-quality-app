import React from 'react';
import { VIEW_MODES } from '../../constants/constants';
import styles from './MobileBottomBar.module.css';

/**
 * MobileBottomBar - Bottom navigation bar for mobile devices
 */
const MobileBottomBar = ({ viewMode, onViewModeChange }) => {
  const bottomBarItems = [
    {
      id: VIEW_MODES.MAP,
      icon: '🗺️',
      label: 'Map',
      active: viewMode === VIEW_MODES.MAP
    },
    {
      id: VIEW_MODES.TABLE,
      icon: '📊',
      label: 'Table',
      active: viewMode === VIEW_MODES.TABLE
    }
  ];

  return (
    <div className={styles['mobile-bottom-bar']}>
      {bottomBarItems.map(item => (
        <div
          key={item.id}
          className={`${styles['bottom-bar-item']} ${item.active ? styles['active'] : ''}`}
          onClick={() => onViewModeChange(item.id)}
        >
          <div className={styles['bottom-bar-icon']}>{item.icon}</div>
          <span className={styles['bottom-bar-label']}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default MobileBottomBar;