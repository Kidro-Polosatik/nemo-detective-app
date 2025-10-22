class EpisodeView {
    static show(episodeId) {
        DebugLogger.log('=== ПОКАЗ ЭПИЗОДА ===', episodeId);
        
        const episode = window.episodes[episodeId];
        if (!episode) {
            DebugLogger.log('ERROR: Эпизод не найден', episodeId);
            DebugLogger.log('Доступные эпизоды:', Object.keys(window.episodes || {}));
            Menu.show();
            return;
        }
        
        DebugLogger.log('Эпизод загружен:', episode.title);
        DebugLogger.log('Структура эпизода:', episode);
        
        const container = document.getElementById('app-container');
        container.innerHTML = this.render(episode);
        
        // Обновляем состояние
        window.appState.currentView = 'episode';
        window.appState.currentEpisodeId = episodeId;
        
        DebugLogger.log('Эпизод отображён');
    }
    
    static render(episode) {
        // Используем полный ID эпизода для вызова
        const fullEpisodeId = `${episode.chapter}_${episode.id}`;
        
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
                
                <button class="back-btn" onclick="Menu.show()">← ВЕРНУТЬСЯ В МЕНЮ</button>
                
                <!-- Отладочная информация -->
                <div style="margin-top: 10px; font-size: 12px; color: #666; border-top: 1px solid #333; padding-top: 10px;">
                    <strong>Отладка:</strong> Эпизод ${fullEpisodeId} | Правильные ответы: ${(episode.correctAnswers || []).join(', ')}
                </div>
            </div>
        `;
    }
    
    static submitAnswer(fullEpisodeId) {
        DebugLogger.log('=== ОБРАБОТКА ОТВЕТА ===');
        DebugLogger.log('Полный ID эпизода:', fullEpisodeId);
        
        const episode = window.episodes[fullEpisodeId];
        DebugLogger.log('Эпизод найден:', !!episode);
        
        if (!episode) {
            DebugLogger.log('ERROR: Эпизод не найден в window.episodes');
            DebugLogger.log('Доступные эпизоды:', Object.keys(window.episodes || {}));
            window.tg.showPopup({
                title: 'Ошибка',
                message: 'Эпизод не найден',
                buttons: [{ type: 'ok' }]
            });
            return;
        }
        
        DebugLogger.log('Структура эпизода:', episode);
        
        const answerInput = document.getElementById('answer-input');
        DebugLogger.log('Поле ввода найдено:', !!answerInput);
        
        const answer = answerInput ? answerInput.value.trim().toLowerCase() : '';
        DebugLogger.log('Введённый ответ:', `"${answer}"`);
        
        // Защита от undefined correctAnswers
        const correctAnswers = episode.correctAnswers || [];
        DebugLogger.log('Правильные ответы:', correctAnswers);
        
        if (!answer) {
            DebugLogger.log('ERROR: Пустой ответ');
            window.tg.showPopup({
                title: 'Внимание!',
                message: 'Введите ответ перед отправкой.',
                buttons: [{ type: 'ok' }]
            });
            return;
        }
        
        // Нормализуем ответ для сравнения
        const normalizedAnswer = answer.replace(/\s+/g, ' ').trim();
        
        const isCorrect = correctAnswers.some(correct => {
            const normalizedCorrect = String(correct).toLowerCase().replace(/\s+/g, ' ').trim();
            const match = normalizedCorrect === normalizedAnswer;
            DebugLogger.log('Сравнение:', `"${normalizedAnswer}" === "${normalizedCorrect}" = ${match}`);
            return match;
        });
        
        DebugLogger.log('Итоговый результат:', isCorrect);
        
        if (isCorrect) {
            // Правильный ответ
            window.appState.userData.score += 10;
            window.appState.userData.currentEpisode = parseInt(episode.id) + 1;
            
            DebugLogger.log('Новый счёт:', window.appState.userData.score);
            DebugLogger.log('Следующий эпизод:', window.appState.userData.currentEpisode);
            
            this.saveUserData();
            
            window.tg.showPopup({
                title: '✅ Верно!',
                message: `+10 баллов! Твой счёт: ${window.appState.userData.score}`,
                buttons: [{ type: 'ok' }]
            });
            
            // Переходим к следующему эпизоду
            setTimeout(() => {
                const nextEpisodeId = `${episode.chapter}_${parseInt(episode.id) + 1}`;
                DebugLogger.log('Пытаемся перейти к эпизоду:', nextEpisodeId);
                
                if (window.episodes[nextEpisodeId]) {
                    DebugLogger.log('Следующий эпизод найден, переходим...');
                    this.show(nextEpisodeId);
                } else {
                    // Глава завершена
                    DebugLogger.log('Глава завершена!');
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
            DebugLogger.log('ERROR: Неправильный ответ');
            window.tg.showPopup({
                title: '❌ Неверно',
                message: 'Попробуй ещё раз!',
                buttons: [{ type: 'ok' }]
            });
        }
    }
    
    static nextEpisode(currentEpisodeId) {
        DebugLogger.log('Переход к следующему эпизоду из:', currentEpisodeId);
        const currentEpisode = window.episodes[currentEpisodeId];
        const nextEpisodeId = `${currentEpisode.chapter}_${parseInt(currentEpisode.id) + 1}`;
        this.show(nextEpisodeId);
    }
    
    static saveUserData() {
        try {
            localStorage.setItem('nemo_detective_data', JSON.stringify(window.appState.userData));
            DebugLogger.log('Данные сохранены:', window.appState.userData);
        } catch (e) {
            DebugLogger.log('Ошибка сохранения данных:', e);
        }
    }
}