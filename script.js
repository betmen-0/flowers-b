const mainFlowers = [
    {name:"Roses", image:"images/Roses.png"},
    {name: "Lilies", image:"images/lilies.png"},
    {name: "Poppies", image:"images/poppies.png"},
    {name: "Tulips", image:"images/tulips.png"},
    {name: "Sunflowers", image:"images/sunflowers.png"}
];

const supportFlowers = [
    {name:"Clovers", image:"images/clovers.png"},
    {name:"Daisies", image:"images/daisies.png"},
    {name:"Primroses", image:"images/primroses.png"},
    {name:"violets", image:"images/violets.png"}
];


let bgMusic;
let isMusicPlaying = false;

function initMusic() {
    if (!bgMusic) {
        bgMusic = document.getElementById('bgMusic');
        bgMusic.volume = 0.5;

        const musicTime = localStorage.getItem('musicTime');
        if (musicTime) {
            bgMusic.currentTime = parseFloat(musicTime);
        }

        bgMusic.play().then(() => {
            isMusicPlaying = true;
            updateMusicButton();
            localStorage.setItem('musicPlaying', 'true');
        }).catch(err => {

            bgMusic.muted = true;
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                updateMusicButton();
                localStorage.setItem('musicPlaying', 'true');
            }).catch(err2 => console.log('Muted Autoplay Failed:', err2));
        });

        document.addEventListener('click', () => {
            if(bgMusic.muted) bgMusic.muted = false;
    }, { once: true });

    setInterval(() => {
        if (isMusicPlaying) {
            localStorage.setItem('musicTime', bgMusic.currentTime);
        }
    }, 1000);
}
}

function toggleMusic() {
    if (!bgMusic) return;

    if (bgMusic.paused) {
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            localStorage.setItem('musicPlaying', 'true');
            updateMusicButton();
        }).catch(err => console.log('Play Failed:', err));
    } else {
        bgMusic.pause();
        isMusicPlaying = false;
        localStorage.setItem('musicPlaying', 'false');
        updateMusicButton();
    }
}

function updateMusicButton() {
    const button = document.getElementById('musicToggle');
    if (button) {
        if (isMusicPlaying) {
            button.textContent = 'Music OFF';
            button.classList.add('playing');
        }
    }
}


let selectedMain = "";
let selectedSupport = "";

function showBuilder() {
    document.querySelector('.landing').style.display= 'none';
    document.getElementById('builderSection').style.display = 'block';
    loadFlowers();
}

function loadFlowers() {
    const mainContainer = document.getElementById("mainFlowers");
    const supportContainer = document.getElementById("supportFlowers");

    mainFlowers.forEach(flower => {
        const div = document.createElement("div");
        div.classList.add("flower-option");
        div.innerHTML = `<img src="${flower.image}" alt="${flower.name}"><p>
        ${flower.name}
        </p>`;
        div.addEventListener("click", () => selectFlower(div,flower.name, "main"));
        mainContainer.appendChild(div);
    });

    supportFlowers.forEach(flower => {
        const div = document.createElement("div");
        div.classList.add("flower-option");
        div.innerHTML = `<img src = "${flower.image}" alt= "${flower.name}"<p>
        {flower.name}
        </p>`;

        div.addEventListener("click",() => selectFlower(div, flower.name, "support"));
        supportContainer.appendChild(div);
    });
}

