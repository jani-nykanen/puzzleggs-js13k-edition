import { Shape } from "./canvas.js";
import { Stage, Tile } from "./stage.js";
import { ObjectManager } from "./objects.js";
import { MOVE_TIME } from "./movable.js";

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

        // Create an object manager
        this.objMan = new ObjectManager();
        // Create a stage
        this.stage = new Stage(1, this.objMan);

        // Cog angle
        this.cogAngle = 0.0;
        // Floating text value
        this.textFloatValue = 0.0;
    }


    //
    // Update the game scene
    //
    update(ev) {

        const COG_SPEED = Math.PI/2.0 / MOVE_TIME;
        const FLOAT_SPEED = 0.05;

        // Update stage
        this.stage.update(this.objMan.eggsCollected(), ev);

        // Update objects
        this.objMan.update(this.stage, ev);

        if (this.objMan.isActive()) {

            // Update cog angle
            this.cogAngle = (this.cogAngle + COG_SPEED * ev.step) 
                % (Math.PI / 2);
        }
        else {

            this.cogAngle = 0;
        }

        // Update floating text
        this.textFloatValue += FLOAT_SPEED * ev.step;
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
    // Draw stage info
    //
    drawStageInfo(c) {

        const TEXT = ["STAGE 1", "Password: NONE"];

        const POS_Y = 4;

        const FONT_SIZE = [64, 48];
        const AMPLITUDE = [6.0, 4.0];
        const PERIOD = [Math.PI/3, Math.PI/6];

        const SHADOW_ALPHA = 0.25;
        const SHADOW_X = [6, 4];
        const SHADOW_Y = [6, 4];

        c.toggleTexturing(true);

        // Draw stage text
        let y;
        for (let j = 0; j < 2; ++ j) {

            for (let i = 1; i >= 0; -- i) {

                if (j == 0)
                    y = POS_Y + Tile.Height/2;
                else
                    y = c.viewport.y - POS_Y - Tile.Height/2;
                y -= FONT_SIZE[j]/2 - i *SHADOW_Y[j];

                if (i == 1)
                    c.setColor(0, 0, 0, SHADOW_ALPHA);
                else
                    c.setColor(1, 1, 0.5);

                c.drawScaledText(TEXT[j], 
                    c.viewport.x/2 + i*SHADOW_X[j], y,
                    -16, 0, 
                    FONT_SIZE[j], FONT_SIZE[j], true, 
                    PERIOD[j], AMPLITUDE[j],
                    this.textFloatValue);

            }
    }
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
        this.stage.drawTiles(c, this.objMan.eggsCollected());

        // Draw game objects
        this.objMan.draw(c);

        // Reset view
        c.loadIdentity();
        c.setWorldTransform();
        c.fitViewToDimension(c.w, c.h, VIEW_TARGET);
        c.useTransform();

        // Draw cogs
        this.drawCogs(c);


        // Draw stage info
        this.drawStageInfo(c);
    }
}
