/* --- Clock --- */
const hour = document.querySelectorAll('.digitH');
const minute = document.querySelectorAll('.digitM');

function setHour(hourValue) {
    const digits = hourValue.toString().padStart(2, '0');
    hour.forEach((el, i) => el.textContent = digits[i]);
}
function setMinute(minValue) {
    const digits = minValue.toString().padStart(2, '0');
    minute.forEach((el, i) => el.textContent = digits[i]);
}
function updateClock() {
    const now = new Date();
    setHour(now.getHours());
    setMinute(now.getMinutes());
}
updateClock();
setInterval(updateClock, 1000);

/* --- Lamp --- */
document.getElementById('lampbase').addEventListener('click', () => {
    document.getElementById('lamp').classList.toggle('off');
});

/* --- Window Drag + Focus --- */
const windows = document.querySelectorAll('.window1, .window2, .window3, .window4, .window5');
let highestZ = 10;
let activeWindow = null;

windows.forEach(windowEl => {
    const titleBars = windowEl.querySelectorAll('.title-bar1, .title-bar2, .title-bar3, .title-bar4, .title-bar5');
    let isDragging = false;
    let offsetX, offsetY;

    windowEl.addEventListener('mousedown', () => {
        highestZ++;
        windowEl.style.zIndex = highestZ;
        activeWindow = windowEl;
    });

    titleBars.forEach(titleBar => {
        titleBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            highestZ++;
            windowEl.style.zIndex = highestZ;
            offsetX = e.clientX - windowEl.offsetLeft;
            offsetY = e.clientY - windowEl.offsetTop;
            windowEl.classList.add('dragging');
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;

        const screen = document.querySelector('.screen');
        if (screen) {
            const maxX = screen.clientWidth - windowEl.offsetWidth;
            const maxY = screen.clientHeight - windowEl.offsetHeight;
            x = Math.max(0, Math.min(x, maxX));
            y = Math.max(0, Math.min(y, maxY));
        }

        windowEl.style.left = x + 'px';
        windowEl.style.top = y + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        windowEl.classList.remove('dragging');
    });
});

/* Mouse movement */
const screen = document.querySelector('.screen');
const mouse = document.querySelector('.mouse');
const mousepad = document.querySelector('.mousepad');

const startX = mouse.offsetLeft;
const startY = mouse.offsetTop;

screen.addEventListener('mousemove', (e) => {
    const rect = screen.getBoundingClientRect();

    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    const moveRange = 70;

    const offsetX = (relX) * moveRange;
    const offsetY = (relY) * moveRange;

    mouse.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
});

screen.addEventListener('mouseleave', () => {
    mouse.style.transition = 'transform 0.3s ease';
    mouse.style.transform = 'translate(0, 0)';
    mouse.style.transform = 'rotate(-10deg)';
    setTimeout(() => (mouse.style.transition = ''), 300);
});

/* --- CMD Window --- */
const CMDWindow = document.querySelector('.window1');
const CMDIcon = document.getElementById('cmdIcon');
const closeCMD = document.querySelector('.close1');
const minimizeCMD = document.querySelector('.minus1');

CMDIcon.style.backgroundColor = '#ccc';
CMDWindow.style.opacity = 1;
CMDWindow.style.pointerEvents = 'auto';

function toggleCMD() {
    const isOpen = CMDWindow.style.opacity === '1';

    if (!isOpen) {
        CMDWindow.style.opacity = 1;
        CMDWindow.style.pointerEvents = 'auto';
        CMDIcon.classList.add('current-window');
        CMDIcon.style.backgroundColor = '#ccc';
    } else {
        CMDWindow.style.opacity = 0;
        CMDWindow.style.pointerEvents = 'none';
        CMDIcon.classList.remove('current-window');
        CMDIcon.style.backgroundColor = '#757575b4';
    }
}

