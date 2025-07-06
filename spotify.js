

console.log("hello");

// 🔼 Global variables
let songs = [];
let currentIndex = 0;
let currentSong;
let seekbar;
let togglePlay;
let playbar;

let defaultColor = "rgb(225, 240, 230)";
let hoverColor = "rgb(55, 233, 114)";
async function getSongs(){
  let a=await fetch("http://127.0.0.1:5500/songs/")

  let response=await a.text();

  let div=document.createElement("div")
  div.innerHTML=response;

  let links=div.getElementsByTagName("a")

  let foundSongs=[]
  for(let i=0;i<links.length;i++){
    const element=links[i];
   if(element.href && element.href.endsWith(".mp3")){
    foundSongs.push(element.href)
   }
  }
  return foundSongs
}

async function main() {
  songs = await getSongs()
  currentIndex=0;
  currentSong = new Audio(songs[currentIndex])
  
  const volumeSlider = document.querySelector(".volume-slider");
const volumeIcon = document.getElementById("volume-icon");

// Set initial volume on load
currentSong.volume = volumeSlider.value / 100;
updateVolumeIcon(volumeSlider.value);

// When user moves the volume slider
volumeSlider.addEventListener("input", () => {
  const vol = parseInt(volumeSlider.value);
  currentSong.volume = vol / 100;
  updateVolumeIcon(vol);
});

function updateVolumeIcon(val) {
  if (val == 0) {
    volumeIcon.className = "fa-solid fa-volume-off";
  } else if (val <= 50) {
    volumeIcon.className = "fa-solid fa-volume-low";
  } else {
    volumeIcon.className = "fa-solid fa-volume-high";
  }
}


  // 🔄 Cache DOM elements globally
  seekbar = document.querySelector(".seekbar");
  togglePlay=document.querySelector(".togglePlay i");
  playbar=document.querySelector(".playbar");

  setUpSeekbar(currentSong);

  // ▶️ Play on card's play button
  document.querySelector(".play-button").addEventListener("click",()=>{
    currentSong.play();
    playbar.classList.add("show");
    togglePlay.classList.remove("fa-play");
    togglePlay.classList.add("fa-pause");
    
  })

  // ⏯ Toggle play/pause button
  document.querySelector(".togglePlay") .addEventListener("click", () => {
    if(currentSong.paused){
       currentSong.play();
       togglePlay.classList.remove("fa-play");
       togglePlay.classList.add("fa-pause");
    }else{
      currentSong.pause();
      togglePlay.classList.remove("fa-pause");
      togglePlay.classList.add("fa-play");
    }
  })

  // 📀 Song card click
  document.querySelectorAll(".song.card").forEach((card,i)=>{
    card.addEventListener("click",()=>{
      loadAndPlay(i);
    })
  });
  // ⏭ Next
  document.querySelector(".next").addEventListener("click", () => {
    let next=(currentIndex+1)%songs.length;
    loadAndPlay(next);
  })

  // ⏮ Prev
  document.querySelector(".back").addEventListener("click", () => {
    let back = (currentIndex - 1 + songs.length) % songs.length;
    loadAndPlay(back);
  });

  
  

  

}

function loadAndPlay(index) {
  if (index < 0 || index >= songs.length) return;

  if (currentSong) currentSong.pause();

  currentSong = new Audio(songs[index]);
  currentIndex = index;
  currentSong.play();

  togglePlay.classList.remove("fa-play");
  togglePlay.classList.add("fa-pause");
  playbar.classList.add("show");

  currentSong.addEventListener("ended", () => {
  let nextIndex = (currentIndex + 1) % songs.length;
  loadAndPlay(nextIndex);
});
setUpSeekbar(currentSong);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function setUpSeekbar(song) {
  const seekbar = document.querySelector(".seekbar");
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


function updateSeekbarColor(color) {
  const percent = (seekbar.value / seekbar.max) * 100;
  seekbar.style.background = `linear-gradient(to right, ${color} ${percent}%, rgba(62, 59, 59, 0.69) ${percent}%)`;
}

main();


document.querySelector(".hamburger").addEventListener("click", () => {
  const left = document.querySelector(".left-container");
  if(left.style.display === "none"){
    left.style.display = "block";
  }else{
    left.style.display = "none";
  }
 
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 1240) {
    left.style.display = "block";
  } else {
    left.style.display = "none";
  }
});

const audio = document.getElementById('audioPlayer');
const slider = document.querySelector('.volume-slider');
const icon = document.getElementById('volume-icon');

// Set initial volume on load
audio.volume = slider.value / 100;
updateVolumeIcon(slider.value);

// Update volume and icon when slider changes
slider.addEventListener('input', () => {
  const val = parseInt(slider.value);
  audio.volume = val / 100;
  updateVolumeIcon(val);
});

// Function to change icon
function updateVolumeIcon(val) {
  if (val == 0) {
    icon.className = "fa-solid fa-volume-off";
  } else if (val <= 50) {
    icon.className = "fa-solid fa-volume-low";
  } else {
    icon.className = "fa-solid fa-volume-high";
  }
}
