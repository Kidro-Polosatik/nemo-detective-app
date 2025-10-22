class EpisodeView {
    static show(episodeId) {
        console.log('=== ПОКАЗ ЭПИЗОДА ===', episodeId);
        
        const episode = window.episodes[episodeId];
        if (!episode) {
            console.error('ERROR: Эпизод не найден', episodeId);
            console.log('Доступные эпизоды:', Object.keys(window.episodes || {}));
            
            // Защита от отсутствия Menu
            if (typeof Menu !== 'undefined') {
                Menu.show();
            } else {
                // Fallback
                document.getElementById('app-container').innerHTML = `
                    <div class="episode-container">
                        <h2>Ошибка</h2>
                        <p>Эпизод ${episodeId} не найден</p>
                        <button class="back-btn" onclick="location.reload()">🔄 Перезагрузить</button>
                    </div>
                `;
            }
            return;
        }
        
        console.log('Эпизод загружен:', episode.title);
        
        const container = document.getElementById('app-container');
        if (!container) {
            console.error('ERROR: app-container не найден');
            return;
        }
        
        container.innerHTML = this.render(episode);
        
        // Обновляем состояние с защитой
        if (window.appState) {
            window.appState.currentView = 'episode';
            window.appState.currentEpisodeId = episodeId;
        }
        
        console.log('Эпизод отображён');
    }
    
    static render(episode) {
        const fullEpisodeId = `${episode.chapter}_${episode.id}`;
        const correctAnswers = episode.correctAnswers || [];
        
        return `
            <div class="episode-container">
                <div class="episode-title">Глава ${episode.chapter}, Эпизод ${episode.id}: ${episode.title}</div>
                <div class="episode-text">${episode.text}</div>
                
                ${episode.hasInput ? `
                <input type="text" class="answer-input" placeholder="Введите ваш ответ..." id="answer-input">
                <button class="submit-btn" onclick="EpisodeView.submitAnswer('${fullEpisodeId}')">
                    🔍 ОТПРАВИТЬ ОТВЕТ
                </button>
                ` : `
                <button class="submit-btn" onclick="EpisodeView.nextEpisode('${fullEpisodeId}')">
                    ➡️ ДАЛЕЕ
                </button>
                `}
                
                <button class="back-btn" onclick="EpisodeView.goBack()">← ВЕРНУТЬСЯ В МЕНЮ</button>
            </div>
        `;
    }
    
    static submitAnswer(fullEpisodeId) {
        console.log('=== ОБРАБОТКА ОТВЕТА ===', fullEpisodeId);
        
        const episode = window.episodes[fullEpisodeId];
        if (!episode) {
            console.error('ERROR: Эпизод не найден');
            alert('Ошибка: эпизод не найден');
            return;
        }
        
        const answerInput = document.getElementById('answer-input');
        const answer = answerInput ? answerInput.value.trim().toLowerCase() : '';
        
        console.log('Ответ:', answer);
        console.log('Правильные ответы:', episode.correctAnswers);
        
        if (!answer) {
            alert('Введите ответ перед отправкой!');
            return;
        }
        
        const correctAnswers = episode.correctAnswers || [];
        const normalizedAnswer = answer.replace(/\s+/g, ' ').trim();
        
        const isCorrect = correctAnswers.some(correct => {
            const normalizedCorrect = String(correct).toLowerCase().replace(/\s+/g, ' ').trim();
            return normalizedCorrect === normalizedAnswer;
        });
        
        console.log('Результат:', isCorrect);
        
        if (isCorrect) {
            // Правильный ответ
            if (window.appState && window.appState.userData) {
                window.appState.userData.score += 10;
                window.appState.userData.currentEpisode = parseInt(episode.id) + 1;
                
                // Сохраняем данные
                try {
                    localStorage.setItem('nemo_detective_data', JSON.stringify(window.appState.userData));
                } catch (e) {
                    console.error('Ошибка сохранения:', e);
                }
            }
            
            alert(`✅ Верно! +10 баллов!`);
            
            // Переходим к следующему эпизоду
            setTimeout(() => {
                const nextEpisodeId = `${episode.chapter}_${parseInt(episode.id) + 1}`;
                console.log('Переход к:', nextEpisodeId);
                
                if (window.episodes[nextEpisodeId]) {
                    this.show(nextEpisodeId);
                } else {
                    alert('🎉 Поздравляем! Вы завершили главу 1!');
                    this.goBack();
                }
            }, 1000);
            
        } else {
            alert('❌ Неверно. Попробуй ещё раз!');
        }
    }
    
    static nextEpisode(currentEpisodeId) {
        console.log('Переход к следующему эпизоду:', currentEpisodeId);
        const currentEpisode = window.episodes[currentEpisodeId];
        if (!currentEpisode) {
            this.goBack();
            return;
        }
        
        const nextEpisodeId = `${currentEpisode.chapter}_${parseInt(currentEpisode.id) + 1}`;
        this.show(nextEpisodeId);
    }
    
    static goBack() {
        // Защита от отсутствия Menu
        if (typeof Menu !== 'undefined') {
            Menu.show();
        } else {
            location.reload();
        }
    }
}

// Глобальная ссылка
window.EpisodeView = EpisodeView;
console.log('EpisodeView класс зарегистрирован');