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
                
                <!-- Кнопка для отладки - показывает правильный ответ -->
                ${window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? `
                <div style="margin-top: 20px; padding: 10px; background: rgba(255,0,0,0.1); border-radius: 5px; text-align: center;">
                    <small style="color: #ff6b6b;">DEV MODE: </small>
                    <button onclick="EpisodeView.showCorrectAnswer('${fullEpisodeId}')" 
                            style="background: none; border: none; color: #ff6b6b; cursor: pointer; text-decoration: underline;">
                        Показать правильный ответ
                    </button>
                </div>
                ` : ''}
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
        const answerData = window.episodeAnswers ? window.episodeAnswers[fullEpisodeId] : null;
        const correctAnswers = answerData ? answerData.answers : [];
        const hint = answerData ? answerData.hint : 'нет подсказки';
        
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
        
        // Нормализуем ответ: нижний регистр, убираем лишние пробелы, игнорируем пунктуацию
        const normalizedAnswer = this.normalizeAnswer(answer);
        
        const isCorrect = correctAnswers.some(correct => {
            const normalizedCorrect = this.normalizeAnswer(correct);
            return normalizedCorrect === normalizedAnswer;
        });
        
        console.log('🎯 Результат:', isCorrect);
        console.log('🔍 Сравнение:', normalizedAnswer, 'vs', correctAnswers.map(c => this.normalizeAnswer(c)));
        
        if (isCorrect) {
            this.handleCorrectAnswer(fullEpisodeId, episode);
        } else {
            // Показываем подсказку
            this.showAlert(`❌ Неверно! Подсказка: попробуйте "${hint}"`);
            
            // Очищаем поле ввода для новой попытки
            if (answerInput) {
                answerInput.value = '';
                answerInput.focus();
            }
        }
    }

    // Метод для нормализации ответов (регистронезависимый)
    static normalizeAnswer(text) {
        return String(text)
            .toLowerCase()                    // нижний регистр
            .normalize('NFD')                // нормализуем Unicode (убираем диакритики)
            .replace(/[\u0300-\u036f]/g, '') // убираем диакритические знаки
            .replace(/[^\w\sа-яё]/gi, ' ')   // заменяем пунктуацию на пробелы (включая кириллицу)
            .replace(/\s+/g, ' ')            // заменяем множественные пробелы на один
            .trim();                         // убираем пробелы по краям
    }
    
    static handleCorrectAnswer(fullEpisodeId, episode) {
        // Проверяем, что эпизод еще не был пройден
        if (window.appState?.userData?.completedEpisodes?.includes(fullEpisodeId)) {
            console.log('⚠️ Эпизод уже был пройден ранее');
            this.showAlert('Этот эпизод уже был пройден!');
            this.nextEpisode(fullEpisodeId);
            return;
        }
        
        // Начисляем баллы и обновляем прогресс
        if (window.appState && window.appState.userData) {
            // Увеличиваем счет только если эпизод еще не пройден
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
            
            // Показываем обновленный эпизод с сообщением о завершении
            setTimeout(() => {
                this.show(fullEpisodeId);
            }, 1500);
            
        } else {
            this.showAlert(`✅ Верно!`);
            this.nextEpisode(fullEpisodeId);
        }
    }
    
    // Метод для отладки - показывает правильный ответ
    static showCorrectAnswer(fullEpisodeId) {
        const answerData = window.episodeAnswers ? window.episodeAnswers[fullEpisodeId] : null;
        if (answerData && answerData.answers) {
            this.showAlert(`Правильные ответы: ${answerData.answers.join(', ')}`);
        } else {
            this.showAlert('Ответы для этого эпизода не найдены');
        }
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