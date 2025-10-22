class Menu {
    static show() {
        console.log('Menu.show() вызван');
        
        const userData = window.appState?.userData || { score: 0, currentEpisode: 1 };
        const container = document.getElementById('app-container');
        
        if (!container) {
            console.error('ERROR: app-container не найден');
            return;
        }
        
        container.innerHTML = `
            <div class="main-menu">
                <!-- Декоративные элементы -->
                <div class="decoration top-left"></div>
                <div class="decoration bottom-right"></div>

                <!-- Верхний заголовок -->
                <div class="main-title">
                    <h1>ВЕЧНЫЙ ДЕТЕКТИВ</h1>
                    <div class="subtitle">ИГРА</div>
                </div>

                <!-- Центральные кнопки -->
                <div class="menu-buttons-container">
                    <button class="menu-btn start-btn" onclick="Menu.startChapter(1)">
                        НАЧАТЬ ДЕЛО
                    </button>
                    
                    ${userData.currentEpisode > 1 ? `
                    <button class="menu-btn continue-btn" onclick="Menu.continueGame()">
                        ПРОДОЛЖИТЬ РАССЛЕДОВАНИЕ
                    </button>
                    ` : ''}
                    
                    <button class="menu-btn rating-btn" onclick="Menu.showRating()">
                        РЕЙТИНГ ДЕТЕКТИВОВ
                    </button>
                </div>

                <!-- Нижняя надпись и счет -->
                <div class="bottom-section">
                    <div class="quote">
                        "Каждая загадка - ключ к вечной тайне"
                    </div>
                    <div class="score-display">
                        <strong>Накоплено улик:</strong> ${userData.score}
                    </div>
                </div>
            </div>
        `;
        
        // Добавляем стили если их еще нет
        this.addStyles();
        
        // Обновляем состояние
        if (window.appState) {
            window.appState.currentView = 'menu';
        }
        
        console.log('Меню показано успешно');
    }
    
    static addStyles() {
        // Проверяем, не добавлены ли стили уже
        if (document.getElementById('menu-styles')) return;
        
        const styles = `
            <style id="menu-styles">
                .main-menu {
                    font-family: 'Georgia', 'Times New Roman', serif;
                    background: linear-gradient(135deg, #0A1931 0%, #1A2B4A 100%);
                    color: #FFD700;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;
                    padding: 40px 20px;
                    position: relative;
                    overflow: hidden;
                }

                /* Эффект старинной бумаги */
                .main-menu::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100" height="100" filter="url(%23noise)" opacity="0.1"/></svg>');
                    opacity: 0.1;
                    pointer-events: none;
                }

                /* Верхний заголовок */
                .main-title {
                    text-align: center;
                    margin-top: 40px;
                    z-index: 2;
                }

                .main-title h1 {
                    font-size: 2.8rem;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 4px;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                    margin-bottom: 10px;
                    background: linear-gradient(45deg, #FFD700, #FFED4E);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .main-title .subtitle {
                    font-size: 1.2rem;
                    letter-spacing: 8px;
                    opacity: 0.9;
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
                }

                /* Контейнер кнопок */
                .menu-buttons-container {
                    z-index: 2;
                    margin: 40px 0;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    width: 100%;
                    max-width: 300px;
                }

                /* Стили кнопок */
                .menu-btn {
                    background: linear-gradient(45deg, #1E3A5F, #2D4F7C);
                    color: #FFD700;
                    border: 2px solid #FFD700;
                    padding: 18px 25px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
                    position: relative;
                    overflow: hidden;
                    font-family: 'Georgia', serif;
                }

                .menu-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent);
                    transition: left 0.5s ease;
                }

                .menu-btn:hover::before {
                    left: 100%;
                }

                .menu-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
                    background: linear-gradient(45deg, #2D4F7C, #3B5F8A);
                }

                .menu-btn:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
                }

                /* Особые стили для кнопки начала */
                .start-btn {
                    font-size: 1.3rem;
                    padding: 20px 30px;
                }

                /* Нижняя секция */
                .bottom-section {
                    text-align: center;
                    z-index: 2;
                    margin-bottom: 30px;
                }

                .quote {
                    font-style: italic;
                    font-size: 1rem;
                    color: #B8B8B8;
                    max-width: 300px;
                    line-height: 1.4;
                    margin-bottom: 15px;
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
                    opacity: 0.8;
                }

                .score-display {
                    font-size: 1rem;
                    color: #FFD700;
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
                }

                /* Декоративные элементы */
                .decoration {
                    position: absolute;
                    opacity: 0.1;
                    z-index: 1;
                }

                .decoration.top-left {
                    top: 20px;
                    left: 20px;
                    width: 80px;
                    height: 80px;
                    border: 1px solid #FFD700;
                    transform: rotate(45deg);
                }

                .decoration.bottom-right {
                    bottom: 20px;
                    right: 20px;
                    width: 60px;
                    height: 60px;
                    border: 1px solid #FFD700;
                    border-radius: 50%;
                }

                /* Адаптивность */
                @media (max-width: 480px) {
                    .main-title h1 {
                        font-size: 2.2rem;
                        letter-spacing: 3px;
                    }
                    
                    .main-title .subtitle {
                        font-size: 1rem;
                        letter-spacing: 6px;
                    }
                    
                    .menu-btn {
                        padding: 16px 20px;
                        font-size: 1rem;
                    }
                    
                    .start-btn {
                        font-size: 1.1rem;
                        padding: 18px 25px;
                    }
                    
                    .quote {
                        font-size: 0.9rem;
                        max-width: 250px;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    static startChapter(chapterNumber) {
        console.log('Запуск главы:', chapterNumber);
        
        if (typeof EpisodeView === 'undefined') {
            console.error('ERROR: EpisodeView не загружен');
            Telegram.WebApp.showAlert('Ошибка загрузки. Перезагрузите приложение.');
            return;
        }
        
        EpisodeView.show(`${chapterNumber}_1`);
    }
    
    static continueGame() {
        console.log('Продолжение игры');
        
        if (typeof EpisodeView === 'undefined') {
            console.error('ERROR: EpisodeView не загружен');
            return;
        }
        
        const currentEpisode = window.appState?.userData?.currentEpisode || 1;
        const currentChapter = 1;
        EpisodeView.show(`${currentChapter}_${currentEpisode}`);
    }
    
    static showRating() {
        console.log('Показ рейтинга');
        
        if (typeof Rating === 'undefined') {
            console.error('ERROR: Rating не загружен');
            // Показываем простой рейтинг вместо ошибки
            const container = document.getElementById('app-container');
            const userData = window.appState?.userData || { score: 0 };
            
            container.innerHTML = `
                <div class="main-menu">
                    <div class="decoration top-left"></div>
                    <div class="decoration bottom-right"></div>
                    
                    <div class="main-title">
                        <h1>РЕЙТИНГ</h1>
                        <div class="subtitle">ДЕТЕКТИВОВ</div>
                    </div>
                    
                    <div class="rating-list" style="z-index: 2; text-align: center; margin: 40px 0;">
                        <div style="margin: 15px 0; font-size: 1.2rem;">1. Шерлок Холмс - 150 баллов</div>
                        <div style="margin: 15px 0; font-size: 1.2rem;">2. Эркюль Пуаро - 130 баллов</div>
                        <div style="margin: 15px 0; font-size: 1.2rem; color: #ffd700; font-weight: bold;">3. Вы - ${userData.score} баллов</div>
                    </div>
                    
                    <button class="menu-btn" onclick="Menu.show()" style="max-width: 200px;">
                        НАЗАД В МЕНЮ
                    </button>
                </div>
            `;
            return;
        }
        
        Rating.show();
    }
}

// Глобальная ссылка для вызова из HTML
window.Menu = Menu;
console.log('Menu класс зарегистрирован с новым дизайном');