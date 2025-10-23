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

// Новый метод для получения случайной фразы
static getRandomPhrase(type) {
    if (!window.gamePhrases || !window.gamePhrases[type]) {
        return type === 'correct' ? 'Верно!' : 'Неверно!';
    }
    
    const phrases = window.gamePhrases[type];
    return phrases[Math.floor(Math.random() * phrases.length)];
}