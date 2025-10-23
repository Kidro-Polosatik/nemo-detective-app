// Главный файл приложения
class NemoDetectiveApp {
    constructor() {
        console.log('NemoDetectiveApp создан');
        this.tg = window.Telegram.WebApp;
        this.init();
    }
    
    init() {
        console.log('=== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ===');
        
        // Проверяем что компоненты загружены
        if (typeof Menu === 'undefined' || typeof EpisodeView === 'undefined') {
            console.error('Компоненты не загружены. Menu:', typeof Menu, 'EpisodeView:', typeof EpisodeView);
            this.showError('Компоненты не загружены');
            return;
        }
        
        // Инициализация Telegram WebApp с защитой
        try {
            this.tg.expand();
            this.tg.enableClosingConfirmation();
            console.log('Telegram WebApp инициализирован');
        } catch (error) {
            console.warn('Telegram WebApp не доступен:', error);
        }
        
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
        
        // Загрузка пользовательских данных
        this.loadUserData();
        
        // Настройка кнопки "Назад"
        this.setupBackButton();
        
        // Запуск приложения
        this.start();
    }
    
   start() {
    console.log('🕵️ Вечный Детектив - приложение запущено!');
    console.log('Загружено эпизодов:', Object.keys(window.episodes || {}).length);
    console.log('Компоненты:', {
        Menu: typeof Menu,
        EpisodeView: typeof EpisodeView, 
        Rating: typeof Rating
    });
    
    // Проверяем что Menu доступен глобально
    if (typeof window.Menu === 'undefined') {
        console.error('Menu не доступен глобально');
        window.Menu = Menu; // Принудительно устанавливаем
    }
    
    // Показываем главное меню
    try {
        Menu.show();
        console.log('Главное меню показано успешно');
    } catch (error) {
        console.error('Ошибка при показе меню:', error);
        this.showError('Ошибка запуска: ' + error.message);
    }
}
    
loadUserData() {
    try {
        // Пробуем получить данные из Telegram Cloud Storage
        if (this.tg && this.tg.CloudStorage) {
            this.tg.CloudStorage.getItem('nemo_detective_data', (error, cloudData) => {
                if (!error && cloudData) {
                    const parsedData = JSON.parse(cloudData);
                    this.initUserData(parsedData);
                    console.log('Данные загружены из Cloud Storage:', parsedData);
                } else {
                    // Если в облаке нет, пробуем локально
                    this.loadFromLocalStorage();
                }
            });
        } else {
            // Fallback на localStorage
            this.loadFromLocalStorage();
        }
    } catch (e) {
        console.error('Ошибка загрузки данных:', e);
        this.initUserData();
    }
}

loadFromLocalStorage() {
    const savedData = localStorage.getItem('nemo_detective_data');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        this.initUserData(parsedData);
        console.log('Данные загружены из localStorage:', parsedData);
    } else {
        console.log('Сохранённых данных нет, используем по умолчанию');
        this.initUserData();
    }
}

initUserData(parsedData = null) {
    window.appState.userData = parsedData || {
        score: 0,
        currentEpisode: 1,
        completedEpisodes: []
    };
    
    // Добавляем completedEpisodes если его нет
    if (!window.appState.userData.completedEpisodes) {
        window.appState.userData.completedEpisodes = [];
    }
}

// ДОБАВИТЬ метод сохранения
saveUserData() {
    try {
        const dataString = JSON.stringify(window.appState.userData);
        
        // Пробуем сохранить в Telegram Cloud Storage
        if (this.tg && this.tg.CloudStorage) {
            this.tg.CloudStorage.setItem('nemo_detective_data', dataString, (error) => {
                if (error) {
                    console.warn('Не удалось сохранить в Cloud Storage:', error);
                    // Fallback на localStorage
                    localStorage.setItem('nemo_detective_data', dataString);
                } else {
                    console.log('Данные сохранены в Cloud Storage');
                }
            });
        } else {
            // Fallback на localStorage
            localStorage.setItem('nemo_detective_data', dataString);
            console.log('Данные сохранены в localStorage');
        }
    } catch (e) {
        console.error('Ошибка сохранения данных:', e);
    }
}
    
    setupBackButton() {
        // Кнопка "Назад" только если Telegram WebApp доступен
        if (this.tg && this.tg.BackButton) {
            try {
                this.tg.BackButton.show();
                this.tg.BackButton.onClick(() => {
                    console.log('Нажата кнопка Назад');
                    if (window.appState.currentView !== 'menu' && typeof Menu !== 'undefined') {
                        Menu.show();
                    }
                });
                console.log('Кнопка Назад настроена');
            } catch (error) {
                console.warn('Не удалось настроить кнопку Назад:', error);
            }
        }
    }
    
    showError(message) {
        const container = document.getElementById('app-container');
        if (container) {
            container.innerHTML = `
                <div class="loading">
                    <h2>🕵️ Вечный Детектив</h2>
                    <p>${message}</p>
                    <button onclick="location.reload()">🔄 Перезагрузить</button>
                </div>
            `;
        }
    }
}

// Запуск приложения когда все загружено
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== ЗАГРУЗКА DOM ===');
    console.log('Компоненты при загрузке:', {
        Menu: typeof Menu,
        EpisodeView: typeof EpisodeView,
        Rating: typeof Rating,
        Episodes: typeof window.episodes
    });
    
    // Ждём немного чтобы все скрипты успели загрузиться
    setTimeout(() => {
        console.log('=== ПРОВЕРКА ПОСЛЕ ЗАГРУЗКИ ===');
        console.log('Компоненты после задержки:', {
            Menu: typeof Menu,
            EpisodeView: typeof EpisodeView,
            Rating: typeof Rating,
            Episodes: Object.keys(window.episodes || {})
        });
        
        if (typeof Menu !== 'undefined' && typeof EpisodeView !== 'undefined') {
            console.log('✅ Все компоненты загружены, запускаем приложение');
            new NemoDetectiveApp();
        } else {
            console.error('❌ Компоненты не загрузились');
            document.getElementById('app-container').innerHTML = `
                <div class="loading">
                    <h2>🕵️ Вечный Детектив</h2>
                    <p>Ошибка загрузки. Перезагрузите приложение.</p>
                    <p>Menu: ${typeof Menu}</p>
                    <p>EpisodeView: ${typeof EpisodeView}</p>
                    <button onclick="location.reload()">🔄 Перезагрузить</button>
                </div>
            `;
        }
    }, 100); // Небольшая задержка для загрузки скриптов
});