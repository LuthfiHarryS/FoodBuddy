import express from 'express';

const router = express.Router();

// Weather translation mapping
const cuacaTerjemahan = {
    "Sunny": "cerah",
    "Partly cloudy": "berawan sebagian",
    "Cloudy": "berawan",
    "Overcast": "mendung",
    "Mist": "berkabut",
    "Patchy rain possible": "hujan ringan kemungkinan",
    "Light rain": "hujan ringan",
    "Heavy rain": "hujan deras",
    "Thunderstorm": "badai petir",
    "Clear": "cerah",
    "Fog": "kabut",
    "Snow": "salju",
    "Moderate rain at times": "hujan ringan",
    "Patchy light rain": "hujan ringan",
    "Light rain shower": "Hujan Gerimis",
    "Partly Cloudy": "sedikit berawan",
};

// Get weather data for a city
router.get('/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const weatherApiKey = process.env.WEATHER_API_KEY;

        if (!weatherApiKey) {
            return res.status(500).json({ 
                error: 'Weather API key not configured' 
            });
        }

        if (!city) {
            return res.status(400).json({ 
                error: 'City parameter is required' 
            });
        }

        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${encodeURIComponent(city)}&aqi=no`
        );

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();
        const temp = data.current?.temp_c;
        const conditionEN = data.current?.condition?.text;
        const conditionID = cuacaTerjemahan[conditionEN] || conditionEN;
        const isRainy = ["Light rain", "Moderate rain", "Heavy rain", "Rain"].includes(conditionEN);

        res.json({
            temperature: temp,
            condition: {
                english: conditionEN,
                indonesian: conditionID
            },
            isRainy,
            raw: data.current
        });
    } catch (error) {
        console.error('Weather API error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch weather data',
            message: error.message 
        });
    }
});

export default router;
