import "../app.css";
import {youtubePlayer} from "$lib/youtubePlayer.js";

export const prerender = true;
export const ssr = false;

let player = new youtubePlayer("player", "vxXEkw8KsQU");

setTimeout(() => {
    player.playVideo()
}, 3000)