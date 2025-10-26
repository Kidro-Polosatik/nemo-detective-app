// js/engine/test-scene.js
window.testScene = {
    background: "https://placehold.co/800x600/1a2b4a/ffffff?text=Фон+Дороги",
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
        text: "Привет! Я Юпитер Джонс. Это тест визуальной новеллы! Нажми ниже чтобы продолжить."
    }
};

console.log('✅ Тестовая сцена загружена');