// js/data/characters.js
window.vnCharacters = {
    jupiter: {
        name: "Юпитер Джонс",
        description: "stocky overweight short teenage boy, dark hair, detective, leader, intelligent eyes, 14 years old, visual novel style",
        colors: { primary: "#4a6fa5", secondary: "#ffd700" },
        expressions: {
            neutral: "neutral expression, confident posture",
            excited: "excited expression, eyes wide", 
            thinking: "thinking pose, hand on chin"
        }
    },
    driver: {
        name: "Ворвингтон", 
        description: "middle-aged driver, simple clothes, working class, concerned expression, 40 years old, portrait",
        colors: { primary: "#8b4513", secondary: "#654321" },
        expressions: {
            neutral: "neutral face, tired eyes",
            worried: "concerned expression, furrowed brow"
        }
    },
    bob: {
        name: "Боб",
        description: "shortest teenage boy, blonde hair, bright blue eyes, glasses, tanned skin, slim build, not muscular, studious look, notebook, 14 years old",
        colors: { primary: "#27ae60", secondary: "#2ecc71" },
        expressions: {
            neutral: "neutral expression through glasses",
            helpful: "helpful smile, adjusting glasses"
        }
    },
    pete: {
        name: "Пит",
        description: "tall athletic teenage boy, reddish-brown hair, bright green eyes, tanned surfer skin, muscular build, strongest of group, energetic posture, 14 years old", 
        colors: { primary: "#e74c3c", secondary: "#c0392b" },
        expressions: {
            neutral: "neutral expression, athletic stance",
            surprised: "surprised look, wide green eyes"
        }
    }
};

console.log('✅ Данные персонажей загружены');