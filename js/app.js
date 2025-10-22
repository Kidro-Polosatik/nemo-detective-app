// Главный файл приложения
class NemoDetectiveApp {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.init();
    }
    
    init() {
        // Инициализация Telegram WebApp
        this.tg.expand();
        this.tg.enableClosingConfirmation();
        
        // Инициализация состояния приложения
        window.appState = {
            currentView: 'menu',
            currentEpisodeId: null,
            userData: {
                score: 0,
                currentEpisode: 1,
                completedEpisodes: []
            }
        };
        
        window.tg = this.tg;
        
        // Загрузка пользовательских данных
        this.loadUserData();
        
        // Настройка кнопки "Назад"
        this.setupBackButton();
        
        // Запуск приложения
        this.start();
    }
    
    start() {
        console.log('🕵️ Неживой Детектив - приложение запущено!');
        console.log('Загружено эпизодов:', Object.keys(window.episodes || {}).length);
        
        // Показываем главное меню
        Menu.show();
    }
    
    loadUserData() {
        // В будущем здесь будет загрузка из базы данных
        // Пока используем данные по умолчанию
        const savedData = localStorage.getItem('nemo_detective_data');
        if (savedData) {
            try {
                window.appState.userData = JSON.parse(savedData);
            } catch (e) {
                console.error('Ошибка загрузки данных:', e);
            }
        }
    }
    
    saveUserData() {
        try {
            localStorage.setItem('nemo_detective_data', JSON.stringify(window.appState.userData));
        } catch (e) {
            console.error('Ошибка сохранения данных:', e);
        }
    }
    
    setupBackButton() {
        // Показываем кнопку "Назад" в Telegram
        this.tg.BackButton.show();
        this.tg.BackButton.onClick(() => {
            if (window.appState.currentView !== 'menu') {
                Menu.show();
            }
        });
    }
}

// Запуск приложения когда все загружено
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем что все компоненты загружены
    if (typeof Menu !== 'undefined' && typeof EpisodeView !== 'undefined') {
        new NemoDetectiveApp();
    } else {
        // Если компоненты не загрузились, показываем сообщение об ошибке
        document.getElementById('app-container').innerHTML = `
            <div class="loading">
                <h2>🕵️ Неживой Детектив</h2>
                <p>Загрузка приложения...</p>
                <p>Если загрузка не происходит, проверьте консоль браузера (F12)</p>
            </div>
        `;
        
        // Перезагружаем через 3 секунды если что-то пошло не так
        setTimeout(() => {
            location.reload();
        }, 3000);
    }
});

// Глобальные функции для кнопок
window.Menu = Menu;
window.EpisodeView = EpisodeView; 
window.Rating = Rating;