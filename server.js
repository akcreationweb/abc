// server.js
import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 3000; // The port where your local server will run

// API Information
const API_KEY = "25bdff0de7167fca0205fbc4009023afdf21c163f925937b4948517b098e89b9"; 
const API_BASE_URL = "https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api";
const ENDPOINT = "/ytapi";

// Enable CORS
app.use(cors());

// Middleware for parsing JSON requests
app.use(express.json());

// Proxy Route for Download Requests
app.post('/api/download', async (req, res) => {
    // Extract parameters from the client request
    const { url, fo, qu } = req.body;

    if (!url || !fo || !qu) {
        return res.status(400).json({ error: "Missing required parameters: url, fo, or qu" });
    }

    const params = {
        url: url,
        fo: fo,
        qu: qu
    };

    try {
        // Call the external download API using the stored API_KEY
        const response = await axios.get(`${API_BASE_URL}${ENDPOINT}`, {
            params: params,
            headers: {
                // Sending the API Key securely via Authorization Header
                'Authorization': `Bearer ${API_KEY}`, 
            }
        });

        // Send the external API's response back to the client
        res.json(response.data);
    } catch (error) {
        console.error("External API Call Failed:", error.response?.data || error.message);
        res.status(500).json({ 
            error: "Failed to process download request",
            details: error.response?.data?.message || "Internal server error"
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Your server is running on localhost:${PORT}`);
});
