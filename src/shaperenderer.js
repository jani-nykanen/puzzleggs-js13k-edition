import { Shape } from "./canvas.js";

//
// Shape renderer
// (c) 2019 Jani Nykänen
//


export class ShapeRenderer {


    //
    // Constructor
    //
    constructor(w, h) {

        this.w = w;
        this.h = h;
    }


    //
    // Draw a button
    //
    drawButton(c, x, y, off, col) {

        const OUTLINE = 3
        const WIDTH = 20;
        const HEIGHT = 10;
        const SHADOW_WIDTH = 26;
        const SHADOW_HEIGHT = 18;
        const SHADOW_OFF_X = 2;
        const SHADOW_OFF_Y = 0;
        // What is "varsi" in English in this context?
        const THING_HEIGHT = 16;

        let mx = (x+0.5)*this.w;
        let my = (y+0.5)*this.h + THING_HEIGHT/2;

        // Draw shadow
        if (!off) {

            c.setColor(0, 0, 0, 0.25);
            c.push();
            c.translate(
                mx + SHADOW_OFF_X, my + SHADOW_OFF_Y);
            c.rotate(Math.PI/12);
            c.useTransform();

            c.fillShape(Shape.Ellipse,
                0, 0, 
                SHADOW_WIDTH, SHADOW_HEIGHT);

            c.pop();
        }

        // Draw base button
        c.setColor(0, 0, 0);
        for (let i = 1; i >= 0; -- i) {

            // Bottom of that thing
            if (i == 0) {

                if (off)
                    c.setColor(...col[0]);
                else
                    c.setColor(...col[1]);
            }
            c.fillShape(Shape.Ellipse,
                 mx, my, 
                WIDTH + OUTLINE*i, HEIGHT+ OUTLINE*i);

            if (!off) {

                // That thing
                c.fillShape(Shape.Rect, 
                    mx-WIDTH-OUTLINE*i, 
                    my-THING_HEIGHT- OUTLINE*i, 
                    (WIDTH+OUTLINE*i)*2, 
                    THING_HEIGHT+ OUTLINE*2*i);
                
                // Ellipse
                if (i == 0) 
                    c.setColor(...col[2]);
                
                c.fillShape(Shape.Ellipse,
                    mx, my-THING_HEIGHT, 
                    WIDTH+ OUTLINE*i, HEIGHT+ OUTLINE*i);
            }

        }
    }


    //
    // Draw a key body
    //
    drawKeyBody(c, x, y, sx, sy, col) {

        const OUTLINE = 3;
        const HOLE_SCALE = 0.5;
        const TOP_WIDTH = 14;
        const TOP_HEIGHT = 10;
        const TOP_Y = -12;
        const HANDLE_WIDTH = 10;
        const HANDLE_HEIGHT = 32;
        const HANDLE_Y = -8;
        const TOOTH_HEIGHT = 6;
        const TOOTH_WIDTH = 10;

        c.push();
        c.translate(x, y);
        c.rotate(-Math.PI / 6.0);
        c.scale(sx, sy);
        c.useTransform();

        for (let i = 1; i >= (col ? 1 : 0); -- i) {

            if (col)
                c.setColor(...col)
            else if (i == 1)
                c.setColor(0, 0, 0);
            else 
                c.setColor(1, 0.90, 0.2);

            // Top
            c.fillShape(Shape.Ellipse, 0, TOP_Y, 
                TOP_WIDTH + OUTLINE*i, TOP_HEIGHT + OUTLINE*i);

            // "Handle"
            c.fillShape(Shape.Rect, 
                -HANDLE_WIDTH/2-OUTLINE*i, 
                HANDLE_Y-OUTLINE*i, 
                HANDLE_WIDTH+OUTLINE*i*2, 
                HANDLE_HEIGHT+OUTLINE*i*2);

            // Teeth
            for (let j = 0; j < 2; ++ j) {

                c.fillShape(Shape.Rect, 
                    HANDLE_WIDTH/2+OUTLINE*i,
                    TOOTH_HEIGHT-OUTLINE*i + TOOTH_HEIGHT*2 * j, 
                    TOOTH_WIDTH, 
                    TOOTH_HEIGHT+OUTLINE*i*2);
            }

            // Hole
            if (i == 0) {

                c.setColor(0, 0, 0);
                c.fillShape(Shape.Ellipse,
                        0, TOP_Y, 
                        TOP_WIDTH*HOLE_SCALE, 
                        TOP_HEIGHT*HOLE_SCALE);
            }
        }

        c.pop();
    }


    //
    // Draw a key (with shadow)
    //
    drawKey(c, x, y, t, sx, sy) {

        const HEIGHT_BASE = 4;
        const HEIGHT_VARY = 2;
        
        if (sx == null) sx = 1;
        if (sy == null) sy = 1;

        // Height vary
        let h = HEIGHT_BASE + Math.sin(t) * HEIGHT_VARY;

        this.drawKeyBody(c, x, y, sx, sy, [0, 0, 0, 0.25]);
        this.drawKeyBody(c, x-h, y-h, sx, sy);
    }
}
