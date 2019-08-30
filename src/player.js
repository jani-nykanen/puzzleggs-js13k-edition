import { Vector2 } from "./vector.js";
import { Tile } from "./stage.js";
import { Shape } from "./canvas.js";

//
// Player object
// (c) 2019 Jani Nykänen
//


export class Player {


    //
    // Constructor
    //
    constructor(x, y) {

        // Grid position
        this.pos = new Vector2(x | 0, y | 0);
        // Render position (top-left corner)
        this.rpos = new Vector2(x * Tile.Width, y * Tile.Height);

        // Move timer
        this.moveTimer = 0;
        // Move target
        this.target = this.pos.clone();
        // Is moving
        this.moving = false;

        // Head angle
        this.headAngle = 0.0;
    }


    //
    // Update
    //
    update(stage, ev) {

        this.headAngle += 0.05 * ev.step;
    }


    //
    // Draw
    //
    draw(c) {

        const HEAD_W = 48;
        const HEAD_H = 40;
        const HEAD_Y = -6;

        const LEG_OUTLINE = 2;
        const LEG_COLOR = [0.67, 0.40, 0.1];

        const BOX_OUTLINE = 3;
        const BOX_COLOR = [1.0, 0.75, 0.0]

        const BEAK_COLOR = [ [1.0, 0.95, 0.5], [0.9, 0.5, 0] ];

        let mx = this.rpos.x + Tile.Width/2;
        let my = this.rpos.y + Tile.Height/2;

        //
        // Draw legs
        //
        let legY = [
            -Math.abs(Math.cos(this.headAngle)) * 4,
            -Math.abs(Math.sin(this.headAngle)) * 4];
        for (let i = -1; i <= 1; i += 2) {

            // Leg outline
            c.setColor(0.0, 0.0, 0.0);
            c.fillShape(Shape.EquilTriangle,
                mx + 10*i - LEG_OUTLINE/2 +1, my + 4 + legY[i == -1 ? 0 : 1],
                16 + LEG_OUTLINE*2, -10 - LEG_OUTLINE);

            // Leg base
            c.setColor(...LEG_COLOR);
            c.fillShape(Shape.EquilTriangle,
                mx + 10*i, my + 4 + legY[i == -1 ? 0 : 1], 16, -10);
        }

        //
        // Draw head
        //

        c.push();
        c.translate(mx, my + HEAD_Y);
        c.rotate(Math.sin(this.headAngle) * Math.PI/16.0);
        c.useTransform();   

        // Head outline
        c.setColor(0, 0, 0);
        c.fillShape(Shape.Rect, 
            -HEAD_W/2 - BOX_OUTLINE, -HEAD_H/2 - BOX_OUTLINE, 
            HEAD_W + BOX_OUTLINE*2, HEAD_H + BOX_OUTLINE*2);

        // Head base
        c.setColor(...BOX_COLOR);
        c.fillShape(Shape.Rect, 
            -HEAD_W/2, -HEAD_H/2, HEAD_W, HEAD_H);

        // Eyes
        for (let i = -1; i <= 1; i += 2) {

            // Black
            c.setColor(0, 0, 0);
            c.fillShape(Shape.Ellipse,
                -12 * i, -6, 10, 10);

            // White
            c.setColor();
            c.fillShape(Shape.Ellipse,
                -12 * i + 2, -8, 4, 4);
        }

        // Beak
        for (let i = 0; i < 2; ++ i) {

            c.setColor(...BEAK_COLOR[i]);
            c.fillShape(Shape.RAngledTriangle, -16*(1-i), 0, -16 + 32*i, 16);
        }


        c.pop();
    }
}
