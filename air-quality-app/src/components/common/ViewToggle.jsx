import { VIEW_MODES } from '../../constants/constants';
import styles from './ViewToggle.module.css';

const ViewToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className={styles['view-toggle']}>
      <button
        className={`${styles['toggle-button']} ${viewMode === VIEW_MODES.MAP ? styles.active : ''}`}
        onClick={() => setViewMode(VIEW_MODES.MAP)}
      >
        Map View
      </button>
      <button
        className={`${styles['toggle-button']} ${viewMode === VIEW_MODES.TABLE ? styles.active : ''}`}
        onClick={() => setViewMode(VIEW_MODES.TABLE)}
      >
        Table View
      </button>
    </div>
  );
};

export default ViewToggle;