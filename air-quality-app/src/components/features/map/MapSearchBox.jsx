import React from 'react';
import { useMapSearch } from '../../../hooks/useMapSearch.js';
import { Button } from '../../ui/Button';
import SearchBar from '../../common/SearchBar';
import styles from './MapSearchBox.module.css';

/**
 * MapSearchBox Component - Search interface for map stations
 * @param {Object} props
 * @param {function} props.onStationSelect - Callback when station is selected
 * @param {function} props.onSearchFocus - Callback when search input is focused
 */
const MapSearchBox = ({ onStationSelect, onSearchFocus }) => {

    const {
        query,
        suggestions,
        showSuggestions,
        showNoResults,
        searchRef,
        handleSearch,
        handleSuggestionClick,
        handleSearchFocus,
        clearSearch,
        highlightMatch
    } = useMapSearch({ onStationSelect, onSearchFocus });

    return (
        <div ref={searchRef} className={styles['search-container']}>
            <div className={styles['search-box']}>
                <SearchBar
                    searchQuery={query}
                    onSearchChange={handleSearch}
                    placeholder="Search stations..."
                    className={styles['search-input']}
                    onFocus={handleSearchFocus}
                />
                {query && (
                    <Button
                        variant="ghost"
                        size="small"
                        className={styles['clear-button']}
                        onClick={clearSearch}
                    >
                        ✕
                    </Button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className={styles['suggestions']}>
                    {suggestions.slice(0, 8).map((suggestion) => (
                        <div
                            key={suggestion.id}
                            className={styles['suggestion-item']}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            <div className={styles['suggestion-icon']}>
                                {suggestion.icon}
                            </div>
                            <div className={styles['suggestion-content']}>
                                <div className={styles['suggestion-name']}>
                                    {highlightMatch(suggestion.name, query).map((part) =>
                                        part.isMatch ? (
                                            <mark key={part.key} style={{ backgroundColor: '#fff3cd', padding: '0 2px' }}>
                                                {part.text}
                                            </mark>
                                        ) : (
                                            part.text
                                        )
                                    )}
                                </div>
                                <div className={styles['suggestion-address']}>
                                    {suggestion.category}
                                </div>
                            </div>
                            <div className={styles['suggestion-type']}>
                                📊
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* No results */}
            {showNoResults && (
                <div className={styles['suggestions']}>
                    <div className={styles['no-results']}>
                        <div className={styles['no-results-icon']}>🔍</div>
                        <div>No recent results found</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapSearchBox;