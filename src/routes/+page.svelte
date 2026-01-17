<script lang="ts">
    import {youtubePlayer} from "../lib/youtubePlayer.js";

    let player: youtubePlayer;

    player = new youtubePlayer("player", "vxXEkw8KsQU");
    
    let intervalId;
    setTimeout(() => {
        player.playVideo();
        player.setVolume(100);

        intervalId = setInterval(() => {
            timeElapsed = player.getCurrentTime();
            timeTotal = player.getDuration();
            playerState = player.getPlayerState();
            volume = player.getVolume();

            if (playerState === 1 && playPauseIcon === "play_arrow"){
                playPauseToggle(false);
            } else if (playerState === 2 && playPauseIcon === "pause"){
                playPauseToggle(false);
            }
        }, 50);
    }, 1500);

    let timeElapsed = 0;
    let timeTotal = 0;
    let playerState = 0; // 0 = ended, 1 = playing, 2 = paused
    let volume = 0;

    function secondsToTime(seconds:number) {
        seconds = Math.floor(seconds)

        if (seconds < 0) {return "00:00"}

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        } else {
            return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        }
    }

    let playPauseIcon = "play_arrow"
    function playPauseToggle(isManual:boolean){
        if (playPauseIcon === "play_arrow"){
            playPauseIcon = "pause";
            if (isManual){player.playVideo();}
        } else if (playPauseIcon === "pause") {
            playPauseIcon = "play_arrow";
            if (isManual){player.pauseVideo();}
        }
    }

    let titleComposerYear = "Brandenburg Concerto No. 3 in G major · Johann Sebastian Bach · 1719"
</script>
<title>SpreadsheetPlayer</title>

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"/>

<div class="bg-base-300 grid h-screen grid-cols-[4fr_3fr] grid-rows-[1fr_80px] gap-5 p-5">
    <div class="card bg-base-200 card-md shadow-sm p-5">
        <div id="player" class = "rounded"></div>
    </div>

    <div class="card bg-base-200 card-md shadow-sm">
        <div class="card-body">
            <h2 class="card-title">Music</h2>
        </div>
    </div>

    <div class="card bg-base-200 card-md shadow-sm col-span-2">
        <div class="card-body grid grid-cols-[242px_1fr_242px] gap-5 p-5">
            <div>
                <button class="btn"><span class="material-symbols-outlined">skip_previous</span></button>
                <button class="btn" on:click={() => {playPauseToggle(true)}}><span class="material-symbols-outlined">{playPauseIcon}</span></button>
                <button class="btn"><span class="material-symbols-outlined">skip_next</span></button>
                <button class="btn"><span class="material-symbols-outlined">repeat</span></button>
            </div>
            <div class = "grid grid-cols-[0px_1fr]">
                <div class = "text-xs ml-0.5 mt-1.5">{secondsToTime(timeElapsed)}/{secondsToTime(timeTotal)}</div>
                <div class = "text-center text-xs mt-1.5">{titleComposerYear}</div>
                <input type="range" min="0" max={timeTotal} value={timeTotal-timeElapsed} class="mt-1 leading-none range range-xs origin-left range-neutral [--color-neutral:#323841] [--range-thumb:white] [--range-bg:transparent] scale-30 w-[330.5%] rotate-180 transform translate-x-[30.05%] bg-linear-to-r from-red-500 to-orange-400 [--range-p:0rem] col-span-2"/>
            </div>
            <div>
                <button class="btn"><span id = "toggleableVolume" class="material-symbols-outlined">volume_up</span></button>
                <button class="btn"><span id = "toggleableRepeat" class="material-symbols-outlined">switch_access_2</span></button>
                <button class="btn"><span class="material-symbols-outlined">upload</span></button>
                <button class="btn"><span id = "toggleableVisibility" class="material-symbols-outlined">visibility</span></button>
            </div>
        </div>
    </div>
</div>