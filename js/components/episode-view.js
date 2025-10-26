// Компонент отображения эпизодов
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
        
        // ЕСЛИ это ВН-эпизод - используем движок ВН
        if (episode.vnScenes && typeof VNEngine !== 'undefined') {
            console.log('🎬 Запускаем через VN Engine');
            
            // Инициализируем ВН-движок с эпизодом
            VNEngine.initEpisode(episode);
            VNEngine.showCurrentScene();
            
            // Обновляем состояние
            if (window.appState) {
                window.appState.currentView = 'episode';
                window.appState.currentEpisodeId = episodeId;
                window.appState.currentVNEpisode = episode;
            }
            return;
        }
        
        // ИНАЧЕ старый рендеринг
        console.log('📝 Используем старый рендеринг');
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
                
                ${episode.hasInput && !isCompleted ? `
                <div class="answer-section">
                    <input type="text" class="answer-input" placeholder="Введите ваш ответ..." id="answer-input">
                    <button class="submit-btn" onclick="EpisodeView.submitAnswer('${fullEpisodeId}')">
                        🔍 ОТПРАВИТЬ ОТВЕТ
                    </button>
                </div>
                ` : ''}
                
                ${isCompleted ? `
                <div style="text-align: center; margin: 20px 0;">
                    <div style="color: #ffd700; font-size: 1.2rem; margin-bottom: 15px;">✅ Эпизод завершён!</div>
                    <button class="submit-btn" onclick="EpisodeView.nextEpisode('${fullEpisodeId}')">
                        ➡️ ПЕРЕЙТИ К СЛЕДУЮЩЕМУ
                    </button>
                </div>
                ` : ''}
                
                ${!episode.hasInput && !isCompleted ? `
                <button class="submit-btn" onclick="EpisodeView.nextEpisode('${fullEpisodeId}')">
                    ➡️ ДАЛЕЕ
                </button>
                ` : ''}
                
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
        let answer = answerInput ? answerInput.value.trim() : '';
        
        console.log('📝 Исходный ответ:', answer);
        
        // Получаем правильные ответы из единого файла
        const correctAnswers = window.episodeAnswers ? window.episodeAnswers[fullEpisodeId] : [];
        
        console.log('✅ Правильные ответы:', correctAnswers);
        
        if (!correctAnswers || correctAnswers.length === 0) {
            console.error('❌ Нет правильных ответов для эпизода:', fullEpisodeId);
            this.showAlert('Ошибка: ответы для этого эпизода не найдены');
            return;
        }
        
        if (!answer) {
            this.showAlert('Введите ответ перед отправкой!');
            return;
        }
        
        // Нормализуем ответ
        const normalizedAnswer = this.normalizeAnswer(answer);
        
        const isCorrect = correctAnswers.some(correct => {
            const normalizedCorrect = this.normalizeAnswer(correct);
            return normalizedCorrect === normalizedAnswer;
        });
        
        console.log('🎯 Результат:', isCorrect);
        
        if (isCorrect) {
            this.handleCorrectAnswer(fullEpisodeId, episode);
        } else {
            this.handleWrongAnswer(answerInput);
        }
    }

    static handleCorrectAnswer(fullEpisodeId, episode) {
        // Проверяем, что эпизод еще не был пройден
        if (window.appState?.userData?.completedEpisodes?.includes(fullEpisodeId)) {
            console.log('⚠️ Эпизод уже был пройден ранее');
            this.showAlert('Этот эпизод уже был пройден!');
            this.nextEpisode(fullEpisodeId);
            return;
        }
        
        // Получаем случайную фразу для верного ответа
        const phrase = this.getRandomPhrase('correct');
        
        // Начисляем баллы и обновляем прогресс
        if (window.appState && window.appState.userData) {
            window.appState.userData.score += 10;
            
            const nextEpisodeNumber = parseInt(episode.id) + 1;
            window.appState.userData.currentEpisode = nextEpisodeNumber;
            
            if (!window.appState.userData.completedEpisodes) {
                window.appState.userData.completedEpisodes = [];
            }
            
            if (!window.appState.userData.completedEpisodes.includes(fullEpisodeId)) {
                window.appState.userData.completedEpisodes.push(fullEpisodeId);
            }
            
            this.saveUserData();
            
            this.showAlert(`✅ ${phrase}! +10 баллов!`);
            
            setTimeout(() => {
                this.show(fullEpisodeId);
            }, 1500);
            
        } else {
            this.showAlert(`✅ ${phrase}!`);
            this.nextEpisode(fullEpisodeId);
        }
    }

    static handleWrongAnswer(answerInput) {
        // Получаем случайную фразу для неверного ответа
        const phrase = this.getRandomPhrase('wrong');
        this.showAlert(`❌ ${phrase}`);
        
        // Очищаем поле ввода для новой попытки
        if (answerInput) {
            answerInput.value = '';
            answerInput.focus();
        }
    }

    // Метод для получения случайной фразы
    static getRandomPhrase(type) {
        if (!window.gamePhrases || !window.gamePhrases[type]) {
            return type === 'correct' ? 'Верно!' : 'Неверно!';
        }
        
        const phrases = window.gamePhrases[type];
        return phrases[Math.floor(Math.random() * phrases.length)];
    }

    // Метод для нормализации ответов
    static normalizeAnswer(text) {
        return String(text)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\sа-яё]/gi, ' ')
            .replace(/\s+/g, ' ')
            .trim();
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
        const container = document.getElementById('app-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="episode-container">
                <div class="episode-title" style="color: #ffd700; font-size: 1.6em;">
                    🎉 ГЛАВА ЗАВЕРШЕНА!
                </div>
                <div class="episode-text" style="text-align: center; font-size: 1.2em;">
                    Поздравляем! Вы успешно завершили Главу 1.<br><br>
                    Ваш текущий счёт: <strong>${window.appState?.userData?.score || 0} баллов</strong>
                </div>
                <button class="submit-btn" onclick="EpisodeView.goBack()" style="margin-top: 20px;">
                    🏠 ВЕРНУТЬСЯ В МЕНЮ
                </button>
            </div>
        `;
    }
    
    static goBack() {
        console.log('🔙 Возврат в меню');
        
        if (typeof Menu !== 'undefined') {
            Menu.show();
        } else {
            console.error('❌ Menu не доступен для возврата');
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