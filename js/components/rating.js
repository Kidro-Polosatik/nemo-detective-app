class Rating {
    static show() {
        console.log('📊 Rating.show() вызван');
        
        const container = document.getElementById('app-container');
        if (!container) {
            console.error('❌ ERROR: app-container не найден');
            return;
        }
        
        container.innerHTML = `
            <div class="main-menu">
                <div class="decoration top-left"></div>
                <div class="decoration bottom-right"></div>
                
                <div class="main-title">
                    <h1>РЕЙТИНГ ДЕТЕКТИВОВ</h1>
                    <div class="subtitle">ЛУЧШИЕ СЫЩИКИ</div>
                </div>
                
                <div style="z-index: 2; text-align: center; margin: 30px 0; max-width: 360px;">
                    <div style="color: #b8a050; margin-bottom: 20px; font-size: 1.1rem;">
                        Топ детективов по набранным очкам
                    </div>
                    ${this.renderRealRating()}
                </div>
                
                <button class="menu-btn" onclick="Rating.goBack()" style="max-width: 200px;">
                    НАЗАД В МЕНЮ
                </button>
            </div>
        `;
        
        // Обновляем состояние
        if (window.appState) {
            window.appState.currentView = 'rating';
        }
        
        console.log('✅ Рейтинг показан');
    }
    
    static renderRealRating() {
        const allPlayers = this.getAllRealPlayers();
        
        if (allPlayers.length === 0) {
            return `
                <div style="color: #b8a050; padding: 40px 20px;">
                    Пока никто не участвовал в расследованиях.<br>
                    Станьте первым!
                </div>
            `;
        }
        
        return `
            <div class="rating-list" style="text-align: left; margin: 20px 0;">
                ${allPlayers.map((player, index) => `
                    <div class="rating-item ${player.isCurrentUser ? 'current-user' : ''}" 
                         style="display: flex; justify-content: space-between; 
                                align-items: center; margin: 12px 0; padding: 12px;
                                background: ${player.isCurrentUser ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.05)'};
                                border: 1px solid ${player.isCurrentUser ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.1)'};
                                border-radius: 8px;">
                        <div style="display: flex; align-items: center; flex: 1;">
                            <span style="font-weight: bold; color: #ffd700; width: 30px;">
                                ${index + 1}.
                            </span>
                            <span style="color: ${player.isCurrentUser ? '#ffd700' : '#e6e6e6'}; margin-left: 10px;">
                                ${player.name}
                            </span>
                        </div>
                        <span style="color: #ffd700; font-weight: bold;">
                            ${player.score} баллов
                        </span>
                    </div>
                `).join('')}
            </div>
            <div style="color: #b8a050; font-size: 0.9rem; margin-top: 15px;">
                Всего детективов: ${allPlayers.length}
            </div>
        `;
    }
    
    static getAllRealPlayers() {
        // Собираем всех реальных пользователей из localStorage
        const realPlayers = [];
        const currentUserId = window.appState?.userData?.userId;
        
        try {
            // Ищем данные других пользователей в localStorage
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                
                // Ищем ключи, связанные с нашим приложением
                if (key && key.startsWith('nemo_detective_data_')) {
                    try {
                        const userData = JSON.parse(localStorage.getItem(key));
                        if (userData && userData.userId && userData.score !== undefined) {
                            const userName = this.getUserName(userData.userId);
                            
                            realPlayers.push({
                                name: userName,
                                score: userData.score || 0,
                                userId: userData.userId,
                                isCurrentUser: userData.userId === currentUserId
                            });
                        }
                    } catch (e) {
                        console.warn('⚠️ Ошибка парсинга данных пользователя:', key, e);
                    }
                }
            }
            
            // Добавляем текущего пользователя, если его еще нет
            const currentUser = window.appState?.userData;
            if (currentUser && currentUser.userId) {
                const userExists = realPlayers.some(player => player.userId === currentUser.userId);
                if (!userExists) {
                    realPlayers.push({
                        name: this.getUserName(currentUser.userId),
                        score: currentUser.score || 0,
                        userId: currentUser.userId,
                        isCurrentUser: true
                    });
                }
            }
            
        } catch (error) {
            console.error('❌ Ошибка получения реальных игроков:', error);
        }
        
        // Сортируем по убыванию очков и возвращаем топ-20
        return realPlayers
            .sort((a, b) => b.score - a.score)
            .slice(0, 20);
    }
    
    static getUserName(userId) {
        // Генерируем читаемое имя на основе ID
        if (userId.startsWith('tg_')) {
            return `Детектив_${userId.substr(3, 4)}`;
        } else if (userId.startsWith('user_')) {
            return `Сыщик_${userId.substr(5, 4)}`;
        }
        
        // Для демо-пользователей оставляем оригинальные имена
        const demoNames = {
            'sherlock': 'Шерлок Холмс',
            'poirot': 'Эркюль Пуаро', 
            'marple': 'Мисс Марпл',
            'wolfe': 'Ниро Вульф',
            'marlowe': 'Филип Марлоу'
        };
        
        return demoNames[userId] || `Детектив_${userId.substr(0, 4)}`;
    }
    
    static saveCurrentUserToGlobal() {
        // Сохраняем текущего пользователя в глобальный список
        const currentUser = window.appState?.userData;
        if (!currentUser || !currentUser.userId) return;
        
        try {
            const storageKey = `nemo_detective_data_${currentUser.userId}`;
            const userData = {
                userId: currentUser.userId,
                name: this.getUserName(currentUser.userId),
                score: currentUser.score || 0,
                lastActive: Date.now()
            };
            
            localStorage.setItem(storageKey, JSON.stringify(userData));
            console.log('✅ Текущий пользователь сохранен в глобальный рейтинг');
        } catch (error) {
            console.error('❌ Ошибка сохранения в глобальный рейтинг:', error);
        }
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

// Сохраняем текущего пользователя при загрузке
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        Rating.saveCurrentUserToGlobal();
    }, 2000);
});

// Глобальная регистрация
if (typeof window !== 'undefined') {
    window.Rating = Rating;
    console.log('✅ Rating класс зарегистрирован');
}