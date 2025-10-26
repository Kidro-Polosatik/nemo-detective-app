// js/engine/vn-engine.js
class VNEngine {
    static init() {
        console.log('🎬 VN Engine инициализирован');
        this.currentScene = null;
        this.isTyping = false;
        this.currentText = '';
    }
    
    static showScene(sceneData) {
        const container = document.getElementById('app-container');
        if (!container) {
            console.error('❌ app-container не найден');
            return;
        }
        
        container.innerHTML = this.renderFirstPersonScene(sceneData);
        this.currentScene = sceneData;
        this.typeText(sceneData.dialog.text);
    }
    
    static renderFirstPersonScene(scene) {
        return `
            <div class="vn-scene first-person" style="background-image: url('${scene.background}')">
                ${this.renderOtherCharacters(scene.characters)}
                ${this.renderDialog(scene.dialog)}
            </div>
        `;
    }
    
    static renderOtherCharacters(characters) {
        if (!characters) return '';
        
        return characters.map(char => `
            <div class="character-sprite ${char.position}" 
                 data-character="${char.name}"
                 style="background-image: url('assets/characters/${char.name}/${char.expression}.png')">
            </div>
        `).join('');
    }
    
    static renderDialog(dialog) {
        const speaker = window.vnCharacters[dialog.speaker];
        return `
            <div class="dialog-box">
                <div class="speaker-name">${speaker?.name || 'Неизвестный'}</div>
                <div class="dialog-text" id="dialog-text"></div>
                <div class="continue-indicator" onclick="VNEngine.next()">▼ Нажмите чтобы продолжить</div>
            </div>
        `;
    }
    
    static typeText(text) {
        this.isTyping = true;
        this.currentText = '';
        const element = document.getElementById('dialog-text');
        if (!element) return;
        
        element.innerHTML = '';
        
        let i = 0;
        const typing = setInterval(() => {
            if (i < text.length) {
                this.currentText += text.charAt(i);
                element.innerHTML = this.currentText;
                i++;
            } else {
                clearInterval(typing);
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
            }
        } else {
            // Пока просто возвращаем в меню
            if (window.Menu) {
                Menu.show();
            }
        }
    }
}

// ДОБАВЬ В КОНЕЦ vn-engine.js:

// Система управления сценами в эпизоде
VNEngine.initEpisode = function(episode) {
    console.log('🎬 Инициализация эпизода ВН:', episode.title);
    this.currentEpisode = episode;
    this.currentSceneIndex = 0;
    this.scenes = episode.vnScenes || [];
};

VNEngine.showCurrentScene = function() {
    if (!this.scenes || this.scenes.length === 0) {
        console.error('❌ Нет сцен для показа');
        return;
    }
    
    if (this.currentSceneIndex >= this.scenes.length) {
        console.log('🎉 Эпизод завершен!');
        this.episodeComplete();
        return;
    }
    
    const scene = this.scenes[this.currentSceneIndex];
    this.showScene(scene);
};

VNEngine.nextScene = function() {
    this.currentSceneIndex++;
    this.showCurrentScene();
};

VNEngine.episodeComplete = function() {
    // Здесь будет логика завершения эпизода
    console.log('🏁 Эпизод завершен, возврат в меню');
    if (window.Menu) {
        Menu.show();
    }
};

// Обновляем метод next для перехода между сценами
VNEngine.next = function() {
    if (this.isTyping) {
        // Пропустить анимацию печати
        const element = document.getElementById('dialog-text');
        if (element && this.currentScene) {
            element.innerHTML = this.currentScene.dialog.text;
            this.isTyping = false;
        }
    } else {
        // Переход к следующей сцене
        this.nextScene();
    }
};

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', function() {
    VNEngine.init();
});