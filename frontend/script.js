// FoodBuddy Frontend - Optimized JavaScript
// API Configuration - Automatically detects environment
const getApiBaseUrl = () => {
    const hostname = window.location.hostname;
    
    // Development environment
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3001/api';
    }
    
    // GitHub Pages production
    if (hostname.includes('github.io')) {
        // IMPORTANT: Update this with your backend production URL after deploying backend
        // Example: 'https://foodbuddy-backend.railway.app/api'
        // Example: 'https://foodbuddy-backend.onrender.com/api'
        // For now, using relative path (will fail if backend not deployed)
        // TODO: Replace with actual backend URL after deployment
        return '/api'; // Update this with your backend URL!
    }
    
    // Default: use relative path
    return '/api';
};

const API_BASE_URL = getApiBaseUrl();

// Utility functions
const getTimeOfDay = (hour) => {
    if (hour >= 5 && hour < 11) return { period: 'pagi', greeting: 'Halo, selamat pagi!', bg: 'Assets/ioann-mark-kuznietsov-P6uqpNyXcI4-unsplash.jpg' };
    if (hour >= 11 && hour < 15) return { period: 'siang', greeting: 'Halo, selamat siang!', bg: 'Assets/shifaaz-shamoon-sLAk1guBG90-unsplash.jpg' };
    if (hour >= 15 && hour < 18) return { period: 'sore', greeting: 'Halo, selamat sore!', bg: 'Assets/shifaaz-shamoon-sLAk1guBG90-unsplash.jpg' };
    return { period: 'malam', greeting: 'Halo, selamat malam!', bg: 'Assets/luca-bravo-a_hPPrncGlQ-unsplash.jpg' };
};

const getTimeIcon = (hour, isRainy) => {
    if (isRainy) return 'umbrella';
    if (hour >= 5 && hour < 11) return 'wb_twilight';
    if (hour >= 11 && hour < 15) return 'wb_sunny';
    if (hour >= 15 && hour < 18) return 'cloud';
    return 'nights_stay';
};

// Initialize time-based UI
const currentHour = new Date().getHours();
const timeData = getTimeOfDay(currentHour);
const leftPanel = document.querySelector('.left-panel');
const greetingElement = document.getElementById('greeting');

if (leftPanel) {
    leftPanel.style.backgroundImage = `url("${timeData.bg}")`;
}
if (greetingElement) {
    greetingElement.textContent = timeData.greeting;
}

// Initialize date
const date = new Date();
const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const dayNameEl = document.getElementById('day-name');
const dateTextEl = document.getElementById('date-text');
if (dayNameEl) dayNameEl.textContent = dayNames[date.getDay()];
if (dateTextEl) dateTextEl.textContent = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;

