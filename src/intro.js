import { Shape } from "./canvas.js";

//
// Intro
// (c) 2019 Jani Nykänen
//


export class Intro {


    //
    // Constructor
    //
    constructor(ev) {

        const WAIT_TIME = 120;

        this.timer = WAIT_TIME;

        ev.tr.activate(false, 1.0, 0, 0, 0);
    }


    //
    // Update scene
    //
    update(ev) {

        if (ev.tr.active) return;

        if ((this.timer -= ev.step) <= 0) {

            ev.tr.activate(true, 2.0, 0, 0, 0,
                () => {
                    ev.changeScene("title");
                });
        }
    }

    //
    // Draw scene
    //
    draw(c) {

        const VIEW_TARGET = 720.0;
        const SMALL_SCALE = 32;
        const BIG_SCALE = 64;
        const TEXT_SHIFT = 0;

        let mx = c.viewport.x/2;
        let my = c.viewport.y/2;

        c.clear(0, 0, 0);
        c.toggleTexturing(true);

        c.loadIdentity();
        c.translate(mx, my);
        c.fitViewToDimension(c.w, c.h, VIEW_TARGET);
        c.useTransform();

        c.setColor(1, 1, 1);

        // Draw text
        c.drawScaledText("Created by", 
            0, - BIG_SCALE + TEXT_SHIFT, 
            -20, 0, SMALL_SCALE, SMALL_SCALE, true);

        c.drawScaledText("Jani Nyk#nen", 
            0, - BIG_SCALE/2 + TEXT_SHIFT, 
            -20, 0, BIG_SCALE, BIG_SCALE, true);    
    }

}
