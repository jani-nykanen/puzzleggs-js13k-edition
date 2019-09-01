import { Movable, MOVE_TIME } from "./movable.js";
import { Shape } from "./canvas.js";
import { Tile } from "./stage.js";

//
// An egg
// (c) 2019 Jani Nykänen
//


export class Egg extends Movable {


    //
    // Constructor
    //
    constructor(x, y) {

        super(x, y);

        this.shakeTimer = 0;
    }


    //
    // Animate
    //
    animate(ev) {

        // ...
    }


    //
    // Update
    //
    update(stage, ev) {

        if (this.follow != null) {

            // If follower is moving
            if (this.follow.moving) {

                // Set target to the position where the
                // followed object just left (unless have the
                // same position, or something else in there)
                if (!this.moving && 
                    (this.pos.x != this.follow.pos.x ||
                    this.pos.y != this.follow.pos.y) &&
                    stage.getSolid(this.follow.pos.x, this.follow.pos.y) != 2) {
                    
                    this.target = this.follow.pos.clone();
                    this.moving = true;

                    stage.updateSolid(this.pos.x, this.pos.y, 0);
                    stage.updateSolid(this.target.x, this.target.y, 2);
                }
            }

            if (this.moving) {

                // Copy move timer
                this.moveTimer = this.follow.moveTimer;

                // Update shake 
                this.shakeTimer = (1.0 - this.moveTimer / MOVE_TIME) * 
                    (this.pos.x % 2 == this.pos.y % 2 == 0 ? 1 : -1);
            }
        }

        // Move
        this.move(ev);
    }


    //
    // Player collision
    //
    playerCollision(pl, eggs, o) {

        if (this.follow != null) return;

        if (pl.pos.x == this.pos.x && 
            pl.pos.y == this.pos.y) {

            // Determine follower
            if (eggs.length == 0) {

                this.follow = pl;
            }
            else {
                
                eggs[eggs.length -1].follow = this;
                this.follow = pl;
            }
            eggs.push(this);

            // Create stars
            o.createStar(this.rpos.x + Tile.Width/2,
                    this.rpos.y + Tile.Height/2,
                    -4, -4, 12, 1, [1.0, 0.50, 0.40]);
        }
    }


    //
    // Draw
    //
    draw(c) {

        const BASE_OFF = -8;
        const OUTLINE = [6, 3, 0];
        const OFF_X = [0, 0, -2, -6];
        const OFF_Y = [0, 0, -2, -6];
        const COLOR1 = 
            [ [0,0,0], [0.50, 0.45, 0.40], 
            [0.85, 0.80, 0.75], [1,1,1] ];
        const COLOR2 = 
            [ [0,0,0], [0.80, 0.25, 0.15], 
            [1.0, 0.50, 0.40], [1,0.80,0.80] ];
        const RADIUS = 22;
        const REF_RADIUS = 10;

        const SHADOW_WIDTH = 48;
        const SHADOW_HEIGHT = 16;
        const SHADOW_OFF = RADIUS+2;
        const SHADOW_ALPHA = 0.25;

        let mx = this.rpos.x + Tile.Width/2;
        let my = this.rpos.y + Tile.Height/2 + BASE_OFF;
        let color = this.follow ? COLOR1 : COLOR2;

        // Draw shadow
        c.setColor(0, 0, 0, SHADOW_ALPHA);
        c.fillShape(Shape.Ellipse, 
            mx, my + SHADOW_OFF,
            SHADOW_WIDTH/2, SHADOW_HEIGHT/2 );

        c.push();
        c.translate(mx, my);
        c.rotate(Math.sin(this.shakeTimer * Math.PI) * Math.PI / 6.0);
        c.useTransform();

        // Draw outline & base shape
        for (let i = 0; i < 3; ++ i) {

            c.setColor( ...color[i]);
            c.fillShape(Shape.Egg, 
                OFF_X[i], OFF_Y[i], 
                RADIUS + OUTLINE[i], RADIUS+ OUTLINE[i]);
        }

        // Draw reflection
        c.setColor( ...color[3]);
        c.fillShape(Shape.Ellipse, 
            OFF_X[3], OFF_Y[3], 
            REF_RADIUS, REF_RADIUS);

        c.pop();
    } 

}
