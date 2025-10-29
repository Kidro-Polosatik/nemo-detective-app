// js/components/rating.js
class Rating {
    static show() {
        console.log('📊 Показ рейтинга');
        
        const container = document.getElementById('app-container');
        if (!container) return;
        
        // Получаем глобальный рейтинг из localStorage
        const globalRating = this.getGlobalRating();
        const currentUser = this.getCurrentUser();
        
        container.innerHTML = `
            <div class="main-menu">
                <div class="decoration top-left"></div>
                <div class="decoration bottom-right"></div>
                
                <div class="main-title">
                    <h1>РЕЙТИНГ ДЕТЕКТИВОВ</h1>
                    <div class="subtitle">ТОП ИГРОКОВ</div>
                </div>
                
                <div class="rating-container">
                    ${this.renderRatingTable(globalRating, currentUser)}
                    
                    <div class="rating-stats">
                        <div>Всего детективов: ${globalRating.length}</div>
                        <div>Ваше место: ${this.getUserPosition(globalRating, currentUser)}</div>
                    </div>
                </div>
                
                <button class="menu-btn" onclick="Menu.show()" style="max-width: 200px; margin-top: 20px;">
                    НАЗАД В МЕНЮ
                </button>
            </div>
        `;
        
        if (window.appState) {
            window.appState.currentView = 'rating';
        }
    }
    
    static getGlobalRating() {
        try {
            const ratingData = localStorage.getItem('nemo_global_rating');
            if (ratingData) {
                return JSON.parse(ratingData);
            }
        } catch (e) {
            console.error('❌ Ошибка загрузки рейтинга:', e);
        }
        return [];
    }
    
    static getCurrentUser() {
        const userData = window.appState?.userData;
        if (!userData) return null;
        
        // Получаем имя из Telegram аккаунта
        let userName = 'Детектив';
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
            const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
            userName = tgUser.first_name || tgUser.username || 'Детектив';
        }
        
        return {
            id: userData.userId,
            name: userName,
            score: userData.score,
            completedEpisodes: userData.completedEpisodes?.length || 0
        };
    }
    
    static renderRatingTable(globalRating, currentUser) {
        // Сортируем по очкам (по убыванию)
        const sortedRating = [...globalRating].sort((a, b) => b.score - a.score);
        
        if (sortedRating.length === 0) {
            return `
                <div class="no-rating">
                    <p>Рейтинг пока пуст</p>
                    <p>Будьте первым детективом в таблице!</p>
                </div>
            `;
        }
        
        return `
            <table class="rating-table">
                <thead>
                    <tr>
                        <th>Место</th>
                        <th>Детектив</th>
                        <th>Очки</th>
                        <th>Эпизоды</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedRating.map((user, index) => `
                        <tr class="${user.id === currentUser?.id ? 'current-user' : ''}">
                            <td class="position">${index + 1}</td>
                            <td class="name">${user.name}</td>
                            <td class="score">${user.score}</td>
                            <td class="episodes">${user.completedEpisodes}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    static getUserPosition(globalRating, currentUser) {
        if (!currentUser) return '-';
        
        const sortedRating = [...globalRating].sort((a, b) => b.score - a.score);
        const position = sortedRating.findIndex(user => user.id === currentUser.id);
        
        return position !== -1 ? position + 1 : '-';
    }
    
    static saveCurrentUserToGlobal() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return;
        
        try {
            const globalRating = this.getGlobalRating();
            
            // Ищем существующего пользователя
            const existingUserIndex = globalRating.findIndex(user => user.id === currentUser.id);
            
            if (existingUserIndex !== -1) {
                // Обновляем существующего
                globalRating[existingUserIndex] = currentUser;
            } else {
                // Добавляем нового
                globalRating.push(currentUser);
            }
            
            // Сохраняем обратно
            localStorage.setItem('nemo_global_rating', JSON.stringify(globalRating));
            console.log('✅ Рейтинг обновлен для пользователя:', currentUser.name);
            
        } catch (e) {
            console.error('❌ Ошибка сохранения рейтинга:', e);
        }
    }
}

// Глобальная регистрация
if (typeof window !== 'undefined') {
    window.Rating = Rating;
    console.log('✅ Rating класс зарегистрирован');
}