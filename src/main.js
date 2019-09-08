import { Core } from "./core.js";
import { Game } from "./game.js";
import { Ending } from "./ending.js";
import { TitleScreen } from "./title.js";

//
// Main file
// (c) 2019 Jani Nykänen
//


// Called when the page is loaded
window.onload = () => {

    let c = new Core();
    c.addScene(new Game(c.ev), "game", false);
    c.addScene(new Ending(c.ev), "ending", false);
    c.addScene(new TitleScreen(c.ev, c.canvas), "title", true);

    c.run(60);
}
