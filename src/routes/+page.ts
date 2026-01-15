import "../app.css";
import {youtubePlayer} from "$lib/youtubePlayer.js";

export const prerender = true;
export const ssr = false;

if (typeof window !== "undefined") {
    const player = new youtubePlayer("player", "qr0f6t2UbOo");
}