// Recommendations data
const getManualRekomendasi = (waktu, cuaca) => {
    const kunci = `${waktu}-${cuaca}`;
    const daftarRekomendasi = {
        'pagi-cerah': [
            'Bubur Ayam Komplit – lembut, hangat, dan penuh topping yang bikin nagih.',
            'Roti Bakar Isi Cokelat dan Keju – lelehan isi manis-gurih yang lumer di lidah.',
            'Susu Hangat dan Pisang – simpel, sehat, dan bikin pagi lebih bertenaga.'
        ],
        'siang-cerah': [
            'Nasi Padang Daging Rendang – pedas gurihnya menggugah semangat makan siang.',
            'Gado-Gado – segar, kaya rasa, dan saus kacangnya nendang!',
            'Mie Ayam Jamur – kenyal dan gurih, pas banget buat isi ulang tenaga.'
        ],
        'malam-cerah': [
            'Soto Ayam – kuah hangat dan aroma rempahnya bikin rileks.',
            'Nasi Goreng Spesial – harum, gurih, dan selalu jadi comfort food terbaik.',
            'Wedang Jahe & Pisang Goreng – hangat, manis, dan bikin malam makin cozy.'
        ],
        'siang-hujan': [
            'Bakso Urat – kenyal-kenyal mantap dengan kuah hangat menggoda.',
            'Mie Rebus Jawa – kuah pedas gurihnya susah dilawan saat hujan.',
            'Teh Hangat dan Tahu Isi – kriuk dan hangat yang memanjakan lidah.'
        ],
        'malam-hujan ringan': [
            'Sop Buntut – daging empuk dan kuah panas yang menyentuh hati.',
            'Nasi Rawon – kaya rempah, hangat, dan bikin tidur lebih nyenyak.',
            'Kacang Rebus & Wedang Ronde – camilan hangat yang bikin betah berlama-lama.'
        ],
        'malam-hujan': [
            'Sop Buntut – daging empuk dan kuah panas yang menyentuh hati.',
            'Nasi Rawon – kaya rempah, hangat, dan bikin tidur lebih nyenyak.',
            'Kacang Rebus & Wedang Ronde – camilan hangat yang bikin betah berlama-lama.'
        ],
        'default': [
            'Nasi Telur Kecap – sederhana, cepat disiapkan, dan selalu menggugah selera.',
            'Mie Ayam – kuah gurih, dan ayam berbumbu yang selalu jadi favorit kapan saja.',
            'Roti Bakar Cokelat – roti garing di luar, lembut di dalam, dengan cokelat lumer.'
        ]
    };
    return daftarRekomendasi[kunci] || daftarRekomendasi['default'];
};

const tampilkanRekomendasiManual = (waktu, cuaca) => {
    const rekomendasiBox = document.getElementById('recommendations');
    if (!rekomendasiBox) return;
    
    rekomendasiBox.innerHTML = '';
    const rekomendasiList = getManualRekomendasi(waktu, cuaca);
    rekomendasiList.forEach(item => {
        const listItem = document.createElement('li');
        listItem.className = 'recommendation-card';
        listItem.setAttribute('tabindex', '0');
        listItem.textContent = item;
        rekomendasiBox.appendChild(listItem);
    });
};

// API Functions - Call Backend
// Note: Backend must be deployed separately (Railway, Render, etc.) and URL configured in getApiBaseUrl()
const fetchLocation = async () => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(`${API_BASE_URL}/location`, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error('Failed to fetch location');
        return await response.json();
    } catch (error) {
        // Silently handle network errors (backend may not be deployed yet)
        if (error.name !== 'AbortError') {
            console.warn('Location API unavailable, using default location');
        }
        return { city: '', country: '', location: 'Unknown' };
    }
};

const fetchWeather = async (city) => {
    if (!city) return null;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(`${API_BASE_URL}/weather/${encodeURIComponent(city)}`, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error('Failed to fetch weather');
        return await response.json();
    } catch (error) {
        // Silently handle network errors (backend may not be deployed yet)
        if (error.name !== 'AbortError') {
            console.warn('Weather API unavailable, using default weather');
        }
        return null;
    }
};

const sendChatMessage = async (message) => {
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });
        if (!response.ok) throw new Error('Failed to send message');
        const data = await response.json();
        return data.reply;
    } catch (error) {
        console.error('Chat error:', error);
        return 'Terjadi kesalahan saat menghubungi AI.';
    }
};

