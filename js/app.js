// Главный файл приложения
class NemoDetectiveApp {
    constructor() {
        console.log('🕵️ NemoDetectiveApp создан');
        this.tg = window.Telegram?.WebApp || null;
        this.init();
    }
    
    init() {
        console.log('=== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ===');
        
        // Проверяем что компоненты загружены
        if (typeof Menu === 'undefined' || typeof EpisodeView === 'undefined') {
            console.error('❌ Компоненты не загружены:', {
                Menu: typeof Menu,
                EpisodeView: typeof EpisodeView,
                Rating: typeof Rating
            });
            this.showError('Компоненты не загружены. Перезагрузите приложение.');
            return;
        }
        
        // Проверяем что эпизоды загружены
        const episodeCount = Object.keys(window.episodes || {}).length;
        if (episodeCount === 0) {
            console.error('❌ Эпизоды не загружены');
            this.showError('Эпизоды не загружены. Перезагрузите приложение.');
            return;
        }
        
        console.log(`✅ Загружено эпизодов: ${episodeCount}`);
        
        // Инициализация Telegram WebApp с защитой
        if (this.tg) {
            try {
                this.tg.expand();
                this.tg.enableClosingConfirmation();
                console.log('✅ Telegram WebApp инициализирован');
            } catch (error) {
                console.warn('⚠️ Telegram WebApp не доступен:', error);
            }
        } else {
            console.log('ℹ️ Telegram WebApp не доступен, работаем в браузере');
        }
        
        // Инициализация состояния приложения
        this.initAppState();
        
        // Настройка кнопки "Назад"
        this.setupBackButton();
        
        // Запуск приложения
        this.start();
    }
    
    initAppState() {
        // Загружаем данные ДО создания состояния
        this.loadUserData();
    }
    
    start() {
        console.log('🎬 Вечный Детектив - приложение запущено!');
        
        // Показываем главное меню
        try {
            if (typeof Menu !== 'undefined' && typeof Menu.show === 'function') {
                Menu.show();
                console.log('✅ Главное меню показано успешно');
            } else {
                throw new Error('Menu.show не доступен');
            }
        } catch (error) {
            console.error('❌ Ошибка при показе меню:', error);
            this.showError('Ошибка запуска: ' + error.message);
        }
    }
    
