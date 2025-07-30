console.log("Spotify Clone Ready");

let songs = [
  "songs/02-Phir-Bhi-Tumko-Chahunga-(Arijit-Singh)-320Kbps.mp3",
  "songs/03-mera-yarr.mp3",
  "songs/Dooriyaan.mp3",
  "songs/Ik-Vaari.mp3",
  "songs/Khuda-bhi.mp3",
  "songs/Tare.mp3",
  "songs/Tu-jane-na.mp3",
  "songs/Yaar-mod-do.mp3",
  
]; // 🎧 Add your actual filenames here
let currentIndex = 0;
let currentSong = new Audio(songs[currentIndex]);

let seekbar, togglePlay, playbar;

let defaultColor = "rgb(225, 240, 230)";
let hoverColor = "rgb(55, 233, 114)";

async function main() {
  const volumeSlider = document.querySelector(".volume-slider");
  const volumeIcon = document.getElementById("volume-icon");

  // Volume Setup
  currentSong.volume = volumeSlider.value / 100;
  updateVolumeIcon(volumeSlider.value);
  volumeSlider.addEventListener("input", () => {
    const vol = parseInt(volumeSlider.value);
    currentSong.volume = vol / 100;
    updateVolumeIcon(vol);
  });

  // DOM cache
  seekbar = document.querySelector(".seekbar");
  togglePlay = document.querySelector(".togglePlay i");
  playbar = document.querySelector(".playbar");

  setUpSeekbar(currentSong);

  // Play button
  document.querySelector(".togglePlay").addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      togglePlay.classList.replace("fa-play", "fa-pause");
    } else {
      currentSong.pause();
      togglePlay.classList.replace("fa-pause", "fa-play");
    }
    playbar.classList.add("show");
  });

  // Next / Prev
  document.querySelector(".next").addEventListener("click", () => {
    loadAndPlay((currentIndex + 1) % songs.length);
  });

  document.querySelector(".back").addEventListener("click", () => {
    loadAndPlay((currentIndex - 1 + songs.length) % songs.length);
  });
}

function loadAndPlay(index) {
  if (currentSong) currentSong.pause();

  currentIndex = index;
  currentSong = new Audio(songs[index]);
  currentSong.play();

  togglePlay.classList.replace("fa-play", "fa-pause");
  playbar.classList.add("show");

  setUpSeekbar(currentSong);

  currentSong.addEventListener("ended", () => {
    loadAndPlay((currentIndex + 1) % songs.length);
  });
}

function setUpSeekbar(song) {
  const currentTimeDisplay = document.querySelector(".current-time");
  const totalDurationDisplay = document.querySelector(".total-duration");

  song.addEventListener("loadedmetadata", () => {
    seekbar.max = song.duration;
    totalDurationDisplay.textContent = formatTime(song.duration);
  });

  song.addEventListener("timeupdate", () => {
    seekbar.value = song.currentTime;
    currentTimeDisplay.textContent = formatTime(song.currentTime);
    const activeColor = seekbar.matches(":hover") ? hoverColor : defaultColor;
    updateSeekbarColor(activeColor);
  });

  seekbar.addEventListener("input", () => {
    song.currentTime = seekbar.value;
  });
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function updateSeekbarColor(color) {
  const percent = (seekbar.value / seekbar.max) * 100;
  seekbar.style.background = `linear-gradient(to right, ${color} ${percent}%, rgba(62, 59, 59, 0.69) ${percent}%)`;
}

function updateVolumeIcon(val) {
  const icon = document.getElementById("volume-icon");
  if (val == 0) {
    icon.className = "fa-solid fa-volume-off";
  } else if (val <= 50) {
    icon.className = "fa-solid fa-volume-low";
  } else {
    icon.className = "fa-solid fa-volume-high";
  }
}

main();
