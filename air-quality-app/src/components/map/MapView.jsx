import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAppContext } from '../../contexts/AppContext.jsx';
import { calculateAQI } from '../../utils/helpers.js';
import MapSearchBox from './MapSearchBox';
import StationInfoPanel from './StationInfoPanel';
import styles from './MapView.module.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;


const MapView = () => {
    const { stations, selectedStation, setSelectedStation } = useAppContext();
    const [mapStyle, setMapStyle] = useState('streets-v12');
    const [filteredStations, setFilteredStations] = useState([]);

    const mapContainer = useRef(null);
    const map = useRef(null);
    const mapViewRef = useRef(null);

    // Default coordinates
    const defaultCenter = [15.8419, 50.2103];
    const defaultZoom = 10;

    // Map style options
    const mapStyles = [
        { id: 'streets-v12', name: '🗺️ Streets', url: 'mapbox://styles/mapbox/streets-v12' },
        { id: 'satellite-v9', name: '🛰️ Satellite', url: 'mapbox://styles/mapbox/satellite-v9' },
        { id: 'satellite-streets-v12', name: '🛰️ Hybrid', url: 'mapbox://styles/mapbox/satellite-streets-v12' },
        { id: 'outdoors-v12', name: '🏔️ Outdoors', url: 'mapbox://styles/mapbox/outdoors-v12' },
        { id: 'light-v11', name: '☀️ Light', url: 'mapbox://styles/mapbox/light-v11' },
        { id: 'dark-v11', name: '🌙 Dark', url: 'mapbox://styles/mapbox/dark-v11' },
        { id: 'navigation-day-v1', name: '🚗 Navigation Day', url: 'mapbox://styles/mapbox/navigation-day-v1' },
        { id: 'navigation-night-v1', name: '🌃 Navigation Night', url: 'mapbox://styles/mapbox/navigation-night-v1' }
    ];

    // Filter stations based on search query - now handled by MapSearchBox
    useEffect(() => {
        if (!stations || !Array.isArray(stations)) {
            setFilteredStations([]);
            return;
        }
        // Show all stations by default
        setFilteredStations(stations);
    }, [stations]);

    // Handle station selection from search
    const handleStationSelect = (station) => {
        setSelectedStation(station);
        if (map.current) {
            map.current.flyTo({
                center: [station.lng, station.lat],
                zoom: 14,
                duration: 1500
            });
        }
    };

    // Handle search focus - close station info panel
    const handleSearchFocus = () => {
        setSelectedStation(null);
    };

    // Handle map style change
    const handleMapStyleChange = (styleId) => {
        if (map.current) {
            const style = mapStyles.find(s => s.id === styleId);
            if (style) {
                map.current.setStyle(style.url);
                setMapStyle(styleId);

                // Re-add stations after style change
                map.current.once('styledata', () => {
                    // Small delay to ensure style is fully loaded
                    setTimeout(() => {
                        addMarkersToMap();
                    }, 500);
                });
            }
        }
    };


    // Handle click outside to deselect station
    useEffect(() => {
        const handleClickOutside = (event) => {
            // If click is on map container but not on a station marker, deselect
            if (mapContainer.current && mapContainer.current.contains(event.target)) {
                // Let Mapbox handle station clicks, this will only trigger for empty map areas
                return;
            }

            // If click is outside the entire map view, deselect station
            if (mapViewRef.current && !mapViewRef.current.contains(event.target)) {
                setSelectedStation(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setSelectedStation]);


    // Initialize map only once
    useEffect(() => {
        if (map.current) return; // Initialize map only once
        if (!mapContainer.current) return; // Wait for container to be ready

        try {
            const currentStyle = mapStyles.find(s => s.id === mapStyle);
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: currentStyle ? currentStyle.url : 'mapbox://styles/mapbox/streets-v12',
                center: defaultCenter,
                zoom: defaultZoom,
                // Prevent map from moving markers during zoom/pan
                preserveDrawingBuffer: true,
                antialias: true
            });

            map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

            // Disable map rotation to prevent marker drift
            map.current.dragRotate.disable();
            map.current.touchZoomRotate.disableRotation();

        } catch (error) {
            console.error('Error initializing map:', error);
        }

        return () => {
            if (map.current) {
                // Clean up layers and sources
                try {
                    if (map.current.getLayer('stations-labels')) {
                        map.current.removeLayer('stations-labels');
                    }
                    if (map.current.getLayer('stations-layer')) {
                        map.current.removeLayer('stations-layer');
                    }
                    if (map.current.getSource('stations')) {
                        map.current.removeSource('stations');
                    }
                } catch (error) {
                    console.warn('Error cleaning up map layers:', error);
                }

                // Clean up markers (fallback)
                markersRef.current.forEach(marker => marker.remove());
                markersRef.current = [];

                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    // Store markers reference to manage them properly
    const markersRef = useRef([]);

    // Function to add markers to the map
    const addMarkersToMap = () => {
        if (!map.current || !filteredStations || !filteredStations.length) return;

        try {
            // Remove existing layers if they exist
            if (map.current.getLayer('stations-labels')) {
                map.current.removeLayer('stations-labels');
            }
            if (map.current.getLayer('stations-layer')) {
                map.current.removeLayer('stations-layer');
            }
            if (map.current.getSource('stations')) {
                map.current.removeSource('stations');
            }
        } catch (error) {
            console.warn('Error cleaning up existing layers:', error);
        }

        // Clear existing DOM markers (fallback)
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Create GeoJSON data from stations
        const geojsonData = {
            type: 'FeatureCollection',
            features: filteredStations.map(station => {
                const aqiInfo = calculateAQI(station.data);
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(station.lng), parseFloat(station.lat)]
                    },
                    properties: {
                        id: station.id,
                        name: station.name,
                        data: station.data,
                        aqi: aqiInfo.aqi,
                        aqiColor: aqiInfo.color,
                        aqiLevel: aqiInfo.level
                    }
                };
            })
        };

        try {
            // Add source
            map.current.addSource('stations', {
                type: 'geojson',
                data: geojsonData
            });

            // Add layer for markers
            map.current.addLayer({
                id: 'stations-layer',
                type: 'circle',
                source: 'stations',
                paint: {
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        8, 6,
                        10, 10,
                        15, 15
                    ],
                    'circle-color': ['get', 'aqiColor'], // Use dynamic AQI color
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff',
                    'circle-opacity': 0.9,
                    'circle-stroke-opacity': 1
                }
            });

            // Add labels layer
            map.current.addLayer({
                id: 'stations-labels',
                type: 'symbol',
                source: 'stations',
                layout: {
                    'text-field': ['get', 'name'],
                    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                    'text-size': 10,
                    'text-offset': [0, 2.5],
                    'text-anchor': 'top'
                },
                paint: {
                    'text-color': '#333333',
                    'text-halo-color': '#ffffff',
                    'text-halo-width': 1
                }
            });

            // Add click handlers
            map.current.on('click', 'stations-layer', (e) => {
                const feature = e.features[0];
                const station = filteredStations.find(s => s.id === feature.properties.id);
                if (station) {
                    setSelectedStation(station);
                    // setShowDetailModal(true);
                }
            });

            // Add click handler for empty map areas to deselect station
            map.current.on('click', (e) => {
                // Check if click was on a station
                const features = map.current.queryRenderedFeatures(e.point, {
                    layers: ['stations-layer']
                });

                // If no station was clicked, deselect current station
                if (features.length === 0) {
                    setSelectedStation(null);
                }
            });

            // Change cursor on hover
            map.current.on('mouseenter', 'stations-layer', () => {
                map.current.getCanvas().style.cursor = 'pointer';
            });

            map.current.on('mouseleave', 'stations-layer', () => {
                map.current.getCanvas().style.cursor = '';
            });

        } catch (error) {
            console.error('Error adding markers to map:', error);
        }
    };



    // Add/update markers when stations data changes
    useEffect(() => {
        // Ensure map and stations data are ready
        if (!map.current || !filteredStations || !filteredStations.length) return;

        // Wait for map to be fully loaded before adding markers
        const addMarkersWhenReady = () => {
            if (map.current.loaded()) {
                addMarkersToMap();
            } else {
                map.current.on('load', addMarkersToMap);
            }
        };

        // Small delay to ensure everything is ready
        const timer = setTimeout(addMarkersWhenReady, 100);

        // Cleanup timer and event listeners
        return () => {
            clearTimeout(timer);
        };
    }, [filteredStations]);




    // Center map on selected station
    useEffect(() => {
        if (map.current && selectedStation && selectedStation.lat && selectedStation.lng) {
            map.current.flyTo({
                center: [selectedStation.lng, selectedStation.lat],
                zoom: 14,
                duration: 1500
            });
        }
    }, [selectedStation]);



    return (
        <div ref={mapViewRef} className={styles['map-view']}>
            {/* Map Controls */}
            <div className={styles['map-controls']}>
                {/* Google Maps Style Search */}
                <div className={styles['search-wrapper']}>
                    <MapSearchBox
                        onStationSelect={handleStationSelect}
                        onSearchFocus={handleSearchFocus}
                    />
                </div>                {/* Map Style Selector */}
                <div className={styles['style-selector']}>
                    <select
                        value={mapStyle}
                        onChange={(e) => handleMapStyleChange(e.target.value)}
                        className={styles['style-select']}
                        title="Select Map Style"
                    >
                        {mapStyles.map(style => (
                            <option key={style.id} value={style.id}>
                                {style.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Station Counter */}
                <div className={styles['station-counter']}>
                    {filteredStations.length} stations
                </div>
            </div>

            <div ref={mapContainer} className={styles['map-container']} />
            <StationInfoPanel
                station={selectedStation}
                onClose={() => setSelectedStation(null)}
            />
        </div>
    );
};

export default MapView;
