const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Improved proxy handler function
async function proxyRequest(config) {
    try {
        const response = await axios({
            method: config.method,
            url: config.url,
            headers: config.headers,
            data: config.data,
            maxBodyLength: Infinity,
            validateStatus: () => true // Handle all status codes without throwing
        });
        return response;
    } catch (error) {
        console.error('Proxy request error:', error.message);
        throw error;
    }
}

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Unified proxy endpoint for all methods
app.all('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    
    if (!targetUrl) {
        return res.status(400).json({ error: 'Target URL is required' });
    }

    // Filter out problematic headers
    const forwardedHeaders = { ...req.headers };
    const headersToRemove = [
        'host', 'origin', 'referer', 
        'content-length', 'accept-encoding',
        'connection', 'cookie'
    ];
    
    headersToRemove.forEach(header => {
        delete forwardedHeaders[header];
    });

    // Prepare request config
    const config = {
        method: req.method.toLowerCase(),
        url: targetUrl,
        headers: forwardedHeaders,
        data: req.body
    };

    try {
        const response = await proxyRequest(config);
        
        // Forward response headers
        Object.entries(response.headers).forEach(([key, value]) => {
            res.setHeader(key, value);
        });
        
        return res.status(response.status).send(response.data);
    } catch (error) {
        if (error.response) {
            // Forward error response
            return res.status(error.response.status).send(error.response.data);
        } else if (error.request) {
            return res.status(502).json({ error: 'Bad Gateway: No response from target server' });
        } else {
            console.error('Proxy setup error:', error.message);
            return res.status(500).json({ error: 'Internal proxy server error' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});