CMDIcon.addEventListener('click', toggleCMD);
minimizeCMD.addEventListener('click', toggleCMD);
closeCMD.addEventListener('click', () => {
    CMDWindow.style.opacity = 0;
    CMDWindow.style.pointerEvents = 'none';
    CMDIcon.classList.remove('current-window');
    CMDIcon.style.backgroundColor = 'transparent';
});

/* CMD input */
const textHere = document.getElementById('text-here');
const cursor = document.getElementById('cursor');
let input = '';

document.querySelector('.typeable').addEventListener('click', () => {
    cursor.style.animation = 'blink 1s steps(2, start) infinite';
    textHere.focus();
});

document.addEventListener('keydown', e => {
    if (!document.activeElement.isSameNode(textHere) && !document.activeElement.isSameNode(cursor)) return;

    if (e.key === 'Backspace') {
        e.preventDefault();
        input = input.slice(0, -1);
    } else if (e.key.length === 1) {
        input += e.key;
    } else if (e.key === 'Enter') {
        e.preventDefault();
        console.log('User typed:', input);
        input = '';
    }

    textHere.textContent = input;
});

// On-screen keyboard typing
let typedText = '';

document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', () => {
        const char = key.textContent.trim();
        if (char === 'Enter') {
            typedText += '\n> ';
        } else if (char === '⬅') {
            typedText = typedText.slice(0, -1);
        } else if (char === 'Space') {
            typedText += ' ';
        } else if (
            ['Ctrl', 'Alt', 'Fn', '⇧', '⊞', '☰', '⇄', '⬇'].includes(char)
        ) {
            return;
        } else {
            typedText += char;
        }

        textHere.textContent = typedText;
    });
});

/* --- Paint Window --- */
const paintWindow = document.querySelector('.window2');
const paintIcon = document.getElementById('paintIcon');
const closePaint = document.querySelector('.close2');
const minimizePaint = document.querySelector('.minus2');
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const clearCanvas = document.getElementById('clearCanvas');
const tools = document.querySelectorAll('.tool');

paintIcon.style.backgroundColor = 'transparent';
paintWindow.style.opacity = 0;

let drawing = false;
let currentTool = 'brush';
let color = '#000';

