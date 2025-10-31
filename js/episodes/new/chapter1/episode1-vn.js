// js/episodes/new/chapter1/episode1-vn.js - Теперь это основной эпизод 1_1
window.episodes = window.episodes || {};
window.episodes['1_1'] = {
    id: "1",
    chapter: 1,
    title: "Неожиданная встреча",
    vnScenes: [
        // СЦЕНА 1: Падение на дороге
        {
            background: "assets/chapter1/backgrounds/country_road.png",
            characters: [
                {
                    name: "driver",
                    position: "center", 
                    expression: "worried",
                    visible: true
                }
            ],
            dialog: {
                speaker: "driver",
                text: "Вы в порядке, мистер? – водитель участливо наклонился надо мной, помогая подняться."
            }
        },
        
        // СЦЕНА 2: Непонимание где я
        {
            background: "assets/chapter1/backgrounds/country_road.png",
            characters: [],
            dialog: {
                speaker: "Я",
                text: "Да-да, все в порядке… - И тут я понял, что не понимаю, где нахожусь. – Что это за место?"
            }
        },
        
        // СЦЕНА 3: Появление Юпитера
        {
            background: "assets/chapter1/backgrounds/country_road.png", 
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
                text: "Пасое Плэйс, Калифорния. Вы знаете, как Вас зовут?"
            }
        },
        
        // СЦЕНА 4: Амнезия и паника
        {
            background: "assets/chapter1/backgrounds/country_road.png",
            characters: [],
            dialog: {
                speaker: "Я",
                text: "Я попытался вспомнить. С осознанием того, что я не помню не только своего имени, но и вообще ни одного факта о себе, я начинал приходить в ужас."
            }
        },
        
        // СЦЕНА 5: Представление детективов
        {
            background: "assets/chapter1/backgrounds/country_road.png",
            characters: [
                {
                    name: "jupiter",
                    position: "center",
                    expression: "excited", 
                    visible: true
                },
                {
                    name: "bob",
                    position: "left",
                    expression: "helpful",
                    visible: true
                },
                {
                    name: "pete",
                    position: "right",
                    expression: "surprised",
                    visible: true
                }
            ],
            dialog: {
                speaker: "jupiter",
                text: "Я – Юпитер Джонс, это мои друзья Боб и Пит. Ворвингтон – наш водитель. Мы детективы. – и он протянул мне визитную карточку с  нарисованными на ней тремя знаками вопросов."
            }
        },
        
        // СЦЕНА 6: Обнаружение своей профессии
        {
            background: "assets/chapter1/backgrounds/country_road.png",
            characters: [],
            dialog: {
                speaker: "Я",
                text: "Мне кажется, я тоже детектив, - почему-то мне и правда так казалось."
            }
        },
        
        // СЦЕНА 7: Диалог о попугае
        {
            background: "assets/chapter1/backgrounds/country_road.png",
            characters: [
                {
                    name: "pete",
                    position: "center",
                    expression: "surprised", 
                    visible: true
                }
            ],
            dialog: {
                speaker: "pete",
                text: "Неужели мистер Фентрисс нанял еще детектива, а мы его чуть не сбили?! Вы тоже расследуете дело попугая-заики?"
            }
        },
        
        // СЦЕНА 8: Ответ и вопрос о прогрессе
        {
            background: "assets/chapter1/backgrounds/country_road.png",
            characters: [],
            dialog: {
                speaker: "Я",
                text: "Да, получается, мы коллеги. Вам уже удалось что-то выяснить?"
            }
        },
        
        // СЦЕНА 9: Информация о попугае
        {
            background: "assets/chapter1/backgrounds/country_road.png",
            characters: [
                {
                    name: "jupiter",
                    position: "left",
                    expression: "thinking", 
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
                speaker: "jupiter",
                text: "Мы только начали, знаем, что пропавший попугай повторял «Быть или не быть». Знаменитый монолог Гамлета."
            }
        },
        
        // СЦЕНА 10: Блокнот Боба
        {
            background: "assets/chapter1/backgrounds/country_road.png",
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
                text: "Вообще-то мистер Фентрисс с гордостью уверял, что попугай знал гораздо больше, чем одну фразу, практически весь монолог, хоть и в не очень уверенном пересказе. Человек, который его обучил, был явным заикой. Я записал, если Вам интересно."
            }
        },
        
        // СЦЕНА 11: Текст монолога (ключевая сцена)
        {
            background: "assets/chapter1/backgrounds/notebook_closeup.png",
            characters: [],
            dialog: {
                speaker: "Я",
                text: "На целую страницу ровным подчерком был записан текст:\n\nБыть или не быть, вот в чем вопрос. Достойно ль\nСмиряться под ударами судьбы,\nИль надо ок-к-казать сопротивл-л-ленье\nИ в смертной схватке с целым морем бед-д-д\nПокончить с ними? Умереть. Заб-б-быться.\nИ знать, что этим обрываешь цепь\nСердечных мук и тысячи лишений,\nПрисущ-щих телу. Это ли не цель\nЖеланная? Скончаться. Сном забыться.\nУснуть… и видеть сны? Вот и ответ. Вот и ответ\n\nПробежав глазами по тексту, моя мысль за что-то зацепилась. Но вот что я увидел?"
            }
        }
    ],
    hasInput: true
};

console.log('✅ Эпизод 1_1 в формате ВН загружен (заменяет текстовую версию)');
console.log('📁 Пути к ассетам настроены для главы 1');