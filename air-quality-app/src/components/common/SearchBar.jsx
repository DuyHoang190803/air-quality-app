import styles from './SearchBar.module.css';

const SearchBar = ({ searchQuery, onSearchChange, placeholder = "Search..." }) => {
  return (
    <div className={styles['search-container']}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className={styles['search-input']}
      />
      <div className={styles['search-icon']}>
        🔍
      </div>
    </div>
  );
};

export default SearchBar;