/* Drawing functionality */
canvas.addEventListener('mousedown', e => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseout', () => drawing = false);
canvas.addEventListener('mousemove', e => {
    if (!drawing) return;
    if (currentTool === 'brush') {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (currentTool === 'eraser') {
        ctx.clearRect(e.offsetX - 4, e.offsetY - 4, 8, 8);
    }
});

colorPicker.addEventListener('input', e => color = e.target.value);

tools.forEach(tool => {
    tool.addEventListener('click', () => {
        tools.forEach(t => t.classList.remove('selected'));
        tool.classList.add('selected');
        currentTool = tool.dataset.tool;
    });
});

clearCanvas.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function togglePaint() {
    const isOpen = paintWindow.style.opacity === '1';
    if (!isOpen) {
        paintWindow.style.opacity = 1;
        paintWindow.style.pointerEvents = 'auto';
        paintIcon.classList.add('current-window');
        paintIcon.style.backgroundColor = '#ccc';
        highestZ++;
        paintWindow.style.zIndex = highestZ;
    } else {
        paintWindow.style.opacity = 0;
        paintWindow.style.pointerEvents = 'none';
        paintIcon.classList.remove('current-window');
        paintIcon.style.backgroundColor = '#757575b4';
    }
}

function closePaintfunc() {
    paintWindow.style.opacity = 0;
    paintWindow.style.pointerEvents = 'none';
    paintIcon.classList.remove('current-window');
    paintIcon.style.backgroundColor = 'transparent';
}

paintIcon.addEventListener('click', togglePaint);
minimizePaint.addEventListener('click', togglePaint);
closePaint.addEventListener('click', closePaintfunc);

/* --- Music Window --- */
const musicWindow = document.querySelector('.window3');
const musicIcon = document.getElementById('musicIcon');
const closeMusic = document.querySelector('.close3');
const minimizeMusic = document.querySelector('.minus3');

const playPauseBtn = document.getElementById('playPauseBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');

let isPlaying = false;

/* Playlist */
const playlist = [
    {
        title: "Lofi_Chill_Beats",
        artist: "DJ Zen",
        src: "../mediafiles/music0C.mp3",
        art: "../img/music_cover_art/cover0.jpg"
    },
    {
        title: "Sour_Times",
        artist: "Portishead",
        src: "../mediafiles/music1C.mp3",
        art: "../img/music_cover_art/cover2.jpg"
    },
    {
        title: "Glory_Box",
        artist: "Portishead",
        src: "../mediafiles/music2C.mp3",
        art: "../img/music_cover_art/cover2.jpg"
    },
    {
        title: "Only_You",
        artist: "Zámbó Jimmy",
        src: "../mediafiles/music3C.mp3",
        art: "../img/music_cover_art/cover3.jpg"
    },
    {
        title: "Bone_Church",
        artist: "Slipknot",
        src: "../mediafiles/music4C.mp3",
        art: "../img/music_cover_art/cover4.jpg"
    },
    {
        title: "Wicked_Game",
        artist: "Chris Isaak",
        src: "../mediafiles/music5C.mp3",
        art: "../img/music_cover_art/cover5.jpg"
    },
    {
        title: "Zick_Zack",
        artist: "Rammstein",
        src: "../mediafiles/music6C.mp3",
        art: "../img/music_cover_art/cover6.jpg"
    }
];
let currentTrack = 0;

const musicPlayer = new Audio();
musicPlayer.src = playlist[currentTrack].src;

function updateSongInfo() {
    document.getElementById('songTitle').textContent = playlist[currentTrack].title;
    document.getElementById('songArtist').textContent = playlist[currentTrack].artist;

    const albumArt = document.querySelector('.album-art img');
    if (albumArt) albumArt.src = playlist[currentTrack].art;
}
updateSongInfo();

function toggleMusic() {
    const isOpen = musicWindow.style.opacity === '1';
    if (!isOpen) {
        musicWindow.style.opacity = 1;
        musicWindow.style.pointerEvents = 'auto';
        musicIcon.style.backgroundColor = '#ccc';
        musicIcon.classList.add('current-window');
        highestZ++;
        musicWindow.style.zIndex = highestZ;
    } else {
        musicWindow.style.opacity = 0;
        musicWindow.style.pointerEvents = 'none';
        musicIcon.style.backgroundColor = '#757575b4';
        musicIcon.classList.remove('current-window');
    }
}

function closeMusicFunc() {
    musicWindow.style.opacity = 0;
    musicWindow.style.pointerEvents = 'none';
    musicIcon.style.backgroundColor = 'transparent';
    musicIcon.classList.remove('current-window');
    musicPlayer.pause();
    isPlaying = false;
    playPauseBtn.textContent = '▶';
}

musicIcon.addEventListener('click', toggleMusic);
minimizeMusic.addEventListener('click', toggleMusic);
closeMusic.addEventListener('click', closeMusicFunc);

/* --- Player controls --- */
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        musicPlayer.pause();
        playPauseBtn.textContent = '▶';
    } else {
        musicPlayer.play();
        playPauseBtn.textContent = '⏸';
    }
    isPlaying = !isPlaying;
});

nextBtn.addEventListener('click', () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    musicPlayer.src = playlist[currentTrack].src;
    updateSongInfo();
    if (isPlaying) musicPlayer.play();
});

musicPlayer.addEventListener('timeupdate', () => {
    progressBar.value = (musicPlayer.currentTime / musicPlayer.duration) * 100 || 0;
});

progressBar.addEventListener('input', () => {
    musicPlayer.currentTime = (progressBar.value / 100) * musicPlayer.duration;
});

function updateProgressFill() {
    const value = progressBar.value;
    progressBar.style.setProperty('--progress', value + '%');
}
progressBar.addEventListener('input', updateProgressFill);

// --- Volume Control ---
const volumeSlider = document.querySelector('.volume-window input[type="range"]');
const settingsVolume = document.getElementById('volume');

