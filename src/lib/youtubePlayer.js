// lib/youtubePlayer.js
export class youtubePlayer {
    constructor(elementId, initVideoId) {
        this.player = null;

        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
            this.player = new YT.Player(elementId, {
                videoId: initVideoId,
                height: '100%',
                width: '100%',
                playerVars: {
                    playsinline: 1,
                    controls: 0,
                }
            });
        };
    }

    loadVideo(videoID){
        this.player.loadVideoById(videoID);
    }

    playVideo(){
        this.player.playVideo();
    }

    pauseVideo(){
        this.player.pauseVideo();
    }

    stopVideo(){
        this.player.stopVideo();
    }

    seekTo(seconds){
        this.player.seekTo(seconds);
    }

    setVolume(volume){
        this.player.setVolume(volume);
    }

    getVolume(){
        return Math.floor(this.player.getVolume());
    }

    getPlayerState(){
        return Math.floor(this.player.getPlayerState());
    }

    getCurrentTime(){
        return Math.floor(this.player.getCurrentTime());
    }

    getDuration(){
        return Math.ceil(this.player.getDuration()) - 1;
    }
}
