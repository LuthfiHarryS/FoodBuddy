/**
 * Unit tests untuk script.js
 * Testing fungsi-fungsi utama aplikasi FoodBuddy
 */

// Mock window.location sebelum import
Object.defineProperty(window, 'location', {
  value: {
    hostname: 'localhost'
  },
  writable: true
});

// Mock fetch global
global.fetch = jest.fn();

// Mock marked (jika digunakan)
global.marked = {
  parse: jest.fn((text) => text)
};

// Import script.js untuk coverage
// Note: Top-level code akan dieksekusi, jadi kita perlu mock dulu
require('./script.js');

// Import functions untuk testing
const {
  getApiBaseUrl,
  getTimeOfDay,
  getTimeIcon,
  getManualRekomendasi,
  tampilkanRekomendasiManual,
  fetchLocation,
  fetchWeather,
  sendChatMessage,
  showMessage,
  showLoadingIndicator,
  removeLoadingIndicator
} = require('./script.js');

describe('FoodBuddy Application Tests', () => {
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="greeting"></div>
      <div id="day-name"></div>
      <div id="date-text"></div>
      <div id="location-text"></div>
      <div id="temperature-text"></div>
      <div id="weather-description"></div>
      <div id="recommendations"></div>
      <div id="chatBox"></div>
      <input id="userInput" />
      <button id="sendButton"></button>
      <div class="left-panel"></div>
      <div id="intro-text"></div>
      <div id="status-icon"></div>
      <div id="input-icon"></div>
    `;
    
    // Reset fetch mock
    global.fetch.mockClear();
  });

  describe('getApiBaseUrl', () => {
    test('should return localhost URL for localhost hostname', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost' },
        writable: true
      });
      expect(getApiBaseUrl()).toBe('http://localhost:3001/api');
    });

    test('should return /api for Firebase Hosting', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'foodbuddy.web.app' },
        writable: true
      });
      expect(getApiBaseUrl()).toBe('/api');
    });

    test('should return /api for GitHub Pages', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'luthfiharrys.github.io' },
        writable: true
      });
      expect(getApiBaseUrl()).toBe('/api');
    });
  });

  describe('getTimeOfDay', () => {
    test('should return pagi for hours 5-10', () => {
      const result = getTimeOfDay(8);
      expect(result.period).toBe('pagi');
      expect(result.greeting).toBe('Halo, selamat pagi!');
      expect(result.bg).toContain('.jpg');
    });

    test('should return siang for hours 11-14', () => {
      const result = getTimeOfDay(12);
      expect(result.period).toBe('siang');
      expect(result.greeting).toBe('Halo, selamat siang!');
    });

    test('should return sore for hours 15-17', () => {
      const result = getTimeOfDay(16);
      expect(result.period).toBe('sore');
      expect(result.greeting).toBe('Halo, selamat sore!');
    });

    test('should return malam for hours 18-4', () => {
      const result = getTimeOfDay(20);
      expect(result.period).toBe('malam');
      expect(result.greeting).toBe('Halo, selamat malam!');
    });

    test('should return malam for early morning hours', () => {
      const result = getTimeOfDay(2);
      expect(result.period).toBe('malam');
    });
  });

  describe('getTimeIcon', () => {
    test('should return umbrella for rainy weather', () => {
      expect(getTimeIcon(12, true)).toBe('umbrella');
    });

    test('should return wb_twilight for morning hours', () => {
      expect(getTimeIcon(8, false)).toBe('wb_twilight');
    });

    test('should return wb_sunny for afternoon hours', () => {
      expect(getTimeIcon(12, false)).toBe('wb_sunny');
    });

    test('should return cloud for evening hours', () => {
      expect(getTimeIcon(16, false)).toBe('cloud');
    });

    test('should return nights_stay for night hours', () => {
      expect(getTimeIcon(22, false)).toBe('nights_stay');
    });
  });

  describe('getManualRekomendasi', () => {
    test('should return recommendations for pagi-cerah', () => {
      const result = getManualRekomendasi('pagi', 'cerah');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      expect(result[0]).toContain('Bubur Ayam');
    });

    test('should return recommendations for siang-cerah', () => {
      const result = getManualRekomendasi('siang', 'cerah');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      expect(result[0]).toContain('Nasi Padang');
    });

    test('should return recommendations for malam-cerah', () => {
      const result = getManualRekomendasi('malam', 'cerah');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
    });

    test('should return recommendations for siang-hujan', () => {
      const result = getManualRekomendasi('siang', 'hujan');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      expect(result[0]).toContain('Bakso');
    });

    test('should return default recommendations for unknown combination', () => {
      const result = getManualRekomendasi('unknown', 'unknown');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      expect(result[0]).toContain('Nasi Telur');
    });
  });

  describe('tampilkanRekomendasiManual', () => {
    test('should create recommendation list items in DOM', () => {
      tampilkanRekomendasiManual('siang', 'cerah');
      
      const recommendationsBox = document.getElementById('recommendations');
      expect(recommendationsBox).toBeTruthy();
      
      const listItems = recommendationsBox.querySelectorAll('li');
      expect(listItems.length).toBe(3);
      expect(listItems[0].className).toBe('recommendation-card');
      expect(listItems[0].getAttribute('tabindex')).toBe('0');
    });

    test('should handle empty recommendations box gracefully', () => {
      document.getElementById('recommendations').remove();
      // Should not throw error
      expect(() => tampilkanRekomendasiManual('siang', 'cerah')).not.toThrow();
    });
  });

  describe('fetchLocation', () => {
    test('should return location data on successful fetch', async () => {
      const mockData = { 
        city: { name: 'Jakarta' }, 
        country: { iso_code: 'ID' } 
      };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });

      const result = await fetchLocation();
      // fetchLocation returns raw API data
      expect(result.city.name).toBe('Jakarta');
      expect(result.country.iso_code).toBe('ID');
    });

    test('should return default location on fetch failure', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchLocation();
      expect(result.city).toBe('');
      expect(result.country).toBe('');
      expect(result.location).toBe('Unknown');
    });

    test('should return default location on non-ok response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const result = await fetchLocation();
      expect(result.location).toBe('Unknown');
    });
  });

  describe('fetchWeather', () => {
    test('should return weather data on successful fetch', async () => {
      const mockData = {
        temperature: 28,
        condition: { indonesian: 'cerah' },
        isRainy: false
      };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });

      const result = await fetchWeather('Jakarta');
      expect(result.temperature).toBe(28);
      expect(result.condition.indonesian).toBe('cerah');
      expect(result.isRainy).toBe(false);
    });

    test('should return null for empty city', async () => {
      const result = await fetchWeather('');
      expect(result).toBeNull();
    });

    test('should return null on fetch failure', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchWeather('Jakarta');
      expect(result).toBeNull();
    });
  });

  describe('sendChatMessage', () => {
    test('should return AI reply on successful request', async () => {
      const mockResponse = {
        reply: 'Ini adalah rekomendasi makanan',
        model: 'deepseek'
      };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await sendChatMessage('Apa makanan yang cocok?');
      expect(result).toBe('Ini adalah rekomendasi makanan');
    });

    test('should return error message on failed request', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await sendChatMessage('Test');
      expect(result).toBe('Terjadi kesalahan saat menghubungi AI.');
    });
  });

  describe('showMessage', () => {
    test('should add message to chat box', () => {
      showMessage('Test message', 'user-message');
      
      const chatBox = document.getElementById('chatBox');
      const messages = chatBox.querySelectorAll('.message');
      expect(messages.length).toBe(1);
      expect(messages[0].className).toContain('user-message');
    });

    test('should handle missing chat box gracefully', () => {
      document.getElementById('chatBox').remove();
      expect(() => showMessage('Test', 'user-message')).not.toThrow();
    });
  });

  describe('showLoadingIndicator', () => {
    test('should add loading indicator to chat box', () => {
      showLoadingIndicator();
      
      const chatBox = document.getElementById('chatBox');
      const loader = chatBox.querySelector('.loading-dots');
      expect(loader).toBeTruthy();
    });
  });

  describe('removeLoadingIndicator', () => {
    test('should remove loading indicator from chat box', () => {
      showLoadingIndicator();
      removeLoadingIndicator();
      
      const chatBox = document.getElementById('chatBox');
      const loader = chatBox.querySelector('.loading-dots');
      expect(loader).toBeNull();
    });
  });

  describe('DOM Elements', () => {
    test('should have all required DOM elements', () => {
      expect(document.getElementById('greeting')).toBeTruthy();
      expect(document.getElementById('day-name')).toBeTruthy();
      expect(document.getElementById('date-text')).toBeTruthy();
      expect(document.getElementById('location-text')).toBeTruthy();
      expect(document.getElementById('temperature-text')).toBeTruthy();
      expect(document.getElementById('weather-description')).toBeTruthy();
      expect(document.getElementById('recommendations')).toBeTruthy();
      expect(document.getElementById('chatBox')).toBeTruthy();
      expect(document.getElementById('userInput')).toBeTruthy();
      expect(document.getElementById('sendButton')).toBeTruthy();
    });
  });
});