if (volumeSlider) {
    musicPlayer.volume = volumeSlider.value / 100;

    volumeSlider.addEventListener('input', () => {
        musicPlayer.volume = volumeSlider.value / 100;
        if (settingsVolume) settingsVolume.value = volumeSlider.value;
    });
}

if (settingsVolume) {
    settingsVolume.addEventListener('input', () => {
        musicPlayer.volume = settingsVolume.value / 100;
        if (volumeSlider) volumeSlider.value = settingsVolume.value;
    });
}

// --- Speakers ---
const speakers = document.querySelectorAll('.speaker');

function updateSpeakerVisual(isPlaying) {
    speakers.forEach(sp => {
        if (isPlaying) sp.classList.add('playing');
        else sp.classList.remove('playing');
    });
}

musicPlayer.addEventListener('play', () => updateSpeakerVisual(true));
musicPlayer.addEventListener('pause', () => updateSpeakerVisual(false));

// --- Music Notes ---
let noteInterval = null;

function createMusicNote() {
    const note = document.createElement('div');
    note.className = 'music-note';
    note.textContent = ['♩','♪','♫','♬'][Math.floor(Math.random() * 4)];

    // random speaker
    const speakers = document.querySelectorAll('.speaker');
    const speaker = speakers[Math.floor(Math.random() * speakers.length)];
    if (!speaker) return;

    // get viewport rect
    const rect = speaker.getBoundingClientRect();
    const centerX = rect.left + (rect.width / 2);
    const startX = centerX + (Math.random() * 40 - 20); // +/- 20px wiggle
    const startY = rect.top + window.scrollY - 8;top

    note.style.left = `${startX + window.scrollX}px`;
    note.style.top = `${startY}px`;

    // randomize appearance & timing
    const size = 12 + Math.random() * 16;
    note.style.fontSize = `${size}px`;
    const dur = 1.6 + Math.random() * 1.6;
    note.style.animationDuration = `${dur}s`;
    const drift = (Math.random() * 40) - 20;
    note.style.setProperty('--drift', `${drift}px`);
    document.body.appendChild(note);

    setTimeout(() => {
        note.remove();
    }, (dur * 1000) + 250);
}


musicPlayer.addEventListener('play', () => {
    clearInterval(noteInterval);
    noteInterval = setInterval(createMusicNote, 700);
});

musicPlayer.addEventListener('pause', () => {
    clearInterval(noteInterval);
    noteInterval = null;
});

musicPlayer.addEventListener('ended', () => {
    clearInterval(noteInterval);
    noteInterval = null;
});

/* FILE MANAGER */
const fileManagerWindow = document.querySelector('.window4');
const fileManagerIcon = document.getElementById('filesIcon');
const closeFileManager = document.querySelector('.close4');
const minimizeFileManager = document.querySelector('.minus4');
const fileSidebarItems = fileManagerWindow.querySelectorAll('.sidebar li');
const fileGrid = fileManagerWindow.querySelector('.file-grid');
const pathbar = fileManagerWindow.querySelector('.pathbar');

const fileSystem = {
    "Desktop": [
        { name: "My Computer", type: "folder" },
        { name: "Recycle Bin", type: "folder" },
        { name: "todo.txt", type: "file" }
    ],
    "Documents": [
        { name: "Projects", type: "folder" },
        { name: "Homework.docx", type: "file" },
        { name: "Budget.xlsx", type: "file" }
    ],
    "Music": [
        { name: "Lofi_Beats.mp3", type: "file" },
        { name: "Soundtrack.flac", type: "file" }
    ],
    "Videos": [
        { name: "clip1.mp4", type: "file" },
        { name: "movie_trailer.mov", type: "file" }
    ],
    "Pictures": [
        { name: "Wallpaper.png", type: "file" },
        { name: "Vacation", type: "folder" },
        { name: "portrait.jpg", type: "file" }
    ],
    "Downloads": [
        { name: "installer.exe", type: "file" },
        { name: "zip_archive.zip", type: "file" }
    ],
    "Local Disk (C:)": [
        { name: "Program Files", type: "folder" },
        { name: "Windows", type: "folder" },
        { name: "Users", type: "folder" }
    ],
    "Data (D:)": [
        { name: "Games", type: "folder" },
        { name: "Music Archive", type: "folder" },
        { name: "Backups", type: "folder" }
    ]
};
let currentPath = "Desktop";

