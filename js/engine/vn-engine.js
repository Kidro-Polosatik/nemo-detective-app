// Движок визуальной новеллы
class VNEngine {
    static init() {
        console.log('🎬 VN Engine инициализирован');
        this.currentScene = null;
        this.isTyping = false;
        this.currentText = '';
        this.currentEpisode = null;
        this.currentSceneIndex = 0;
        this.scenes = [];
        this.typingInterval = null;
    }
    
    static initEpisode(episode) {
        console.log('🎬 Инициализация эпизода ВН:', episode.title);
        this.currentEpisode = episode;
        this.currentSceneIndex = 0;
        this.scenes = episode.vnScenes || [];
    }
    
    static showCurrentScene() {
        if (!this.scenes || this.scenes.length === 0) {
            console.error('❌ Нет сцен для показа');
            this.episodeComplete();
            return;
        }
        
        if (this.currentSceneIndex >= this.scenes.length) {
            console.log('🎉 Эпизод завершен!');
            this.episodeComplete();
            return;
        }
        
        const scene = this.scenes[this.currentSceneIndex];
        this.showScene(scene);
    }
    
    static showScene(sceneData) {
        const container = document.getElementById('app-container');
        if (!container) {
            console.error('❌ ERROR: app-container не найден');
            return;
        }
        
        console.log('🎬 Рендерим сцену:', {
            background: sceneData.background,
            characters: sceneData.characters,
            dialog: sceneData.dialog
        });
        
        container.innerHTML = this.renderFirstPersonScene(sceneData);
        this.currentScene = sceneData;
        this.typeText(sceneData.dialog.text);
        
        console.log(`🎭 Сцена ${this.currentSceneIndex + 1}/${this.scenes.length}`);
    }
    
    static renderFirstPersonScene(scene) {
        return `
            <div class="vn-scene first-person" style="background-image: url('${scene.background}')">
                ${this.renderOtherCharacters(scene.characters)}
                ${this.renderDialog(scene.dialog)}
                <!-- Кнопка назад -->
                <button class="back-btn-vn" onclick="VNEngine.returnToMenu()">
                    ← ВЕРНУТЬСЯ В МЕНЮ
                </button>
            </div>
        `;
    }
    
    static renderOtherCharacters(characters) {
        if (!characters || !Array.isArray(characters)) {
            console.log('❌ Нет персонажей для отображения');
            return '';
        }
        
        console.log('🎭 Рендерим персонажей:', characters);
        
        const isMobile = window.innerWidth <= 768;
        
        const charactersHTML = characters
            .filter(char => char.visible !== false)
            .map(char => {
                const imagePath = `assets/chapter1/characters/${char.name}/${char.expression}.png`;
                const mobileClass = isMobile ? 'mobile' : '';
                
                console.log(`👤 Создаем спрайт: ${char.name} (${char.expression}) -> ${imagePath}`);
                
                return `
                    <div class="character-sprite ${char.position} ${mobileClass}" 
                         data-character="${char.name}"
                         data-expression="${char.expression}"
                         style="background-image: url('${imagePath}')">
                         <div class="debug-info">${char.name}:${char.expression}</div>
                    </div>
                `;
            }).join('');
        
        console.log('📝 HTML персонажей:', charactersHTML);
        return charactersHTML;
    }
    
    static renderDialog(dialog) {
        const speaker = window.vnCharacters?.[dialog.speaker];
        const speakerName = speaker?.name || dialog.speaker || 'Неизвестный';
        
        return `
            <div class="dialog-box">
                <div class="speaker-name">${speakerName}</div>
                <div class="dialog-text" id="dialog-text"></div>
                <div class="continue-indicator" onclick="VNEngine.next()">
                    ▼ Нажмите чтобы продолжить
                </div>
            </div>
        `;
    }
    
    static typeText(text) {
        // Останавливаем предыдущую анимацию
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
        }
        
        this.isTyping = true;
        this.currentText = '';
        const element = document.getElementById('dialog-text');
        if (!element) return;
        
        element.innerHTML = '';
        
