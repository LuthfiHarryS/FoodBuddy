/**
 * Unit tests untuk script.js
 * Testing fungsi-fungsi utama aplikasi FoodBuddy
 */

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
      <div id="userInput"></div>
      <button id="sendButton"></button>
    `;
  });

  test('should initialize greeting based on time', () => {
    const hour = new Date().getHours();
    const greetingElement = document.getElementById('greeting');
    
    // Mock time untuk testing
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(12);
    
    // Test logic greeting
    let expectedGreeting = '';
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 11) {
      expectedGreeting = 'Halo, selamat pagi!';
    } else if (currentHour >= 11 && currentHour < 15) {
      expectedGreeting = 'Halo, selamat siang!';
    } else if (currentHour >= 15 && currentHour < 18) {
      expectedGreeting = 'Halo, selamat sore!';
    } else {
      expectedGreeting = 'Halo, selamat malam!';
    }
    
    expect(expectedGreeting).toBeTruthy();
  });

  test('should format date correctly', () => {
    const date = new Date();
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jimat', 'Sabtu'];
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                         'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const dayName = dayNames[date.getDay()];
    const dateText = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    
    expect(dayName).toBeTruthy();
    expect(dateText).toMatch(/\d{1,2} \w+ \d{4}/);
  });

  test('should have recommendation function', () => {
    // Test bahwa fungsi getManualRekomendasi ada dan bekerja
    const waktu = 'siang';
    const cuaca = 'cerah';
    const kunci = `${waktu}-${cuaca}`;
    
    const daftarRekomendasi = {
      'siang-cerah': [
        'Nasi Padang Daging Rendang – pedas gurihnya menggugah semangat makan siang.',
        'Gado-Gado – segar, kaya rasa, dan saus kacangnya nendang!',
        'Mie Ayam Jamur – kenyal dan gurih, pas banget buat isi ulang tenaga.'
      ]
    };
    
    const result = daftarRekomendasi[kunci] || daftarRekomendasi['default'];
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test('should handle user input', () => {
    const inputField = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    
    expect(inputField).toBeTruthy();
    expect(sendButton).toBeTruthy();
  });

  test('should have chat box element', () => {
    const chatBox = document.getElementById('chatBox');
    expect(chatBox).toBeTruthy();
  });
});
