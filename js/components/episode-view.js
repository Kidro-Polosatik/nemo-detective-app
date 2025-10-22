class EpisodeView {
    static show(episodeId) {
        const episode = window.episodes[episodeId];
        if (!episode) {
            console.error(`Эпизод ${episodeId} не найден`);
            Menu.show();
            return;
        }
        
        const container = document.getElementById('app-container');
        container.innerHTML = this.render(episode);
        
        // Обновляем состояние
        window.appState.currentView = 'episode';
        window.appState.currentEpisodeId = episodeId;
    }
    
    static render(episode) {
        return `
            <div class="episode-container">
                <div class="episode-title">Глава ${episode.chapter}, Эпизод ${episode.id}: ${episode.title}</div>
                <div class="episode-text">${episode.text}</div>
                
                ${episode.hasInput ? `
                <input type="text" class="answer-input" placeholder="Введите ваш ответ..." id="answer-input">
                <button class="submit-btn" onclick="EpisodeView.submitAnswer('${episode.id}')">
                    🔍 ОТПРАВИТЬ ОТВЕТ
                </button>
                ` : `
                <button class="submit-btn" onclick="EpisodeView.nextEpisode('${episode.id}')">
                    ➡️ ДАЛЕЕ
                </button>
                `}
                
                <button class="back-btn" onclick="Menu.show()">← ВЕРНУТЬСЯ В МЕНЮ</button>
            </div>
        `;
    }
    
    static submitAnswer(episodeId) {
        const episode = window.episodes[episodeId];
        const answerInput = document.getElementById('answer-input');
        const answer = answerInput.value.trim().toLowerCase();
        
        if (!answer) {
            window.tg.showPopup({
                title: 'Внимание!',
                message: 'Введите ответ перед отправкой.',
                buttons: [{ type: 'ok' }]
            });
            return;
        }
        
        if (episode.correctAnswers.includes(answer)) {
            // Правильный ответ
            window.appState.userData.score += 10;
            window.appState.userData.currentEpisode = parseInt(episodeId.split('_')[1]) + 1;
            
            this.saveUserData();
            
            window.tg.showPopup({
                title: '✅ Верно!',
                message: `+10 баллов! Твой счёт: ${window.appState.userData.score}`,
                buttons: [{ type: 'ok' }]
            });
            
            // Переходим к следующему эпизоду
            setTimeout(() => {
                const nextEpisodeId = `${episode.chapter}_${parseInt(episode.id) + 1}`;
                if (window.episodes[nextEpisodeId]) {
                    this.show(nextEpisodeId);
                } else {
                    // Глава завершена
                    window.tg.showPopup({
                        title: '🎉 Поздравляем!',
                        message: 'Вы завершили главу 1!',
                        buttons: [{ type: 'ok' }]
                    });
                    Menu.show();
                }
            }, 1000);
            
        } else {
            // Неправильный ответ
            window.tg.showPopup({
                title: '❌ Неверно',
                message: 'Попробуй ещё раз!',
                buttons: [{ type: 'ok' }]
            });
        }
    }
    
    static nextEpisode(episodeId) {
        const episode = window.episodes[episodeId];
        const nextEpisodeId = `${episode.chapter}_${parseInt(episode.id) + 1}`;
        this.show(nextEpisodeId);
    }
    
    static saveUserData() {
        // В будущем здесь будет сохранение в базу данных
        console.log('User data saved:', window.appState.userData);
    }
}