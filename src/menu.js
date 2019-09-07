import { Action, State } from "./input.js";
import { negMod } from "./util.js";
import { Shape } from "./canvas.js";

//
// A simple menu
// (c) 2019 Jani Nykänen
//


//
// Menu button type
// 
export class Button {


    //
    // Constructor
    //
    constructor(text, cb) {

        this.text = text;
        this.cb = cb;
    }
}


//
// Menu type
//
export class Menu {


    //
    // Constructor
    //
    constructor() {

        this.buttons = [];
        this.cursorPos = 0;

        this.maxLen = 0;
    }


    //
    // Add a button
    //
    addButton(b) {

        for (let i = 0; i < arguments.length; ++ i) {

            this.buttons.push(arguments[i]);

            if (arguments[i].text.length > this.maxLen) {

                this.maxLen = arguments[i].text.length;
            }
        }
    }


    //
    // Update menu
    //
    update(ev) {

        // Update cursor position
        let p = 0;
        if (ev.input.getKey(Action.Up) == State.Pressed) {

            -- p;
        }
        else if (ev.input.getKey(Action.Down) == State.Pressed) {

            ++ p;
        }
        this.cursorPos = 
            negMod(this.cursorPos + p, this.buttons.length);

        // Check if enter pressed
        let cb;
        if (ev.input.getKey(Action.Start) == State.Pressed) {

            cb = this.buttons[this.cursorPos].cb;
            if ( (cb = this.buttons[this.cursorPos].cb) != null) {

                cb();
            }
        }
    }


    //
    // Draw
    //
    draw(c, scale, bg) {

        const BUTTON_OFF = scale / 8;
        const TEXT_XOFF = -20;
        const SCALE_PLUS = 0.1;
        const SHADOW_OFF = BUTTON_OFF/2;
        const SHADOW_ALPHA = 0.25;
        const BG_OFF = BUTTON_OFF*2;

        let n = this.buttons.length;
        let h = scale + BUTTON_OFF;

        let y = c.viewport.y/2 - (n*h)/2;
        let x = c.viewport.x/2;

        // Draw background, if wanted
        let bx, by, bw, bh;
        if (bg) {

            bw = (this.maxLen+2) * (scale+TEXT_XOFF) + BG_OFF*2;
            bh = (n*h) + BG_OFF*2;

            bx = x - bw/2;
            by = c.viewport.y/2 - bh/2;

            c.toggleTexturing(false);
            c.setColor(...bg);
            c.fillShape(Shape.Rect, bx, by, bw, bh);
            c.toggleTexturing(true);
        }


        // Draw buttons
        let s;
        for (let i = 0; i < n; ++ i) {

            for (let j = 1; j >= 0; -- j) {

                if (i == this.cursorPos) {

                    s = scale * (1 + SCALE_PLUS);
                    if (j == 0)
                        c.setColor(1, 1, 0.0);
                }
                else {

                    s = scale;
                    if (j == 0)
                        c.setColor();
                }
                if (j == 1)
                    c.setColor(0, 0, 0, SHADOW_ALPHA);

                c.drawScaledText(this.buttons[i].text,
                    x + j*SHADOW_OFF, y + i*h + j*SHADOW_OFF, 
                    TEXT_XOFF, 0,
                    s, s, true);

            }
        }

    }
}
