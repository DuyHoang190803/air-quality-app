import { VIEW_MODES } from '../../constants/constants';
import Button from '../ui/Button';
import styles from './ViewToggle.module.css';

/**
 * ViewToggle Component - Toggle buttons for switching between map and table views
 * @param {Object} props
 * @param {string} props.viewMode - Current active view mode (MAP or TABLE)
 * @param {function} props.setViewMode - Function to change the view mode
 */
const ViewToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className={styles['view-toggle']}>
      <Button
        variant={viewMode === VIEW_MODES.MAP ? 'primary' : 'secondary'}
        onClick={() => setViewMode(VIEW_MODES.MAP)}
        className={styles['toggle-button']}
      >
        Map View
      </Button>
      <Button
        variant={viewMode === VIEW_MODES.TABLE ? 'primary' : 'secondary'}
        onClick={() => setViewMode(VIEW_MODES.TABLE)}
        className={styles['toggle-button']}
      >
        Table View
      </Button>
    </div>
  );
};

export default ViewToggle;