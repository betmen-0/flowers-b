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

function selectFlower(element,flowerName, type) {
    const container = type === "main"
    ? document.getElementById("mainFlowers")
    : document.getElementById("supportFlowers");

    container.querySelectorAll(".flower-option").forEach(opt => 
        opt.classList.remove("selected")
    );
    element.classList.add("selected");

    if (type === "main") selectedMain = flowerName;
    else selectedSupport = flowerName;
}

document.getElementById("generateBtn").addEventListener("click", () => {
    const message = document.getElementById("userMessage").ariaValueMax.trim();
    const preview = document.getElementById("bouquetPreview");

    if (!selectedMain || !selectedSupport) {
        preview.innerHTML = `
        <div class="bouquet-card">
        <p style="color: #e74c3c;font-weight: 600;">Please Select both main & support flowers 🌸</p>
        </div>`;
        return;
    }


//TODO : Maybe if i add more bouquet combination later
    const fileName = `${selectedMain.toLowerCase()} and ${selectedSupport.toLowerCase()}.png`;
    const imagePath = `images/bouquet_images/${fileName}`;

preview.innerHTML = `
<div class="bouquet-card" id="bouquetCard">
  <img src="${imagePath}" alt="Bouquet">
  <h3>${selectedMain} + ${selectedSupport}</h3>
  ${message ? `<div class="message">"${message}"</div>` : ""}
</div>`;

document.getElementById("downloadBtn").style.display = "block";
});

document.getElementById("downloadBtn").addEventListener("click", () => {
    const bouquetCard = document.getElementById(".bouquet-card");
    if (!bouquetCard) return;

    const downloadContainer = document.createElement("div");
    downloadContainer.style.cssText = `
    background: #fff;
    padding:40px;
    display:inline-block;
    font-family: 'Poppins', sans-serif;
    `;


    const clonedCard = bouquetCard.cloneNode(true);

    // Clean up for the styling download

    function cleanElement(el) {
        if(el.tagName !== 'IMG'){
            el.style.background = "#fff"
        }
        el.style.backdropFilter = "none";
        el.style.filter = "none";
        el.style.opacity = "1";
        el.style.boxShadow = "none";
        el.style.border = "none";
        el.style.textShadow = "none";

        if (el.children.length > 0) {
            Array.from(el.children).forEach(child => cleanElement(child));
        }
    }

    cleanElement(clonedCard);
    downloadContainer.appendChild(clonedCard);

    document.body.appendChild(downloadContainer);
    downloadContainer.style.position = "absolute";
    downloadContainer.style.left = "-9999px";

    const scaleFactor = window.devicePixelRatio * 3;

}); 



