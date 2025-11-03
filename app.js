let stats = {
    hunger: 70,
    happiness: 80,
    energy: 60,
    cleanliness: 90
};

let petName = "Мурчик";
let actionInProgress = false;
let actionTarget = null;
let actionSpeed = 0.5;

const cat = document.getElementById("cat");

function updateStats() {
    document.getElementById("hunger-fill").style.width = stats.hunger + "%";
    document.getElementById("happiness-fill").style.width = stats.happiness + "%";
    document.getElementById("energy-fill").style.width = stats.energy + "%";
    document.getElementById("cleanliness-fill").style.width = stats.cleanliness + "%";
}

function doAction(action) {
    actionInProgress = true;
    actionTarget = {
        feed: "hunger",
        play: "happiness",
        sleep: "energy",
        clear: "cleanliness"
    }[action];

    cat.src = `assets/cat/cat_${action}.png`;

    const sound = new Audio(`assets/sounds/cat_${action}.mp3`);
    sound.volume = 0.7;
    sound.play();

    let interval = setInterval(() => {
        stats[actionTarget] += actionSpeed;
        if (stats[actionTarget] >= 100) {
            stats[actionTarget] = 100;
            actionInProgress = false;
            cat.src = "assets/cat/cat_idle.png";
            clearInterval(interval);
        }
        updateStats();
    }, 50);
}

function editName() {
    let newName = prompt("Введите имя питомца:", petName);
    if (newName) petName = newName.substring(0,12);
    document.getElementById("pet-name").textContent = petName;
}

function restart() {
    for (let key in stats) stats[key] = 100;
    updateStats();
}

// Постепенное уменьшение статов
setInterval(() => {
    if(!actionInProgress) {
        stats.hunger = Math.max(stats.hunger - 0.03, 0);
        stats.happiness = Math.max(stats.happiness - 0.02, 0);
        stats.energy = Math.max(stats.energy - 0.015, 0);
        stats.cleanliness = Math.max(stats.cleanliness - 0.025, 0);
        updateStats();
    }
}, 1000);

updateStats();
