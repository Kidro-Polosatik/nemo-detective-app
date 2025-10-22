class Rating {
    static show() {
        const container = document.getElementById('app-container');
        const userData = window.appState.userData;
        
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
                <button class="back-btn" onclick="Menu.show()">← НАЗАД В МЕНЮ</button>
            </div>
        `;
        
        window.appState.currentView = 'rating';
    }
}