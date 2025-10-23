// Компонент главного меню
class Menu {
    static show() {
        console.log('🎮 Menu.show() вызван');
        
        const userData = window.appState?.userData || { 
            score: 0, 
            currentEpisode: 1,
            completedEpisodes: []
        };
        const container = document.getElementById('app-container');
        
        if (!container) {
            console.error('❌ ERROR: app-container не найден');
            return;
        }
        
        // Проверяем доступность функций для кнопок
        console.log('🔍 Проверка функций для кнопок:');
        console.log('- Menu.startChapter:', typeof Menu.startChapter);
        console.log('- Menu.continueGame:', typeof Menu.continueGame);
        console.log('- Menu.showRating:', typeof Menu.showRating);
        
        // Определяем, новичок или нет
        const isNewUser = userData.currentEpisode === 1 && 
                         userData.score === 0 && 
                         (!userData.completedEpisodes || userData.completedEpisodes.length === 0);
        
        container.innerHTML = `
            <div class="main-menu">
                <!-- Декоративные элементы -->
                <div class="decoration top-left"></div>
                <div class="decoration bottom-right"></div>

                <!-- Верхний заголовок -->
                <div class="main-title">
                    <h1>ВЕЧНЫЙ ДЕТЕКТИВ</h1>
                    <div class="subtitle">РАССЛЕДОВАНИЕ</div>
                </div>

                <!-- Центральные кнопки -->
                <div class="menu-buttons-container">
                    ${isNewUser ? `
                    <button class="menu-btn start-btn" onclick="Menu.startChapter(1)">
                        НАЧАТЬ ДЕЛО
                    </button>
                    ` : `
                    <button class="menu-btn start-btn" onclick="Menu.continueGame()">
                        ПРОДОЛЖИТЬ ДЕЛО
                    </button>
                    `}
                    
                    <button class="menu-btn" onclick="Menu.showRating()">
                        АРХИВ ДЕЛ
                    </button>
                </div>

                <!-- Нижняя надпись и счет -->
                <div class="bottom-section">
                    <div class="quote">
                        Каждый ответ - ключ к вечной загадке
                    </div>
                    <div class="score-display">
                        <strong>Накоплено улик:</strong> ${userData.score}
                    </div>
                </div>
            </div>
        `;
        
        // Обновляем состояние
        if (window.appState) {
            window.appState.currentView = 'menu';
            window.appState.currentEpisodeId = null;
        }
        
        console.log('✅ Меню показано успешно. Новый пользователь:', isNewUser);
    }
    
    static startChapter(chapterNumber) {
        console.log('🎬 Запуск главы:', chapterNumber);
        
        if (typeof EpisodeView === 'undefined') {
            console.error('❌ ERROR: EpisodeView не загружен');
            this.showComponentError('EpisodeView');
            return;
        }
        
        // Сбрасываем прогресс при начале новой главы
        if (window.appState?.userData) {
            window.appState.userData.currentEpisode = 1;
            window.appState.userData.completedEpisodes = [];
            
            // Сохраняем сброшенные данные
            if (window.app && typeof window.app.saveUserData === 'function') {
                window.app.saveUserData();
            }
        }
        
        EpisodeView.show(`${chapterNumber}_1`);
    }
    
    static continueGame() {
        console.log('▶️ Продолжение игры');
        
        if (typeof EpisodeView === 'undefined') {
            console.error('❌ ERROR: EpisodeView не загружен');
            this.showComponentError('EpisodeView');
            return;
        }
        
        const currentEpisode = window.appState?.userData?.currentEpisode || 1;
        const currentChapter = 1;
        console.log('🔍 Переход к эпизоду:', `${currentChapter}_${currentEpisode}`);
        EpisodeView.show(`${currentChapter}_${currentEpisode}`);
    }
    
    static showRating() {
        console.log('📊 Показ рейтинга');
        
        if (typeof Rating === 'undefined') {
            console.error('❌ ERROR: Rating не загружен');
            // Показываем простой рейтинг вместо ошибки
            this.showFallbackRating();
            return;
        }
        
        Rating.show();
    }
    
    static showComponentError(componentName) {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.showAlert(`Ошибка: ${componentName} не загружен. Перезагрузите приложение.`);
        } else {
            alert(`Ошибка: ${componentName} не загружен. Перезагрузите приложение.`);
        }
        
        // Пробуем вернуться в меню
        setTimeout(() => {
            if (typeof Menu !== 'undefined') {
                Menu.show();
            }
        }, 1000);
    }
    
    static showFallbackRating() {
        const container = document.getElementById('app-container');
        const userData = window.appState?.userData || { score: 0 };
        
        if (!container) return;
        
        container.innerHTML = `
            <div class="main-menu">
                <div class="decoration top-left"></div>
                <div class="decoration bottom-right"></div>
                
                <div class="main-title">
                    <h1>АРХИВ ДЕЛ</h1>
                    <div class="subtitle">РЕЙТИНГ</div>
                </div>
                
                <div class="rating-list" style="z-index: 2; text-align: center; margin: 40px 0;">
                    <div style="margin: 15px 0; font-size: 1.2rem;">1. Шерлок Холмс - 150 баллов</div>
                    <div style="margin: 15px 0; font-size: 1.2rem;">2. Эркюль Пуаро - 130 баллов</div>
                    <div style="margin: 15px 0; font-size: 1.2rem; color: #ffd700; font-weight: bold;">
                        3. Вы - ${userData.score} баллов
                    </div>
                </div>
                
                <button class="menu-btn" onclick="Menu.show()" style="max-width: 200px;">
                    НАЗАД В МЕНЮ
                </button>
            </div>
        `;
        
        if (window.appState) {
            window.appState.currentView = 'rating';
        }
    }
}

// Глобальная регистрация с защитой
if (typeof window !== 'undefined') {
    window.Menu = Menu;
    console.log('✅ Menu зарегистрирован глобально');
}