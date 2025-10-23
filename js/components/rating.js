class Rating {
    static show() {
        console.log('📊 Rating.show() вызван');
        
        const container = document.getElementById('app-container');
        if (!container) {
            console.error('❌ ERROR: app-container не найден');
            return;
        }
        
        const userData = window.appState?.userData || { score: 0 };
        
        // Заглушка рейтинга (в будущем будет с сервера)
        const topPlayers = [
            { name: "Шерлок Холмс", score: 150 },
            { name: "Эркюль Пуаро", score: 130 },
            { name: "Мисс Марпл", score: 110 },
            { name: "Вы", score: userData.score, isCurrentUser: true }
        ].sort((a, b) => b.score - a.score);
        
        container.innerHTML = `
            <div class="rating-container">
                <div class="rating-title">🏆 ТОП ДЕТЕКТИВОВ</div>
                <div class="rating-list">
                    ${topPlayers.map((player, index) => `
                        <div class="rating-item ${player.isCurrentUser ? 'current-user' : ''}">
                            <span class="rank">${index + 1}.</span>
                            <span class="name">${player.name}</span>
                            <span class="score">${player.score} баллов</span>
                        </div>
                    `).join('')}
                </div>
                <button class="back-btn" onclick="Rating.goBack()">← НАЗАД В МЕНЮ</button>
            </div>
        `;
        
        // Обновляем состояние
        if (window.appState) {
            window.appState.currentView = 'rating';
        }
        
        console.log('✅ Рейтинг показан');
    }
    
    static goBack() {
        console.log('🔙 Возврат из рейтинга');
        
        if (typeof Menu !== 'undefined') {
            Menu.show();
        } else {
            console.error('❌ Menu не доступен для возврата');
            this.showFallbackMenu();
        }
    }
    
    static showFallbackMenu() {
        const container = document.getElementById('app-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="main-menu">
                <div class="logo">🕵️ ВЕЧНЫЙ ДЕТЕКТИВ</div>
                <p>Не удалось вернуться в меню</p>
                <button class="menu-btn" onclick="location.reload()">🔄 Перезагрузить</button>
            </div>
        `;
    }
}

// Глобальная регистрация
if (typeof window !== 'undefined') {
    window.Rating = Rating;
    console.log('✅ Rating класс зарегистрирован');
}