import express from 'express';

const router = express.Router();

// Get user location based on IP
router.get('/', async (req, res) => {
    try {
        const geoapifyKey = process.env.GEOAPIFY_API_KEY;
        
        if (!geoapifyKey) {
            return res.status(500).json({ 
                error: 'Geoapify API key not configured' 
            });
        }

        const response = await fetch(
            `https://api.geoapify.com/v1/ipinfo?&apiKey=${geoapifyKey}`
        );

        if (!response.ok) {
            throw new Error(`Geoapify API error: ${response.status}`);
        }

        const data = await response.json();
        const city = data.city?.name || '';
        const country = data.country?.iso_code || '';

        res.json({
            city,
            country,
            location: `${city}, ${country}`
        });
    } catch (error) {
        console.error('Location API error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch location',
            message: error.message 
        });
    }
});

export default router;
