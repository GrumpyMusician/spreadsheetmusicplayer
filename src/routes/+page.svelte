<script lang="ts">
    import {youtubePlayer} from "../lib/youtubePlayer.js";
    import { onMount } from 'svelte';
    import Papa from "papaparse"

    let player: youtubePlayer;

    player = new youtubePlayer("player", "tnFWgQT0bZQ");
    
    let intervalId;
    let progressbarValue = 0;
    let ignoreTime = false;
    let soundBarValue = 0;
    let ignoreSound = false;
    let volumeIcon = "volume_up"

    onMount(() => {
        setTimeout(() => {
            player.setVolume(100);
            jumpTo(0, true, 0)

            if ("mediaSession" in navigator) {
                navigator.mediaSession.setActionHandler("previoustrack", () => {previous();});
                navigator.mediaSession.setActionHandler("nexttrack", () => {next(true);});
            }

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

                if (ignoreSound || !Number.isNaN(volume)){
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
                } else if (playerState === 0){
                    next();
                }
            }, 50);
        }, 2000);
    });

    let timeElapsed = 0;
    let timeTotal = 0;
    let playerState = 0; // 0 = ended, 1 = playing, 2 = paused
    let volume = 0;

    function getBgColor(index: number, trash1:number, trash2:boolean){
        if (index === currIndex){
            if (currIsMain){return "bg-linear-to-r from-red-500 to-orange-400"}
            else {return "bg-linear-to-r from-green-500 to-blue-500"}
        } else {
            return "bg-base-100"
        }
    }

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

    let repeatIcon = "repeat"
    function repeatToggle(){
        if (repeatIcon === "repeat"){
            repeatIcon = "repeat_one"
        } else {
            repeatIcon = "repeat"
        }
    } 

    let visibilityIcon = "visibility"
    function visibilityToggle(): void{
        if (visibilityIcon === "visibility"){
            visibilityIcon = "visibility_off"
        } else {
            visibilityIcon = "visibility"
        }
    }

    const byakuzhiMap = { "ch": "ㄔ", "sh": "ㄕ", "th": "ㄘ", "ng": "ㄫ", "b": "ㄅ", "c": "ㄠ", "d": "ㄉ", "f": "ㄈ", "g": "ㄍ", "h": "ㄏ", "j": "ㄐ", "k": "ㄎ", "l": "ㄌ", "m": "ㄇ", "n": "ㄓ", "p": "ㄆ", "q": "ㄩ", "r": "ㄖ", "s": "ㄙ", "t": "ㄊ", "v": "ㄪ", "w": "ㄨ", "x": "ㆲ", "y": "ㄬ", "z": "ㄗ", "a": "ㄡ", "e": "ㄝ", "i": "ㄧ", "o": "ㄛ", "u": "ㄦ", "0": "ロ", "1": "チ", "2": "ニ", "3": "サ", "4": "シ", "5": "ヨ", "6": "ク", "7": "ナ", "8": "ハ", "9": "ウ", " ": "", ".": "。", ",": "，", "!": "！", "?": "？", ";": "；", ":": "：", "(": "（", ")": "）", "[": "［", "]": "］", "~": "～", "@": "＠", "+": "＋", "-": "－", "*": "＊", "/": "／", "\\": "＼", "|": "｜", "_": "＿", "=": "＝", "<": "＜", ">": "＞", "#": "＃", "$": "＄", "%": "％", "&": "＆", "^": "＾", "`": "｀", "{": "｛", "}": "｝", "\"": "＂",  "'":  "＇"};
    let blur = ["", "", ""]
    function obfuscate(text: string | number): string {
        if (visibilityIcon === "visibility") {
            blur = ["", "", ""]
            return String(text);
        }
        
        blur = ["blur-xs", "blur-3xl", "overflow-hidden rounded"]

        const map = byakuzhiMap as Record<string, string>;
        const mapValues = Object.values(map);

        text = String(text).toLowerCase();

        let result = "";
        let i = 0;

        while (i < text.length) {
            const twoChar = text.slice(i, i + 2);

            if (twoChar in map) {
                result += map[twoChar];
                i += 2;
                continue;
            }

            const oneChar = text[i];

            if (oneChar in map) {
                result += map[oneChar];
            } else {
                result += mapValues[Math.floor(Math.random() * mapValues.length)];
            }

            i += 1;
        }

        return result;
    }

    type CSVRow = {Id: number; Name: string; Composers: string; Year: number; Links: string[]; Alternatives: string[];};
    let csvData: CSVRow[] = [{Id: 0, Name: "Twelfth Street Rag", Year: 1914, Composers: "Euday Bowman", Links: ["https://youtu.be/tnFWgQT0bZQ"], Alternatives: ["https://youtu.be/XN3Lvxn3BAU"]}];

    function loadCSV(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input?.files?.[0]) return;
        const file = input.files[0];

        Papa.parse(file, {header: true, skipEmptyLines: true, complete: (results) => {
            csvData = results.data.map((row: any, index: number): CSVRow => {                
                const splitSemicolons = (field: string) => 
                field ? field.split(';').map(s => s.trim()).filter(Boolean) : [];

                return {Id: index + 1, Name: row['Name']?.trim() ?? "", Composers: row['Composers']?.trim() ?? "", Year: parseInt(row['Year']) || 0, Links: splitSemicolons(row['Links']), Alternatives: splitSemicolons(row['Alternatives'])};
            });
            }
        });

        setTimeout(() => {jumpTo(0, true, 0)}, 1500);
    }

    function onSortChange(event: Event): void {
        let songId = csvData[currIndex].Id;
        const sortList = (event.target as HTMLSelectElement).selectedIndex;

        switch (sortList) {
            case 0:
            sortCSVData("Id");
            break;
        case 1:
            sortCSVData("Id", true);
            break;
        case 2:
            sortCSVData("Name");
            break;
        case 3:
            sortCSVData("Composers");
            break;
        case 4:
            sortCSVData("Year");
            break;
        case 5:
            sortCSVData("Year", true);
            break;
        }

        currIndex = csvData.findIndex(item => item.Id === songId);
        autoScroll()
    }

    function sortCSVData(key: keyof CSVRow, reverse: boolean = false): void {
        csvData = [...csvData].sort((a, b) => {
            const av = a[key];
            const bv = b[key];

            let result = 0;

            if (typeof av === "number" && typeof bv === "number") {
                result = av - bv;
            } else {
                result = String(av).localeCompare(String(bv));
            }

            return reverse ? -result : result;
        });
    }

    let filterPlay = 0; // 0 = All, 1 = Originals Only, 2 = Alternatives Only
    function onPlayChange(event: Event): void{
        filterPlay = (event.target as HTMLSelectElement).selectedIndex;
    }

    let currIndex = 0;
    let currIsMain = true;
    let currSubIndex = 0;
    function playVideo(): void{
        if (currIsMain){
            player.loadVideo(toYoutubeId(csvData[currIndex].Links[currSubIndex]));
        } else {
            player.loadVideo(toYoutubeId(csvData[currIndex].Alternatives[currSubIndex]));
        }
    }

    function jumpTo(index: number, isMain = true, subIndex: number): void{
        currIndex = index;
        currIsMain = isMain;
        currSubIndex = subIndex;
        playVideo();
    }

    function next(isManual = false): void {
        autoScroll()

        if ((repeatIcon === "repeat_one") && !isManual) {
            playVideo();
            return;
        }

        const song = csvData[currIndex];

        if (currIsMain) {
            if (currSubIndex + 1 < song.Links.length) {
                currSubIndex++;
                playVideo();
                return;
            }
            if (filterPlay === 0 && song.Alternatives.length > 0) {
                currIsMain = false;
                currSubIndex = 0;
                playVideo();
                return;
            }
        } else {
            if (currSubIndex + 1 < song.Alternatives.length) {
                currSubIndex++;
                playVideo();
                return;
            }
        }

        for (let i = currIndex + 1; i < csvData.length; i++) {
            const s = csvData[i];

            if (
                (filterPlay === 0 && (s.Links.length > 0 || s.Alternatives.length > 0)) ||
                (filterPlay === 1 && s.Links.length > 0) ||
                (filterPlay === 2 && s.Alternatives.length > 0)
            ) {
                currIndex = i;
                currSubIndex = 0;
                currIsMain = !(filterPlay === 2 || s.Links.length === 0);
                playVideo();
                return;
            }
        }

        for (let i = 0; i <= currIndex; i++) {
            const s = csvData[i];

            if (
                (filterPlay === 0 && (s.Links.length > 0 || s.Alternatives.length > 0)) ||
                (filterPlay === 1 && s.Links.length > 0) ||
                (filterPlay === 2 && s.Alternatives.length > 0)
            ) {
                currIndex = i;
                currSubIndex = 0;
                currIsMain = !(filterPlay === 2 || s.Links.length === 0);
                playVideo();
                return;
            }
        }
    }

    function previous(): void {
        autoScroll()

        const song = csvData[currIndex];

        if (currSubIndex > 0) {
            currSubIndex--;
            playVideo();
            return;
        }

        if (!currIsMain && filterPlay === 0 && song.Links.length > 0) {
            currIsMain = true;
            currSubIndex = song.Links.length - 1;
            playVideo();
            return;
        }

        for (let i = currIndex - 1; i >= 0; i--) {
            const s = csvData[i];

            if (
                (filterPlay === 0 && (s.Links.length > 0 || s.Alternatives.length > 0)) ||
                (filterPlay === 1 && s.Links.length > 0) ||
                (filterPlay === 2 && s.Alternatives.length > 0)
            ) {
                currIndex = i;

                if (filterPlay === 2 || s.Links.length === 0) {
                    currIsMain = false;
                    currSubIndex = s.Alternatives.length - 1;
                } else {
                    currIsMain = true;
                    currSubIndex = s.Links.length - 1;
                }

                playVideo();
                return;
            }
        }
    }

    function autoScroll(): void{
        document.getElementById("song" + currIndex)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

</script>
<title>SpreadsheetPlayer</title>

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"/>

<div class="bg-base-300 grid h-screen grid-cols-[2fr_1fr] grid-rows-[1fr_80px] gap-5 p-5">
    <div class="card bg-base-200 card-md shadow-sm p-5">
        <div class = "{blur[2]} h-full">
            <div class = "{blur[1]} h-full">
                <div id="player" class = "rounded"></div>
            </div>
        </div>
    </div>

    <div class="card bg-base-200 card-md shadow-sm">
        <div class="card-body h-100">
            <h2 class="card-title">Music</h2>
            <div class="overflow-y-scroll overflow-x-hidden grow pt-3">
                {#each csvData as song, i}
                    <div class="card {getBgColor(i, currIndex, currIsMain)} shadow-sm" id = "song{i}">
                        <div class="card-body p-4">
                            <div class="grid grid-cols-[60px_5fr_max-content] grid-rows-2 w-full">
                                <div class="row-span-2">
                                    <div class = "{blur[2]} w-12 h-12">
                                        <img class="w-12 h-12 object-cover rawimage rounded {blur[0]}" src="https://img.youtube.com/vi/{toYoutubeId(song.Links[0])}/default.jpg" alt="Song artwork"/>
                                    </div>
                                </div>
                                <p class="text-sm font-semibold truncate text-ellipsis pr-1">{obfuscate(song.Name)}</p>
                                <div class="row-span-2 pt-3">
                                    {#if filterPlay !== 2}{#each song.Links, j}<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions --><span class="material-symbols-outlined cursor-pointer -mr-1.5" on:click={() => {jumpTo(i, true, j)}}>music_note</span>{/each}{/if}
                                    {#if filterPlay !== 1}{#each song.Alternatives, j}<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions --><span class="material-symbols-outlined cursor-pointer" on:click={() => {jumpTo(i, false, j)}}>music_note_add</span>{/each}{/if}
                                    {#if song.Alternatives.length === 0 || filterPlay === 1}<span class="mr-1.5"></span>{/if}
                                </div>
                                <p class="text-sm text-base-content/70 truncate text-ellipsis">
                                    {#if song.Composers}{obfuscate(song.Composers)}{/if}
                                    {#if song.Composers && song.Year && song.Year !== -1}·{/if}
                                    {#if song.Year && song.Year !== -1}{obfuscate(song.Year)}{/if}
                                </p>
                            </div>
                        </div>
                    </div>
                    <br/>
                {/each}
            </div>
            <div class = "grid grid-cols-3 gap-2">
                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Sort by...</legend>
                    <select class="select select-xs" on:change={onSortChange}>
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
                    <select class="select select-xs" on:change={onPlayChange}>
                        <option selected>All Music</option>
                        <option>Originals Only</option>
                        <option>Alternatives Only</option>
                    </select>                    
                </fieldset>
            </div>
        </div>
    </div>

    <div class="card bg-base-200 card-md shadow-sm col-span-2">
        <div class="card-body grid grid-cols-[242px_1fr_242px] gap-5 p-5">
            <div>
                <button class="btn" on:click={previous}><span class="material-symbols-outlined">skip_previous</span></button>
                <button class="btn" on:click={() => {playPauseToggle(true)}}><span class="material-symbols-outlined">{playPauseIcon}</span></button>
                <button class="btn" on:click={() => {next(true)}}><span class="material-symbols-outlined">skip_next</span></button>
                <button class="btn" on:click={repeatToggle}><span class="material-symbols-outlined">{repeatIcon}</span></button>
            </div>
            <div class = "grid grid-cols-[0px_1fr]">
                <div class = "text-xs ml-0.5 mt-1">{secondsToTime(timeElapsed)}/{secondsToTime(timeTotal)}</div>
                <div class = "text-center text-xs mt-1 truncate text-ellipsis">
                    {#if csvData[currIndex].Name}{obfuscate(csvData[currIndex].Name)}{/if}
                    {#if csvData[currIndex].Name && csvData[currIndex].Composers}·{/if}
                    {#if csvData[currIndex].Composers}{obfuscate(csvData[currIndex].Composers)}{/if}
                    {#if csvData[currIndex].Composers && csvData[currIndex].Year && csvData[currIndex].Year !== -1}·{/if}
                    {#if csvData[currIndex].Year && csvData[currIndex].Year !== -1}{obfuscate(csvData[currIndex].Year)}{/if}
                </div>
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
                <button class="btn" on:click = {visibilityToggle}><span id = "toggleableVisibility" class="material-symbols-outlined">{visibilityIcon}</span></button>
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