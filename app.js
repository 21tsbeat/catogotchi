const cat = document.getElementById("cat");
const bgMusic = document.getElementById("bg-music");
const petNameEl = document.getElementById("pet-name");

// Статы
const stats = {
    hunger: 70,
    happiness: 80,
    energy: 60,
    cleanliness: 90
};

// Бары
const statBars = {
    hunger: document.getElementById("hunger-fill"),
    happiness: document.getElementById("happiness-fill"),
    energy: document.getElementById("energy-fill"),
    cleanliness: document.getElementById("cleanliness-fill")
};

// Звуки действий
const actionSounds = {
    feed: new Audio("assets/sounds/cat_feed.mp3"),
    play: new Audio("assets/sounds/cat_play.mp3"),
    sleep: new Audio("assets/sounds/cat_sleep.mp3"),
    clear: new Audio("assets/sounds/cat_clear.mp3")
};
let currentSound = null;

// Состояние кота
let currentAction = "idle";
let actionTarget = null;
let actionInProgress = false;
const actionSpeed = 0.5;

// Ввод имени
let editingName = false;

// Включение/выключение музыки
let musicPlaying = true;

// Функция действий
function doAction(action) {
    if (!["feed","play","sleep","clear"].includes(action)) return;

    currentAction = action;  
    cat.src = `assets/cat/cat_${action}.png`;
    actionTarget = action === "feed" ? "hunger" :
                   action === "play" ? "happiness" :
                   action === "sleep" ? "energy" : "cleanliness";
    actionInProgress = true;

    if (currentSound) {
        currentSound.pause();
        currentSound.currentTime = 0;
    }
    currentSound = actionSounds[action];
    currentSound.loop = true;
    currentSound.play();
}

// Редактирование имени
function editName() {
    editingName = true;
    const newName = prompt("Введите имя питомца:", petNameEl.textContent);
    if (newName) petNameEl.textContent = newName.toUpperCase();
    editingName = false;
}

// Включение/выключение музыки
function toggleMusic() {
    musicPlaying = !musicPlaying;
    if (musicPlaying) {
        bgMusic.play();
    } else {
        bgMusic.pause();
    }
}

// Сброс игры
function restart() {
    for (let key in stats) stats[key] = 100;
    updateBars();
    currentAction = "idle";
    cat.src = "assets/cat/cat_idle.png";
}

// Цикл обновления статов
function updateStats() {
    for (let key in stats) {
        if (!actionInProgress || key !== actionTarget) {
            stats[key] -= 0.02; // decay
            if (stats[key] < 0) stats[key] = 0;
        }
    }

    if (actionInProgress && actionTarget) {
        stats[actionTarget] += actionSpeed;
        if (stats[actionTarget] >= 100) {
            stats[actionTarget] = 100;
            actionInProgress = false;
            currentAction = "idle";
            cat.src = "assets/cat/cat_idle.png";
            if (currentSound) {
                currentSound.pause();
                currentSound.currentTime = 0;
                currentSound = null;
            }
        }
    }

    updateBars();
    requestAnimationFrame(updateStats);
}

// Обновление визуала баров
function updateBars() {
    for (let key in statBars) {
        statBars[key].style.setProperty("--fill", stats[key]);
    }
}

// Запуск цикла
requestAnimationFrame(updateStats);
