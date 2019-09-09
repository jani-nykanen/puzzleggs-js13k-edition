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
        this.depth = this.rpos.y + Tile.Height/2 + 16;
    }


    //
    // Update
    //
    update(stage, ev) {

        if (this.die(ev)) return;
        
        if (this.follow != null) {

            // If followed is dying
            if (this.follow.dying) {

                if (!this.moving) {

                    this.pos = this.target.clone();
                    this.target = this.follow.target.clone();
                    this.moving = true;

                    stage.updateSolid(this.pos.x, this.pos.y, 0);
                }
            }
            // If followed is moving
            else if (this.follow.moving)  {

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

                    if (!this.follow.dying) // Uncomment?
                        stage.updateSolid(this.target.x, this.target.y, 2);
                }
            }

            if (this.moving) {

                // Copy death or move timer
                if (this.follow.dying) {

                    this.moveTimer = this.follow.deathTimer;
                }
                else {

                    this.moveTimer = this.follow.moveTimer;
                }

                // Update shake 
                this.shakeTimer = (1.0 - this.moveTimer / MOVE_TIME) * 
                    (this.pos.x % 2 == this.pos.y % 2 == 0 ? 1 : -1);
            }
            else {

                stage.updateSolid(this.pos.x, this.pos.y, 2);
            }
        }

        // Move
        this.move(ev);

        // Compute depth
        this.depth = this.rpos.y + Tile.Height/2 + 16;
    }


    //
    // Player collision
    //
    playerCollision(pl, eggs, o, stage) {

        const STAR_COUNT = 5;
        const STAR_SPEED = 4.0;
        const STAR_RADIUS = 10;

        if (this.follow != null || !this.exist) return;

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

            // Update player's egg count
            ++ pl.eggCount;

            // Create stars
            o.createStarShower(
                    this.rpos.x + Tile.Width/2,
                    this.rpos.y + Tile.Height/2,
                    STAR_SPEED, 
                     STAR_COUNT,
                    STAR_RADIUS, 
                    this.depth, 
                    [1.0, 0.25, 0.20] );

            // Update solid data
            stage.updateSolid(this.pos.x, this.pos.y, 2);
        }
    }


    //
    // Draw
    //
    draw(c, noShadow, angle, center, scale, notransf, noOffline) {

        const EPS = 0.01;
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

        if (!this.exist || (scale && scale < EPS)) return;

        let mx = this.rpos.x
             + (notransf ? 0 : Tile.Width/2);
        let my = this.rpos.y
             + (notransf ? 0 : Tile.Height/2) 
            + (center ? 0 : BASE_OFF);
        let color = this.follow ? COLOR1 : COLOR2;

        if (angle == null) angle = 0.0;
        if (scale == null) scale = 1.0;

        if (this.dying) {

            c.setGlobalAlpha(this.deathTimer/MOVE_TIME);
        }

        if (!noShadow) {

            // Draw shadow
            c.setColor(0, 0, 0, SHADOW_ALPHA);
            c.fillShape(Shape.Ellipse, 
                mx, my + SHADOW_OFF,
                SHADOW_WIDTH/2, SHADOW_HEIGHT/2 );
        }

        c.push();
        c.translate(mx, my);
        c.rotate(angle +
            Math.sin(this.shakeTimer * Math.PI) * 
            Math.PI / 6.0);
        c.scale(scale, scale);
        c.useTransform();

        // Draw outline & base shape
        for (let i = noOffline ? 1 : 0; i < 3; ++ i) {

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
        c.setGlobalAlpha(1);
    } 

}