        let i = 0;
        this.typingInterval = setInterval(() => {
            if (i < text.length) {
                this.currentText += text.charAt(i);
                element.innerHTML = this.currentText;
                i++;
            } else {
                clearInterval(this.typingInterval);
                this.isTyping = false;
            }
        }, 30);
    }
    
    static next() {
        if (this.isTyping) {
            // Пропустить анимацию печати
            const element = document.getElementById('dialog-text');
            if (element && this.currentScene) {
                element.innerHTML = this.currentScene.dialog.text;
                this.isTyping = false;
                // Останавливаем все интервалы
                if (this.typingInterval) {
                    clearInterval(this.typingInterval);
                }
            }
        } else {
            // Переход к следующей сцене
            this.nextScene();
        }
    }
    
    static nextScene() {
        this.currentSceneIndex++;
        this.showCurrentScene();
    }
    
    static prevScene() {
        if (this.currentSceneIndex > 0) {
            this.currentSceneIndex--;
            this.showCurrentScene();
        }
    }
    
    static episodeComplete() {
        console.log('🏁 Эпизод завершен');
        
        if (this.currentEpisode && this.currentEpisode.hasInput) {
            // Если эпизод требует ввода ответа
            this.showAnswerInput();
        } else {
            // Иначе возвращаем в меню
            this.returnToMenu();
        }
    }
    
    static showAnswerInput() {
        const container = document.getElementById('app-container');
        if (!container) return;
        
        const fullEpisodeId = `${this.currentEpisode.chapter}_${this.currentEpisode.id}`;
        const isCompleted = window.appState?.userData?.completedEpisodes?.includes(fullEpisodeId);
        
        if (isCompleted) {
            container.innerHTML = `
                <div class="episode-container">
                    <div class="episode-title">
                        Глава ${this.currentEpisode.chapter}, Эпизод ${this.currentEpisode.id}: ${this.currentEpisode.title} ✅
                    </div>
                    <div class="episode-text">
                        Эпизод уже завершён! Ваш ответ был верным.
                    </div>
                    <button class="submit-btn" onclick="VNEngine.returnToMenu()">
                        🏠 ВЕРНУТЬСЯ В МЕНЮ
                    </button>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="episode-container">
                    <div class="episode-title">
                        Глава ${this.currentEpisode.chapter}, Эпизод ${this.currentEpisode.id}: ${this.currentEpisode.title}
                    </div>
                    <div class="episode-text">
                        Введите ваш ответ на загадку:
                    </div>
                    
                    <div class="answer-section">
                        <input type="text" class="answer-input" placeholder="Введите ваш ответ..." id="answer-input">
                        <button class="submit-btn" onclick="VNEngine.submitAnswer()">
                            🔍 ОТПРАВИТЬ ОТВЕТ
                        </button>
                    </div>
                    
                    <button class="back-btn" onclick="VNEngine.returnToMenu()">← ВЕРНУТЬСЯ В МЕНЮ</button>
                </div>
            `;
        }
    }
    
    static submitAnswer() {
        const fullEpisodeId = `${this.currentEpisode.chapter}_${this.currentEpisode.id}`;
        const answerInput = document.getElementById('answer-input');
        let answer = answerInput ? answerInput.value.trim() : '';
        
        console.log('📝 Ответ из ВН-эпизода:', answer);
        
        if (!answer) {
            this.showAlert('Введите ответ перед отправкой!');
            return;
        }
        
        // Получаем правильные ответы
        const correctAnswers = window.episodeAnswers ? window.episodeAnswers[fullEpisodeId] : [];
        
        if (!correctAnswers || correctAnswers.length === 0) {
            console.error('❌ Нет правильных ответов для эпизода:', fullEpisodeId);
            this.showAlert('Ошибка: ответы для этого эпизода не найдены');
            return;
        }
        
        // Нормализуем ответ
        const normalizedAnswer = this.normalizeAnswer(answer);
        const isCorrect = correctAnswers.some(correct => {
            const normalizedCorrect = this.normalizeAnswer(correct);
            return normalizedCorrect === normalizedAnswer;
        });
        
        if (isCorrect) {
            this.handleCorrectAnswer(fullEpisodeId);
        } else {
            this.handleWrongAnswer(answerInput);
        }
    }
    
    static handleCorrectAnswer(fullEpisodeId) {
        const phrase = this.getRandomPhrase('correct');
        
        // Начисляем баллы и обновляем прогресс
        if (window.appState && window.appState.userData) {
            window.appState.userData.score += 10;
            
            const nextEpisodeNumber = parseInt(this.currentEpisode.id) + 1;
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
                this.returnToMenu();
            }, 1500);
            
        } else {
            this.showAlert(`✅ ${phrase}!`);
            this.returnToMenu();
        }
    }
    
    static handleWrongAnswer(answerInput) {
        const phrase = this.getRandomPhrase('wrong');
        this.showAlert(`❌ ${phrase}`);
        
        // Очищаем поле ввода для новой попытки
        if (answerInput) {
            answerInput.value = '';
            answerInput.focus();
        }
    }
    
    static normalizeAnswer(text) {
        return String(text)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\sа-яё]/gi, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }
    
    static getRandomPhrase(type) {
        if (!window.gamePhrases || !window.gamePhrases[type]) {
            return type === 'correct' ? 'Верно!' : 'Неверно!';
        }
        
        const phrases = window.gamePhrases[type];
        return phrases[Math.floor(Math.random() * phrases.length)];
    }
    
    static returnToMenu() {
        console.log('🔙 Возврат в меню из ВН');
        
        // Очищаем состояние ВН
        this.currentEpisode = null;
        this.currentSceneIndex = 0;
        this.scenes = [];
        this.currentScene = null;
        this.isTyping = false;
        this.currentText = '';
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
        }
        
        if (typeof Menu !== 'undefined' && typeof Menu.show === 'function') {
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
}

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', function() {
    VNEngine.init();
});

// Глобальная регистрация
if (typeof window !== 'undefined') {
    window.VNEngine = VNEngine;
    console.log('✅ VNEngine класс зарегистрирован');
}