function renderFiles(folder) {
    const files = fileSystem[folder] || [];
    fileGrid.innerHTML = "";

    files.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("file");
        const iconSrc = item.type === "folder"
            ? "https://cdn-icons-png.flaticon.com/512/716/716784.png"
            : "https://cdn-icons-png.flaticon.com/512/716/716735.png";

        div.innerHTML = `<img src="${iconSrc}" alt="${item.type}"><span>${item.name}</span>`;
        fileGrid.appendChild(div);
    });

    pathbar.value = `C:\\Users\\You\\${folder}`;
    currentPath = folder;
}

fileSidebarItems.forEach(li => {
    li.addEventListener("click", () => {
        const folderName = li.textContent.replace(/^[^a-zA-Z0-9]+/, "");
        renderFiles(folderName);
    });
});

fileGrid.addEventListener("click", e => {
    const target = e.target.closest(".file");
    if (!target) return;
    const name = target.querySelector("span").textContent;
    const file = (fileSystem[currentPath] || []).find(f => f.name === name);

    if (file && file.type === "folder") {
        if (fileSystem[name]) {
            renderFiles(name);
        } else {
            alert(`"${name}" is empty.`);
        }
    } else {
        alert(`Opening "${name}"...`);
    }
});

renderFiles(currentPath);
function toggleFileManager() {
    const isOpen = fileManagerWindow.style.opacity === '1';
    if (!isOpen) {
        fileManagerWindow.style.opacity = 1;
        fileManagerWindow.style.pointerEvents = 'auto';
        fileManagerIcon.style.backgroundColor = '#ccc';
        fileManagerIcon.classList.add('current-window');
        highestZ++;
        fileManagerWindow.style.zIndex = highestZ;
    } else {
        fileManagerWindow.style.opacity = 0;
        fileManagerWindow.style.pointerEvents = 'none';
        fileManagerIcon.style.backgroundColor = '#757575b4';
        fileManagerIcon.classList.remove('current-window');
    }
}

function closeFileFunc() {
    fileManagerWindow.style.opacity = 0;
    fileManagerWindow.style.pointerEvents = 'none';
    fileManagerIcon.style.backgroundColor = 'transparent';
    fileManagerIcon.classList.remove('current-window');
}

fileManagerIcon.addEventListener('click', toggleFileManager);
minimizeFileManager.addEventListener('click', toggleFileManager);
closeFileManager.addEventListener('click', closeFileFunc);

/* Settings */
const settingsWindow = document.querySelector('.window5');
const settingsIcon = document.getElementById('optionsIcon');
const closeSettings = document.querySelector('.close5');
const minimizeSettings = document.querySelector('.minus5');

renderFiles(currentPath);
function toggleSettings() {
    const isOpen = settingsWindow.style.opacity === '1';
    if (!isOpen) {
        settingsWindow.style.opacity = 1;
        settingsWindow.style.pointerEvents = 'auto';
        settingsIcon.style.backgroundColor = '#ccc';
        settingsIcon.classList.add('current-window');
        highestZ++;
        settingsWindow.style.zIndex = highestZ;
    } else {
        settingsWindow.style.opacity = 0;
        settingsWindow.style.pointerEvents = 'none';
        settingsIcon.style.backgroundColor = '#757575b4';
        settingsIcon.classList.remove('current-window');
    }
}

function closeSettingsFunc() {
    settingsWindow.style.opacity = 0;
    settingsWindow.style.pointerEvents = 'none';
    settingsIcon.style.backgroundColor = 'transparent';
    settingsIcon.classList.remove('current-window');
}

