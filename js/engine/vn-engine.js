// js/engine/vn-engine.js - Движок с тремя кнопками навигации
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
        
        container.innerHTML = this.renderFirstPersonScene(sceneData);
        this.currentScene = sceneData;
        
        // Только для обычных сцен включаем печать текста
        if (!sceneData.background.includes('notebook')) {
            this.typeText(sceneData.dialog.text);
        }
        
        console.log(`🎭 Сцена ${this.currentSceneIndex + 1}/${this.scenes.length}`);
    }
    
    static renderFirstPersonScene(scene) {
        // Если это сцена с блокнотом (последняя сцена)
        if (scene.background.includes('notebook')) {
            return `
                <div class="vn-scene notebook-scene">
                    <div class="notebook-content">
                        ${scene.dialog.text}
                    </div>
                    <div class="answer-section-final">
                        <input type="text" class="answer-input-final" placeholder="Введите ваш ответ..." id="answer-input-final">
                        <button class="submit-btn-final" onclick="VNEngine.submitFinalAnswer()">
                            🔍 ОТПРАВИТЬ ОТВЕТ
                        </button>
                    </div>
                    <div class="navigation-buttons">
                        <button class="nav-btn back" onclick="VNEngine.prevScene()" ${this.currentSceneIndex === 0 ? 'disabled' : ''}>
                            ← НАЗАД
                        </button>
                        <button class="nav-btn menu" onclick="VNEngine.returnToMenu()">
                            🏠 МЕНЮ
                        </button>
                        <button class="nav-btn next" onclick="VNEngine.nextScene()">
                            ДАЛЕЕ →
                        </button>
                    </div>
                </div>
            `;
        }
        
        // Обычная сцена с тремя кнопками навигации
        const isFirstScene = this.currentSceneIndex === 0;
        const isLastScene = this.currentSceneIndex === this.scenes.length - 1;
        const nextButtonText = isLastScene ? 'ЗАВЕРШИТЬ →' : 'ДАЛЕЕ →';
        const nextButtonAction = isLastScene ? 'VNEngine.episodeComplete()' : 'VNEngine.nextScene()';
        
        return `
            <div class="vn-scene first-person" style="background-image: url('${scene.background}')">
                ${this.renderOtherCharacters(scene.characters)}
                ${this.renderDialog(scene.dialog)}
                <div class="navigation-buttons">
                    <button class="nav-btn back" onclick="VNEngine.prevScene()" ${isFirstScene ? 'disabled' : ''}>
                        ← НАЗАД
                    </button>
                    <button class="nav-btn menu" onclick="VNEngine.returnToMenu()">
                        🏠 МЕНЮ
                    </button>
                    <button class="nav-btn next" onclick="${nextButtonAction}">
                        ${nextButtonText}
                    </button>
                </div>
            </div>
        `;
    }
    
    static renderOtherCharacters(characters) {
        if (!characters || !Array.isArray(characters)) return '';
        
        const isMobile = window.innerWidth <= 768;
        
        return characters
            .filter(char => char.visible !== false)
            .map(char => {
                const imagePath = `assets/chapter1/characters/${char.name}/${char.expression}.png`;
                const mobileClass = isMobile ? 'mobile' : '';
                
                return `
                    <div class="character-sprite ${char.position} ${mobileClass}" 
                         data-character="${char.name}"
                         style="background-image: url('${imagePath}')">
                    </div>
                `;
            }).join('');
    }
    
    static renderDialog(dialog) {
        const speaker = window.vnCharacters?.[dialog.speaker];
        const speakerName = speaker?.name || dialog.speaker || 'Неизвестный';
        
        return `
            <div class="dialog-box">
                <div class="speaker-name">${speakerName}</div>
                <div class="dialog-text" id="dialog-text"></div>
            </div>
        `;
    }
    
    static typeText(text) {
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
    
    static nextScene() {
        if (this.isTyping) {
            const element = document.getElementById('dialog-text');
            if (element && this.currentScene) {
                element.innerHTML = this.currentScene.dialog.text;
                this.isTyping = false;
                if (this.typingInterval) {
                    clearInterval(this.typingInterval);
                }
            }
        } else {
            this.currentSceneIndex++;
            this.showCurrentScene();
        }
    }
    
    static prevScene() {
        if (this.isTyping) {
            const element = document.getElementById('dialog-text');
            if (element && this.currentScene) {
                element.innerHTML = this.currentScene.dialog.text;
                this.isTyping = false;
                if (this.typingInterval) {
                    clearInterval(this.typingInterval);
                }
            }
        } else {
            if (this.currentSceneIndex > 0) {
                this.currentSceneIndex--;
                this.showCurrentScene();
            }
        }
    }
    
    static episodeComplete() {
        console.log('🏁 Эпизод завершен');
        
        if (this.currentEpisode && this.currentEpisode.hasInput) {
            this.showAnswerInput();
        } else {
            this.returnToMenu();
        }
    }
    
    // ... остальные методы остаются без изменений
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
                    <div class="navigation-buttons">
                        <button class="nav-btn back" onclick="VNEngine.returnToMenu()">
                            ← МЕНЮ
                        </button>
                        <button class="nav-btn menu" onclick="Menu.showArchive()">
                            АРХИВ
                        </button>
                        <button class="nav-btn next" onclick="VNEngine.nextEpisode()">
                            СЛЕДУЮЩИЙ →
                        </button>
                    </div>
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
                    
                   <div style="text-align: center; margin-top: 30px;">
                        <button class="submit-btn" onclick="VNEngine.returnToMenu()" style="max-width: 250px;">
                            ← ВЕРНУТЬСЯ В МЕНЮ
                        </button>
                    </div>
                </div>
            `;
        }
    }
    
    // ... остальные методы без изменений
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