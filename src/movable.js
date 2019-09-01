import { Vector2 } from "./vector.js";
import { Tile } from "./stage.js";

//
// A movable (well, moving) object
// (c) 2019 Jani Nykänen
//

// Move time
export const MOVE_TIME = 30;


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

        // Does follow something 
        this.follow = null;
    }


    //
    // Move
    //
    move(ev) {

        // Not moving, not interested
        if (!this.moving) return;

        // Update move timer, if not following anyone
        if (this.follow == null)
            this.moveTimer -= ev.step

        // Check if stopped moving
        if (this.moveTimer <= 0) {

            this.moveTimer = 0.0;
            this.moving = false;

            this.pos = this.target.clone();
        }

        // Compute render pos
        let t = this.moveTimer / MOVE_TIME;
        this.rpos.x = (this.pos.x * t + (1-t) * this.target.x) * Tile.Width;
        this.rpos.y = (this.pos.y * t + (1-t) * this.target.y) * Tile.Height;

    }
}