// Initialize weather and location
(async () => {
    try {
        // Fetch location
        const locationData = await fetchLocation();
        const locationTextEl = document.getElementById('location-text');
        if (locationTextEl) {
            locationTextEl.textContent = locationData.location || 'Unknown';
        }

        let weatherData = null;
        let cuacaCondition = 'cerah'; // Default cuaca

        // Fetch weather
        if (locationData.city) {
            weatherData = await fetchWeather(locationData.city);
            if (weatherData) {
                // Update temperature
                const tempEl = document.getElementById('temperature-text');
                if (tempEl) {
                    tempEl.innerHTML = `${weatherData.temperature}&deg;C`;
                }
                
                // Update weather description
                const weatherDescEl = document.getElementById('weather-description');
                if (weatherDescEl) {
                    weatherDescEl.textContent = weatherData.condition.indonesian;
                }
                
                cuacaCondition = weatherData.condition.indonesian.toLowerCase();
            }
        }

        // Update icons (use default if weather not available)
        const statusIcon = document.getElementById('status-icon');
        const inputIcon = document.getElementById('input-icon');
        const iconName = getTimeIcon(currentHour, weatherData?.isRainy || false);
        if (statusIcon) statusIcon.textContent = iconName;
        if (inputIcon) inputIcon.textContent = iconName;
        
        // Update intro text
        const introText = document.getElementById('intro-text');
        if (introText) {
            if (weatherData) {
                introText.textContent = `Cuaca ${timeData.period} ini ${cuacaCondition} berikut rekomendasi makananan dan minuman yang pas banget buat makanan yang cocok dinikmati ${timeData.period} hari!`;
            } else {
                introText.textContent = `Berikut rekomendasi makananan dan minuman yang pas banget buat makanan yang cocok dinikmati ${timeData.period} hari!`;
            }
        }
        
        // Display recommendations (always show, even if weather API fails)
        tampilkanRekomendasiManual(timeData.period, cuacaCondition);
    } catch (error) {
        console.error('Initialization error:', error);
        // Fallback: show recommendations based on time only
        tampilkanRekomendasiManual(timeData.period, 'cerah');
    }
})();

// Chat functionality
const showMessage = (message, className) => {
    const chatBox = document.getElementById('chatBox');
    if (!chatBox) return;
    
    const formattedMessage = typeof marked !== 'undefined' ? marked.parse(message) : message;
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.innerHTML = formattedMessage;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
};

const showLoadingIndicator = () => {
    const chatBox = document.getElementById('chatBox');
    if (!chatBox) return;
    
    const loader = `
        <div class="message bot-message">
            <div class="loading-dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
    `;
    chatBox.insertAdjacentHTML('beforeend', loader);
};

const removeLoadingIndicator = () => {
    const loaders = document.querySelectorAll('.loading-dots');
    if (loaders.length > 0) {
        loaders[loaders.length - 1].parentElement.remove();
    }
};

// Event listeners
const sendButton = document.getElementById('sendButton');
const userInput = document.getElementById('userInput');
const initialContent = document.getElementById('initialContent');
const tanyaRekomendasi = document.getElementById('tanyaRekomendasi');
const inputForm = document.querySelector('.input-container');

const handleSendMessage = async function(e) {
    if (e) {
        e.preventDefault();
    }
    // Hide initial content
    if (initialContent) {
        initialContent.style.display = 'none';
    }
    
    const inputValue = userInput.value.trim();
    if (!inputValue) {
        alert('Input tidak boleh kosong!');
        return;
    }
    
    sendButton.disabled = true;
    userInput.disabled = true;
    
    if (tanyaRekomendasi) {
        tanyaRekomendasi.style.display = 'none';
    }
    
    showMessage(inputValue, 'user-message');
    userInput.value = '';
    showLoadingIndicator();
    
    try {
        const reply = await sendChatMessage(inputValue);
        removeLoadingIndicator();
        const formatted = typeof marked !== 'undefined' ? marked.parse(reply) : reply;
        showMessage(formatted, 'bot-message');
    } catch (error) {
        removeLoadingIndicator();
        console.error('Gagal:', error);
        showMessage('Terjadi kesalahan saat menghubungi AI.', 'bot-message');
    }
    
    sendButton.disabled = false;
    userInput.disabled = false;
    userInput.focus();
};

if (sendButton && userInput) {
    sendButton.addEventListener('click', handleSendMessage);
    
    if (inputForm) {
        inputForm.addEventListener('submit', handleSendMessage);
    }
    
    // Enter key handler
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    });
}
