// js/engine/test-scene.js
window.episodes = window.episodes || {};
window.episodes['test_vn'] = {
    id: "test",
    chapter: 1,
    title: "Демо визуальной новеллы",
    vnScenes: [
        {
            background: "https://placehold.co/800x600/1a2b4a/ffffff?text=Детективное+агентство",
            characters: [
                {
                    name: "jupiter",
                    position: "center",
                    expression: "excited",
                    visible: true
                }
            ],
            dialog: {
                speaker: "jupiter",
                text: "Добро пожаловать в демо визуальной новеллы! Я - Юпитер Джонс, глава детективного агентства."
            }
        },
        {
            background: "https://placehold.co/800x600/2c5530/ffffff?text=Команда+детективов", 
            characters: [
                {
                    name: "pete",
                    position: "left",
                    expression: "surprised",
                    visible: true
                },
                {
                    name: "bob", 
                    position: "right",
                    expression: "helpful",
                    visible: true
                }
            ],
            dialog: {
                speaker: "pete",
                text: "А мы - мои напарники! Это Пит (я) и Боб. Вместе мы расследуем самые запутанные дела."
            }
        },
        {
            background: "https://placehold.co/800x600/8b4513/ffffff?text=Технологии+будущего",
            characters: [
                {
                    name: "bob",
                    position: "center",
                    expression: "helpful", 
                    visible: true
                }
            ],
            dialog: {
                speaker: "bob",
                text: "Скоро здесь будут настоящие фоны и персонажи! А пока - это демо возможностей движка визуальной новеллы. 🎭"
            }
        }
    ],
    hasInput: false
};

console.log('✅ Демо ВН-эпизод загружен');