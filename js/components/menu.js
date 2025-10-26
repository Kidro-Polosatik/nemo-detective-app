static showSecretMessage() {
    const container = document.getElementById('app-container');
    
    if (!container) return;
    
    container.innerHTML = `
        <div class="main-menu">
            <div class="decoration top-left"></div>
            <div class="decoration bottom-right"></div>
            
            <div class="secret-message-container">
                <div class="burnt-letter">
                    <!-- Эффекты тления -->
                    <div class="burning-edges">
                        <div class="burn-edge top-edge"></div>
                        <div class="burn-edge right-edge"></div>
                        <div class="burn-edge bottom-edge"></div>
                        <div class="burn-edge left-edge"></div>
                    </div>
                    
                    <!-- Эффекты дыма -->
                    <div class="smoke-effect smoke-1"></div>
                    <div class="smoke-effect smoke-2"></div>
                    <div class="smoke-effect smoke-3"></div>
                    
                    <!-- Пятна от огня -->
                    <div class="burn-marks burn-mark-1"></div>
                    <div class="burn-marks burn-mark-2"></div>
                    
                    <!-- Текст письма как на скриншоте -->
                    <div class="handwritten-text">
                        <span class="letter-line centered">Jat is born for ye.</span>
                        <span class="letter-line centered">The thard theen.</span>
                        <span class="letter-line" style="margin-top: 20px;"></span>
                        <span class="letter-line left-aligned">May, tid of buy</span>
                        <span class="letter-line centered">snedyeyeves gu</span>
                        <span class="letter-line right-aligned">hanyhan thereder.</span>
                        <span class="letter-line centered" style="margin-top: 15px;">The ixufe.</span>
                    </div>
                </div>
                
                <button class="return-btn" onclick="Menu.show()">
                    ВЕРНУТЬСЯ В МЕНЮ
                </button>
            </div>
        </div>
    `;
}