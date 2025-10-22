class Menu {
    static show() {
        console.log('Menu.show() вызван');
        
        const userData = window.appState?.userData || { score: 0, currentEpisode: 1 };
        const container = document.getElementById('app-container');
        
        if (!container) {
            console.error('ERROR: app-container не найден');
            return;
        }
        
        container.innerHTML = `
            <div class="main-menu">
                <div class="logo">🕵️ ВЕЧНЫЙ ДЕТЕКТИВ</div>
                <div class="subtitle">Каждая загадка — шаг к разгадке вечной тайны</div>
                
                <button class="menu-btn" onclick="Menu.startChapter(1)">
                    🎬 НАЧАТЬ ГЛАВУ 1
                </button>
                
                ${userData.currentEpisode > 1 ? `
                <button class="menu-btn" onclick="Menu.continueGame()">
                    ▶️ ПРОДОЛЖИТЬ (Эпизод ${userData.currentEpisode})
                </button>
                ` : ''}
                
                <button class="menu-btn" onclick="Menu.showRating()">
                    📊 РЕЙТИНГ ДЕТЕКТИВОВ
                </button>
                
                <div class="score-display">
                    <strong>Твой счёт:</strong> ${userData.score} баллов
                </div>
            </div>
        `;
        
        // Обновляем состояние
        if (window.appState) {
            window.appState.currentView = 'menu';
        }
        
        console.log('Меню показано успешно');
    }
    
    static startChapter(chapterNumber) {
        console.log('Запуск главы:', chapterNumber);
        
        if (typeof EpisodeView === 'undefined') {
            console.error('ERROR: EpisodeView не загружен');
            alert('Ошибка загрузки. Перезагрузите приложение.');
            return;
        }
        
        EpisodeView.show(`${chapterNumber}_1`);
    }
    
    static continueGame() {
        console.log('Продолжение игры');
        
        if (typeof EpisodeView === 'undefined') {
            console.error('ERROR: EpisodeView не загружен');
            return;
        }
        
        const currentEpisode = window.appState?.userData?.currentEpisode || 1;
        const currentChapter = 1;
        EpisodeView.show(`${currentChapter}_${currentEpisode}`);
    }
    
    static showRating() {
        console.log('Показ рейтинга');
        
        if (typeof Rating === 'undefined') {
            console.error('ERROR: Rating не загружен');
            // Показываем простой рейтинг вместо ошибки
            const container = document.getElementById('app-container');
            const userData = window.appState?.userData || { score: 0 };
            
            container.innerHTML = `
                <div class="rating-container">
                    <div class="rating-title">🏆 ТОП ДЕТЕКТИВОВ</div>
                    <div class="rating-list">
                        <div>1. Шерлок Холмс - 150 баллов</div>
                        <div>2. Эркюль Пуаро - 130 баллов</div>
                        <div style="color: #ffd700; font-weight: bold;">3. Вы - ${userData.score} баллов</div>
                    </div>
                    <button class="back-btn" onclick="Menu.show()">← НАЗАД В МЕНЮ</button>
                </div>
            `;
            return;
        }
        
        Rating.show();
    }
}

// Глобальная ссылка для вызова из HTML
window.Menu = Menu;
console.log('Menu класс зарегистрирован');