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

        bgMusic.addEventListener('play', () => {
            isMusicPlaying = true;
            localStorage.setItem('musicPlaying', 'true');
            updateMusicButton();
        });

        bgMusic.addEventListener('pause', () => {
            isMusicPlaying = false;
            localStorage.setItem('musicPlaying', 'false');
            updateMusicButton();
        });

        const musicTime = localStorage.getItem('musicTime');
        if (musicTime) {
            bgMusic.currentTime = parseFloat(musicTime);
        }

        const shouldPlayMusic = localStorage.getItem('musicPlaying') !== 'false';

        if (shouldPlayMusic) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                updateMusicButton();
                localStorage.setItem('musicPlaying', 'true');
            }).catch(() => {

                bgMusic.muted = true;
                bgMusic.play().then(() => {
                    isMusicPlaying = true;
                    updateMusicButton();
                    localStorage.setItem('musicPlaying', 'true');
                }).catch(err2 => console.log('Muted Autoplay Failed:', err2));
            });
        } else {
            isMusicPlaying = false;
            updateMusicButton();
        }

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
        bgMusic.muted = false;
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
        if (isMusicPlaying && !bgMusic?.paused) {
            button.textContent = 'Music ON';
            button.classList.add('playing');
            button.setAttribute('aria-label', 'Pause music');
        } else {
            button.textContent = 'Music OFF';
            button.classList.remove('playing');
            button.setAttribute('aria-label', 'Play music');
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

    // Avoid duplicating cards if builder is opened more than once.
    mainContainer.innerHTML = "";
    supportContainer.innerHTML = "";

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
        div.innerHTML = `<img src="${flower.image}" alt="${flower.name}"><p>
        ${flower.name}
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

function loadImageAsync(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
    });
}

function wrapCanvasText(ctx, text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    words.forEach(word => {
        const candidate = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(candidate).width <= maxWidth) {
            currentLine = candidate;
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

document.getElementById("generateBtn").addEventListener("click", () => {
    const message = document.getElementById("userMessage").value.trim();
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

document.getElementById("downloadBtn").addEventListener("click", async () => {
    if (!selectedMain || !selectedSupport) return;

    const message = document.getElementById("userMessage").value.trim();
    const fileName = `${selectedMain.toLowerCase()} and ${selectedSupport.toLowerCase()}.png`;
    const imagePath = `images/bouquet_images/${fileName}`;

    try {
        const sourceImage = await loadImageAsync(imagePath);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = 2400;
        const sidePadding = 180;
        const topPadding = 150;
        const bottomPadding = 150;
        const titleGap = 80;
        const maxImageHeight = 1300;
        const contentWidth = width - sidePadding * 2;

        let drawWidth = contentWidth;
        let drawHeight = drawWidth * (sourceImage.naturalHeight / sourceImage.naturalWidth);

        if (drawHeight > maxImageHeight) {
            drawHeight = maxImageHeight;
            drawWidth = drawHeight * (sourceImage.naturalWidth / sourceImage.naturalHeight);
        }

        const title = `${selectedMain} + ${selectedSupport}`;
        const messageFontSize = 56;
        const messageLineHeight = 78;
        const messageBoxPadding = 48;

        ctx.font = `${messageFontSize}px Poppins, sans-serif`;
        const wrappedMessage = message ? wrapCanvasText(ctx, `"${message}"`, contentWidth - messageBoxPadding * 2) : [];
        const messageBoxHeight = wrappedMessage.length
            ? wrappedMessage.length * messageLineHeight + messageBoxPadding * 2
            : 0;

        const messageGap = wrappedMessage.length ? 70 : 0;
        const titleHeight = 110;
        const canvasHeight = Math.ceil(
            topPadding + drawHeight + titleGap + titleHeight + messageGap + messageBoxHeight + bottomPadding
        );

        canvas.width = width;
        canvas.height = canvasHeight;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        const bgGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        bgGradient.addColorStop(0, "#fffaf4");
        bgGradient.addColorStop(1, "#fff3e7");
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, canvasHeight);

        const imageX = (width - drawWidth) / 2;
        const imageY = topPadding;
        ctx.drawImage(sourceImage, imageX, imageY, drawWidth, drawHeight);

        const titleY = imageY + drawHeight + titleGap;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#6f4433";
        ctx.font = "italic 92px 'Playfair Display', serif";
        ctx.fillText(title, width / 2, titleY);

        if (wrappedMessage.length) {
            const boxY = titleY + 70;
            const boxX = sidePadding;
            const boxWidth = contentWidth;

            drawRoundedRect(ctx, boxX, boxY, boxWidth, messageBoxHeight, 38);
            ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
            ctx.fill();

            ctx.lineWidth = 10;
            ctx.strokeStyle = "#e7b7a0";
            ctx.stroke();

            ctx.fillStyle = "#7e5d4e";
            ctx.font = `${messageFontSize}px Poppins, sans-serif`;
            ctx.textBaseline = "top";

            wrappedMessage.forEach((line, index) => {
                ctx.fillText(
                    line,
                    width / 2,
                    boxY + messageBoxPadding + index * messageLineHeight
                );
            });
        }

        const link = document.createElement("a");
        link.download = `${selectedMain}_${selectedSupport}_bouquet.png`;

        canvas.toBlob(blob => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        }, "image/png");
    } catch (error) {
        console.error("Download Failed:", error);
    }
});

document.addEventListener("DOMContentLoaded", function(){
    initMusic();
    updateMusicButton();
});

window.onload = () => {
    if (document.getElementById('builderSection').style.display !== 'none') {
        const elements = document.querySelectorAll('.flower-section, .message-section');
        
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';

            setTimeout(() => {
                el.style.transition = 'all 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
};





