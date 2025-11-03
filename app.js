// === Переменные ===
const stats = {
    hunger: 70,
    happiness: 80,
    energy: 60,
    cleanliness: 90,
};

const decaySpeeds = {
    hunger: 0.03,
    happiness: 0.02,
    energy: 0.015,
    cleanliness: 0.025,
};

let actionInProgress = false;
let actionTarget = null;
let actionSpeed = 0.5;
let actionSound = null;

// === Элементы ===
const statBars = {
    hunger: document.querySelector("#hunger-stat .bar-fill"),
    happiness: document.querySelector("#happiness-stat .bar-fill"),
    energy: document.querySelector("#energy-stat .bar-fill"),
    cleanliness: document.querySelector("#cleanliness-stat .bar-fill"),
};

// === Звуки ===
const actionSounds = {
    feed: new Audio("assets/sounds/cat_feed.mp3"),
    play: new Audio("assets/sounds/cat_play.mp3"),
    sleep: new Audio("assets/sounds/cat_sleep.mp3"),
    clear: new Audio("assets/sounds/cat_clear.mp3"),
};

// === Обработчики кнопок ===
document.querySelectorAll("#buttons img").forEach(btn => {
    btn.addEventListener("click", () => {
        const action = btn.dataset.action; // укажи data-action="feed" и т.д.

        if (["feed","play","sleep","clear"].includes(action)) {
            actionInProgress = true;
            actionTarget = action === "feed" ? "hunger" :
                           action === "play" ? "happiness" :
                           action === "sleep" ? "energy" : "cleanliness";

            // стоп предыдущего звука
            if (actionSound) {
                actionSound.pause();
                actionSound.currentTime = 0;
            }

            actionSound = actionSounds[action];
            actionSound.loop = true;
            actionSound.play();
        } 
        else if (action === "restart") {
            for (let key in stats) stats[key] = 100;
        }
    });
});

// === Основной цикл обновления ===
function updateStats() {
    for (let key in stats) {
        // если действие идет по другому бару — уменьшаем остальные
        if (!actionInProgress || key !== actionTarget) {
            stats[key] -= decaySpeeds[key];
            if (stats[key] < 0) stats[key] = 0;
        }
    }

    // действие: заполнение бара
    if (actionInProgress && actionTarget) {
        stats[actionTarget] += actionSpeed;
        if (stats[actionTarget] >= 100) {
            stats[actionTarget] = 100;
            actionInProgress = false;
            actionTarget = null;

            if (actionSound) {
                actionSound.pause();
                actionSound.currentTime = 0;
                actionSound = null;
            }
        }
    }

    // обновление визуала
    for (let key in statBars) {
        statBars[key].style.setProperty("--fill", stats[key]);
    }

    requestAnimationFrame(updateStats);
}

// запуск
requestAnimationFrame(updateStats);
