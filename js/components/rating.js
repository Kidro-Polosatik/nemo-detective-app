class Rating {
    static show() {
        console.log('Rating.show() вызван');
        
        const container = document.getElementById('app-container');
        if (!container) {
            console.error('ERROR: app-container не найден');
            return;
        }
        
        const userData = window.appState?.userData || { score: 0 };
        
        // Заглушка рейтинга (в будущем будет с сервера)
        const topPlayers = [
            { name: "Шерлок Холмс", score: 150 },
            { name: "Эркюль Пуаро", score: 130 },
            { name: "Мисс Марпл", score: 110 },
            { name: "Ты", score: userData.score }
        ].sort((a, b) => b.score - a.score);
        
        container.innerHTML = `
            <div class="rating-container">
                <div class="rating-title">🏆 ТОП ДЕТЕКТИВОВ</div>
                <div class="rating-list">
                    ${topPlayers.map((player, index) => `
                        <div style="${player.name === 'Ты' ? 'color: #ffd700; font-weight: bold;' : ''}">
                            ${index + 1}. ${player.name} - ${player.score} баллов
                        </div>
                    `).join('')}
                </div>
                <button class="back-btn" onclick="Rating.goBack()">← НАЗАД В МЕНЮ</button>
            </div>
        `;
        
        // Обновляем состояние с защитой
        if (window.appState) {
            window.appState.currentView = 'rating';
        }
        
        console.log('Рейтинг показан');
    }
    
    static goBack() {
        console.log('Возврат из рейтинга');
        
        // Защита от отсутствия Menu
        if (typeof Menu !== 'undefined') {
            Menu.show();
        } else {
            // Fallback
            document.getElementById('app-container').innerHTML = `
                <div class="main-menu">
                    <div class="logo">🕵️ НЕЖИВОЙ ДЕТЕКТИВ</div>
                    <button class="menu-btn" onclick="location.reload()">🔄 Перезагрузить</button>
                </div>
            `;
        }
    }
}

// Глобальная ссылка
window.Rating = Rating;
console.log('Rating класс зарегистрирован');