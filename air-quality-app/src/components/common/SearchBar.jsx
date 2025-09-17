import styles from './SearchBar.module.css';

const SearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  placeholder = "Search...", 
  className = '',
  onFocus,
  ...props 
}) => {
  return (
    <div className={styles['search-container']}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className={`${styles['search-input']} ${className}`}
        onFocus={onFocus}
        {...props}
      />
      <div className={styles['search-icon']}>
        🔍
      </div>
    </div>
  );
};

export default SearchBar;