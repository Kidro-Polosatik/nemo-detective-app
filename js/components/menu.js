class Menu {
    static show() {
        console.log('Menu.show() вызван - Leonardo стиль');
        
        const userData = window.appState?.userData || { score: 0, currentEpisode: 1 };
        const container = document.getElementById('app-container');
        
        if (!container) {
            console.error('ERROR: app-container не найден');
            return;
        }
        
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
                    <button class="menu-btn start-btn" onclick="Menu.startChapter(1)">
                        НАЧАТЬ ДЕЛО
                    </button>
                    
                    ${userData.currentEpisode > 1 ? `
                    <button class="menu-btn" onclick="Menu.continueGame()">
                        ПРОДОЛЖИТЬ РАССЛЕДОВАНИЕ
                    </button>
                    ` : ''}
                    
                    <button class="menu-btn" onclick="Menu.showRating()">
                        АРХИВ ДЕЛ
                    </button>
                </div>

                <!-- Нижняя надпись и счет -->
                <div class="bottom-section">
                    <div class="quote">
                        Каждая загадка - ключ к вечной тайне
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
        
        console.log('Меню Leonardo показано успешно');
    }
    
    // ... остальные методы без изменений ...
}