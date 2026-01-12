<head>
    <title>SpreadsheetPlayer</title>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"/>
</head>
<body class="bg-base-300">
    <div class="grid h-screen grid-cols-[4fr_3fr] grid-rows-[7fr_1fr] gap-5 p-5">
        <div class="card bg-base-200 card-md shadow-sm">
            <div class="card-body">
                
            </div>
        </div>

        <div class="card bg-base-200 card-md shadow-sm">
            <div class="card-body">
                <h2 class="card-title">Music</h2>
            </div>
        </div>

        <div class="card bg-base-200 card-md shadow-sm col-span-2">
            <div class="card-body">
                <span>
                    <button class="btn"><span class="material-symbols-outlined">skip_previous</span></button>
                    <button class="btn"><span id = "toggleablePause" class="material-symbols-outlined">play_arrow</span></button> <!--Could be pause-->
                    <button class="btn"><span class="material-symbols-outlined">skip_next</span></button>
                    <button class="btn"><span class="material-symbols-outlined">queue_music</span></button>
                </span>
        </div>
    </div>
</body>
