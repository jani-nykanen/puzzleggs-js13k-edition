import { Shape } from "./canvas.js";
import { Stage } from "./stage.js";

//
// Game scene
// (c) 2019 Jani Nykänen
//


export class Game {

    //
    // Constructor
    // 
    constructor(gl) {

        this.stage = new Stage(1);

        this.frameSkip = 0;
    }


    //
    // Update the game scene
    //
    update(ev) {

        // ...

        this.frameSkip += ev.step;
    }


    //
    // Draw the game scene
    //
    draw(c) {

        const VIEW_TARGET = 720.0;

        c.clear(0.33, 0.67, 1.00);

        // No textures
        c.toggleTexturing(false);

        // Set stage transform
        this.stage.setStageView(c);

        // Draw stage
        this.stage.drawTiles(c);

        // Reset view
        c.loadIdentity();
        c.setWorldTransform();
        c.fitViewToDimension(c.w, c.h, VIEW_TARGET);
        c.useTransform();

        // Compute FPS
        let fps = "FPS: " + String( (60.0 / this.frameSkip) | 0);
        this.frameSkip = 0;

        // Version info
        c.toggleTexturing(true);
        c.setColor(1, 1, 0);
        c.drawScaledText(fps, 
            0, 0, -20, 0, 
            48, 48, false);
    }
}
