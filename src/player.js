import { Vector2 } from "./vector.js";
import { Tile } from "./stage.js";
import { Shape } from "./canvas.js";
import { State, Action } from "./input.js";
import { MOVE_TIME, Movable } from "./movable.js";

//
// Player object
// (c) 2019 Jani Nykänen
//


export class Player extends Movable {


    //
    // Constructor
    //
    constructor(x, y) {

        super(x, y);

        this.headTimer = 0;
        this.headAngle = 0;
        this.eggCount = 0;
        this.legTimer = 0;
        this.keyCount = 0;

        this.autoMove = false;
    }


    //
    // Check nearby walls
    //
    isSurrounded(stage) {

        let x = this.pos.x | 0;
        let y = this.pos.y | 0;

        return stage.isSolid(x-1, y, 1, null, this.keyCount) &&
               stage.isSolid(x+1, y, 3, null, this.keyCount) &&
               stage.isSolid(x, y-1, 2, null, this.keyCount) &&
               stage.isSolid(x, y+1, 0, null, this.keyCount); 
    }


    //
    // Check if stuck
    //
    isStuck(stage) {

        if (this.moving) return false;

        if (this.isSurrounded(stage)) {

            this.control(stage, null, null, true);
            if (this.isSurrounded(stage)) {

                return true;
            }
        }
        return false;
    }


    //
    // Control
    //
    control(stage, ev, objm, autoOnly) {

        const STAR_SPEED = 4;
        const STAR_COUNT = 5;
        const STAR_RADIUS = 10;

        let tx = this.pos.x | 0;
        let ty = this.pos.y | 0;

        // No controls if moving
        if (this.moving) return;

        this.autoMove  = false;

        // Check auto movement
        let v = stage.autoMovement(this, objm);
        let dir = null;
        if (v == null && !autoOnly) {

            // Check arrow keys
            if (ev.input.getKey(Action.Left) == State.Down) {

                -- tx;
                dir = 1;
            }
            else if (ev.input.getKey(Action.Right) == State.Down) {

                ++ tx;
                dir = 3;
            }
            else if (ev.input.getKey(Action.Up) == State.Down) {

                -- ty;
                dir = 2;
            }
            else if (ev.input.getKey(Action.Down) == State.Down) {

                ++ ty;
                dir = 0;
            }

        }
        else if(v != null) {
            
            tx = v.x;
            ty = v.y;

            this.autoMove = true;
        }

        // If target changed and possible, move to this
        // position (or actually, start moving)
        if (!stage.isSolid(tx, ty, dir, null, this.keyCount) && (
            tx != (this.pos.x | 0) || ty != (this.pos.y | 0) )) {

            this.moving = true;
            this.moveTimer = MOVE_TIME;
            this.target.x = tx;
            this.target.y = ty;

            stage.updateSolid(this.pos.x, this.pos.y, 0);

            // Return true only if a lock is opened with a key
            if (stage.updateSolid(tx, ty, 2)) {

                -- this.keyCount;

                // Create stars
                objm.createStarShower(
                    (tx+0.5)*Tile.Width,
                    (ty+0.5)*Tile.Height,
                    STAR_SPEED, STAR_COUNT, 
                    STAR_RADIUS, 1, [1, 1, 1]);
            }
        }
    }


    //
    // Animate player
    //
    animate(ev) {

        const HEAD_SPEED = Math.PI * 2 / MOVE_TIME;
        const LEG_SPEED = HEAD_SPEED;
        const HEAD_STILL_SPEED = 0.05;

        if (this.moving && !this.autoMove) {

            // Update head angle & leg timer
            this.headAngle += HEAD_SPEED* ev.step;
            this.legTimer  += LEG_SPEED* ev.step;

            this.headAngle %= Math.PI * 2;
            this.legTimer %= Math.PI * 2;

            this.headTimer = 0.0;
        }
        else {

            this.headAngle = 0;
            this.legTimer = 0;

            // Update head timer
            this.headTimer += HEAD_STILL_SPEED * ev.step;
            this.headAngle %= Math.PI * 2;
        }
    }

    
    //
    // Update
    //
    update(stage, objm, ev) {

        if (this.die(ev)) return;

        // Control
        this.control(stage, ev, objm);
        // Move
        this.move(ev);
        // Animate
        this.animate(ev);

        // Compute depth
        this.depth = this.rpos.y + Tile.Height/2 + 18;
    }


