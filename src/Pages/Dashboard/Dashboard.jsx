import React, { useState, useEffect, useMemo } from 'react';
import { motion as m } from "framer-motion";
import Map from '../../Components/StoryTellingMap/Map.jsx';
import RangeSlider from '../../Components/RangeSliderDB/RangeSlider.jsx';
import styles from './Dashboard.module.css';
import 'leaflet/dist/leaflet.css';

// --- Data variables (matches keys in the new JSON) ---
const dataVariables = {
    // Vegetation Indices
    'NDVI': 'NDVI',
    'EVI': 'EVI',
    'NDWI': 'NDWI',
    'SAVI': 'SAVI',

    // Weather Metrics
    'Temperature': 'Temperature_C',
    'Rainfall': 'Rainfall_mm',
    'Humidity': 'Humidity_%',
    'Wind Speed': 'WindSpeed_m/s',
    'Soil Moisture': 'SoilMoisture',
    'Solar Radiation': 'SolarRadiation',

    // Soil Composition
    'Clay %': 'Clay',
    'Sand %': 'Sand',
    'Silt %': 'Silt',
    'Organic Carbon': 'OrganicCarbon',
};

// --- Helper function to get a date from a week number ---
const getDateFromWeek = (year, week) => {
    // This creates a date object for the first day of the given week
    const date = new Date(year, 0, 1 + (week - 1) * 7);
    return date;
};

// --- The Main Dashboard Component ---
function Dashboard() {
    // --- State Management ---
    const [allBloomEvents, setAllBloomEvents] = useState([]);
    const [dateRange, setDateRange] = useState({ min: 0, max: 0 });
    const [isLoading, setIsLoading] = useState(true);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [animationFrame, setAnimationFrame] = useState(0);
    const [animationSpeed, setAnimationSpeed] = useState(250);
    const [selectedVariable, setSelectedVariable] = useState('NDVI');

    // --- Data Fetching ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Assuming the new data is in the same file location
                const response = await fetch('./data/AfricaData.json'); 

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                
                // --- MODIFIED: Standardize data using 'year' and 'week_number' ---
                const standardizedData = data.map(d => {
                    const eventDate = getDateFromWeek(d.year, d.week_number);
                    return {
                      ...d, 
                      // Add a full date object for reliable sorting
                      fullDate: eventDate,
                      // Keep original year and week for labeling
                      year: d.year,
                      week_number: d.week_number,
                    };
                });

                // Sort data chronologically using the new fullDate property
                const sortedData = standardizedData.sort((a, b) => a.fullDate - b.fullDate);
                
                setAllBloomEvents(sortedData);

                // Set the slider range to cover the entire dataset
                const fullRange = { min: 0, max: sortedData.length - 1 };
                setDateRange(fullRange);
                setAnimationFrame(0);
                setIsPlaying(false);

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []); // Runs once on component mount

    // --- Memoized Derived State ---
    const variableMaxValues = useMemo(() => {
        if (!allBloomEvents.length) return {};
        const maxValues = {};
        Object.values(dataVariables).forEach(key => { maxValues[key] = -Infinity; });
        allBloomEvents.forEach(event => {
            Object.values(dataVariables).forEach(key => {
                if (event[key] > maxValues[key]) {
                    maxValues[key] = event[key];
                }
            });
        });
        return maxValues;
    }, [allBloomEvents]);

    // --- MODIFIED: Generate labels based on week and year ---
    const dateLabels = useMemo(() => {
        if (!allBloomEvents.length) return [];
        return allBloomEvents.map(e => `W${e.week_number}-${e.year}`);
    }, [allBloomEvents]);

    const allTransformedBloomEvents = useMemo(() => {
        return allBloomEvents.map(e => ({
            geoCode: [e.lat, e.lon],
            value: e[selectedVariable],
            text: `Event from Week ${e.week_number}, ${e.year}`,
            ...e
        }));
    }, [allBloomEvents, selectedVariable]);

    // --- Animation Logic ---
    useEffect(() => {
        if (!isPlaying || !allBloomEvents.length) return;
        
        const intervalId = setInterval(() => {
            setAnimationFrame(prevFrame => (prevFrame >= dateRange.max ? dateRange.min : prevFrame + 1));
        }, animationSpeed);
        
        return () => clearInterval(intervalId);
    }, [isPlaying, dateRange, animationSpeed, allBloomEvents]);

    // --- Data Filtering for Display ---
    const displayedBloomEvents = useMemo(() => {
        if (!allBloomEvents.length) return [];
        
        if (isPlaying) {
            // During animation, show only the data for the current animation frame (week)
            return [allTransformedBloomEvents[animationFrame]];
        }
        // When not playing, show all data within the selected slider range
        return allTransformedBloomEvents.slice(dateRange.min, dateRange.max + 1);
    }, [dateRange, isPlaying, animationFrame, allTransformedBloomEvents]);
    
    // --- Event Handlers ---
    const handleRangeChange = (min, max) => {
        setIsPlaying(false);
        setDateRange({ min, max });
        setAnimationFrame(min);
    };

    // --- Render Logic ---
    if (isLoading) {
        return <div className={styles.loadingScreen}>Loading Dashboard...</div>;
    }

    return (
        <div className={styles.dashboardContainer}>
            <m.div 
                className={styles.visualization}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className={styles.dashboardHeader}>
                    <h1>Phenology Dashboard: Africa</h1>
                    <p>Explore environmental data over time. Use the controls below to select a variable and visualize changes on the map.</p>
                </div>

                <Map 
                    bloomEvents={displayedBloomEvents} 
                    animate={!isPlaying} 
                    maxHeatmapValue={variableMaxValues[selectedVariable]}
                />

                <div className={styles.bottomControlsContainer}>
                    <div className={styles.controlsPanel}>
                        <div className={styles.animationControls}>
                            <div className={styles.variableSelector}>
                                {Object.entries(dataVariables).map(([displayName, keyName]) => (
                                    <label key={keyName}>
                                        <input
                                            type="radio"
                                            name="variable"
                                            value={keyName}
                                            checked={selectedVariable === keyName}
                                            onChange={(e) => setSelectedVariable(e.target.value)}
                                        />
                                        <span>{displayName}</span>
                                    </label>
                                ))}
                            </div>
                            <button onClick={() => setIsPlaying(!isPlaying)}>
                                {isPlaying ? "Pause" : "Play Animation"}
                            </button>
                            {isPlaying && <span className={styles.animationStatus}>Showing: {dateLabels[animationFrame]}</span>}
                            <div className={styles.speedControl}>
                                <label htmlFor="speed">Speed</label>
                                <input
                                    type="range"
                                    id="speed"
                                    min="50"
                                    max="1000"
                                    step="50"
                                    value={animationSpeed}
                                    onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                                />
                            </div>
                        </div>
                        <RangeSlider
                            labels={dateLabels}
                            minValue={dateRange.min}
                            maxValue={dateRange.max}
                            onRangeChange={handleRangeChange}
                        />
                    </div>
                </div>
            </m.div>
        </div>
    );
}

export default Dashboard;