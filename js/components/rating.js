class Rating {
    static show() {
        console.log('📊 Rating.show() вызван');
        
        const container = document.getElementById('app-container');
        if (!container) {
            console.error('❌ ERROR: app-container не найден');
            return;
        }
        
        const userData = window.appState?.userData || { score: 0 };
        const topPlayers = this.getTopPlayers();
        
        container.innerHTML = `
            <div class="rating-container">
                <div class="rating-title">🏆 РЕЙТИНГ ДЕТЕКТИВОВ</div>
                <div class="rating-list">
                    ${topPlayers.map((player, index) => `
                        <div class="rating-item ${player.isCurrentUser ? 'current-user' : ''}">
                            <span class="rank">${index + 1}.</span>
                            <span class="name">${player.name}</span>
                            <span class="score">${player.score} баллов</span>
                        </div>
                    `).join('')}
                </div>
                <div style="text-align: center; margin: 20px 0; color: #b8a050;">
                    Всего детективов: ${topPlayers.length}
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
    
    static getTopPlayers() {
        // В реальном приложении здесь был бы запрос к серверу
        // Сейчас используем демо-данные + текущего пользователя
        
        const demoPlayers = [
            { name: "Шерлок Холмс", score: 150, userId: "sherlock" },
            { name: "Эркюль Пуаро", score: 130, userId: "poirot" },
            { name: "Мисс Марпл", score: 110, userId: "marple" },
            { name: "Ниро Вульф", score: 95, userId: "wolfe" },
            { name: "Филип Марлоу", score: 80, userId: "marlowe" }
        ];
        
        // Добавляем текущего пользователя
        const currentUser = window.appState?.userData;
        if (currentUser) {
            const userPlayer = {
                name: "Вы",
                score: currentUser.score,
                userId: currentUser.userId,
                isCurrentUser: true
            };
            
            // Объединяем и сортируем по убыванию очков
            const allPlayers = [...demoPlayers, userPlayer]
                .sort((a, b) => b.score - a.score)
                .slice(0, 10); // Топ-10
            
            return allPlayers;
        }
        
        return demoPlayers.slice(0, 10);
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