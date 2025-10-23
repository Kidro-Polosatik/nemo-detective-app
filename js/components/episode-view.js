class EpisodeView {
    static show(episodeId) {
        console.log('=== ПОКАЗ ЭПИЗОДА ===', episodeId);
        
        // Проверяем что эпизоды загружены
        if (!window.episodes) {
            console.error('❌ ERROR: Эпизоды не загружены');
            this.showEpisodeError('Эпизоды не загружены');
            return;
        }
        
        const episode = window.episodes[episodeId];
        if (!episode) {
            console.error('❌ ERROR: Эпизод не найден', episodeId);
            console.log('Доступные эпизоды:', Object.keys(window.episodes));
            this.showEpisodeError(`Эпизод ${episodeId} не найден`);
            return;
        }
        
        console.log('✅ Эпизод загружен:', episode.title);
        
        const container = document.getElementById('app-container');
        if (!container) {
            console.error('❌ ERROR: app-container не найден');
            return;
        }
        
        container.innerHTML = this.render(episode);
        
        // Обновляем состояние с защитой
        if (window.appState) {
            window.appState.currentView = 'episode';
            window.appState.currentEpisodeId = episodeId;
        }
        
        console.log('✅ Эпизод отображён');
    }
    
    static render(episode) {
        const fullEpisodeId = `${episode.chapter}_${episode.id}`;
        const isCompleted = window.appState?.userData?.completedEpisodes?.includes(fullEpisodeId);
        
        return `
            <div class="episode-container">
                <div class="episode-title">
                    Глава ${episode.chapter}, Эпизод ${episode.id}: ${episode.title}
                    ${isCompleted ? ' ✅' : ''}
                </div>
                <div class="episode-text">${episode.text}</div>
                
                ${episode.hasInput ? `
                <div class="answer-section">
                    <input type="text" class="answer-input" placeholder="Введите ваш ответ..." id="answer-input">
                    <button class="submit-btn" onclick="EpisodeView.submitAnswer('${fullEpisodeId}')">
                        🔍 ${isCompleted ? 'ПРОЙДЕНО' : 'ОТПРАВИТЬ ОТВЕТ'}
                    </button>
                </div>
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
            console.error('❌ ERROR: Эпизод не найден');
            this.showAlert('Ошибка: эпизод не найден');
            return;
        }

        // Проверяем, что эпизод еще не пройден
        const isAlreadyCompleted = window.appState?.userData?.completedEpisodes?.includes(fullEpisodeId);
        
        if (isAlreadyCompleted) {
            console.log('ℹ️ Эпизод уже пройден, переход к следующему');
            this.nextEpisode(fullEpisodeId);
            return;
        }

        const answerInput = document.getElementById('answer-input');
        const answer = answerInput ? answerInput.value.trim().toLowerCase() : '';
        
        console.log('📝 Ответ:', answer);
        console.log('✅ Правильные ответы:', episode.correctAnswers);
        
        if (!answer) {
            this.showAlert('Введите ответ перед отправкой!');
            return;
        }
        
        const correctAnswers = episode.correctAnswers || [];
        const normalizedAnswer = answer.replace(/\s+/g, ' ').trim();
        
        const isCorrect = correctAnswers.some(correct => {
            const normalizedCorrect = String(correct).toLowerCase().replace(/\s+/g, ' ').trim();
            return normalizedCorrect === normalizedAnswer;
        });
        
        console.log('🎯 Результат:', isCorrect);
        
        if (isCorrect) {
            this.handleCorrectAnswer(fullEpisodeId, episode);
        } else {
            this.showAlert('❌ Неверно. Попробуй ещё раз!');
        }
    }
    
    static handleCorrectAnswer(fullEpisodeId, episode) {
        // Начисляем баллы и обновляем прогресс
        if (window.appState && window.appState.userData) {
            // Увеличиваем счет
            window.appState.userData.score += 10;
            
            // Обновляем текущий эпизод
            const nextEpisodeNumber = parseInt(episode.id) + 1;
            window.appState.userData.currentEpisode = nextEpisodeNumber;
            
            // Добавляем в завершенные эпизоды
            if (!window.appState.userData.completedEpisodes) {
                window.appState.userData.completedEpisodes = [];
            }
            
            if (!window.appState.userData.completedEpisodes.includes(fullEpisodeId)) {
                window.appState.userData.completedEpisodes.push(fullEpisodeId);
            }
            
            // Сохраняем данные
            this.saveUserData();
            
            this.showAlert(`✅ Верно! +10 баллов!`);
        } else {
            this.showAlert(`✅ Верно!`);
        }
        
        // Переходим к следующему эпизоду
        setTimeout(() => {
            this.nextEpisode(fullEpisodeId);
        }, 1500);
    }
    
    static nextEpisode(currentEpisodeId) {
        console.log('🔜 Переход к следующему эпизоду:', currentEpisodeId);
        
        const currentEpisode = window.episodes[currentEpisodeId];
        if (!currentEpisode) {
            console.error('❌ Текущий эпизод не найден');
            this.goBack();
            return;
        }
        
        const nextEpisodeId = `${currentEpisode.chapter}_${parseInt(currentEpisode.id) + 1}`;
        
        if (window.episodes[nextEpisodeId]) {
            this.show(nextEpisodeId);
        } else {
            console.log('🎉 Глава завершена!');
            this.showChapterComplete();
        }
    }
    
    static showChapterComplete() {
        this.showAlert('🎉 Поздравляем! Вы завершили главу 1!');
        this.goBack();
    }
    
    static goBack() {
        console.log('🔙 Возврат в меню');
        
        if (typeof Menu !== 'undefined') {
            Menu.show();
        } else {
            console.error('❌ Menu не доступен для возврата');
            // Fallback перезагрузка
            location.reload();
        }
    }
    
    static showAlert(message) {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.showAlert(message);
        } else {
            alert(message);
        }
    }
    
    static saveUserData() {
        if (window.app && typeof window.app.saveUserData === 'function') {
            window.app.saveUserData();
        } else {
            // Fallback сохранение
            try {
                localStorage.setItem('nemo_detective_data', JSON.stringify(window.appState.userData));
            } catch (e) {
                console.error('❌ Ошибка сохранения:', e);
            }
        }
    }
    
    static showEpisodeError(message) {
        const container = document.getElementById('app-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="error-container">
                <h2>Ошибка</h2>
                <p>${message}</p>
                <button class="back-btn" onclick="EpisodeView.goBack()">← ВЕРНУТЬСЯ В МЕНЮ</button>
                <button class="back-btn" onclick="location.reload()">🔄 Перезагрузить</button>
            </div>
        `;
    }
}

// Глобальная регистрация
if (typeof window !== 'undefined') {
    window.EpisodeView = EpisodeView;
    console.log('✅ EpisodeView класс зарегистрирован');
}