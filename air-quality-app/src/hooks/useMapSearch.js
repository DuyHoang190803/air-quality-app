import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext.jsx';
import { normalizeString } from '../utils/helpers.js';

/**
 * Custom hook for search functionality
 * @param {Object} options
 * @param {function} options.onStationSelect - Callback when station is selected
 * @param {function} options.onSearchFocus - Callback when search input is focused
 * @returns {Object} Search state and handlers
 */
export const useMapSearch = ({ onStationSelect, onSearchFocus } = {}) => {
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

    // Handle search focus
    const handleSearchFocus = () => {
        onSearchFocus?.();
        if (query.length >= 1) {
            setShowSuggestions(true);
        }
    };

    // Clear search
    const clearSearch = () => {
        setQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
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

    // Highlight matching text utility - returns data structure instead of JSX
    const highlightMatch = (text, query) => {
        if (!query.trim()) return [{ text, isMatch: false }];

        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) => ({
            text: part,
            isMatch: regex.test(part),
            key: index
        }));
    };

    return {
        // State
        query,
        suggestions,
        showSuggestions,
        searchRef,
        
        // Handlers
        handleSearch,
        handleSuggestionClick,
        handleSearchFocus,
        clearSearch,
        
        // Utils
        highlightMatch,
        
        // Computed
        hasResults: suggestions.length > 0,
        showNoResults: showSuggestions && query.length >= 1 && suggestions.length === 0
    };
};