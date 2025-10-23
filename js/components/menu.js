// Принудительная глобальная регистрация
if (typeof window.Menu === 'undefined') {
    window.Menu = Menu;
    console.log('🔄 Menu зарегистрирован глобально из menu.js');
}

class Menu {
    static show() {
        console.log('Menu.show() вызван - Leonardo стиль');
        
        const userData = window.appState?.userData || { score: 0, currentEpisode: 1 };
        const container = document.getElementById('app-container');
        
        if (!container) {
            console.error('ERROR: app-container не найден');
            return;
        }
        
        // Проверяем доступность функций для кнопок
        console.log('🔍 Проверка функций для кнопок:');
        console.log('- Menu.startChapter:', typeof Menu.startChapter);
        console.log('- Menu.continueGame:', typeof Menu.continueGame);
        console.log('- Menu.showRating:', typeof Menu.showRating);
        console.log('- window.Menu:', typeof window.Menu);
        
        // Определяем, новичок или нет
        const isNewUser = userData.currentEpisode === 1 && userData.score === 0;
        
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
                    <button class="menu-btn start-btn" onclick="window.Menu.startChapter(1)">
                        НАЧАТЬ ДЕЛО
                    </button>
                    ` : `
                    <button class="menu-btn start-btn" onclick="window.Menu.continueGame()">
                        ПРОДОЛЖИТЬ ДЕЛО
                    </button>
                    `}
                    
                    <button class="menu-btn" onclick="window.Menu.showRating()">
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
        }
        
        console.log('✅ Меню показано успешно. Новый пользователь:', isNewUser);
    }
    
    static startChapter(chapterNumber) {
        console.log('🎬 Запуск главы:', chapterNumber);
        
        if (typeof EpisodeView === 'undefined') {
            console.error('ERROR: EpisodeView не загружен');
            if (window.Telegram && window.Telegram.WebApp) {
                window.Telegram.WebApp.showAlert('Ошибка загрузки. Перезагрузите приложение.');
            } else {
                alert('Ошибка загрузки. Перезагрузите приложение.');
            }
            return;
        }
        
        EpisodeView.show(`${chapterNumber}_1`);
    }
    
    static continueGame() {
        console.log('▶️ Продолжение игры');
        
        if (typeof EpisodeView === 'undefined') {
            console.error('ERROR: EpisodeView не загружен');
            return;
        }
        
        const currentEpisode = window.appState?.userData?.currentEpisode || 1;
        const currentChapter = 1;
        console.log('Переход к эпизоду:', `${currentChapter}_${currentEpisode}`);
        EpisodeView.show(`${currentChapter}_${currentEpisode}`);
    }
    
    static showRating() {
        console.log('📊 Показ рейтинга');
        
        if (typeof Rating === 'undefined') {
            console.error('ERROR: Rating не загружен');
            // Показываем простой рейтинг вместо ошибки
            const container = document.getElementById('app-container');
            const userData = window.appState?.userData || { score: 0 };
            
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
                        <div style="margin: 15px 0; font-size: 1.2rem; color: #ffd700; font-weight: bold;">3. Вы - ${userData.score} баллов</div>
                    </div>
                    
                    <button class="menu-btn" onclick="window.Menu.show()" style="max-width: 200px;">
                        НАЗАД В МЕНЮ
                    </button>
                </div>
            `;
            return;
        }
        
        Rating.show();
    }
}

// Дублирующая регистрация на случай если класс объявлен после
if (typeof window.Menu === 'undefined') {
    window.Menu = Menu;
    console.log('✅ Menu зарегистрирован глобально в конце файла');
}