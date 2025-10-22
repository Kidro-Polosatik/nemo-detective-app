class Menu {
    static show() {
        const container = document.getElementById('app-container');
        const userData = window.appState?.userData || { score: 0, currentEpisode: 1 };
        
        container.innerHTML = `
            <div class="main-menu">
                <div class="logo">🕵️ НЕЖИВОЙ ДЕТЕКТИВ</div>
                <div class="subtitle">Каждая загадка — шаг к разгадке вечной тайны</div>
                
                <button class="menu-btn" onclick="Menu.startChapter(1)">
                    🎬 НАЧАТЬ ГЛАВУ 1
                </button>
                
                ${userData.currentEpisode > 1 ? `
                <button class="menu-btn" onclick="Menu.continueGame()">
                    ▶️ ПРОДОЛЖИТЬ (Эпизод ${userData.currentEpisode})
                </button>
                ` : ''}
                
                <button class="menu-btn" onclick="Rating.show()">
                    📊 РЕЙТИНГ ДЕТЕКТИВОВ
                </button>
                
                <div class="score-display">
                    <strong>Твой счёт:</strong> ${userData.score} баллов
                </div>
            </div>
        `;
        
        // Обновляем состояние
        window.appState.currentView = 'menu';
    }
    
    static startChapter(chapterNumber) {
        // Начинаем с первого эпизода главы
        EpisodeView.show(`${chapterNumber}_1`);
    }
    
    static continueGame() {
        // Продолжаем с текущего эпизода
        const currentEpisode = window.appState.userData.currentEpisode;
        const currentChapter = 1; // Пока только глава 1
        EpisodeView.show(`${currentChapter}_${currentEpisode}`);
    }
}