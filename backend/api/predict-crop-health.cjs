const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());


app.post('/predict-crop-health', (req, res) => {
    const inputData = req.body; 
    const dataString = JSON.stringify(inputData);

    const scriptPath = path.join(__dirname, '..', 'Models', 'predict_crop_health.py');
    
    console.log(`Running command: ${pythonExecutable} ${scriptPath}`);

    const pythonProcess = spawn(pythonExecutable, [scriptPath, dataString]);

    let predictionData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
        predictionData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
    });

    // --- UPDATED: More Robust Error Handling ---
    pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);

        // 1. Prioritize any direct error messages from the Python script.
        if (errorData) {
            console.error('--- Python stderr ---');
            console.error(errorData);
            console.error('--- End Python stderr ---');
            return res.status(500).json({ 
                error: 'The Python script returned an error.', 
                details: errorData 
            });
        }

        // 2. If the script produced no output, it's a critical failure.
        if (!predictionData.trim()) {
            const errorMessage = `The Python script produced no output. This often means there was an early error (like a missing library) or a problem with the Python path. Exit code: ${code}.`;
            console.error(errorMessage);
            return res.status(500).json({ 
                error: 'The Python script produced no output.',
                details: errorMessage
            });
        }

        // 3. Try to parse the output, but be ready for it to fail.
        console.log(`Data received from Python: ${predictionData}`);
        try {
            const prediction = JSON.parse(predictionData);
            
            // 4. Check if the JSON itself contains an error message from our script's try/except block.
            if (prediction.error) {
                console.error('Python script returned a JSON error object:', prediction);
                return res.status(500).json({ 
                    error: 'The Python script reported an internal error.', 
                    details: prediction.details || JSON.stringify(prediction)
                });
            }

            // If everything is good, send the prediction.
            res.json(prediction);

        } catch (parseError) {
            console.error(`Error parsing JSON from Python: ${parseError}`);
            res.status(500).json({ 
                error: 'Failed to parse the output from the Python script as JSON.', 
                details: predictionData 
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Crop Health API server running at http://localhost:${port}`);
});

