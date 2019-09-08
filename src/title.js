import { Menu, Button } from "./menu.js";
import { BG_COLOR } from "./game.js";

//
// Title screen scene
// (c) 2019 Jani Nykänen
//


export class TitleScreen {

    //
    // Constructor
    //
    constructor(ev) {

        // Menu
        this.menu = new Menu();
        this.menu.addButton(
            new Button("New Game", () => {
                ev.tr.activate(true, 2.0, ...BG_COLOR,
                    () => {ev.changeScene("game", 1);}
                );
                }),
            new Button("Password", 
                () => {}),
        );
    }


    //
    // Update scene
    //
    update(ev) {

        this.menu.update(ev);
    }


    //
    // Draw scene
    //
    draw(c) {

        const VIEW_TARGET = 720.0;

        c.clear(...BG_COLOR);

        // Reset view
        c.loadIdentity();
        c.fitViewToDimension(c.w, c.h, VIEW_TARGET);
        c.useTransform();

        // Draw menu
        this.menu.draw(c, 48);
    }

}
