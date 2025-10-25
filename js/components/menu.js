// Компонент главного меню
class Menu {
    static show() {
        console.log('🎮 Menu.show() вызван');
        
        const userData = window.appState?.userData || { 
            score: 0, 
            currentEpisode: 1,
            completedEpisodes: []
        };
        const container = document.getElementById('app-container');
        
        if (!container) {
            console.error('❌ ERROR: app-container не найден');
            return;
        }
        
        // Получаем имя пользователя из Telegram или используем "Детектив"
        const userName = this.getUserName();
        
        // Определяем, новичок или нет
        const isNewUser = userData.currentEpisode === 1 && 
                         userData.score === 0 && 
                         (!userData.completedEpisodes || userData.completedEpisodes.length === 0);
        
        container.innerHTML = `
            <div class="main-menu">
                <!-- Декоративные элементы -->
                <div class="decoration top-left"></div>
                <div class="decoration bottom-right"></div>

                <!-- Верхний заголовок -->
                <div class="main-title">
                    <h1>ВЕЧНЫЙ ДЕТЕКТИВ</h1>
                    <div class="subtitle">РАССЛЕДОВАНИЕ</div>
                </div>

                <!-- Центральные кнопки -->
                <div class="menu-buttons-container">
                    ${isNewUser ? `
                    <button class="menu-btn start-btn" onclick="Menu.startChapter(1)">
                        НАЧАТЬ ДЕЛО
                    </button>
                    ` : `
                    <button class="menu-btn start-btn" onclick="Menu.continueGame()">
                        ПРОДОЛЖИТЬ ДЕЛО
                    </button>
                    `}
                    
                    <button class="menu-btn" onclick="Menu.showArchive()">
                        АРХИВ ДЕЛ
                    </button>
                    
                    <button class="menu-btn" onclick="Menu.showRating()">
                        РЕЙТИНГ ДЕТЕКТИВОВ
                    </button>
                </div>

                <!-- Нижняя надпись и счет -->
                <div class="bottom-section">
                    <div class="quote clickable-quote" onclick="Menu.showSecretMessage()">
                        Каждый ответ - ключ к вечной загадке
                    </div>
                    <div class="score-display">
                        <strong>Накоплено улик:</strong> ${userData.score}
                    </div>
                </div>
            </div>
        `;
        
        // Обновляем состояние
        if (window.appState) {
            window.appState.currentView = 'menu';
            window.appState.currentEpisodeId = null;
        }
        
        console.log('✅ Меню показано успешно. Новый пользователь:', isNewUser);
    }
    
