import { Movable } from "./movable.js";
import { Shape } from "./canvas.js";

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
                }
            }

            if (this.moving) {

                // Copy move timer
                this.moveTimer = this.follow.moveTimer;
            }
        }

        // Move
        this.move(ev);

        // If stopped moving, update solid data
        if (this.follow != null && !this.moving) {

            stage.updateSolid(this.pos.x, this.pos.y, 2);
        }
    }


    //
    // Player collision
    //
    playerCollision(pl, eggs) {

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
        }
    }


    //
    // Draw
    //
    draw(c) {

        // TEMP
        c.setColor(1, 0, 0);
        c.fillShape(Shape.Rect, 
            this.rpos.x + 8, this.rpos.y + 8, 48, 48);
    }

}
