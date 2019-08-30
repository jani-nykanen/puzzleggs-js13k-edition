import { Shape } from "./canvas.js";
import { Stage } from "./stage.js";

//
// Game scene
// (c) 2019 Jani Nykänen
//


// Local constants
const BG_COLOR = [0.33, 0.67, 1.00];


//
// Game scene class
//
export class Game {

    //
    // Constructor
    // 
    constructor(gl) {

        this.stage = new Stage(1);

        this.frameSkip = 0;

        // Cog angle
        this.cogAngle = 0.0;
    }


    //
    // Update the game scene
    //
    update(ev) {

        const COG_SPEED = 0.025;

        // Update cog angle
        this.cogAngle = (this.cogAngle + COG_SPEED * ev.step) 
            % (Math.PI / 2);
        

        this.frameSkip += ev.step;
    }


    //
    // Draw a single cog
    //
    drawCog(c, dx, dy, r, outline, angle, sx, sy, salpha) {

        const COLOR_OUTLINE = [0.5, 0.5, 0.5];
        const COLOR_BASE = [0.75, 0.75, 0.75];

        // Draw shadow
        if (sx != null) {

            c.push();
            c.translate(dx + sx, dy + sy);
            c.rotate(angle);
            c.useTransform();

            c.setColor(0, 0, 0, salpha);
            c.fillShape(Shape.Cog, 0, 0, r, r);

            c.pop();
        }

        // Draw the actual cog
        c.push();
        c.translate(dx, dy);
        c.rotate(angle);
        c.useTransform();

        // Draw base color
        c.setColor(...COLOR_OUTLINE);
        c.fillShape(Shape.Cog, 0, 0, r, r);

        // Draw base color
        c.setColor(...COLOR_BASE);
        c.fillShape(Shape.Cog, 0, 0, r - outline, r - outline);

        c.pop();
    }


    //
    // Draw cogs
    //
    drawCogs(c) {

        // Top-left corner
        this.drawCog(c, 0, 0, 128, 8, 
                this.cogAngle,
                16, 8, 0.25);

        // Top-right corner
        this.drawCog(c, c.viewport.x, 0, 96, 8, 
            -this.cogAngle,
            16, 8, 0.25);

        // Bottom-left corner
        this.drawCog(c, 0, c.viewport.y, 
            96, 8, 
            -this.cogAngle,
            16, 8, 0.25);

        // Bottom-right corner
        this.drawCog(c, c.viewport.x, c.viewport.y, 
            128, 8, 
            this.cogAngle,
            16, 8, 0.25);
    }


    //
    // Draw the game scene
    //
    draw(c) {

        const VIEW_TARGET = 720.0;

        c.clear(...BG_COLOR);

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

        // Draw cogs
        this.drawCogs(c);

        // Compute FPS
        let fps = "FPS: " + String( (60.0 / this.frameSkip) | 0);
        this.frameSkip = 0;

        // Version info
        c.toggleTexturing(true);
        c.setColor(1, 1, 0);
        c.drawScaledText(fps, 
            c.viewport.x/2, 0, -20, 0, 
            48, 48, true);
    }
}