    static getUserName() {
        // Пробуем получить имя из Telegram
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
            const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
            return tgUser.first_name || tgUser.username || 'Детектив';
        }
        return 'Детектив';
    }
    
    static showSecretMessage() {
        const userName = this.getUserName();
        const container = document.getElementById('app-container');
        
        if (!container) return;
        
        // Получаем текст из отдельного файла
        let messageText = window.secretMessageText || `Здравствуй, ${userName}!\n\nЭто секретное сообщение о проекте.`;
        
        // Заменяем плейсхолдер именем пользователя
        messageText = messageText.replace('{username}', userName);
        
        // Разбиваем текст на параграфы
        const paragraphs = messageText.split('\n\n').map(paragraph => {
            if (paragraph.includes('AllertsDonate')) {
                return `
                    <p>${paragraph.replace('AllertsDonate', '')}</p>
                    <div class="donate-link">
                        <a href="https://allertsdonate.com" target="_blank" class="donate-btn">
                            AllertsDonate
                        </a>
                    </div>
                `;
            }
            return `<p>${paragraph}</p>`;
        }).join('');
        
        container.innerHTML = `
            <div class="main-menu">
                <div class="decoration top-left"></div>
                <div class="decoration bottom-right"></div>
                
                <div class="main-title">
                    <h1>СЕКРЕТНОЕ ПОСЛАНИЕ</h1>
                    <div class="subtitle">ОБУГЛЕННОЕ ПИСЬМО</div>
                </div>
                
                <div class="secret-message-container">
                    <div class="burnt-paper">
                        <div class="burnt-edges"></div>
                        <div class="message-content">
                            ${paragraphs}
                        </div>
                    </div>
                </div>
                
                <button class="menu-btn" onclick="Menu.show()" style="max-width: 200px; margin-top: 30px;">
                    ВЕРНУТЬСЯ В МЕНЮ
                </button>
            </div>
        `;
    }
    
    static startChapter(chapterNumber) {
        console.log('🎬 Запуск главы:', chapterNumber);
        
        if (typeof EpisodeView === 'undefined') {
            console.error('❌ ERROR: EpisodeView не загружен');
            this.showComponentError('EpisodeView');
            return;
        }
        
        EpisodeView.show(`${chapterNumber}_1`);
    }
    
    static continueGame() {
        console.log('▶️ Продолжение игры');
        
        if (typeof EpisodeView === 'undefined') {
            console.error('❌ ERROR: EpisodeView не загружен');
            this.showComponentError('EpisodeView');
            return;
        }
        
        const currentEpisode = window.appState?.userData?.currentEpisode || 1;
        const currentChapter = 1;
        console.log('🔍 Переход к эпизоду:', `${currentChapter}_${currentEpisode}`);
        EpisodeView.show(`${currentChapter}_${currentEpisode}`);
    }
    
    static showArchive() {
        console.log('📁 Показ архива дел');
        
        const container = document.getElementById('app-container');
        const userData = window.appState?.userData || { 
            completedEpisodes: [],
            currentEpisode: 1
        };
        
        if (!container) return;
        
        // Определяем прогресс по главам
        const completedCount = userData.completedEpisodes.length;
        const totalEpisodes = Object.keys(window.episodes || {}).length;
        const progress = totalEpisodes > 0 ? Math.round((completedCount / totalEpisodes) * 100) : 0;
        
        container.innerHTML = `
            <div class="main-menu">
                <div class="decoration top-left"></div>
                <div class="decoration bottom-right"></div>
                
                <div class="main-title">
                    <h1>АРХИВ ДЕЛ</h1>
                    <div class="subtitle">ПРОГРЕСС И ПОВТОРЕНИЕ</div>
                </div>
                
                <div style="z-index: 2; text-align: center; margin: 30px 0; max-width: 360px;">
                    <div style="margin: 20px 0; font-size: 1.2rem; color: #ffd700;">
                        Общий прогресс: ${progress}%
                    </div>
                    
                    <div style="margin: 25px 0; padding: 15px; background: rgba(255,215,0,0.1); border-radius: 10px;">
                        <div style="font-size: 1rem; margin-bottom: 10px;">Завершено эпизодов: ${completedCount}/${totalEpisodes}</div>
                        <div style="font-size: 1rem;">Текущий счёт: ${userData.score} баллов</div>
                    </div>
                    
                    <div style="text-align: left; margin: 25px 0;">
                        <div style="font-size: 1.1rem; color: #ffd700; margin-bottom: 15px; text-align: center;">
                            Глава 1: "Неожиданная встреча"
                        </div>
                        ${this.renderEpisodeList(1, userData)}
                    </div>
                </div>
                
                <button class="menu-btn" onclick="Menu.show()" style="max-width: 200px;">
                    НАЗАД В МЕНЮ
                </button>
            </div>
        `;
        
        if (window.appState) {
            window.appState.currentView = 'archive';
        }
    }
    
    static renderEpisodeList(chapter, userData) {
        const episodes = Object.keys(window.episodes || {})
            .filter(id => id.startsWith(chapter + '_'))
            .sort((a, b) => {
                const aNum = parseInt(a.split('_')[1]);
                const bNum = parseInt(b.split('_')[1]);
                return aNum - bNum;
            });
        
        let html = '';
        episodes.forEach(episodeId => {
            const episode = window.episodes[episodeId];
            const isCompleted = userData.completedEpisodes.includes(episodeId);
            const isAvailable = isCompleted || this.isEpisodeAvailable(episodeId, userData);
            
            html += `
                <div class="archive-episode ${isCompleted ? 'completed' : 'locked'}" 
                     style="margin: 12px 0; padding: 12px; border-radius: 8px; 
                            background: ${isCompleted ? 'rgba(255,215,0,0.1)' : 'rgba(128,128,128,0.1)'}; 
                            border: 1px solid ${isCompleted ? 'rgba(255,215,0,0.3)' : 'rgba(128,128,128,0.3)'};">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1;">
                            <div style="font-weight: bold; color: ${isCompleted ? '#ffd700' : '#888'};">
                                Эпизод ${episode.id}: ${episode.title}
                            </div>
                            <div style="font-size: 0.9rem; color: ${isCompleted ? '#b8a050' : '#666'}; margin-top: 5px;">
                                ${isCompleted ? '✅ Завершён' : '🔒 Недоступен'}
                            </div>
                        </div>
                        ${isAvailable ? `
                        <button class="menu-btn" onclick="Menu.playEpisode('${episodeId}')" 
                                style="padding: 8px 16px; font-size: 0.9rem; margin-left: 10px;">
                            ${isCompleted ? '🔄 Повторить' : '▶️ Играть'}
                        </button>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        return html;
    }
    
    static isEpisodeAvailable(episodeId, userData) {
        const [chapter, episodeNum] = episodeId.split('_');
        const episodeNumber = parseInt(episodeNum);
        
        if (episodeNumber === 1) return true;
        
        const prevEpisodeId = `${chapter}_${episodeNumber - 1}`;
        return userData.completedEpisodes.includes(prevEpisodeId);
    }
    
    static playEpisode(episodeId) {
        console.log('🎮 Запуск эпизода из архива:', episodeId);
        
        if (typeof EpisodeView === 'undefined') {
            console.error('❌ ERROR: EpisodeView не загружен');
            this.showComponentError('EpisodeView');
            return;
        }
        
        EpisodeView.show(episodeId);
    }
    
    static showRating() {
        console.log('📊 Показ рейтинга');
        
        if (typeof Rating === 'undefined') {
            console.error('❌ ERROR: Rating не загружен');
            this.showFallbackRating();
            return;
        }
        
        Rating.show();
    }
    
    static showComponentError(componentName) {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.showAlert(`Ошибка: ${componentName} не загружен. Перезагрузите приложение.`);
        } else {
            alert(`Ошибка: ${componentName} не загружен. Перезагрузите приложение.`);
        }
        
        setTimeout(() => {
            if (typeof Menu !== 'undefined') {
                Menu.show();
            }
        }, 1000);
    }
    
    static showFallbackRating() {
        const container = document.getElementById('app-container');
        const userData = window.appState?.userData || { score: 0 };
        
        if (!container) return;
        
        container.innerHTML = `
            <div class="main-menu">
                <div class="decoration top-left"></div>
                <div class="decoration bottom-right"></div>
                
                <div class="main-title">
                    <h1>РЕЙТИНГ ДЕТЕКТИВОВ</h1>
                    <div class="subtitle">ТОП ИГРОКОВ</div>
                </div>
                
                <div style="z-index: 2; text-align: center; margin: 40px 0;">
                    <div style="color: #b8a050; margin-bottom: 20px;">
                        Рейтинг обновляется в реальном времени
                    </div>
                    ${Rating.renderRealRating()}
                </div>
                
                <button class="menu-btn" onclick="Menu.show()" style="max-width: 200px;">
                    НАЗАД В МЕНЮ
                </button>
            </div>
        `;
        
        if (window.appState) {
            window.appState.currentView = 'rating';
        }
    }
}

// Глобальная регистрация с защитой
if (typeof window !== 'undefined') {
    window.Menu = Menu;
    console.log('✅ Menu зарегистрирован глобально');
}