settingsIcon.addEventListener('click', toggleSettings);
minimizeSettings.addEventListener('click', toggleSettings);
closeSettings.addEventListener('click', closeSettingsFunc);

/* Windows window */
const windowsWindow = document.querySelector('.windows-window');
const winLogo = document.getElementById('win-logo');

windowsWindow.style.opacity = '0';
windowsWindow.style.pointerEvents = 'none';

function toggleWindowsMenu() {
    const isOpen = windowsWindow.style.opacity === '1';

    closeVolumeFunc();
    closeInternetFunc();
    closeMusicFunc();
    closeSearch();

    if (!isOpen) {
        windowsWindow.style.opacity = '1';
        windowsWindow.style.pointerEvents = 'auto';
        highestZ++;
        windowsWindow.style.zIndex = highestZ;
    } else {
        closeWindowsMenu();
    }
}

windowsWindow.addEventListener('click', (e) => {
    const action = e.target.getAttribute('data-action');
    if (!action) return;

    switch(action) {
        case 'sleep':
            enterSleepMode(); 
            break;
        case 'shutdown':
            shutdown(); 
            break;
        case 'restart':
            restart(); 
            break;
    }

    closeWindowsMenu();
});

function closeWindowsMenu() {
    windowsWindow.style.opacity = '0';
    windowsWindow.style.pointerEvents = 'none';
}

winLogo.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleWindowsMenu();
});

screen.addEventListener('click', (e) => {
    if (!windowsWindow.contains(e.target) && !winLogo.contains(e.target)) {
        closeWindowsMenu();
    }
});

const sleepScreen = document.querySelector('.sleep-screen');
const powerButton = document.querySelector('.power-button');
let isSleeping = false;
let isOff = false;

// --- Enter sleep ---
function enterSleepMode() {
    sleepScreen.classList.add('active');
    isSleeping = true;
    isOff = false;
    musicPlayer.pause();
    clearInterval(noteInterval);
    document.activeElement.blur();
}

// --- Shutdown ---
function shutdown() {
    sleepScreen.classList.add('active');
    sleepScreen.style.backgroundColor = '#000';
    sleepScreen.innerHTML = '<p style="color:gray;text-align:center;margin-top:40%;">PC is Off</p>';
    isOff = true;
    isSleeping = false;
    musicPlayer.pause();
    clearInterval(noteInterval);
}

// --- Restart ---
function restart() {
    sleepScreen.classList.add('active');
    sleepScreen.innerHTML = '<p style="color:gray;text-align:center;margin-top:40%;">Restarting...</p>';
    musicPlayer.pause();
    clearInterval(noteInterval);

    setTimeout(() => {
        sleepScreen.innerHTML = '';
        sleepScreen.classList.remove('active');
        isSleeping = false;
        isOff = false;
    }, 2000);
}

// --- Wake up from sleep ---
function wakeUp() {
    if (!isSleeping || isOff) return;
    sleepScreen.classList.remove('active');
    sleepScreen.innerHTML = '';
    isSleeping = false;
}

document.addEventListener('keydown', wakeUp);
document.addEventListener('mousedown', wakeUp);
powerButton.addEventListener('click', () => {
    if (isOff) {
        sleepScreen.classList.remove('active');
        sleepScreen.innerHTML = '';
        sleepScreen.style.backgroundColor = '';
        isOff = false;
    } else if (isSleeping) {
        wakeUp();
    }
});

/* --- Search Window --- */
const searchWindow = document.querySelector('.search-window');
const searchIcon = document.getElementById('searchIcon');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchWindow.style.opacity = '0';
searchWindow.style.pointerEvents = 'none';

const trayApps = [
    {id: 'optionsIcon', name: 'Settings'},
    {id: 'filesIcon', name: 'File Manager'},
    {id: 'paintIcon', name: 'Paint'},
    {id: 'cmdIcon', name: 'Command Prompt'},
    {id: 'musicIcon', name: 'Music'},
    {id: 'internetIcon', name: 'Internet'},
    {id: 'volumeIcon', name: 'Volume'}
];

