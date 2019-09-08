import { Shape } from "./canvas.js";

//
// Transition manager
// (c) 2019 Jani Nykänen
//


// Local constants
const TRANSITION_TIME = 60;


//
// Transition class
//
export class Transition {


    //
    // Constructor
    //
    constructor() {

        this.timer = 0;
        this.cb = () => {}; // We avoid one if with this 
        this.color = {r: 0, g: 0, b: 0};
        this.active = false;
        this.speed = 1;
        this.fadeIn = false;
        this.delayTimer = 0;
        this.delayTime = 1; // As long as it's not 0
    }


    //
    // Activate
    //
    activate(fadeIn, speed, r, g, b, cb,delay) {

        this.fadeIn = fadeIn;
        this.speed = speed;
        this.color.r = r;
        this.color.g = g;
        this.color.b = b;
        this.timer = TRANSITION_TIME;

        if (cb != null)
            this.cb = cb;

        this.delayTime = delay ? delay : 0;
        this.delayTimer = this.delayTime;

        this.active = true;
    }


    //
    // Update
    //
    update(ev) {

        if (!this.active) return;
        
        // Update delay timer
        if ((this.delayTimer -= 1.0 * ev.step) > 0) return;

        // Update timer
        if ((this.timer -= this.speed * ev.step) <= 0) {

            if ((this.fadeIn = !this.fadeIn) == false) {

                this.cb(ev);
                this.timer += TRANSITION_TIME;
            }
            else {

                this.active = false;
                this.timer = 0;
            }
        }
    }


    //
    // Draw
    //
    draw(c) {

        if (!this.active || this.delayTimer > 0) 
            return;

        c.loadIdentity();
        c.useTransform();

        let s = c.toggleTexturing(false);
        let t = this.getScaledTime();
        c.setColor(this.color.r, 
                   this.color.g, 
                   this.color.b, 
                   t);
        c.fillShape(Shape.Rect, 0, 0, c.viewport.x, c.viewport.y);

        if (s)
            c.toggleTexturing(true);
    }


    //
    // Get scaled time
    //
    getScaledTime() {

        let t = this.timer / TRANSITION_TIME;
        if (this.fadeIn) t = 1.0 - t;
        return t;
    }


    //
    // Get scaled delay time
    //
    getScaledDelayTime() {

        const EPS = 0.001;

        if (this.delayTime <= EPS) return 0;

        let t = this.delayTimer / this.delayTime;
        if (this.fadeIn) t = 1.0 - t;
        return t;
    }
}
