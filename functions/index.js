/**
 * FoodBuddy Cloud Functions
 * Backend API untuk FoodBuddy application
 */

const {setGlobalOptions} = require("firebase-functions/v2");
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Set global options
setGlobalOptions({
  maxInstances: 10,
  cors: true, // Enable CORS for all functions
});

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

// Helper function untuk handle CORS preflight
const handleCors = (req, res) => {
  // Set CORS headers
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  
  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return true;
  }
  return false;
};

/**
 * Location API - Get user location based on IP
 * GET /api/location
 */
exports.location = onRequest(async (req, res) => {
  try {
    if (handleCors(req, res)) return;

    const geoapifyKey = process.env.GEOAPIFY_API_KEY;

    if (!geoapifyKey) {
      logger.error("Geoapify API key not configured");
      return res.status(500).json({
        error: "Geoapify API key not configured",
      });
    }

    const response = await fetch(
      `https://api.geoapify.com/v1/ipinfo?&apiKey=${geoapifyKey}`
    );

    if (!response.ok) {
      throw new Error(`Geoapify API error: ${response.status}`);
    }

    const data = await response.json();
    const city = data.city?.name || "";
    const country = data.country?.iso_code || "";

    logger.info("Location fetched successfully", {city, country});

    res.json({
      city,
      country,
      location: `${city}, ${country}`,
    });
  } catch (error) {
    logger.error("Location API error:", error);
    res.status(500).json({
      error: "Failed to fetch location",
      message: error.message,
    });
  }
});

/**
 * Weather API - Get weather data for a city
 * GET /api/weather/:city
 */
exports.weather = onRequest(async (req, res) => {
  try {
    if (handleCors(req, res)) return;

    // Extract city from URL path
    const pathParts = req.path.split("/");
    const city = pathParts[pathParts.length - 1] || req.query.city;

    const weatherApiKey = process.env.WEATHER_API_KEY;

    if (!weatherApiKey) {
      logger.error("Weather API key not configured");
      return res.status(500).json({
        error: "Weather API key not configured",
      });
    }

    if (!city) {
      return res.status(400).json({
        error: "City parameter is required",
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
    const isRainy = ["Light rain", "Moderate rain", "Heavy rain", "Rain"]
        .includes(conditionEN);

    logger.info("Weather fetched successfully", {city, temp, conditionEN});

    res.json({
      temperature: temp,
      condition: {
        english: conditionEN,
        indonesian: conditionID,
      },
      isRainy,
      raw: data.current,
    });
  } catch (error) {
    logger.error("Weather API error:", error);
    res.status(500).json({
      error: "Failed to fetch weather data",
      message: error.message,
    });
  }
});

/**
 * Chat API - Chat with AI chatbot
 * POST /api/chat
 */
exports.chat = onRequest(async (req, res) => {
  try {
    if (handleCors(req, res)) return;

    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed",
      });
    }

    const {message} = req.body;
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    if (!openRouterKey) {
      logger.error("OpenRouter API key not configured");
      return res.status(500).json({
        error: "OpenRouter API key not configured",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: "system",
            content: "Kamu adalah asisten rekomendasi makanan dan minuman berdasarkan waktu dan cuaca saat ini. Tugasmu juga memberikan saran menu makanan dan minuman yang cocok berdasarkan pertanyaan atau preferensi pengguna. Kamu juga boleh memberikan jawaban mengenai cuaca dan waktu berdasarkan. Berikan deskripsi singkat makanan itu yang dapat menggugah selera user. Tetapi, jawabanmu harus singkat dan to the point, tidak perlu panjang atau berparagraf. Selalu jawab dalam Bahasa Indonesia terlebih dahulu, dan jika user bertanya dengan Bahasa mereka, maka jawab sesuai dengan Bahasa input dari user. Jangan menjawab pertanyaan di luar topik makanan atau minuman. Jika pertanyaan tidak relevan, tolong jawab dengan sopan dan arahkan pengguna untuk bertanya seputar makanan atau minuman.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const botReply = data.choices?.[0]?.message?.content ||
      "Maaf, tidak ada respon dari AI.";

    logger.info("Chat message processed successfully");

    res.json({
      reply: botReply,
      model: data.model,
    });
  } catch (error) {
    logger.error("Chat API error:", error);
    res.status(500).json({
      error: "Failed to get AI response",
      message: error.message,
    });
  }
});

/**
 * Health check endpoint
 * GET /api/health
 */
exports.health = onRequest((req, res) => {
  if (handleCors(req, res)) return;
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "FoodBuddy API",
  });
});