// --- Toggle Search ---
function toggleSearch() {
    const isOpen = searchWindow.style.opacity === '1';
    closeVolumeFunc();
    closeInternetFunc();
    closeMusicFunc();

    if (!isOpen) {
        searchWindow.style.opacity = '1';
        searchWindow.style.pointerEvents = 'auto';
        highestZ++;
        searchWindow.style.zIndex = highestZ;
        searchInput.focus();
    } else {
        closeSearch();
    }
}

// --- Close Search ---
function closeSearch() {
    searchWindow.style.opacity = '0';
    searchWindow.style.pointerEvents = 'none';
    searchInput.value = '';
    searchResults.innerHTML = '';
}

searchIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSearch();
});

screen.addEventListener('click', (e) => {
    if (!searchWindow.contains(e.target) && !searchIcon.contains(e.target)) {
        closeSearch();
    }
});

// --- Live search ---
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const matches = trayApps.filter(app => app.name.toLowerCase().includes(query));
    searchResults.innerHTML = matches
        .map(app => `<div data-id="${app.id}">${app.name}</div>`)
        .join('');
});

// --- Click result to open app ---
searchResults.addEventListener('click', (e) => {
    const targetId = e.target.getAttribute('data-id');
    if (!targetId) return;
    const appIcon = document.getElementById(targetId);
    if (appIcon) appIcon.click(); // simulate tray click
    closeSearch();
});


/* Volume */
const volumeWindow = document.querySelector('.volume-window');
const volumeIcon = document.getElementById('volumeIcon');

/* Internet */
const internetWindow = document.querySelector('.internet-window');
const internetIcon = document.getElementById('internetIcon');

volumeWindow.style.opacity = '0';
volumeWindow.style.pointerEvents = 'none';
volumeIcon.style.backgroundColor = 'transparent';
volumeIcon.classList.remove('current-window');

internetWindow.style.opacity = '0';
internetWindow.style.pointerEvents = 'none';
internetIcon.style.backgroundColor = 'transparent';
internetIcon.classList.remove('current-window');

function toggleVolume() {
    const isOpen = volumeWindow.style.opacity === '1';
    closeInternetFunc();
    if (!isOpen) {
        volumeWindow.style.opacity = '1';
        volumeWindow.style.pointerEvents = 'auto';
        volumeIcon.style.backgroundColor = '#ccc';
        volumeIcon.classList.add('current-window');
        highestZ++;
        volumeWindow.style.zIndex = highestZ;
    } else {
        closeVolumeFunc();
    }
}

function closeVolumeFunc() {
    volumeWindow.style.opacity = '0';
    volumeWindow.style.pointerEvents = 'none';
    volumeIcon.style.backgroundColor = 'transparent';
    volumeIcon.classList.remove('current-window');
}

function toggleInternet() {
    const isOpen = internetWindow.style.opacity === '1';
    closeVolumeFunc();
    if (!isOpen) {
        internetWindow.style.opacity = '1';
        internetWindow.style.pointerEvents = 'auto';
        internetIcon.style.backgroundColor = '#ccc';
        internetIcon.classList.add('current-window');

        highestZ++;
        internetWindow.style.zIndex = highestZ;
    } else {
        closeInternetFunc();
    }
}

function closeInternetFunc() {
    internetWindow.style.opacity = '0';
    internetWindow.style.pointerEvents = 'none';
    internetIcon.style.backgroundColor = 'transparent';
    internetIcon.classList.remove('current-window');
}

volumeIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleVolume();
});

internetIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleInternet();
});

screen.addEventListener('click', (e) => {
    if (!volumeWindow.contains(e.target) && !volumeIcon.contains(e.target)) {
        closeVolumeFunc();
    }
    if (!internetWindow.contains(e.target) && !internetIcon.contains(e.target)) {
        closeInternetFunc();
    }
});
