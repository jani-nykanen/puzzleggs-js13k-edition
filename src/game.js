import { Shape } from "./canvas.js";

//
// Game scene
// (c) 2019 Jani Nykänen
//


export class Game {

    //
    // Constructor
    // 
    constructor(gl) {


    }


    //
    // Update the game scene
    //
    update(ev) {

        // ...
    }


    //
    // Draw the game scene
    //
    draw(c) {

        const VIEW_TARGET = 720.0;

        c.clear(0.67, 0.67, 0.67);

        c.loadIdentity();
        c.setWorldTransform();
        c.fitViewToDimension(c.w, c.h, VIEW_TARGET);
        c.useTransform();

        // Funky shapes
        c.toggleTexturing(false);
        c.setColor(1, 0, 0);
        c.fillShape(Shape.Ellipse, 128, 128, 64, 64);

        c.fillShape(Shape.RAngledTriangle, 0, 0, 32, -32);

        // Version info
        c.toggleTexturing(true);
        c.setColor(0, 0, 0, 1);
        c.drawScaledText("Pre-Alpha 0.0.1", 
            0, 0, -32, 0, 
            64, 64, false);
    }
}
