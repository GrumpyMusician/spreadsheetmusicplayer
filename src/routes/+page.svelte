<head>
    <title>SpreadsheetPlayer</title>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"/>
</head>
<body class="bg-base-300">
    <div class="grid h-screen grid-cols-[4fr_3fr] grid-rows-[1fr_80px] gap-5 p-5">
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
                    <button class="btn"><span class="material-symbols-outlined">play_arrow</span></button> <!--Could be pause-->
                    <button class="btn"><span class="material-symbols-outlined">skip_next</span></button>
                    <button class="btn"><span class="material-symbols-outlined">queue_music</span></button>
                </div>
                <div class = "grid grid-cols-[0px_1fr]">
                    <div class = "text-xs ml-0.5 mt-1.5">00:00/00:00</div>
                    <div class = "text-center text-xs mt-1.5">Untitled</div>
                    <input type="range" min="0" max="100" value="100" class="mt-1 leading-none range range-xs origin-left range-neutral [--color-neutral:#323841] [--range-thumb:white] [--range-bg:transparent] scale-30 w-[330.5%] rotate-180 transform translate-x-[30.05%] border-base-200 bg-linear-to-r from-red-500 to-orange-400 [--range-p:0rem] col-span-2"/>
                </div>
                <div>
                    <button class="btn"><span id = "toggleableVolume" class="material-symbols-outlined">volume_up</span></button>
                    <button class="btn"><span id = "toggleableRepeat" class="material-symbols-outlined">repeat</span></button>
                    <button class="btn"><span class="material-symbols-outlined">upload</span></button>
                    <button class="btn"><span id = "toggleableVisibility" class="material-symbols-outlined">visibility</span></button>
                </div>
            </div>
        </div>
    </div>
</body>
