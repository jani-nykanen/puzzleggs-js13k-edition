import { Core } from "./core.js";
import { Game } from "./game.js";
import { Ending } from "./ending.js";

//
// Main file
// (c) 2019 Jani Nykänen
//


// Called when the page is loaded
window.onload = () => {

    let c = new Core();
    c.addScene(new Game(c.ev), "game", true);
    c.addScene(new Ending(c.ev), "ending", false);

    c.run(60);
}
