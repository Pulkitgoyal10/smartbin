const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Initialize with some default data so the GET request never fails
let binData = [{
    bin_id: "Bin_001",
    fill_percentage: 0.0,
    battery: 80
}];

// Simple health check
app.get('/', (req, res) => {
    res.send("Smart Bin API is active!");
});

// GET: What the Dashboard calls
app.get('/data', (req, res) => {
    res.status(200).json(binData);
});

// POST: What the ESP32 calls
app.post('/data', (req, res) => {
    try {
        const { bin_id, fill_percentage, battery } = req.body;
        
        // Basic validation to prevent "Server error"
        if (!bin_id) {
            return res.status(400).json({ error: "Missing bin_id" });
        }

        binData[0] = {
            bin_id: bin_id,
            fill_percentage: parseFloat(fill_percentage) || 0,
            battery: battery || 80
        };

        console.log("Updated Data:", binData[0]);
        res.status(201).json({ status: "success", received: binData[0] });
        
    } catch (err) {
        console.error("Internal Error:", err);
        res.status(500).json({ error: "Server crashed during processing" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server ready on port ${PORT}`);
});