    //
    // Draw
    //
    draw(c, spc) {

        const HEAD_W = 48;
        const HEAD_H = 40;
        const HEAD_Y = -12;
        const HEAD_ANGLE = Math.PI / 16.0;
        const HEAD_STILL_MUL = 2;

        const LEG_OUTLINE = 2;
        const LEG_COLOR = [0.67, 0.40, 0.1];
        const LEG_OFF = 10;
        const LEG_HEIGHT = 10;
        const LEG_WIDTH = 16;

        const BOX_OUTLINE = 3;
        const BOX_COLOR = [0.90, 0.90, 0.90]

        const BEAK_COLOR = [ [1.0, 0.7, 0.0], [0.8, 0.4, 0] ];
        const BEAK_SIZE = 16;

        const EYE_RADIUS = 10;
        const EYE_LIGHT_RADIUS = 3;
        const EYE_X = 12;
        const EYE_Y = -6;
        const EYE_LIGHT_X = 2;
        const EYE_LIGHT_Y = 2;

        const SHADOW_WIDTH = 48;
        const SHADOW_HEIGHT = 14;
        const SHADOW_OFF = 12;
        const SHADOW_ALPHA = 0.25;

        if (!this.exist) return;

        let mx = (spc ? 0 : this.rpos.x + Tile.Width/2);
        let my = (spc ? 0 : this.rpos.y + Tile.Height/2);

        if (this.dying) {

            c.setGlobalAlpha(this.deathTimer / MOVE_TIME);
        }
        

        if (!spc) {

            // Draw shadow
            c.setColor(0, 0, 0, SHADOW_ALPHA);
            c.fillShape(Shape.Ellipse, 
                mx, 
                my + (HEAD_Y + LEG_OFF) + LEG_HEIGHT + SHADOW_OFF,
                SHADOW_WIDTH/2, SHADOW_HEIGHT/2 );
        }

        //
        // Draw legs
        //
        let legY = my + HEAD_Y + LEG_OFF;
        let legYMod = Math.sin(this.legTimer) * 4;
        for (let i = -1; i <= 1; i += 2) {
            
            if (!spc) {
                // Leg outline
                c.setColor(0.0, 0.0, 0.0);
                c.fillShape(Shape.EquilTriangle,
                    mx + LEG_OFF*i - LEG_OUTLINE/2 +1, legY + legYMod*i,
                    LEG_WIDTH + LEG_OUTLINE*2, 
                    -LEG_HEIGHT - LEG_OUTLINE);
            }

            // Leg base
            c.setColor(...LEG_COLOR);
            c.fillShape(Shape.EquilTriangle,
                mx + LEG_OFF*i, legY + legYMod*i, 
                LEG_WIDTH, -LEG_HEIGHT);
        }

        //
        // Draw head
        //

        c.push();
        c.translate(mx, my + HEAD_Y + 
            Math.sin(this.headTimer) * HEAD_STILL_MUL);
        c.rotate(Math.sin(this.headAngle) * HEAD_ANGLE);
        c.useTransform();   

        if (!spc) {

            // Head outline
            c.setColor(0, 0, 0);
            c.fillShape(Shape.Rect, 
                -HEAD_W/2 - BOX_OUTLINE, -HEAD_H/2 - BOX_OUTLINE, 
                HEAD_W + BOX_OUTLINE*2, HEAD_H + BOX_OUTLINE*2);
        }

        // Head base
        c.setColor(...BOX_COLOR);
        c.fillShape(Shape.Rect, 
            -HEAD_W/2, -HEAD_H/2, HEAD_W, HEAD_H);

        // Eyes
        for (let i = -1; i <= 1; i += 2) {

            // Black
            c.setColor(0, 0, 0);
            c.fillShape(Shape.Ellipse,
                EYE_X * i, EYE_Y, 
                EYE_RADIUS, EYE_RADIUS);

            // White
            c.setColor();
            c.fillShape(Shape.Ellipse,
                EYE_X * i + EYE_LIGHT_X, 
                EYE_Y - EYE_LIGHT_Y, 
                EYE_LIGHT_RADIUS, EYE_LIGHT_RADIUS);
        }

        // Beak
        for (let i = 0; i < 2; ++ i) {

            c.setColor(...BEAK_COLOR[i]);
            c.fillShape(Shape.RAngledTriangle, 
                -BEAK_SIZE*(1-i), 0, 
                -BEAK_SIZE + (BEAK_SIZE*2)*i, BEAK_SIZE);
        }


        c.pop();
        c.setGlobalAlpha(1);
    }
}
