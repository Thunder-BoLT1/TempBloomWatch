import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import styles from './HealthPollen.module.css';

// --- The Main Component ---
const HealthPollen = () => {
    // --- State Management ---
    const [currentView, setCurrentView] = useState('choice');
    
    // State for the new Agricultural Prediction Form
    const [predictionFormData, setPredictionFormData] = useState({
        // Climate
        "Humidity_%": '55.0',
        "Rainfall_m": '0.12',
        "Temperature_C": '22.5',
        "WindSpeed_m/s": '3.2',
        "SolarRadiation": '210.0',
        // Soil
        "Clay": '18.0',
        "OrganicCarbon": '1.8',
        "Sand": '65.0',
        "Silt": '17.0',
        "SoilMoisture": '23.0',
        // Vegetation
        "EVI": '0.32',
        "NDVI": '0.68',
        "NDWI": '0.15',
        "SAVI": '0.45',
        // Time
        "week_number": '24',
        "month": '6',
        "day_of_year": '165',
        // Categorical
        "region": 'South_Africa',
        "season": 'Spring'
    });

    // State for managing results screens
    const [showPredictionResults, setShowPredictionResults] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null);
    const [predictionError, setPredictionError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // --- Form Submission Handler for the Prediction Model ---
    const handlePredictionFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setPredictionError(null);
        setPredictionResult(null);

        // 1. Construct the payload with all numerical values converted from strings
        const payload = {
            "Humidity_%": Number(predictionFormData["Humidity_%"]),
            "Rainfall_m": Number(predictionFormData["Rainfall_m"]),
            "Temperature_C": Number(predictionFormData["Temperature_C"]),
            "WindSpeed_m/s": Number(predictionFormData["WindSpeed_m/s"]),
            "SolarRadiation": Number(predictionFormData["SolarRadiation"]),
            "Clay": Number(predictionFormData["Clay"]),
            "OrganicCarbon": Number(predictionFormData["OrganicCarbon"]),
            "Sand": Number(predictionFormData["Sand"]),
            "Silt": Number(predictionFormData["Silt"]),
            "SoilMoisture": Number(predictionFormData["SoilMoisture"]),
            "EVI": Number(predictionFormData["EVI"]),
            "NDVI": Number(predictionFormData["NDVI"]),
            "NDWI": Number(predictionFormData["NDWI"]),
            "SAVI": Number(predictionFormData["SAVI"]),
            "week_number": Number(predictionFormData["week_number"]),
            "month": Number(predictionFormData["month"]),
            "day_of_year": Number(predictionFormData["day_of_year"]),
        };

        // 2. Add the one-hot encoded region features
        const regions = ["East_Africa", "North_Africa", "South_Africa", "West_Africa"];
        regions.forEach(r => {
            payload[`region_${r}`] = (predictionFormData.region === r) ? 1 : 0;
        });

        // 3. Add the one-hot encoded season features
        const seasons = ["Autumn", "Spring", "Summer", "Winter"];
        seasons.forEach(s => {
            payload[`season_${s}`] = (predictionFormData.season === s) ? 1 : 0;
        });
        
        // 4. Call the Node.js API
        try {
            const response = await fetch('http://localhost:4000/predict-crop-health', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(errorDetails.details || 'Network response was not ok');
            }

            const result = await response.json();
            if (result.error) {
                setPredictionError(result.error);
            } else {
                setPredictionResult(result); // Store the entire result object
                setShowPredictionResults(true);
            }
        } catch (err) {
            setPredictionError(`Failed to fetch prediction: ${err.message}. Is the API server running?`);
            setShowPredictionResults(true); // Show the results screen even on error
        } finally {
            setIsLoading(false);
        }
    };

    const handlePredictionFormChange = (e) => {
        const { name, value } = e.target;
        setPredictionFormData(prev => ({...prev, [name]: value }));
    };

    // --- Components for different views ---

    const ChoiceScreen = () => (
        <div className={styles.container}>
            <div className={styles.choiceContainer}>
                <div className={styles.choiceHeader}>
                    <h1 className={styles.mainTitle}>BloomWatch Services</h1>
                    <p className={styles.subtitle}>Choose your area of interest to get personalized insights</p>
                </div>
                <div className={styles.choiceCards}>
                    <div className={styles.choiceCard} onClick={() => setCurrentView('agricultural')}>
                        <div className={styles.choiceIcon}>🌾</div>
                        <h3 className={styles.cardTitle}>Crop Health Prediction</h3>
                        <p className={styles.cardDescription}>Input detailed environmental data to predict crop health status using our advanced machine learning model.</p>
                        <button className={styles.choiceButton}>Use Prediction Model</button>
                    </div>
                </div>
            </div>
        </div>
    );
    
    // --- The Agricultural Prediction Form ---
    const AgriculturalForm = () => (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <button className={styles.backButton} onClick={() => setCurrentView('choice')}>← Back to Services</button>
                <div className={styles.formHeader}>
                    <h2 className={styles.formTitle}>Crop Health Prediction Model</h2>
                    <p className={styles.subtitle}>Provide the following metrics to receive a model-based prediction.</p>
                </div>
                <form className={styles.predictionForm} onSubmit={handlePredictionFormSubmit}>
                    
                    <fieldset className={styles.fieldset}>
                        <legend>Climate</legend>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}><label>Humidity (%)</label><input type="number" step="any" name="Humidity_%" value={predictionFormData["Humidity_%"]} onChange={handlePredictionFormChange} placeholder="e.g., 65.5" required/></div>
                            <div className={styles.formGroup}><label>Rainfall (m)</label><input type="number" step="any" name="Rainfall_m" value={predictionFormData["Rainfall_m"]} onChange={handlePredictionFormChange} placeholder="e.g., 5.2" required/></div>
                            <div className={styles.formGroup}><label>Temperature (°C)</label><input type="number" step="any" name="Temperature_C" value={predictionFormData["Temperature_C"]} onChange={handlePredictionFormChange} placeholder="e.g., 22.3" required/></div>
                            <div className={styles.formGroup}><label>Wind Speed (m/s)</label><input type="number" step="any" name="WindSpeed_m/s" value={predictionFormData["WindSpeed_m/s"]} onChange={handlePredictionFormChange} placeholder="e.g., 3.1" required/></div>
                            <div className={styles.formGroup}><label>Solar Radiation</label><input type="number" step="any" name="SolarRadiation" value={predictionFormData["SolarRadiation"]} onChange={handlePredictionFormChange} placeholder="e.g., 18.5" required/></div>
                        </div>
                    </fieldset>

                    <fieldset className={styles.fieldset}>
                        <legend>Soil</legend>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}><label>Clay (%)</label><input type="number" step="any" name="Clay" value={predictionFormData.Clay} onChange={handlePredictionFormChange} placeholder="e.g., 30.2" required/></div>
                            <div className={styles.formGroup}><label>Organic Carbon</label><input type="number" step="any" name="OrganicCarbon" value={predictionFormData.OrganicCarbon} onChange={handlePredictionFormChange} placeholder="e.g., 1.5" required/></div>
                            <div className={styles.formGroup}><label>Sand (%)</label><input type="number" step="any" name="Sand" value={predictionFormData.Sand} onChange={handlePredictionFormChange} placeholder="e.g., 45.8" required/></div>
                            <div className={styles.formGroup}><label>Silt (%)</label><input type="number" step="any" name="Silt" value={predictionFormData.Silt} onChange={handlePredictionFormChange} placeholder="e.g., 24.0" required/></div>
                            <div className={styles.formGroup}><label>Soil Moisture</label><input type="number" step="any" name="SoilMoisture" value={predictionFormData.SoilMoisture} onChange={handlePredictionFormChange} placeholder="e.g., 0.28" required/></div>
                        </div>
                    </fieldset>

                    <fieldset className={styles.fieldset}>
                        <legend>Vegetation Indices</legend>
                        <div className={styles.formGrid}>
                             <div className={styles.formGroup}><label>EVI</label><input type="number" step="any" name="EVI" value={predictionFormData.EVI} onChange={handlePredictionFormChange} placeholder="e.g., 0.45" required/></div>
                             <div className={styles.formGroup}><label>NDVI</label><input type="number" step="any" name="NDVI" value={predictionFormData.NDVI} onChange={handlePredictionFormChange} placeholder="e.g., 0.68" required/></div>
                             <div className={styles.formGroup}><label>NDWI</label><input type="number" step="any" name="NDWI" value={predictionFormData.NDWI} onChange={handlePredictionFormChange} placeholder="e.g., 0.12" required/></div>
                             <div className={styles.formGroup}><label>SAVI</label><input type="number" step="any" name="SAVI" value={predictionFormData.SAVI} onChange={handlePredictionFormChange} placeholder="e.g., 0.55" required/></div>
                        </div>
                    </fieldset>

                     <fieldset className={styles.fieldset}>
                        <legend>Time</legend>
                        <div className={styles.formGrid}>
                           <div className={styles.formGroup}><label>Week Number</label><input type="number" name="week_number" value={predictionFormData.week_number} onChange={handlePredictionFormChange} placeholder="1-52" required/></div>
                           <div className={styles.formGroup}><label>Month</label><input type="number" name="month" value={predictionFormData.month} onChange={handlePredictionFormChange} placeholder="1-12" required/></div>
                           <div className={styles.formGroup}><label>Day of Year</label><input type="number" name="day_of_year" value={predictionFormData.day_of_year} onChange={handlePredictionFormChange} placeholder="1-365" required/></div>
                        </div>
                    </fieldset>

                    <div className={styles.categoricalGrid}>
                        <fieldset className={styles.fieldset}>
                            <legend>Region</legend>
                            <div className={styles.radioGroup}>
                                {["East_Africa", "North_Africa", "South_Africa", "West_Africa"].map(region => (
                                    <label key={region}><input type="radio" name="region" value={region} checked={predictionFormData.region === region} onChange={handlePredictionFormChange} required/> {region.replace('_', ' ')}</label>
                                ))}
                            </div>
                        </fieldset>

                        <fieldset className={styles.fieldset}>
                            <legend>Season</legend>
                             <div className={styles.radioGroup}>
                                {["Spring", "Summer", "Autumn", "Winter"].map(season => (
                                    <label key={season}><input type="radio" name="season" value={season} checked={predictionFormData.season === season} onChange={handlePredictionFormChange} required/> {season}</label>
                                ))}
                            </div>
                        </fieldset>
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={isLoading}>
                        {isLoading ? 'Analyzing...' : 'Get Crop Health Prediction'}
                    </button>
                </form>
            </div>
        </div>
    );
    
    const AgriculturalResults = () => (
        <div className={styles.container}>
            <div className={styles.resultsContainer}>
                <button className={styles.backButton} onClick={() => setShowPredictionResults(false)}>← Back to Form</button>
                <div className={styles.resultsHeader}>
                    <h2 className={styles.formTitle}>Prediction Result</h2>
                    <p className={styles.subtitle}>Based on the environmental data you provided</p>
                </div>

                {predictionError && (
                    <div className={`${styles.resultCard} ${styles.errorCard}`}>
                        <h3>An Error Occurred</h3>
                        <p>{predictionError}</p>
                    </div>
                )}
                
                {predictionResult && predictionResult.prediction && (
                    <div className={`${styles.resultCard} ${styles.successCard}`}>
                        <h3>Predicted Crop Health:</h3>
                        <p className={styles.predictionValue}>{predictionResult.prediction}</p>
                    </div>
                )}
            </div>
        </div>
    );

    // --- Main Render Logic ---
    return (
        <div>
            {currentView === 'choice' && <ChoiceScreen />}
            {currentView === 'agricultural' && !showPredictionResults && <AgriculturalForm />}
            {currentView === 'agricultural' && showPredictionResults && <AgriculturalResults />}
        </div>
    );
};

export default HealthPollen;

