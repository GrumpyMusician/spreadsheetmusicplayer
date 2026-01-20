<script lang="ts">
    import {youtubePlayer} from "../lib/youtubePlayer.js";

    let player: youtubePlayer;

    player = new youtubePlayer("player", "vxXEkw8KsQU");
    
    let intervalId;
    let progressbarValue = 0;
    let ignoreTime = false;
    let soundBarValue = 0;
    let ignoreSound = false;

    let volumeIcon = "volume_up"
    setTimeout(() => {
        player.playVideo();
        player.setVolume(100);

        intervalId = setInterval(() => {
            timeTotal = player.getDuration();
            if (ignoreTime){
                timeElapsed = timeTotal - progressbarValue;
                player.seekTo(timeElapsed);
            } else {
                timeElapsed = player.getCurrentTime();
                progressbarValue = timeTotal - timeElapsed;
            }

            playerState = player.getPlayerState();
            if (ignoreSound){
                volume = 100 - soundBarValue;
            } else {
                volume = player.getVolume();
                soundBarValue = 100 - volume;
            }

            if (volume === 0){
                volumeIcon = "volume_off"
            } else if (volume <= 33) {
                volumeIcon = "volume_mute"
            } else if (volume <= 66) {
                volumeIcon = "volume_down"
            } else {
                volumeIcon = "volume_up"
            }

            player.setVolume(volume);
            
            if (playerState === 1 && playPauseIcon === "play_arrow"){
                playPauseToggle(false);
            } else if (playerState === 2 && playPauseIcon === "pause"){
                playPauseToggle(false);
            }
        }, 50);
    }, 2000);

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

    function toYoutubeId(url: string) {
        try {
            const parsed = new URL(url);

            if (parsed.hostname === "youtu.be") {
                return parsed.pathname.slice(1);
            }

            if (parsed.searchParams.has("v")) {
                return parsed.searchParams.get("v");
            }

            const pathMatch = parsed.pathname.match(/\/(embed|shorts)\/([^/?]+)/);
            if (pathMatch) {
                return pathMatch[2];
            }

            return null;
        } catch {
            return null;
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

    let csvData: string[][] = [];
    let csvHeader: string[] = [];
    function loadCSV(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        const file: File = input.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const text = reader.result as string;

            const rows = text
                .trim()
                .split(/\r?\n/)
                .map(row => row.split(',').map(cell => cell.trim()));

            csvHeader = rows[0];
            csvData = rows.slice(1);

            musicIndex = 0;
            mainIndex = 0;
            altIndex = 0;
        };

        reader.readAsText(file);
    }

    let musicIndex = 0;
    let mainIndex = 0;
    let altIndex = 0;

    let workingData: string[][] = [];
    function nextSong(): void {
        let lengthMainIndex = workingData[musicIndex][csvHeader.indexOf("Links")].length - 1;
        let lengthAltIndex = workingData[musicIndex][csvHeader.indexOf("Alternatives")].length - 1;

        if (lengthMainIndex !== mainIndex){
            mainIndex++;
        } else if (lengthMainIndex === mainIndex && altIndex !== lengthAltIndex){
            altIndex++;
        } else if (lengthMainIndex === mainIndex && altIndex === lengthAltIndex){
            musicIndex++;
            mainIndex = 0;
            altIndex = 0;
        }

        player.loadVideo(workingData[musicIndex][csvHeader.indexOf("Links")])
    }
</script>
<title>SpreadsheetPlayer</title>

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"/>

<div class="bg-base-300 grid h-screen grid-cols-[4fr_3fr] grid-rows-[1fr_80px] gap-5 p-5">
    <div class="card bg-base-200 card-md shadow-sm p-5">
        <div id="player" class = "rounded"></div>
    </div>

    <div class="card bg-base-200 card-md shadow-sm">
        <div class="card-body flex">

            <h2 class="card-title">Music</h2>
            <div class="w-full overflow-y-scroll grow p-2">
                <div class="card bg-base-100 shadow-sm">
                    <div class="card-body p-4">
                        <div class="flex items-center justify-between gap-4">
                            <div class="flex items-center gap-3">
                            <div class="w-12 h-12 shrink-0">
                            <img class="w-12 h-12 rounded object-cover rawimage" src="" alt="Song artwork"/></div><!--Consider https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg-->
                            <div class="min-w-0">
                                <p class="text-sm font-semibold truncate">Meow</p>
                                <p class="text-sm text-base-content/70 truncate">Meow · Meow</p>
                            </div>
                            </div>
                            <div class="shrink-0">Notes</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class = "columns-3">
                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Sort by...</legend>
                    <select class="select select-xs">
                        <option selected>Spreadsheet Order</option>
                        <option>Reverse Spreadsheet Order</option>
                        <option>Name</option>
                        <option>Composer</option>
                        <option>Date</option>
                        <option>Reverse Date</option>
                    </select>                    
                </fieldset>
                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Play...</legend>
                    <select class="select select-xs">
                        <option selected>All Music</option>
                        <option>Originals Only</option>
                        <option>Alternatives Only</option>
                    </select>                    
                </fieldset>
                <div class = "flex items-end h-full">
                    rats
                </div>
            </div>
        </div>
    </div>

    <div class="card bg-base-200 card-md shadow-sm col-span-2">
        <div class="card-body grid grid-cols-[242px_1fr_242px] gap-5 p-5">
            <div>
                <div class="tooltip" data-tip="Previous Song"><button class="btn"><span class="material-symbols-outlined">skip_previous</span></button></div>
                <button class="btn" on:click={() => {playPauseToggle(true)}}><span class="material-symbols-outlined">{playPauseIcon}</span></button>
                <button class="btn"><span class="material-symbols-outlined">skip_next</span></button>
                <button class="btn"><span class="material-symbols-outlined">repeat</span></button>
            </div>
            <div class = "grid grid-cols-[0px_1fr]">
                <div class = "text-xs ml-0.5 mt-1">{secondsToTime(timeElapsed)}/{secondsToTime(timeTotal)}</div>
                <div class = "text-center text-xs mt-1">{"Brandenburg Concerto No. 3 in G major · Johann Sebastian Bach · 1719"}</div>
                <input type="range" min="0" max={timeTotal} bind:value={progressbarValue} on:mouseup={() => {ignoreTime = false}} on:mousedown={() => {ignoreTime = true}} class="mt-0.5 leading-none range range-xs origin-left range-neutral [--color-neutral:#323841] [--range-thumb:white] [--range-bg:transparent] scale-30 w-[330.5%] rotate-180 transform translate-x-[30.05%] bg-linear-to-r from-red-500 to-orange-400 [--range-p:0rem] col-span-2"/>
            </div>
            <div>
                <div class="dropdown dropdown-top dropdown-center">
                    <div tabindex="0" role="button" class="btn"><span id = "toggleableVolume" class="material-symbols-outlined">{volumeIcon}</span></div>
                    <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 shadow-sm mb-2.5 p-3">
                        <li class = "text-center w-full">{volume}%</li>
                        <input type="range" bind:value={soundBarValue} on:mouseup={() => {ignoreSound = false}} on:mousedown={() => {ignoreSound = true}} class="m-1 leading-none range range-xs origin-left range-neutral [--color-neutral:#323841] [--range-thumb:white] [--range-bg:transparent] scale-30 w-[318%] rotate-180 transform translate-x-[30.05%] bg-linear-to-r from-green-500 to-blue-500 [--range-p:0rem]"/>
                    </ul>
                </div>
                <button class="btn"><span id = "toggleableRepeat" class="material-symbols-outlined">swap_horiz</span></button>
                <button class="btn"><span id = "toggleableVisibility" class="material-symbols-outlined">visibility</span></button>
                <button class="btn">
                    <input id="csvInput" type="file" class = "hidden" accept=".csv" on:change = {loadCSV}/>
                    <label for="csvInput" class="upload-label">
                        <span class="material-symbols-outlined">upload</span>
                    </label>
                </button>
            </div>
        </div>
    </div>
</div>