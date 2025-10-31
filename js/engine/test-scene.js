// js/episodes/new/chapter1/episode2-vn.js - ВН-версия эпизода 2 на основе реального текста
window.episodes = window.episodes || {};
window.episodes['test_vn'] = {
    id: "2", 
    chapter: 1,
    title: "Новые загадки",
    vnScenes: [
        // СЦЕНА 1: Реакция на разгадку
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
                text: "Как же я сам не догадался! Это просто гениально! Это означает, что второй попугай был тоже украден не просто так!"
            }
        },
        
        // СЦЕНА 2: Вопрос о втором попугае
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
                speaker: "Я", 
                text: "Второй попугай?"
            }
        },
        
        // СЦЕНА 3: Объяснение Юпитера
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
                text: "Да, у мисс Ваггонер тоже пропал попугай, которого она недавно купила. Её попугай говорил непонятными стишками, но теперь я уверен, что это не просто детские стишки!"
            }
        },
        
        // СЦЕНА 4: Приглашение и поиск имени
        {
            background: "assets/chapter1/backgrounds/country_road.png",
            characters: [
                {
                    name: "jupiter",
                    position: "center", 
                    expression: "neutral",
                    visible: true
                }
            ],
            dialog: {
                speaker: "jupiter", 
                text: "Поехали с нами, мистер…"
            }
        },
        
        // СЦЕНА 5: Поиск документов
        {
            background: "assets/chapter1/backgrounds/country_road.png",
            characters: [],
            dialog: {
                speaker: "Я",
                text: "Я понятия не имел, как меня зовут. Поискав в карманах куртки какие-либо документы, я нашёл только визитную карточку зоомагазина \"Рыбка Немо\"."
            }
        },
        
        // СЦЕНА 6: Представление Немо
        {
            background: "assets/chapter1/backgrounds/country_road.png",
            characters: [
                {
                    name: "jupiter",
                    position: "center",
                    expression: "neutral",
                    visible: true
                }
            ],
            dialog: {
                speaker: "Я",
                text: "За неимением лучшего, я представился: - Немо."
            }
        },
        
        // СЦЕНА 7: Приглашение на обед
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
                    expression: "neutral",
                    visible: true
                },
                {
                    name: "pete",
                    position: "right",
                    expression: "neutral",
                    visible: true
                }
            ],
            dialog: {
                speaker: "jupiter",
                text: "Мистер Немо, поехали, с меня обед за происшествие, дядя и тетя будут рады гостям."
            }
        },
        
        // СЦЕНА 8: Согласие и дорога
        {
            background: "assets/chapter1/backgrounds/country_road.png",
            characters: [
                {
                    name: "driver",
                    position: "center",
                    expression: "neutral",
                    visible: true
                }
            ],
            dialog: {
                speaker: "Я",
                text: "Его друзья кивали головами в знак согласия. Впрочем, мне все равно было некуда идти, и я принял приглашение на обед с удовольствием. Тем более, я почувствовал, что проголодался."
            }
        },
        
        // СЦЕНА 9: Прибытие на склад
        {
            background: "assets/chapter1/backgrounds/junkyard.png",
            characters: [],
            dialog: {
                speaker: "Я",
                text: "Роллс-ройс не спеша вез нас по пыльной дороге. На улице было достаточно жарко, но в салоне машины приятная прохлада создавалась кондиционером. Я смотрел в окно на маленький городок, который жил неспешной жизнью. Минут через тридцать мы завернули в переулок и автомобиль притормозил."
            }
        },
        
        // СЦЕНА 10: Склад Джонс
        {
            background: "assets/chapter1/backgrounds/junkyard.png",
            characters: [],
            dialog: {
                speaker: "Я",
                text: "Над воротами висела вывеска «Склад утильсырья Джонс». Во дворе какой-то человек сидел в тени дерева и отдыхал."
            }
        },
        
        // СЦЕНА 11: Тетя Матильда
        {
            background: "assets/chapter1/backgrounds/junkyard.png",
            characters: [
                {
                    name: "aunt_mathilda",
                    position: "center",
                    expression: "calling",
                    visible: true
                }
            ],
            dialog: {
                speaker: "aunt_mathilda",
                text: "Юпитер! – громкий голос немолодой женщины донесся из дома, - Немедленно иди обедать с друзьями."
            }
        },
        
        // СЦЕНА 12: Представление Немо тете
        {
            background: "assets/chapter1/backgrounds/junkyard.png",
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
                text: "Уже бежим, тетя, и приготовь еще тарелку на нового гостя. Знакомься, это детектив Немо, и он тоже работает над делом о попугаях!"
            }
        },
        
        // СЦЕНА 13: Реакция тети
        {
            background: "assets/chapter1/backgrounds/junkyard.png",
            characters: [
                {
                    name: "aunt_mathilda",
                    position: "center",
                    expression: "surprised",
                    visible: true
                }
            ],
            dialog: {
                speaker: "aunt_mathilda",
                text: "Надо же. Теперь на поиски попугаев выделяют отряды."
            }
        },
        
        // СЦЕНА 14: Ответ Немо
        {
            background: "assets/chapter1/backgrounds/junkyard.png",
            characters: [],
            dialog: {
                speaker: "Я",
                text: "У заказчика свои причуды, мэм – ответил я."
            }
        },
        
        // СЦЕНА 15: Появление мисс Ваггонер
        {
            background: "assets/chapter1/backgrounds/junkyard.png",
            characters: [
                {
                    name: "miss_waggoner",
                    position: "center",
                    expression: "neutral",
                    visible: true
                }
            ],
            dialog: {
                speaker: "miss_waggoner",
                text: "Вы правда ищете попугая мистера Фентрисса? – из комнаты вышла еще одна женщина, помоложе. – Здравствуйте, я мисс Ваггонер."
            }
        },
        
        // СЦЕНА 16: Вопрос о стихах
        {
            background: "assets/chapter1/backgrounds/junkyard.png",
            characters: [
                {
                    name: "miss_waggoner",
                    position: "center",
                    expression: "neutral",
                    visible: true
                }
            ],
            dialog: {
                speaker: "Я",
                text: "Мне сказали, ваш попугай тоже говорил стихами?"
            }
        },
        
        // СЦЕНА 17: Стишок попугая
        {
            background: "assets/chapter1/backgrounds/junkyard.png",
            characters: [
                {
                    name: "miss_waggoner",
                    position: "center",
                    expression: "thinking",
                    visible: true
                }
            ],
            dialog: {
                speaker: "miss_waggoner",
                text: "Я бы не назвала это стихами, скорее считалочкой."
            }
        },
        
        // СЦЕНА 18: Текст считалочки (ключевая сцена)
        {
            background: "assets/chapter1/backgrounds/notebook_closeup.png",
            characters: [],
            dialog: {
                speaker: "miss_waggoner",
                text: "На широкой улице встретились три друга\nГде четвертая подруга?\nНоль поможет, трем подскажет,\nА четвертой ноль откажет.\nДолго я один играл, долго я один считал\nВосемь раз по двадцать семь\nЯ - один, ты – два, он - всем."
            }
        },
        
        // СЦЕНА 19: Осмысление загадки
        {
            background: "assets/chapter1/backgrounds/junkyard.png",
            characters: [],
            dialog: {
                speaker: "Я",
                text: "Действительно, стишок казался несуразицей, но точно им не был. Похоже, я и правда был детективом, потому что увидел в этих строчках подсказку."
            }
        }
    ],
    hasInput: true
};

console.log('✅ ВН-версия эпизода 2 загружена на основе реального текста');