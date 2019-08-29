import { Core } from "./core.js";
import { Game } from "./game.js";

//
// Main file
// (c) 2019 Jani Nykänen
//


// Called when the page is loaded
window.onload = () => {

    let c = new Core();
    c.addScene(new Game(c.canvas.gl), "game", true);

    c.run(60);
}
