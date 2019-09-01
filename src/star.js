import { Vector2 } from "./vector.js";
import { Shape } from "./canvas.js";

//
// A star effect
// (c) 2019 Jani Nykänen
//


// Local constants
const STAR_TIME = 60;


//
// Star class
//
export class Star {


    //
    // Constructor
    //
    constructor() {

        this.pos = new Vector2();
        this.speed = new Vector2();
        this.angle = 0;

        this.timer = 0;
        this.timerSpeed = 1;
        this.color = [1, 1, 1];
        this.scale = 32;
        this.depth = 0;

        this.exist = false;
    }


    //
    // Create self
    //
    createSelf(x, y, sx, sy, scale, ts, col, depth) {

        this.pos = new Vector2(x, y);
        this.speed = new Vector2(sx, sy);
        this.angle = Math.random() * Math.PI * 2;

        this.timer = STAR_TIME;
        this.timerSpeed = ts != null ? ts : 1.0;
        this.color = col == null ? [1, 1, 1] : col;
        this.scale = scale;
        this.depth = depth;

        this.exist = true;
    }


    //
    // Update star
    //
    update(ev) {

        const GRAVITY = 0.20;
        const GRAV_MAX = 4.0;
        const ANGLE_COMP = 8.0;
        const ANGLE_SPEED = 0.25;

        if (!this.exist) return;

        // Update speed
        this.speed.y += GRAVITY * ev.step;
        this.speed.y = Math.min(GRAV_MAX, this.speed.y);

        // Update angle
        this.angle += this.speed.x / 
            ANGLE_COMP * ANGLE_SPEED * ev.step;

        // Update timer
        if ((this.timer -= this.timerSpeed * ev.step) <= 0) {

            this.exist = false;
        }

        // Update pos
        this.pos.x += this.speed.x * ev.step;
        this.pos.y += this.speed.y * ev.step;
    }


    //
    // Draw star
    // 
    draw(c) {

        if (!this.exist) return;

        c.push();
        c.translate(this.pos.x, this.pos.y);
        c.rotate(this.angle);
        c.useTransform();

        c.setColor(...this.color, this.timer / STAR_TIME);
        c.fillShape(Shape.Star, 0, 0,
            this.scale, this.scale);

        c.pop();
    }

}
