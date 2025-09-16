import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext.jsx';
import { normalizeString } from '../../utils/helpers.js';
import styles from './MapSearchBox.module.css';

const MapSearchBox = ({ onStationSelect, onSearchFocus }) => {
    const { stations } = useAppContext();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    // Search handler
    const handleSearch = (value) => {
        setQuery(value);

        if (value.trim().length < 1) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const normalizedQuery = normalizeString(value);

        // Filter stations with improved search
        const filteredStations = stations.filter(station => {
            const normalizedName = normalizeString(station.name);

            // Check if query matches any part of the station name
            return normalizedQuery.split(' ').some(queryPart =>
                queryPart.length > 0 && normalizedName.includes(queryPart)
            ) ||
                // Also check original name for exact matches
                station.name.toLowerCase().includes(value.toLowerCase());
        }).map(station => ({
            ...station,
            type: 'station',
            icon: '📍',
            category: 'Monitoring Station'
        }));

        setSuggestions(filteredStations);
        setShowSuggestions(true);
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        if (suggestion.type === 'station') {
            onStationSelect?.(suggestion);
            setQuery(suggestion.name);
        }
        setShowSuggestions(false);
    };

    // Highlight matching text
    const highlightMatch = (text, query) => {
        if (!query.trim()) return text;

        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ?
                <mark key={index} style={{ backgroundColor: '#fff3cd', padding: '0 2px' }}>{part}</mark> :
                part
        );
    };

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <div ref={searchRef} className={styles['search-container']}>
                <div className={styles['search-box']}>
                    <div className={styles['search-icon']}>🔍</div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search stations..."
                        className={styles['search-input']}
                        onFocus={() => {
                            onSearchFocus?.();
                            query.length >= 1 && setShowSuggestions(true);
                        }}
                    />
                    {query && (
                        <button
                            className={styles['clear-button']}
                            onClick={() => {
                                setQuery('');
                                setSuggestions([]);
                                setShowSuggestions(false);
                            }}
                        >
                            ✕
                        </button>
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
                                        {highlightMatch(suggestion.name, query)}
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
                {showSuggestions && query.length >= 1 && suggestions.length === 0 && (
                    <div className={styles['suggestions']}>
                        <div className={styles['no-results']}>
                            <div className={styles['no-results-icon']}>🔍</div>
                            <div>No recent results found</div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default MapSearchBox;