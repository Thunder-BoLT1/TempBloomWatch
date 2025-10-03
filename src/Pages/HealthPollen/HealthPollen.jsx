import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import styles from './HealthPollen.module.css';

// --- Helper Components (Moved Outside) ---

const ChoiceScreen = ({ setCurrentView }) => (
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

const AgriculturalForm = ({ setCurrentView, predictionFormData, handlePredictionFormChange, handlePredictionFormSubmit, isLoading }) => (
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

const AgriculturalResults = ({ setShowPredictionResults, predictionResult, predictionError }) => {
    const getResultCardClass = () => {
        const prediction = predictionResult?.prediction;
        if (prediction === 'Healthy') return styles.successCard;
        if (prediction === 'Stressed') return styles.moderateCard;
        if (prediction === 'Diseased') return styles.diseasedCard;
        return styles.successCard;
    };

    return (
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
                    <div className={`${styles.resultCard} ${getResultCardClass()}`}>
                        <h3>Predicted Crop Health:</h3>
                        <p className={styles.predictionValue}>{predictionResult.prediction}</p>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- The Main Component ---
const HealthPollen = () => {
    // --- State Management ---
    const [currentView, setCurrentView] = useState('choice');
    
    const [predictionFormData, setPredictionFormData] = useState({
        "Humidity_%": '65.5', "Rainfall_m": '5.2', "Temperature_C": '22.3',
        "WindSpeed_m/s": '3.1', "SolarRadiation": '18.5', "Clay": '30.2',
        "OrganicCarbon": '1.5', "Sand": '45.8', "Silt": '24.0', "SoilMoisture": '0.28',
        "EVI": '0.45', "NDVI": '0.68', "NDWI": '0.12', "SAVI": '0.55',
        "week_number": '25', "month": '6', "day_of_year": '170',
        "region": 'South_Africa', "season": 'Spring'
    });

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

        const regions = ["East_Africa", "North_Africa", "South_Africa", "West_Africa"];
        regions.forEach(r => {
            payload[`region_${r}`] = (predictionFormData.region === r) ? 1 : 0;
        });

        const seasons = ["Autumn", "Spring", "Summer", "Winter"];
        seasons.forEach(s => {
            payload[`season_${s}`] = (predictionFormData.season === s) ? 1 : 0;
        });
        
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
                setPredictionResult(result);
                setShowPredictionResults(true);
            }
        } catch (err) {
            setPredictionError(`Failed to fetch prediction: ${err.message}. Is the API server running?`);
            setShowPredictionResults(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePredictionFormChange = (e) => {
        const { name, value } = e.target;
        setPredictionFormData(prev => ({...prev, [name]: value }));
    };

    // --- Main Render Logic ---
    if (currentView === 'choice') {
        return <ChoiceScreen setCurrentView={setCurrentView} />;
    }

    if (currentView === 'agricultural') {
        if (showPredictionResults) {
            return <AgriculturalResults 
                        setShowPredictionResults={setShowPredictionResults}
                        predictionResult={predictionResult}
                        predictionError={predictionError}
                    />;
        } else {
            return <AgriculturalForm
                        setCurrentView={setCurrentView}
                        predictionFormData={predictionFormData}
                        handlePredictionFormChange={handlePredictionFormChange}
                        handlePredictionFormSubmit={handlePredictionFormSubmit}
                        isLoading={isLoading}
                    />;
        }
    }

    return <div>Something went wrong.</div>;
};

export default HealthPollen;