    loadUserData() {
        try {
            // Пробуем получить данные из Telegram Cloud Storage
            if (this.tg && this.tg.CloudStorage) {
                this.tg.CloudStorage.getItem('nemo_detective_data', (error, cloudData) => {
                    if (!error && cloudData) {
                        try {
                            const parsedData = JSON.parse(cloudData);
                            this.initWithUserData(parsedData);
                            console.log('✅ Данные загружены из Cloud Storage:', parsedData);
                        } catch (parseError) {
                            console.error('❌ Ошибка парсинга Cloud Storage данных:', parseError);
                            this.loadFromLocalStorage();
                        }
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
            console.error('❌ Ошибка загрузки данных:', e);
            this.initWithDefaultData();
        }
    }

    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem('nemo_detective_data');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                this.initWithUserData(parsedData);
                console.log('✅ Данные загружены из localStorage:', parsedData);
            } else {
                console.log('ℹ️ Сохранённых данных нет, используем по умолчанию');
                this.initWithDefaultData();
            }
        } catch (e) {
            console.error('❌ Ошибка загрузки из localStorage:', e);
            this.initWithDefaultData();
        }
    }

    initWithUserData(userData) {
        window.appState = {
            currentView: 'menu',
            currentEpisodeId: null,
            userData: {
                score: userData.score || 0,
                currentEpisode: Math.max(userData.currentEpisode || 1, 1),
                completedEpisodes: Array.isArray(userData.completedEpisodes) ? 
                    userData.completedEpisodes : [],
                userId: userData.userId || this.getUserId()
            }
        };
    }

    initWithDefaultData() {
        window.appState = {
            currentView: 'menu',
            currentEpisodeId: null,
            userData: {
                score: 0,
                currentEpisode: 1,
                completedEpisodes: [],
                userId: this.getUserId()
            }
        };
    }

    getUserId() {
        // Генерируем уникальный ID пользователя
        if (this.tg && this.tg.initDataUnsafe && this.tg.initDataUnsafe.user) {
            return `tg_${this.tg.initDataUnsafe.user.id}`;
        }
        
        // Для браузера используем localStorage ID
        let userId = localStorage.getItem('nemo_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('nemo_user_id', userId);
        }
        return userId;
    }

    // Метод сохранения данных
    saveUserData() {
        try {
            if (!window.appState?.userData) {
                console.warn('⚠️ Нет данных для сохранения');
                return;
            }
            
            const dataToSave = {
                score: window.appState.userData.score,
                currentEpisode: window.appState.userData.currentEpisode,
                completedEpisodes: window.appState.userData.completedEpisodes,
                userId: window.appState.userData.userId,
                lastSave: Date.now()
            };
            
            const dataString = JSON.stringify(dataToSave);
            
            // Пробуем сохранить в Telegram Cloud Storage
            if (this.tg && this.tg.CloudStorage) {
                this.tg.CloudStorage.setItem('nemo_detective_data', dataString, (error) => {
                    if (error) {
                        console.warn('⚠️ Не удалось сохранить в Cloud Storage:', error);
                        // Fallback на localStorage
                        this.saveToLocalStorage(dataString);
                    } else {
                        console.log('✅ Данные сохранены в Cloud Storage');
                    }
                });
            } else {
                // Fallback на localStorage
                this.saveToLocalStorage(dataString);
            }
            
            // Сохраняем в глобальный рейтинг
            if (typeof Rating !== 'undefined' && typeof Rating.saveCurrentUserToGlobal === 'function') {
                Rating.saveCurrentUserToGlobal();
            }
            
        } catch (e) {
            console.error('❌ Ошибка сохранения данных:', e);
        }
    }
    
    saveToLocalStorage(dataString) {
        try {
            localStorage.setItem('nemo_detective_data', dataString);
            console.log('✅ Данные сохранены в localStorage');
        } catch (e) {
            console.error('❌ Ошибка сохранения в localStorage:', e);
        }
    }
    
    setupBackButton() {
        // Кнопка "Назад" только если Telegram WebApp доступен
        if (this.tg && this.tg.BackButton) {
            try {
                this.tg.BackButton.show();
                this.tg.BackButton.onClick(() => {
                    console.log('🔙 Нажата кнопка Назад');
                    this.handleBackButton();
                });
                console.log('✅ Кнопка Назад настроена');
            } catch (error) {
                console.warn('⚠️ Не удалось настроить кнопку Назад:', error);
            }
        }
    }
    
    handleBackButton() {
        if (window.appState.currentView !== 'menu' && typeof Menu !== 'undefined') {
            Menu.show();
        } else if (this.tg) {
            this.tg.close();
        }
    }
    
    showError(message) {
        const container = document.getElementById('app-container');
        if (container) {
            container.innerHTML = `
                <div class="error-container" style="text-align: center; padding: 40px 20px;">
                    <h2 style="color: #ff6b6b; margin-bottom: 20px;">🕵️ Вечный Детектив</h2>
                    <p style="margin-bottom: 20px; font-size: 16px;">${message}</p>
                    <button onclick="location.reload()" style="
                        background: #ffd700; 
                        color: #1a1a2e; 
                        border: none; 
                        padding: 12px 24px; 
                        border-radius: 8px; 
                        cursor: pointer;
                        font-weight: bold;
                    ">🔄 Перезагрузить</button>
                </div>
            `;
        }
    }
}

// Глобальная регистрация приложения
window.app = new NemoDetectiveApp();

// Запуск приложения когда все загружено
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM ЗАГРУЖЕН ===');
    
    // Ждём чтобы все скрипты успели загрузиться
    setTimeout(() => {
        console.log('=== ПРОВЕРКА КОМПОНЕНТОВ ===');
        console.log('Menu:', typeof Menu);
        console.log('EpisodeView:', typeof EpisodeView);
        console.log('Rating:', typeof Rating);
        console.log('Episodes:', Object.keys(window.episodes || {}));
        
        // Проверяем минимальные требования для запуска
        const hasRequiredComponents = typeof Menu !== 'undefined' && 
                                    typeof EpisodeView !== 'undefined' &&
                                    Object.keys(window.episodes || {}).length > 0;
        
        if (!hasRequiredComponents) {
            console.error('❌ Не все компоненты загрузились');
            const errorDetails = {
                Menu: typeof Menu,
                EpisodeView: typeof EpisodeView,
                Episodes: Object.keys(window.episodes || {}).length
            };
            
            const container = document.getElementById('app-container');
            if (container) {
                container.innerHTML = `
                    <div class="error-container" style="text-align: center; padding: 40px 20px;">
                        <h2 style="color: #ff6b6b; margin-bottom: 20px;">🕵️ Вечный Детектив</h2>
                        <p style="margin-bottom: 15px;">Ошибка загрузки компонентов:</p>
                        <div style="text-align: left; background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">
                            <p>Menu: ${errorDetails.Menu}</p>
                            <p>EpisodeView: ${errorDetails.EpisodeView}</p>
                            <p>Episodes: ${errorDetails.Episodes}</p>
                        </div>
                        <button onclick="location.reload()" style="
                            background: #ffd700; 
                            color: #1a1a2e; 
                            border: none; 
                            padding: 12px 24px; 
                            border-radius: 8px; 
                            cursor: pointer;
                            font-weight: bold;
                            margin-top: 10px;
                        ">🔄 Перезагрузить</button>
                    </div>
                `;
            }
        }
    }, 100);
});