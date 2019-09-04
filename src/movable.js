import { Vector2 } from "./vector.js";
import { Tile } from "./stage.js";

//
// A movable (well, moving) object
// (c) 2019 Jani Nykänen
//

// Move time
export const MOVE_TIME = 30;


//
// Movable object (i.e object that moves, really)
//
export class Movable {

    //
    // Constructor
    //
    constructor(x, y) {

        // Grid position
        this.pos = new Vector2(x | 0, y | 0);
        // Render position (top-left corner)
        this.rpos = new Vector2(x * Tile.Width, y * Tile.Height);
        // Depth (for sorting)
        this.depth = 0;

        // Move timer
        this.moveTimer = 0;
        // Move target
        this.target = this.pos.clone();
        // Is moving
        this.moving = false;
        // Does exist
        this.exist = true;

        // Does follow something 
        this.follow = null;

        // Death timer
        this.deathTimer = 0.0;
        this.dying = false;

        // End functions
        this.endFun = null;
    }


    //
    // Die
    //
    die(ev) {

        if (!this.exist) return true;
        if (!this.dying) return false;
        
        if ((this.deathTimer -= 1.0 * ev.step) <= 0) {

            this.dying = false;
            this.exist = false;
        }
        return true;
    }



    //
    // Move
    //
    move(ev, stage) {

        // Not moving, not interested
        if (!this.moving) return;

        // Update move timer, if not following anyone
        if (this.follow == null)
            this.moveTimer -= ev.step

        // Check if stopped moving
        if (this.moveTimer <= 0) {

            // Call end function
            if (this.endFun != null) {

                this.endFun(stage);
            }

            this.moveTimer = 0.0;
            this.moving = false;

            this.pos = this.target.clone();   
        }

        // Compute render pos
        let t = this.moveTimer / MOVE_TIME;
        this.rpos.x = (this.pos.x * t + (1-t) * this.target.x) * Tile.Width;
        this.rpos.y = (this.pos.y * t + (1-t) * this.target.y) * Tile.Height;

    }


    //
    // Finish object
    //
    finish(stage, o) {

        const STAR_COUNT = 6;
        const STAR_SPEED = 4.0;
        const STAR_RADIUS = 10;

        if (!o.eggsCollected()) return false;
        if (this.dying || !this.exist) return true;

        if ((this.follow == null || !this.follow.exist) &&
            stage.isStartPos(this.pos.x, this.pos.y)) {

            stage.updateSolid(this.pos.x, this.pos.y, 0);
            this.deathTimer = MOVE_TIME;
            this.dying = true;

            // Create stars
            // Create stars
            o.createStarShower(
                this.rpos.x + Tile.Width/2,
                this.rpos.y + Tile.Height/2,
                STAR_SPEED, 
                 STAR_COUNT,
                STAR_RADIUS, 
                this.depth, 
                [1, 1, 1] );

            return true;
        }
        return false;
    }
}
